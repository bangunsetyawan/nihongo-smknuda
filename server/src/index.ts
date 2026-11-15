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
  getTeacherEmails,
  isRequestSecure,
  readSessionUser,
  requireAuth,
  requireTeacher,
  setSessionCookie,
  signSession,
  type AuthRequest,
} from './auth.js';
import { db, toPublicUser, type UserRow } from './db.js';

const execFileAsync = promisify(execFile);
const TTS_CACHE_DIR = process.env.TTS_CACHE_DIR || '/data/tts-cache';
fs.mkdirSync(TTS_CACHE_DIR, { recursive: true });

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const OAUTH_STATE_COOKIE = 'nihongo_oauth_state';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ProgressPayload {
  kana?: Record<string, { c?: number; w?: number; s?: number; t?: number }>;
  vocab?: Record<string, boolean>;
  xp?: number;
  days?: string[];
  quizzes?: number;
  name?: string;
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
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0x3040 && code <= 0x309f) hiraganaMastered++;
    else if (code >= 0x30a0 && code <= 0x30ff) katakanaMastered++;
  }
  const days = Array.isArray(data.days) ? [...new Set(data.days)].sort() : [];
  let streak = 0;
  if (days.length > 0) {
    const set = new Set(days);
    const cur = new Date();
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!set.has(fmt(cur))) cur.setDate(cur.getDate() - 1);
    while (set.has(fmt(cur))) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    }
  }
  return { xp, hiraganaMastered, katakanaMastered, vocabMastered, streak };
}

