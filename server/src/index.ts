import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import express from 'express';
import {
  clearSessionCookie,
  getGoogleConfig,
  getOwnerEmails,
  getTeacherEmails,
  isRequestSecure,
  isStaffRole,
  readSessionUser,
  requireAuth,
  requireTeacher,
  setSessionCookie,
  signSession,
  type AuthRequest,
} from './auth.js';
import { db, toPublicUser, type UserRow } from './db.js';
import { BUNPOU_QUESTION_MAP, isBunpouAnswerCorrect } from './data/bunpou.js';
import { isKanaAnswerCorrect, KANA_MAP } from './data/kana-romaji.js';
import { isKanjiAnswerCorrect, KANJI_MAP } from './data/kanji.js';
import { KAIWA_IDS } from './data/kaiwa-ids.js';
import { VOCAB_IDS } from './data/vocab-ids.js';

const execFileAsync = promisify(execFile);
const TTS_CACHE_DIR = process.env.TTS_CACHE_DIR || '/data/tts-cache';
const TTS_CACHE_MAX_BYTES = 400 * 1024 * 1024; // 400 MB
const TTS_CACHE_TARGET_BYTES = 340 * 1024 * 1024; // bersihkan sampai 340 MB
fs.mkdirSync(TTS_CACHE_DIR, { recursive: true });

const rateBuckets = new Map<string, { count: number; resetAt: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateBuckets) {
    if (v.resetAt <= now) rateBuckets.delete(k);
  }
}, 5 * 60 * 1000).unref();

function clientIp(req: express.Request): string {
  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf.trim()) return cf.trim();
  return req.ip || 'unknown';
}

function rateLimit(
  prefix: string,
  max: number,
  windowMs: number,
  keyFnOrUser: boolean | ((req: AuthRequest) => string) = false,
): express.RequestHandler {
  return (req: AuthRequest, res, next) => {
    const id =
      typeof keyFnOrUser === 'function'
        ? keyFnOrUser(req)
        : keyFnOrUser && req.user
          ? `u:${req.user.id}`
          : `ip:${clientIp(req)}`;
    const key = `${prefix}:${id}`;
    const now = Date.now();
    const cur = rateBuckets.get(key);
    if (!cur || cur.resetAt <= now) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    if (cur.count >= max) {
      res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi sebentar.' });
      return;
    }
    cur.count += 1;
    next();
  };
}

let pruningTts = false;
async function pruneTtsCache() {
  if (pruningTts) return;
  pruningTts = true;
  try {
    const names = await fs.promises.readdir(TTS_CACHE_DIR);
    const stats = await Promise.all(
      names
        .filter((n) => n.endsWith('.mp3'))
        .map(async (n) => {
          const full = path.join(TTS_CACHE_DIR, n);
          const st = await fs.promises.stat(full);
          return { full, size: st.size, mtimeMs: st.mtimeMs };
        })
    );
    let total = stats.reduce((acc, s) => acc + s.size, 0);
    if (total <= TTS_CACHE_MAX_BYTES) return;
    stats.sort((a, b) => a.mtimeMs - b.mtimeMs);
    for (const f of stats) {
      if (total <= TTS_CACHE_TARGET_BYTES) break;
      await fs.promises.unlink(f.full).catch(() => {});
      total -= f.size;
    }
  } catch (err) {
    console.error('TTS cache prune error:', err);
  } finally {
    pruningTts = false;
  }
}

const wibDateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' });

function formatWibDate(d: Date): string {
  return wibDateFormatter.format(d);
}

function todayWib(): string {
  return formatWibDate(new Date());
}

const app = express();
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const OAUTH_STATE_COOKIE = 'nihongo_oauth_state';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_MS = 24 * 60 * 60 * 1000;

interface SrsStat {
  i: number;
  r: number;
}

interface ItemStat {
  c?: number;
  w?: number;
  s?: number;
  t?: number;
  i?: number;
  r?: number;
}

interface ProgressPayload {
  kana?: Record<string, ItemStat>;
  vocab?: Record<string, boolean>;
  vocabSrs?: Record<string, SrsStat>;
  vocabStats?: Record<string, { c: number; w: number }>;
  kanji?: Record<string, ItemStat>;
  bunpou?: Record<string, { c: number; w: number }>;
  bunpouQuestions?: Record<string, { c: number; w: number }>;
  kaiwa?: string[];
  xp?: number;
  days?: string[];
  quizzes?: number;
  name?: string;
}

function normalizeSrs(data: ProgressPayload, now = Date.now()): boolean {
  let changed = false;
  const tomorrow = now + DAY_MS;

  if (data.kana && typeof data.kana === 'object') {
    for (const [ch, st] of Object.entries(data.kana)) {
      if (!st || typeof st !== 'object') continue;
      if (typeof st.i !== 'number' || !Number.isFinite(st.i) || st.i < 1 || typeof st.r !== 'number' || !Number.isFinite(st.r) || st.r <= 0) {
        data.kana[ch] = {
          c: st.c ?? 0,
          w: st.w ?? 0,
          s: st.s ?? 0,
          t: st.t ?? 0,
          i: typeof st.i === 'number' && Number.isFinite(st.i) && st.i >= 1 ? st.i : 1,
          r: typeof st.r === 'number' && Number.isFinite(st.r) && st.r > 0 ? st.r : tomorrow,
        };
        changed = true;
      }
    }
  } else {
    data.kana = {};
    changed = true;
  }

  if (!data.vocab || typeof data.vocab !== 'object') {
    data.vocab = {};
    changed = true;
  }
  if (!data.vocabSrs || typeof data.vocabSrs !== 'object') {
    data.vocabSrs = {};
    if (Object.values(data.vocab).some(Boolean)) changed = true;
  }
  for (const [id, known] of Object.entries(data.vocab)) {
    if (known) {
      const srs = data.vocabSrs[id];
      if (!srs || typeof srs.i !== 'number' || !Number.isFinite(srs.i) || srs.i < 1 || typeof srs.r !== 'number' || !Number.isFinite(srs.r) || srs.r <= 0) {
        data.vocabSrs[id] = { i: 1, r: tomorrow };
        changed = true;
      }
    }
  }

  return changed;
}

function summarizeProgress(data: ProgressPayload) {
  const xp = typeof data.xp === 'number' && Number.isFinite(data.xp) ? Math.max(0, Math.floor(data.xp)) : 0;
  const vocabMastered = data.vocab ? Object.values(data.vocab).filter(Boolean).length : 0;
  const kanaEntries = data.kana ? Object.entries(data.kana) : [];
  let hiraganaMastered = 0;
  let katakanaMastered = 0;
  for (const [ch, st] of kanaEntries) {
    const ok = (st?.s ?? 0) >= 5;
    if (!ok) continue;
    const known = KANA_MAP[ch];
    if (known) {
      if (known.script === 'hiragana') hiraganaMastered++;
      else katakanaMastered++;
    } else {
      const code = ch.codePointAt(0) ?? 0;
      if (code >= 0x3040 && code <= 0x309f) hiraganaMastered++;
      else if (code >= 0x30a0 && code <= 0x30ff) katakanaMastered++;
    }
  }
  const kanjiMastered = data.kanji
    ? Object.values(data.kanji).filter((st) => (st?.s ?? 0) >= 5).length
    : 0;
  const days = Array.isArray(data.days) ? [...new Set(data.days)].sort() : [];
  let streak = 0;
  if (days.length > 0) {
    const set = new Set(days);
    const [y, m, d] = todayWib().split('-').map(Number);
    let cursorMs = Date.UTC(y, m - 1, d);
    const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);
    if (!set.has(isoDay(cursorMs))) cursorMs -= 86_400_000;
    while (set.has(isoDay(cursorMs))) {
      streak++;
      cursorMs -= 86_400_000;
    }
  }
  return { xp, hiraganaMastered, katakanaMastered, vocabMastered, kanjiMastered, streak };
}

function getOrCreateProgress(userId: number): ProgressPayload {
  const row = db.prepare('SELECT data_json FROM user_progress WHERE user_id = ?').get(userId) as
    | { data_json: string }
    | undefined;
  if (row) {
    try {
      const parsed = JSON.parse(row.data_json) as ProgressPayload;
      if (normalizeSrs(parsed)) {
        db.prepare('UPDATE user_progress SET data_json = ? WHERE user_id = ?').run(JSON.stringify(parsed), userId);
      }
      return parsed;
    } catch {
      return { kana: {}, vocab: {}, vocabSrs: {}, kanji: {}, bunpou: {}, kaiwa: [], xp: 0, days: [], quizzes: 0 };
    }
  }
  const empty: ProgressPayload = { kana: {}, vocab: {}, vocabSrs: {}, kanji: {}, bunpou: {}, kaiwa: [], xp: 0, days: [], quizzes: 0 };
  db.prepare('INSERT INTO user_progress (user_id, data_json) VALUES (?, ?)').run(userId, JSON.stringify(empty));
  return empty;
}

function baseUrlFromReq(req: express.Request): string {
  const cfg = getGoogleConfig();
  if (cfg.appUrl) return cfg.appUrl;
  const proto = isRequestSecure(req) ? 'https' : 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:8432';
  return `${proto}://${Array.isArray(host) ? host[0] : host}`;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/auth/providers', (_req, res) => {
  const cfg = getGoogleConfig();
  res.json({ google: cfg.enabled });
});

app.get('/api/auth/me', (req, res) => {
  const user = readSessionUser(req);
  if (!user) {
    res.json({ user: null, progress: null });
    return;
  }
  const progress = getOrCreateProgress(user.id);
  res.json({ user: toPublicUser(user), progress });
});

const registerIpLimit = rateLimit('register-ip', 40, 60 * 60 * 1000);
const registerIpEmailLimit = rateLimit(
  'register-ie',
  5,
  60 * 60 * 1000,
  (req) => `${clientIp(req)}:${String(req.body?.email ?? '').trim().toLowerCase() || '-'}`,
);
const loginIpEmailLimit = rateLimit(
  'login-ie',
  10,
  15 * 60 * 1000,
  (req) => `${clientIp(req)}:${String(req.body?.email ?? '').trim().toLowerCase() || '-'}`,
);
const loginIpLimit = rateLimit('login-ip', 100, 15 * 60 * 1000);

const ALLOWED_JENJANG = new Set(['SMP', 'SMA', 'SMK', 'Umum']);
const ALLOWED_KELAS_BY_JENJANG: Record<string, Set<string>> = {
  SMP: new Set(['VII', 'VIII', 'IX', 'Alumni / Pembina']),
  SMA: new Set(['X', 'XI', 'XII', 'Alumni / Pembina']),
  SMK: new Set(['X', 'XI', 'XII', 'Alumni / Pembina']),
  Umum: new Set(),
};
const ALLOWED_JURUSAN = new Set(['TJKT', 'AKL', 'TKRO', 'Lainnya']);

function validateEducationProfile(body: Record<string, unknown>):
  | { ok: true; jenjang: string; school: string; kelas: string; jurusan: string }
  | { ok: false; error: string } {
  const jenjang = String(body.jenjang ?? '').trim();
  if (!ALLOWED_JENJANG.has(jenjang)) {
    return { ok: false, error: 'Jenjang wajib dipilih (SMP, SMA, SMK, atau Umum).' };
  }
  const schoolRaw = String(body.school ?? '').trim().slice(0, 80);
  if (jenjang !== 'Umum' && !schoolRaw) {
    return { ok: false, error: 'Asal sekolah wajib diisi untuk jenjang SMP/SMA/SMK.' };
  }
  const school = jenjang === 'Umum' ? (schoolRaw || 'Umum') : schoolRaw;

  const kelasRaw = String(body.kelas ?? '').trim();
  let kelas = '';
  if (jenjang !== 'Umum') {
    if (!ALLOWED_KELAS_BY_JENJANG[jenjang].has(kelasRaw)) {
      return { ok: false, error: `Kelas "${kelasRaw || '-'}" tidak sesuai dengan jenjang ${jenjang}.` };
    }
    kelas = kelasRaw;
  }

  let jurusan = '';
  if (jenjang === 'SMK') {
    const jurusanRaw = String(body.jurusan ?? '').trim();
    if (!ALLOWED_JURUSAN.has(jurusanRaw)) {
      return { ok: false, error: 'Jurusan wajib dipilih untuk jenjang SMK.' };
    }
    jurusan = jurusanRaw;
  }

  return { ok: true, jenjang, school, kelas, jurusan };
}