function getOrCreateProgress(userId: number): ProgressPayload {
  const row = db.prepare('SELECT data_json FROM user_progress WHERE user_id = ?').get(userId) as
    | { data_json: string }
    | undefined;
  if (row) {
    try {
      return JSON.parse(row.data_json) as ProgressPayload;
    } catch {
      return { kana: {}, vocab: {}, xp: 0, days: [], quizzes: 0 };
    }
  }
  const empty: ProgressPayload = { kana: {}, vocab: {}, xp: 0, days: [], quizzes: 0 };
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

app.post('/api/auth/register', async (req, res) => {
  const body = req.body ?? {};
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const fullName = String(body.fullName ?? '').trim();
  const nickname = String(body.nickname ?? '').trim() || fullName.split(' ')[0] || '';
  const kelas = String(body.kelas ?? '').trim();
  const jurusan = String(body.jurusan ?? '').trim();
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
  if (!kelas || !jurusan) {
    res.status(400).json({ error: 'Kelas dan jurusan wajib diisi.' });
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ error: 'Email sudah terdaftar. Silakan masuk.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const role = getTeacherEmails().has(email) ? 'teacher' : 'student';
  const info = db
    .prepare(
      `INSERT INTO users (email, password_hash, full_name, nickname, kelas, jurusan, japanese_name, role, profile_completed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
    )
    .run(email, passwordHash, fullName, nickname, kelas, jurusan, japaneseName, role);

  const userId = Number(info.lastInsertRowid);
  const progress = getOrCreateProgress(userId);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;

  setSessionCookie(res, signSession(userId), isRequestSecure(req));
  res.status(201).json({ user: toPublicUser(user), progress });
});

app.post('/api/auth/login', async (req, res) => {
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
      const role = getTeacherEmails().has(email) ? 'teacher' : 'student';
      const info = db
        .prepare(
          `INSERT INTO users (email, google_id, avatar_url, full_name, nickname, role, profile_completed)
           VALUES (?, ?, ?, ?, ?, ?, 0)`
        )
        .run(email, googleId, g.picture ?? null, fullName, nickname, role);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(info.lastInsertRowid)) as UserRow;
      getOrCreateProgress(user.id);
    } else {
      const autoTeacher = getTeacherEmails().has(email) ? 'teacher' : user.role;
      db.prepare(
        `UPDATE users
         SET google_id = COALESCE(google_id, ?),
             avatar_url = COALESCE(?, avatar_url),
             role = ?,
             last_login_at = datetime('now')
         WHERE id = ?`
      ).run(googleId, g.picture ?? null, autoTeacher, user.id);
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
  const body = req.body ?? {};
  const fullName = String(body.fullName ?? '').trim();
  const nickname = String(body.nickname ?? '').trim() || fullName.split(' ')[0] || '';
  const kelas = String(body.kelas ?? '').trim();
  const jurusan = String(body.jurusan ?? '').trim();
  const japaneseName = String(body.japaneseName ?? '').trim();

  if (fullName.length < 2) {
    res.status(400).json({ error: 'Nama lengkap minimal 2 huruf.' });
    return;
  }
  if (!kelas || !jurusan) {
    res.status(400).json({ error: 'Kelas dan jurusan wajib diisi.' });
    return;
  }

  db.prepare(
    `UPDATE users
     SET full_name = ?, nickname = ?, kelas = ?, jurusan = ?, japanese_name = ?, profile_completed = 1
     WHERE id = ?`
  ).run(fullName, nickname, kelas, jurusan, japaneseName, user.id);

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as UserRow;
  res.json({ user: toPublicUser(updated) });
});

app.get('/api/progress', requireAuth, (req: AuthRequest, res) => {
  const progress = getOrCreateProgress(req.user!.id);
  res.json({ progress });
});

app.put('/api/progress', requireAuth, (req: AuthRequest, res) => {
  const payload = req.body as ProgressPayload | undefined;
  if (!payload || typeof payload !== 'object' || typeof payload.kana !== 'object') {
    res.status(400).json({ error: 'Format progres tidak valid.' });
    return;
  }

  const clean: ProgressPayload = {
    kana: payload.kana ?? {},
    vocab: payload.vocab ?? {},
    xp: typeof payload.xp === 'number' ? Math.max(0, Math.floor(payload.xp)) : 0,
    days: Array.isArray(payload.days) ? [...new Set(payload.days)].slice(-365) : [],
    quizzes: typeof payload.quizzes === 'number' ? Math.max(0, Math.floor(payload.quizzes)) : 0,
    name: typeof payload.name === 'string' ? payload.name.slice(0, 32) : undefined,
  };

  const sum = summarizeProgress(clean);
  db.prepare(
    `INSERT INTO user_progress (user_id, data_json, xp, hiragana_mastered, katakana_mastered, vocab_mastered, streak, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       data_json = excluded.data_json,
       xp = excluded.xp,
       hiragana_mastered = excluded.hiragana_mastered,
       katakana_mastered = excluded.katakana_mastered,
       vocab_mastered = excluded.vocab_mastered,
       streak = excluded.streak,
       updated_at = datetime('now')`
  ).run(
    req.user!.id,
    JSON.stringify(clean),
    sum.xp,
    sum.hiraganaMastered,
    sum.katakanaMastered,
    sum.vocabMastered,
    sum.streak
  );

  res.json({ ok: true, summary: sum });
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

app.get('/api/tts', async (req, res) => {
  const text = String(req.query.text ?? '').trim();
  if (!text || text.length > 220) {
    res.status(400).json({ error: 'Teks harus diisi (maksimal 220 karakter).' });
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
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('TTS error:', err);
    res.status(502).json({ error: 'Gagal menghasilkan audio TTS.' });
  }
});

app.get('/api/translate', async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  if (!q || q.length > 220) {
    res.status(400).json({ error: 'Teks harus diisi (maksimal 220 karakter).' });
    return;
  }
  const key = crypto.createHash('sha256').update(q.toLowerCase()).digest('hex');
  const cached = db
    .prepare('SELECT source_text, jp_text, romaji FROM translations_cache WHERE q_hash = ?')
    .get(key) as { source_text: string; jp_text: string; romaji: string } | undefined;
  if (cached) {
    res.json({ source: q, jp: cached.jp_text, romaji: cached.romaji });
    return;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=ja&dt=t&dt=rm&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error('Translate upstream error');
    const data = (await r.json()) as [Array<[string | null, string | null, string | null]>];
    const segments = Array.isArray(data?.[0]) ? data[0] : [];
    const jp = segments.map((s) => s?.[0] ?? '').join('').trim();
    const romaji = segments.map((s) => s?.[2] ?? '').filter(Boolean).join(' ').trim();
    if (!jp) throw new Error('Empty translation');

    db.prepare(
      'INSERT OR REPLACE INTO translations_cache (q_hash, source_text, jp_text, romaji) VALUES (?, ?, ?, ?)'
    ).run(key, q, jp, romaji);

    res.json({ source: q, jp, romaji });
  } catch (err) {
    console.error('Translate error:', err);
    res.status(502).json({ error: 'Gagal menerjemahkan teks. Coba lagi sebentar.' });
  }
});

app.get('/api/leaderboard', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.nickname, u.japanese_name, u.kelas, u.jurusan, u.avatar_url, u.role,
              COALESCE(p.xp, 0) AS xp,
              COALESCE(p.streak, 0) AS streak,
              COALESCE(p.hiragana_mastered, 0) AS hiragana_mastered,
              COALESCE(p.katakana_mastered, 0) AS katakana_mastered,
              COALESCE(p.vocab_mastered, 0) AS vocab_mastered
       FROM users u
       LEFT JOIN user_progress p ON p.user_id = u.id
       WHERE u.profile_completed = 1
       ORDER BY xp DESC, streak DESC, hiragana_mastered DESC, u.id ASC
       LIMIT 100`
    )
    .all() as Array<{
    id: number;
    nickname: string;
    japanese_name: string;
    kelas: string;
    jurusan: string;
    avatar_url: string | null;
    role: string;
    xp: number;
    streak: number;
    hiragana_mastered: number;
    katakana_mastered: number;
    vocab_mastered: number;
  }>;

  res.json({
    entries: rows.map((r) => ({
      id: r.id,
      nickname: r.nickname,
      japaneseName: r.japanese_name,
      kelas: r.kelas,
      jurusan: r.jurusan,
      avatarUrl: r.avatar_url,
      role: r.role,
      xp: r.xp,
      streak: r.streak,
      hiraganaMastered: r.hiragana_mastered,
      katakanaMastered: r.katakana_mastered,
      vocabMastered: r.vocab_mastered,
    })),
  });
});

app.get('/api/teacher/students', requireAuth, requireTeacher, (_req: AuthRequest, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.email, u.full_name, u.nickname, u.japanese_name, u.kelas, u.jurusan,
              u.role, u.profile_completed, u.created_at, u.last_login_at,
              COALESCE(p.xp, 0) AS xp,
              COALESCE(p.streak, 0) AS streak,
              COALESCE(p.hiragana_mastered, 0) AS hiragana_mastered,
              COALESCE(p.katakana_mastered, 0) AS katakana_mastered,
              COALESCE(p.vocab_mastered, 0) AS vocab_mastered,
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
    progress_updated_at: string | null;
  }>;

  res.json({
    students: rows.map((r) => ({
      id: r.id,
      email: r.email,
      fullName: r.full_name,
      nickname: r.nickname,
      japaneseName: r.japanese_name,
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
      progressUpdatedAt: r.progress_updated_at,
    })),
  });
});

app.patch('/api/teacher/students/:id/role', requireAuth, requireTeacher, (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const role = req.body?.role === 'teacher' ? 'teacher' : req.body?.role === 'student' ? 'student' : null;
  if (!id || !role) {
    res.status(400).json({ error: 'ID atau role tidak valid.' });
    return;
  }
  if (id === req.user!.id && role !== 'teacher') {
    res.status(400).json({ error: 'Tidak dapat menurunkan role akun sendiri.' });
    return;
  }
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
  res.json({ ok: true, id, role });
});

for (const email of getTeacherEmails()) {
  db.prepare("UPDATE users SET role = 'teacher' WHERE email = ?").run(email);
}

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`nihongo-api listening on :${port}`);
});