app.post('/api/auth/register', registerIpLimit, registerIpEmailLimit, async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const fullName = String(body.fullName ?? '').trim();
  const nickname = String(body.nickname ?? '').trim() || fullName.split(' ')[0] || '';
  const japaneseName = String(body.japaneseName ?? '').trim();

  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: 'Format email tidak valid.' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password minimal 6 karakter.' });
    return;
  }
  if (fullName.length < 2) {
    res.status(400).json({ error: 'Nama lengkap wajib diisi (minimal 2 huruf).' });
    return;
  }
  const edu = validateEducationProfile(body);
  if (!edu.ok) {
    res.status(400).json({ error: edu.error });
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ error: 'Email sudah terdaftar. Silakan masuk.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // Role teacher/owner hanya diberikan otomatis lewat Google OAuth terverifikasi, bukan form daftar.
  const role = 'student';
  const info = db
    .prepare(
      `INSERT INTO users (email, password_hash, full_name, nickname, jenjang, school, kelas, jurusan, japanese_name, role, profile_completed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
    )
    .run(email, passwordHash, fullName, nickname, edu.jenjang, edu.school, edu.kelas, edu.jurusan, japaneseName, role);

  const userId = Number(info.lastInsertRowid);
  const progress = getOrCreateProgress(userId);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;

  setSessionCookie(res, signSession(userId), isRequestSecure(req));
  res.status(201).json({ user: toPublicUser(user), progress });
});

app.post('/api/auth/login', loginIpLimit, loginIpEmailLimit, async (req, res) => {
  const body = req.body ?? {};
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (!email || !password) {
    res.status(400).json({ error: 'Email dan password wajib diisi.' });
    return;
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
  if (!user) {
    res.status(401).json({ error: 'Email atau password salah.' });
    return;
  }
  if (!user.password_hash) {
    res.status(400).json({ error: 'Akun ini terdaftar lewat Google. Silakan klik "Masuk dengan Google".' });
    return;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    res.status(401).json({ error: 'Email atau password salah.' });
    return;
  }

  db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);
  const progress = getOrCreateProgress(user.id);
  setSessionCookie(res, signSession(user.id), isRequestSecure(req));
  res.json({ user: toPublicUser(user), progress });
});

app.post('/api/auth/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/google', (req, res) => {
  const cfg = getGoogleConfig();
  if (!cfg.enabled) {
    res.redirect('/masuk?error=google_not_configured');
    return;
  }

  const state = crypto.randomBytes(24).toString('hex');
  res.cookie(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isRequestSecure(req),
    maxAge: 10 * 60 * 1000,
    path: '/',
  });

  const redirectUri = `${baseUrlFromReq(req)}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

app.get('/api/auth/google/callback', async (req, res) => {
  const cfg = getGoogleConfig();
  if (!cfg.enabled) {
    res.redirect('/masuk?error=google_not_configured');
    return;
  }

  const code = String(req.query.code ?? '');
  const state = String(req.query.state ?? '');
  const expectedState = req.cookies?.[OAUTH_STATE_COOKIE];
  res.clearCookie(OAUTH_STATE_COOKIE, { path: '/' });

  if (!code || !state || !expectedState || state !== expectedState) {
    res.redirect('/masuk?error=google_state');
    return;
  }

  try {
    const redirectUri = `${baseUrlFromReq(req)}/api/auth/google/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      res.redirect('/masuk?error=google_token');
      return;
    }

    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) {
      res.redirect('/masuk?error=google_token');
      return;
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    if (!profileRes.ok) {
      res.redirect('/masuk?error=google_profile');
      return;
    }

    const g = (await profileRes.json()) as {
      sub?: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    const email = (g.email ?? '').trim().toLowerCase();
    const googleId = (g.sub ?? '').trim();
    if (!email || !googleId) {
      res.redirect('/masuk?error=google_profile');
      return;
    }

    let user = db
      .prepare('SELECT * FROM users WHERE google_id = ? OR email = ?')
      .get(googleId, email) as UserRow | undefined;

    if (!user) {
      const fullName = (g.name ?? '').trim();
      const nickname = fullName.split(' ')[0] || email.split('@')[0];
      const role = getOwnerEmails().has(email)
        ? 'owner'
        : getTeacherEmails().has(email)
          ? 'teacher'
          : 'student';
      const info = db
        .prepare(
          `INSERT INTO users (email, google_id, avatar_url, full_name, nickname, role, profile_completed)
           VALUES (?, ?, ?, ?, ?, ?, 0)`
        )
        .run(email, googleId, g.picture ?? null, fullName, nickname, role);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(info.lastInsertRowid)) as UserRow;
      getOrCreateProgress(user.id);
    } else {
      // Auto-role hanya menaikkan (promote). Pencabutan role dilakukan manual oleh owner lewat halaman Rekap —
      // tidak ada penurunan otomatis, supaya perubahan daftar email yang tidak sengaja tidak langsung mencabut akses guru.
      const autoRole = getOwnerEmails().has(email)
        ? 'owner'
        : getTeacherEmails().has(email) && user.role !== 'owner'
          ? 'teacher'
          : user.role;
      db.prepare(
        `UPDATE users
         SET google_id = COALESCE(google_id, ?),
             avatar_url = COALESCE(?, avatar_url),
             role = ?,
             last_login_at = datetime('now')
         WHERE id = ?`
      ).run(googleId, g.picture ?? null, autoRole, user.id);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as UserRow;
    }

    setSessionCookie(res, signSession(user.id), isRequestSecure(req));
    res.redirect(user.profile_completed === 1 ? '/' : '/lengkapi-profil');
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.redirect('/masuk?error=google_failed');
  }
});

app.put('/api/profile', requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const body = (req.body ?? {}) as Record<string, unknown>;
  const fullName = String(body.fullName ?? '').trim();
  const nickname = String(body.nickname ?? '').trim() || fullName.split(' ')[0] || '';
  const japaneseName = String(body.japaneseName ?? '').trim();
  const showOnLeaderboard = body.showOnLeaderboard === false ? 0 : 1;

  if (fullName.length < 2) {
    res.status(400).json({ error: 'Nama lengkap minimal 2 huruf.' });
    return;
  }
  const edu = validateEducationProfile(body);
  if (!edu.ok) {
    res.status(400).json({ error: edu.error });
    return;
  }

  db.prepare(
    `UPDATE users
     SET full_name = ?, nickname = ?, jenjang = ?, school = ?, kelas = ?, jurusan = ?, japanese_name = ?, show_on_leaderboard = ?, profile_completed = 1
     WHERE id = ?`
  ).run(fullName, nickname, edu.jenjang, edu.school, edu.kelas, edu.jurusan, japaneseName, showOnLeaderboard, user.id);

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as UserRow;
  res.json({ user: toPublicUser(updated) });
});

app.get('/api/progress', requireAuth, (req: AuthRequest, res) => {
  const progress = getOrCreateProgress(req.user!.id);
  res.json({ progress });
});

function saveProgressRow(userId: number, data: ProgressPayload) {
  const sum = summarizeProgress(data);
  db.prepare(
    `INSERT INTO user_progress (user_id, data_json, xp, hiragana_mastered, katakana_mastered, vocab_mastered, kanji_mastered, streak, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       data_json = excluded.data_json,
       xp = excluded.xp,
       hiragana_mastered = excluded.hiragana_mastered,
       katakana_mastered = excluded.katakana_mastered,
       vocab_mastered = excluded.vocab_mastered,
       kanji_mastered = excluded.kanji_mastered,
       streak = excluded.streak,
       updated_at = datetime('now')`
  ).run(
    userId,
    JSON.stringify(data),
    sum.xp,
    sum.hiraganaMastered,
    sum.katakanaMastered,
    sum.vocabMastered,
    sum.kanjiMastered,
    sum.streak
  );
  return sum;
}

function isValidIsoDate(s: unknown): s is string {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function validateRestoreSnapshot(raw: unknown): { ok: true; data: ProgressPayload } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'Format cadangan progres tidak valid.' };
  }
  const obj = raw as Record<string, unknown>;
  if (!obj.kana || typeof obj.kana !== 'object' || Array.isArray(obj.kana)) {
    return { ok: false, error: 'Data huruf kana tidak valid.' };
  }
  const cleanKana: Record<string, { c: number; w: number; s: number; t: number; i?: number; r?: number }> = {};
  for (const [ch, val] of Object.entries(obj.kana as Record<string, unknown>)) {
    if (!(ch in KANA_MAP)) {
      return { ok: false, error: `Huruf kana tidak dikenal: ${ch}` };
    }
    if (!val || typeof val !== 'object' || Array.isArray(val)) {
      return { ok: false, error: `Statistik huruf ${ch} tidak valid.` };
    }
    const st = val as Record<string, unknown>;
    const c = Number(st.c ?? 0);
    const w = Number(st.w ?? 0);
    const s = Number(st.s ?? 0);
    const t = Number(st.t ?? 0);
    const iVal = st.i === undefined ? undefined : Number(st.i);
    const rVal = st.r === undefined ? undefined : Number(st.r);
    if (
      !Number.isInteger(c) || c < 0 || c > 100000 ||
      !Number.isInteger(w) || w < 0 || w > 100000 ||
      !Number.isInteger(s) || s < 0 || s > 100000 ||
      !Number.isFinite(t) || t < 0 ||
      (iVal !== undefined && (!Number.isInteger(iVal) || iVal < 1 || iVal > 36500)) ||
      (rVal !== undefined && (!Number.isFinite(rVal) || rVal < 0))
    ) {
      return { ok: false, error: `Angka statistik huruf ${ch} tidak wajar.` };
    }
    cleanKana[ch] = { c, w, s, t, ...(iVal !== undefined ? { i: iVal } : {}), ...(rVal !== undefined ? { r: rVal } : {}) };
  }

  const cleanVocab: Record<string, boolean> = {};
  if (obj.vocab !== undefined) {
    if (!obj.vocab || typeof obj.vocab !== 'object' || Array.isArray(obj.vocab)) {
      return { ok: false, error: 'Data kosakata tidak valid.' };
    }
    for (const [id, val] of Object.entries(obj.vocab as Record<string, unknown>)) {
      if (!VOCAB_IDS.has(id)) {
        return { ok: false, error: `ID kosakata tidak dikenal: ${id}` };
      }
      if (typeof val !== 'boolean') {
        return { ok: false, error: `Status kosakata ${id} tidak valid.` };
      }
      cleanVocab[id] = val;
    }
  }

  const cleanVocabSrs: Record<string, SrsStat> = {};
  if (obj.vocabSrs && typeof obj.vocabSrs === 'object' && !Array.isArray(obj.vocabSrs)) {
    for (const [id, val] of Object.entries(obj.vocabSrs as Record<string, unknown>)) {
      if (!VOCAB_IDS.has(id) || !val || typeof val !== 'object') continue;
      const st = val as Record<string, unknown>;
      const i = Number(st.i ?? 1);
      const r = Number(st.r ?? 0);
      if (Number.isInteger(i) && i >= 1 && i <= 36500 && Number.isFinite(r) && r > 0) {
        cleanVocabSrs[id] = { i, r };
      }
    }
  }

  const xp = obj.xp === undefined ? 0 : Number(obj.xp);
  if (!Number.isInteger(xp) || xp < 0 || xp > 100000) {
    return { ok: false, error: 'Nilai XP harus bilangan bulat antara 0 sampai 100000.' };
  }

  const quizzes = obj.quizzes === undefined ? 0 : Number(obj.quizzes);
  if (!Number.isInteger(quizzes) || quizzes < 0 || quizzes > 100000) {
    return { ok: false, error: 'Jumlah kuis harus bilangan bulat 0–100000.' };
  }

  let cleanDays: string[] = [];
  if (obj.days !== undefined) {
    if (!Array.isArray(obj.days) || obj.days.length > 365 || !obj.days.every(isValidIsoDate)) {
      return { ok: false, error: 'Daftar tanggal belajar harus format YYYY-MM-DD (maksimal 365 hari).' };
    }
    cleanDays = [...new Set(obj.days)].sort();
  }

  const name = typeof obj.name === 'string' ? obj.name.trim().slice(0, 32) : undefined;
  const result: ProgressPayload = {
    kana: cleanKana,
    vocab: cleanVocab,
    vocabSrs: cleanVocabSrs,
    xp,
    days: cleanDays,
    quizzes,
    ...(name ? { name } : {}),
  };
  normalizeSrs(result);
  return {
    ok: true,
    data: result,
  };
}

app.put('/api/progress', requireAuth, (req: AuthRequest, res) => {
  const payload = req.body as ProgressPayload | undefined;
  if (!payload || typeof payload !== 'object' || typeof payload.kana !== 'object') {
    res.status(400).json({ error: 'Format progres tidak valid.' });
    return;
  }

  // Jangan percaya xp, days, atau quizzes dari browser — pertahankan nilai resmi server.
  const current = getOrCreateProgress(req.user!.id);
  const clean: ProgressPayload = {
    kana: current.kana ?? {},
    vocab: current.vocab ?? {},
    vocabSrs: current.vocabSrs ?? {},
    vocabStats: current.vocabStats ?? {},
    kanji: current.kanji ?? {},
    bunpou: current.bunpou ?? {},
    bunpouQuestions: current.bunpouQuestions ?? {},
    kaiwa: Array.isArray(current.kaiwa) ? current.kaiwa : [],
    xp: current.xp ?? 0,
    days: Array.isArray(current.days) ? current.days : [],
    quizzes: current.quizzes ?? 0,
    name: typeof payload.name === 'string' ? payload.name.slice(0, 32) : current.name,
  };

  const sum = saveProgressRow(req.user!.id, clean);
  res.json({ ok: true, progress: clean, summary: sum });
});

app.delete('/api/progress', requireAuth, (req: AuthRequest, res) => {
  const current = getOrCreateProgress(req.user!.id);
  const reset: ProgressPayload = {
    kana: {},
    vocab: {},
    vocabSrs: {},
    vocabStats: {},
    kanji: {},
    bunpou: {},
    bunpouQuestions: {},
    kaiwa: [],
    xp: 0,
    days: [],
    quizzes: 0,
    ...(current.name ? { name: current.name } : {}),
  };
  const sum = saveProgressRow(req.user!.id, reset);
  res.json({ ok: true, progress: reset, summary: sum });
});

app.post('/api/progress/restore', requireAuth, (req: AuthRequest, res) => {
  const checked = validateRestoreSnapshot(req.body);
  if (!checked.ok) {
    res.status(400).json({ error: checked.error });
    return;
  }
  const sum = saveProgressRow(req.user!.id, checked.data);
  res.json({ ok: true, progress: checked.data, summary: sum });
});

const practiceRateLimit = rateLimit('practice', 120, 60 * 1000, true);

app.post('/api/practice/record', requireAuth, practiceRateLimit, (req: AuthRequest, res) => {
  const body = req.body ?? {};
  const type = String(body.type ?? '');
  const current = getOrCreateProgress(req.user!.id);
  const next: ProgressPayload = {
    kana: { ...(current.kana ?? {}) },
    vocab: { ...(current.vocab ?? {}) },
    vocabSrs: { ...(current.vocabSrs ?? {}) },
    vocabStats: { ...(current.vocabStats ?? {}) },
    kanji: { ...(current.kanji ?? {}) },
    bunpou: { ...(current.bunpou ?? {}) },
    bunpouQuestions: { ...(current.bunpouQuestions ?? {}) },
    kaiwa: Array.isArray(current.kaiwa) ? [...current.kaiwa] : [],
    xp: typeof current.xp === 'number' ? current.xp : 0,
    days: Array.isArray(current.days) ? [...current.days] : [],
    quizzes: typeof current.quizzes === 'number' ? current.quizzes : 0,
    name: current.name,
  };
  const now = Date.now();
  const today = todayWib();
  const ensureToday = () => {
    if (!next.days!.includes(today)) {
      next.days = [...next.days!, today].slice(-365);
    }
  };

  if (type === 'kana_answer') {
    const ch = String(body.char ?? '').trim();
    if (!(ch in KANA_MAP)) {
      res.status(400).json({ error: 'Karakter kana tidak dikenali.' });
      return;
    }
    // Abaikan flag correct dari browser; verifikasi penuh di server terhadap peta kana.
    const correct = isKanaAnswerCorrect(ch, body.given, body.mode);
    const prev = next.kana![ch] ?? { c: 0, w: 0, s: 0, t: 0 };
    if (correct) {
      const nextInterval = (prev.i || 1) * 2;
      next.kana![ch] = {
        c: (prev.c ?? 0) + 1,
        w: prev.w ?? 0,
        s: (prev.s ?? 0) + 1,
        t: now,
        i: nextInterval,
        r: now + nextInterval * DAY_MS,
      };
    } else {
      next.kana![ch] = {
        c: prev.c ?? 0,
        w: (prev.w ?? 0) + 1,
        s: 0,
        t: now,
        i: 1,
        r: now + DAY_MS,
      };
    }
    next.xp = (next.xp ?? 0) + (correct ? 10 : 1);
    ensureToday();
  } else if (type === 'kanji_answer') {
    const ch = String(body.char ?? '').trim();
    if (!(ch in KANJI_MAP)) {
      res.status(400).json({ error: 'Karakter kanji tidak dikenali.' });
      return;
    }
    // Abaikan flag correct dari browser; verifikasi penuh di server terhadap peta kanji.
    const correct = isKanjiAnswerCorrect(ch, body.given, body.mode);
    const prev = next.kanji![ch] ?? { c: 0, w: 0, s: 0, t: 0, i: 1, r: 0 };
    if (correct) {
      const nextInterval = (prev.i || 1) * 2;
      next.kanji![ch] = {
        c: (prev.c ?? 0) + 1,
        w: prev.w ?? 0,
        s: (prev.s ?? 0) + 1,
        t: now,
        i: nextInterval,
        r: now + nextInterval * DAY_MS,
      };
    } else {
      next.kanji![ch] = {
        c: prev.c ?? 0,
        w: (prev.w ?? 0) + 1,
        s: 0,
        t: now,
        i: 1,
        r: now + DAY_MS,
      };
    }
    next.xp = (next.xp ?? 0) + (correct ? 10 : 1);
    ensureToday();
  } else if (type === 'bunpou_answer') {
    const questionId = String(body.questionId ?? '').trim();
    const q = BUNPOU_QUESTION_MAP[questionId];
    if (!q) {
      res.status(400).json({ error: 'ID soal bunpou tidak dikenali.' });
      return;
    }
    // Abaikan flag correct dari browser; verifikasi penuh di server terhadap kunci soal bunpou.
    const correct = isBunpouAnswerCorrect(questionId, body.given);
    const prevTopic = next.bunpou![q.topicId] ?? { c: 0, w: 0 };
    next.bunpou![q.topicId] = correct
      ? { c: prevTopic.c + 1, w: prevTopic.w }
      : { c: prevTopic.c, w: prevTopic.w + 1 };
    const prevQ = next.bunpouQuestions![questionId] ?? { c: 0, w: 0 };
    next.bunpouQuestions![questionId] = correct
      ? { c: prevQ.c + 1, w: prevQ.w }
      : { c: prevQ.c, w: prevQ.w + 1 };
    next.xp = (next.xp ?? 0) + (correct ? 10 : 1);
    ensureToday();
  } else if (type === 'quiz_finish') {
    const answersRaw = body.answers;
    if (!Array.isArray(answersRaw) || answersRaw.length < 1 || answersRaw.length > 50) {
      res.status(400).json({ error: 'Daftar jawaban kuis harus berisi 1–50 soal.' });
      return;
    }
    const quizType =
      body.quizType === 'vocab'
        ? 'vocab'
        : body.quizType === 'mixed'
          ? 'mixed'
          : body.quizType === 'kanji'
            ? 'kanji'
            : 'kana';
    let correctCount = 0;
    if (quizType === 'vocab') {
      for (const item of answersRaw) {
        const id = String((item as Record<string, unknown>)?.id ?? '').trim();
        const givenId = String((item as Record<string, unknown>)?.givenId ?? '').trim();
        if (!VOCAB_IDS.has(id) || (givenId && !VOCAB_IDS.has(givenId))) {
          res.status(400).json({ error: 'Jawaban kuis kosakata mengandung ID tidak valid.' });
          return;
        }
        const ok = id === givenId;
        if (ok) correctCount++;
        const prevVs = next.vocabStats![id] ?? { c: 0, w: 0 };
        next.vocabStats![id] = ok
          ? { c: prevVs.c + 1, w: prevVs.w }
          : { c: prevVs.c, w: prevVs.w + 1 };
      }
    } else if (quizType === 'kanji') {
      for (const item of answersRaw) {
        const rec = (item ?? {}) as Record<string, unknown>;
        const ch = String(rec.char ?? '').trim();
        if (!(ch in KANJI_MAP)) {
          res.status(400).json({ error: 'Jawaban kuis mengandung karakter kanji tidak valid.' });
          return;
        }
        if (isKanjiAnswerCorrect(ch, rec.given, rec.mode)) correctCount++;
      }
    } else if (quizType === 'mixed') {
      for (const item of answersRaw) {
        const rec = (item ?? {}) as Record<string, unknown>;
        if (rec.kind === 'vocab') {
          const id = String(rec.id ?? '').trim();
          const givenId = String(rec.givenId ?? '').trim();
          if (!VOCAB_IDS.has(id) || (givenId && !VOCAB_IDS.has(givenId))) {
            res.status(400).json({ error: 'Jawaban kuis kosakata mengandung ID tidak valid.' });
            return;
          }
          const ok = id === givenId;
          if (ok) correctCount++;
          const prevVs = next.vocabStats![id] ?? { c: 0, w: 0 };
          next.vocabStats![id] = ok
            ? { c: prevVs.c + 1, w: prevVs.w }
            : { c: prevVs.c, w: prevVs.w + 1 };
        } else {
          const ch = String(rec.char ?? '').trim();
          if (!(ch in KANA_MAP)) {
            res.status(400).json({ error: 'Jawaban kuis mengandung karakter kana tidak valid.' });
            return;
          }
          if (isKanaAnswerCorrect(ch, rec.given, rec.mode)) correctCount++;
        }
      }
    } else {
      for (const item of answersRaw) {
        const rec = (item ?? {}) as Record<string, unknown>;
        const ch = String(rec.char ?? '').trim();
        if (!(ch in KANA_MAP)) {
          res.status(400).json({ error: 'Jawaban kuis mengandung karakter kana tidak valid.' });
          return;
        }
        if (isKanaAnswerCorrect(ch, rec.given, rec.mode)) correctCount++;
      }
    }
    const bonusXp = correctCount === answersRaw.length ? 50 : 10;
    next.quizzes = (next.quizzes ?? 0) + 1;
    next.xp = (next.xp ?? 0) + bonusXp;
    ensureToday();
  } else if (type === 'vocab_toggle' || type === 'vocab_mark') {
    const id = String(body.id ?? '').trim();
    if (!VOCAB_IDS.has(id)) {
      res.status(400).json({ error: 'ID kosakata tidak dikenal.' });
      return;
    }
    const hadKey = id in next.vocab!;
    const nextVal = type === 'vocab_toggle' ? !next.vocab![id] : Boolean(body.known);
    const firstTime = nextVal && !hadKey;
    next.vocab![id] = nextVal;
    if (nextVal) {
      next.vocabSrs![id] = { i: 1, r: now + DAY_MS };
    } else {
      delete next.vocabSrs![id];
    }
    if (firstTime) next.xp = (next.xp ?? 0) + 5;
    if (nextVal) ensureToday();
  } else if (type === 'kaiwa_complete') {
    const id = String(body.id ?? '').trim();
    if (!KAIWA_IDS.has(id)) {
      res.status(400).json({ error: 'ID dialog kaiwa tidak dikenal.' });
      return;
    }
    const doneSet = new Set(Array.isArray(next.kaiwa) ? next.kaiwa : []);
    if (doneSet.has(id)) {
      res.status(409).json({ error: 'Dialog ini sudah pernah ditandai selesai.' });
      return;
    }
    doneSet.add(id);
    next.kaiwa = [...doneSet];
    next.xp = (next.xp ?? 0) + 5;
    ensureToday();
  } else {
    res.status(400).json({ error: 'Tipe latihan tidak dikenali.' });
    return;
  }

  const sum = saveProgressRow(req.user!.id, next);
  res.json({ ok: true, progress: next, summary: sum });
});

app.post('/api/profile/password', requireAuth, async (req: AuthRequest, res) => {
  const password = String(req.body?.password ?? '');
  if (password.length < 6) {
    res.status(400).json({ error: 'Password minimal 6 karakter.' });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, req.user!.id);
  res.json({ ok: true });
});

const ttsRateLimit = rateLimit('tts', 40, 60 * 1000, true);
const translateRateLimit = rateLimit('translate', 30, 60 * 1000, true);

app.get('/api/tts', requireAuth, ttsRateLimit, async (req, res) => {
  const text = String(req.query.text ?? '').trim();
  if (!text || text.length > 500) {
    res.status(400).json({ error: 'Teks harus diisi (maksimal 500 karakter).' });
    return;
  }
  const voice = req.query.voice === 'male' ? 'ja-JP-KeitaNeural' : 'ja-JP-NanamiNeural';
  const rate = req.query.rate === 'slow' ? '-25%' : '+0%';
  const key = crypto.createHash('sha256').update(`${voice}|${rate}|${text}`).digest('hex');
  const filePath = path.join(TTS_CACHE_DIR, `${key}.mp3`);

  try {
    if (!fs.existsSync(filePath)) {
      const tmpPath = path.join(TTS_CACHE_DIR, `${key}.${process.pid}.${Date.now()}.tmp.mp3`);
      await execFileAsync('edge-tts', [
        '--text',
        text,
        '--voice',
        voice,
        `--rate=${rate}`,
        '--write-media',
        tmpPath,
      ], { timeout: 15000 });
      fs.renameSync(tmpPath, filePath);
      void pruneTtsCache();
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('TTS error:', err);
    res.status(502).json({ error: 'Gagal menghasilkan audio TTS.' });
  }
});

const TRANSLATE_UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const pendingTranslations = new Map<string, Promise<{ jp: string; romaji: string }>>();

function cleanZeroWidth(s: string): string {
  return s.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchGoogleTranslate(q: string, client: 'gtx' | 'dict-chrome-ex'): Promise<{ jp: string; romaji: string }> {
  const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=id&tl=ja&dt=t&dt=rm&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': TRANSLATE_UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`Google(${client}) HTTP ${r.status}`);
  const data = (await r.json()) as [Array<[string | null, string | null, string | null]>];
  const segments = Array.isArray(data?.[0]) ? data[0] : [];
  const jp = cleanZeroWidth(segments.map((s) => s?.[0] ?? '').join(''));
  const romaji = cleanZeroWidth(segments.map((s) => s?.[2] ?? '').filter(Boolean).join(' '));
  if (!jp) throw new Error(`Google(${client}) empty translation`);
  return { jp, romaji };
}

async function fetchMyMemoryTranslate(q: string): Promise<{ jp: string; romaji: string }> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=id|ja`;
  const r = await fetch(url, {
    headers: { 'User-Agent': TRANSLATE_UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`MyMemory HTTP ${r.status}`);
  const data = (await r.json()) as { responseStatus?: number; responseData?: { translatedText?: string } };
  const jp = cleanZeroWidth(data?.responseData?.translatedText ?? '');
  if (!jp || data?.responseStatus === 429) throw new Error(`MyMemory status ${data?.responseStatus ?? 'empty'}`);
  return { jp, romaji: '' };
}

async function translateIdToJa(q: string): Promise<{ jp: string; romaji: string }> {
  const providers = [
    () => fetchGoogleTranslate(q, 'gtx'),
    () => fetchGoogleTranslate(q, 'dict-chrome-ex'),
    () => fetchMyMemoryTranslate(q),
  ];
  const errors: string[] = [];
  for (const run of providers) {
    try {
      return await run();
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  throw new Error(`All translate providers failed: ${errors.join(' | ')}`);
}

app.get('/api/translate', requireAuth, translateRateLimit, async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  if (!q || q.length > 500) {
    res.status(400).json({ error: 'Teks harus diisi (maksimal 500 karakter).' });
    return;
  }
  const key = crypto.createHash('sha256').update(q.toLowerCase()).digest('hex');
  const cached = db
    .prepare('SELECT source_text, jp_text, romaji FROM translations_cache WHERE q_hash = ?')
    .get(key) as { source_text: string; jp_text: string; romaji: string } | undefined;
  if (cached) {
    res.json({ source: q, jp: cleanZeroWidth(cached.jp_text), romaji: cleanZeroWidth(cached.romaji) });
    return;
  }

  try {
    let inflight = pendingTranslations.get(key);
    if (!inflight) {
      inflight = translateIdToJa(q).finally(() => pendingTranslations.delete(key));
      pendingTranslations.set(key, inflight);
    }
    const { jp, romaji } = await inflight;

    db.prepare(
      'INSERT OR REPLACE INTO translations_cache (q_hash, source_text, jp_text, romaji) VALUES (?, ?, ?, ?)'
    ).run(key, q, jp, romaji);

    res.json({ source: q, jp, romaji });
  } catch (err) {
    console.error('Translate error:', err);
    res.status(502).json({ error: 'Gagal menerjemahkan teks. Coba lagi sebentar.' });
  }
});

app.get('/api/leaderboard', (req, res) => {
  const jenjangParam = String(req.query.jenjang ?? '').trim();
  const useJenjangFilter = ALLOWED_JENJANG.has(jenjangParam);
  const sql = `SELECT u.id, u.nickname, u.japanese_name, u.jenjang, u.school, u.kelas, u.jurusan, u.avatar_url, u.role,
              COALESCE(p.xp, 0) AS xp,
              COALESCE(p.streak, 0) AS streak,
              COALESCE(p.hiragana_mastered, 0) AS hiragana_mastered,
              COALESCE(p.katakana_mastered, 0) AS katakana_mastered,
              COALESCE(p.vocab_mastered, 0) AS vocab_mastered,
              COALESCE(p.kanji_mastered, 0) AS kanji_mastered
       FROM users u
       LEFT JOIN user_progress p ON p.user_id = u.id
       WHERE u.profile_completed = 1 AND u.show_on_leaderboard = 1 AND u.role = 'student'
       ${useJenjangFilter ? 'AND u.jenjang = ?' : ''}
       ORDER BY xp DESC, streak DESC, hiragana_mastered DESC, u.id ASC
       LIMIT 100`;
  const stmt = db.prepare(sql);
  const rows = (useJenjangFilter ? stmt.all(jenjangParam) : stmt.all()) as Array<{
    id: number;
    nickname: string;
    japanese_name: string;
    jenjang: string;
    school: string;
    kelas: string;
    jurusan: string;
    avatar_url: string | null;
    role: string;
    xp: number;
    streak: number;
    hiragana_mastered: number;
    katakana_mastered: number;
    vocab_mastered: number;
    kanji_mastered: number;
  }>;

  res.json({
    entries: rows.map((r) => ({
      id: r.id,
      nickname: r.nickname,
      japaneseName: r.japanese_name,
      jenjang: r.jenjang || 'SMK',
      school: r.school || 'SMK NU Darussalam',
      kelas: r.kelas,
      jurusan: r.jurusan,
      avatarUrl: r.avatar_url,
      role: r.role,
      xp: r.xp,
      streak: r.streak,
      hiraganaMastered: r.hiragana_mastered,
      katakanaMastered: r.katakana_mastered,
      vocabMastered: r.vocab_mastered,
      kanjiMastered: r.kanji_mastered,
    })),
  });
});

function pickCwStats(
  raw: Record<string, { c?: number; w?: number }> | undefined,
): Record<string, { c: number; w: number }> {
  const out: Record<string, { c: number; w: number }> = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [key, val] of Object.entries(raw)) {
    if (!val || typeof val !== 'object') continue;
    const c = Number(val.c ?? 0);
    const w = Number(val.w ?? 0);
    if (c > 0 || w > 0) {
      out[key] = { c, w };
    }
  }
  return out;
}

const ALLOWED_TASK_TYPES = new Set(['kana_mastered', 'vocab_mastered', 'quiz_count', 'xp']);

interface TeacherTaskRow {
  id: number;
  title: string;
  description: string;
  target_type: string;
  target_value: number;
  due_date: string;
  created_by: string;
  created_at: string;
}

function computeTaskMetric(
  progress: ProgressPayload,
  sum: { xp: number; hiraganaMastered: number; katakanaMastered: number; vocabMastered: number },
  targetType: string,
): number {
  if (targetType === 'kana_mastered') return sum.hiraganaMastered + sum.katakanaMastered;
  if (targetType === 'vocab_mastered') return sum.vocabMastered;
  if (targetType === 'quiz_count') return typeof progress.quizzes === 'number' ? progress.quizzes : 0;
  return sum.xp;
}

app.get('/api/teacher/students', requireAuth, requireTeacher, (_req: AuthRequest, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.email, u.full_name, u.nickname, u.japanese_name, u.jenjang, u.school, u.kelas, u.jurusan,
              u.role, u.profile_completed, u.created_at, u.last_login_at,
              COALESCE(p.xp, 0) AS xp,
              COALESCE(p.streak, 0) AS streak,
              COALESCE(p.hiragana_mastered, 0) AS hiragana_mastered,
              COALESCE(p.katakana_mastered, 0) AS katakana_mastered,
              COALESCE(p.vocab_mastered, 0) AS vocab_mastered,
              COALESCE(p.kanji_mastered, 0) AS kanji_mastered,
              p.data_json,
              p.updated_at AS progress_updated_at
       FROM users u
       LEFT JOIN user_progress p ON p.user_id = u.id
       ORDER BY u.role DESC, xp DESC, u.full_name ASC`
    )
    .all() as Array<{
    id: number;
    email: string;
    full_name: string;
    nickname: string;
    japanese_name: string;
    jenjang: string;
    school: string;
    kelas: string;
    jurusan: string;
    role: string;
    profile_completed: number;
    created_at: string;
    last_login_at: string;
    xp: number;
    streak: number;
    hiragana_mastered: number;
    katakana_mastered: number;
    vocab_mastered: number;
    kanji_mastered: number;
    data_json: string | null;
    progress_updated_at: string | null;
  }>;

  res.json({
    students: rows.map((r) => {
      let parsed: ProgressPayload = {};
      if (r.data_json) {
        try {
          parsed = JSON.parse(r.data_json) as ProgressPayload;
        } catch {
          parsed = {};
        }
      }
      return {
        id: r.id,
        email: r.email,
        fullName: r.full_name,
        nickname: r.nickname,
        japaneseName: r.japanese_name,
        jenjang: r.jenjang || 'SMK',
        school: r.school || 'SMK NU Darussalam',
        kelas: r.kelas,
        jurusan: r.jurusan,
        role: r.role,
        profileCompleted: r.profile_completed === 1,
        createdAt: r.created_at,
        lastLoginAt: r.last_login_at,
        xp: r.xp,
        streak: r.streak,
        hiraganaMastered: r.hiragana_mastered,
        katakanaMastered: r.katakana_mastered,
        vocabMastered: r.vocab_mastered,
        kanjiMastered: r.kanji_mastered,
        progressUpdatedAt: r.progress_updated_at,
        itemStats: {
          kana: pickCwStats(parsed.kana),
          vocab: pickCwStats(parsed.vocabStats),
          kanji: pickCwStats(parsed.kanji),
          bunpou: pickCwStats(parsed.bunpouQuestions),
        },
      };
    }),
  });
});

app.get('/api/tasks', requireAuth, (req: AuthRequest, res) => {
  const tasks = db
    .prepare('SELECT * FROM teacher_tasks ORDER BY due_date ASC, id DESC')
    .all() as TeacherTaskRow[];
  const progress = getOrCreateProgress(req.user!.id);
  const sum = summarizeProgress(progress);
  const today = todayWib();

  res.json({
    tasks: tasks.map((t) => {
      const currentValue = computeTaskMetric(progress, sum, t.target_type);
      const completed = currentValue >= t.target_value;
      const overdue = t.due_date < today;
      return {
        id: t.id,
        title: t.title,
        description: t.description,
        targetType: t.target_type,
        targetValue: t.target_value,
        dueDate: t.due_date,
        createdBy: t.created_by,
        createdAt: t.created_at,
        currentValue,
        completed,
        overdue,
      };
    }),
  });
});

app.get('/api/teacher/tasks', requireAuth, requireTeacher, (_req: AuthRequest, res) => {
  const tasks = db
    .prepare('SELECT * FROM teacher_tasks ORDER BY due_date DESC, id DESC')
    .all() as TeacherTaskRow[];
  const studentRows = db
    .prepare(
      `SELECT u.id, p.data_json, COALESCE(p.xp, 0) AS xp,
              COALESCE(p.hiragana_mastered, 0) AS hiragana_mastered,
              COALESCE(p.katakana_mastered, 0) AS katakana_mastered,
              COALESCE(p.vocab_mastered, 0) AS vocab_mastered
       FROM users u
       LEFT JOIN user_progress p ON p.user_id = u.id
       WHERE u.role = 'student'`
    )
    .all() as Array<{
    id: number;
    data_json: string | null;
    xp: number;
    hiragana_mastered: number;
    katakana_mastered: number;
    vocab_mastered: number;
  }>;

  const parsedStudents = studentRows.map((s) => {
    let parsed: ProgressPayload = {};
    if (s.data_json) {
      try {
        parsed = JSON.parse(s.data_json) as ProgressPayload;
      } catch {
        parsed = {};
      }
    }
    return {
      progress: parsed,
      sum: {
        xp: s.xp,
        hiraganaMastered: s.hiragana_mastered,
        katakanaMastered: s.katakana_mastered,
        vocabMastered: s.vocab_mastered,
      },
    };
  });

  res.json({
    tasks: tasks.map((t) => {
      let completedCount = 0;
      for (const s of parsedStudents) {
        if (computeTaskMetric(s.progress, s.sum, t.target_type) >= t.target_value) {
          completedCount++;
        }
      }
      return {
        id: t.id,
        title: t.title,
        description: t.description,
        targetType: t.target_type,
        targetValue: t.target_value,
        dueDate: t.due_date,
        createdBy: t.created_by,
        createdAt: t.created_at,
        completedCount,
        totalStudents: parsedStudents.length,
      };
    }),
  });
});

app.post('/api/teacher/tasks', requireAuth, requireTeacher, (req: AuthRequest, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const title = String(body.title ?? '').trim();
  const description = String(body.description ?? '').trim().slice(0, 400);
  const targetType = String(body.targetType ?? body.target_type ?? '').trim();
  const targetValue = Number(body.targetValue ?? body.target_value ?? 0);
  const dueDate = String(body.dueDate ?? body.due_date ?? '').trim();

  if (title.length < 2 || title.length > 120) {
    res.status(400).json({ error: 'Judul tugas harus 2–120 karakter.' });
    return;
  }
  if (!ALLOWED_TASK_TYPES.has(targetType)) {
    res.status(400).json({ error: 'Jenis target tugas tidak valid.' });
    return;
  }
  if (!Number.isInteger(targetValue) || targetValue < 1 || targetValue > 100000) {
    res.status(400).json({ error: 'Nilai target harus bilangan bulat minimal 1.' });
    return;
  }
  if (!isValidIsoDate(dueDate)) {
    res.status(400).json({ error: 'Tanggal tenggat harus format YYYY-MM-DD yang valid.' });
    return;
  }

  const info = db
    .prepare(
      `INSERT INTO teacher_tasks (title, description, target_type, target_value, due_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(title, description, targetType, targetValue, dueDate, req.user!.email);

  const created = db
    .prepare('SELECT * FROM teacher_tasks WHERE id = ?')
    .get(Number(info.lastInsertRowid)) as TeacherTaskRow;

  res.status(201).json({
    ok: true,
    task: {
      id: created.id,
      title: created.title,
      description: created.description,
      targetType: created.target_type,
      targetValue: created.target_value,
      dueDate: created.due_date,
      createdBy: created.created_by,
      createdAt: created.created_at,
    },
  });
});

app.delete('/api/teacher/tasks/:id', requireAuth, requireTeacher, (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'ID tugas tidak valid.' });
    return;
  }
  const info = db.prepare('DELETE FROM teacher_tasks WHERE id = ?').run(id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Tugas tidak ditemukan.' });
    return;
  }
  res.json({ ok: true, id });
});

app.patch('/api/teacher/students/:id/role', requireAuth, requireTeacher, (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const role = req.body?.role === 'teacher' ? 'teacher' : req.body?.role === 'student' ? 'student' : null;
  if (!id || !role) {
    res.status(400).json({ error: 'ID atau role tidak valid.' });
    return;
  }
  const target = db.prepare('SELECT id, role FROM users WHERE id = ?').get(id) as { id: number; role: string } | undefined;
  if (!target) {
    res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    return;
  }
  if (target.role === 'owner') {
    res.status(403).json({ error: 'Role owner tidak dapat diubah.' });
    return;
  }
  if (id === req.user!.id && role !== req.user!.role) {
    res.status(400).json({ error: 'Tidak dapat menurunkan role akun sendiri.' });
    return;
  }
  if (target.role === 'teacher' && req.user!.role !== 'owner') {
    res.status(403).json({ error: 'Hanya owner yang dapat mengubah role sesama guru.' });
    return;
  }
  if (!isStaffRole(req.user!.role)) {
    res.status(403).json({ error: 'Akses ditolak.' });
    return;
  }
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
  res.json({ ok: true, id, role });
});

// Auto-role hanya menaikkan (promote). Pencabutan role dilakukan manual oleh owner lewat halaman Rekap —
// tidak ada penurunan otomatis, supaya perubahan daftar email yang tidak sengaja tidak langsung mencabut akses guru.
const ownerEmails = getOwnerEmails();
for (const email of getTeacherEmails()) {
  if (!ownerEmails.has(email)) {
    db.prepare("UPDATE users SET role = 'teacher' WHERE email = ? AND role != 'owner'").run(email);
  }
}
for (const email of ownerEmails) {
  db.prepare("UPDATE users SET role = 'owner' WHERE email = ?").run(email);
}

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`nihongo-api listening on :${port}`);
});
