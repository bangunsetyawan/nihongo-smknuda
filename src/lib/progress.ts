// Progres belajar disimpan di perangkat siswa (localStorage) dan disinkronkan ke server saat login.
import { useSyncExternalStore } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface SrsStat {
  i: number; // interval (hari)
  r: number; // timestamp review berikutnya (ms)
}

export interface KanaStat {
  c: number; // total benar
  w: number; // total salah
  s: number; // benar berturut-turut
  t: number; // terakhir dilatih (ms)
  i?: number; // interval SRS (hari)
  r?: number; // nextReview (timestamp ms)
}

export interface KanjiStat {
  c: number;
  w: number;
  s: number;
  t: number;
  i: number;
  r: number;
}

export interface Progress {
  kana: Record<string, KanaStat>;
  vocab?: Record<string, boolean>;
  vocabSrs?: Record<string, SrsStat>;
  vocabStats?: Record<string, { c: number; w: number }>;
  kanji?: Record<string, KanjiStat>;
  bunpou?: Record<string, { c: number; w: number }>;
  bunpouQuestions?: Record<string, { c: number; w: number }>;
  kaiwa?: string[];
  xp: number;
  days: string[]; // tanggal belajar (YYYY-MM-DD)
  quizzes: number;
  perfectQuizzes?: number;
  srsReviews?: number;
  name?: string;
}

export type SyncStatus = 'synced' | 'syncing' | 'pending' | 'offline';

const KEY = 'nihongo-smk:v1';
const empty: Progress = { kana: {}, vocab: {}, vocabSrs: {}, vocabStats: {}, kanji: {}, bunpou: {}, bunpouQuestions: {}, kaiwa: [], xp: 0, days: [], quizzes: 0, perfectQuizzes: 0, srsReviews: 0 };

let state: Progress = load();
const subs = new Set<() => void>();
const syncSubs = new Set<() => void>();
let cloudSyncEnabled = false;
let syncTimer: number | undefined;
let pendingSync = false;
let syncInFlight = false;

function getSyncSnapshot(): SyncStatus {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'offline';
  if (syncInFlight) return 'syncing';
  if (pendingSync) return 'pending';
  return 'synced';
}

let cachedSyncStatus: SyncStatus = getSyncSnapshot();

function notifySync() {
  const next = getSyncSnapshot();
  if (next !== cachedSyncStatus) {
    cachedSyncStatus = next;
    syncSubs.forEach((f) => f());
  }
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    (cb) => { syncSubs.add(cb); return () => syncSubs.delete(cb); },
    () => cachedSyncStatus,
  );
}

async function pushToServer(snapshot: Progress) {
  syncInFlight = true;
  notifySync();
  try {
    const res = await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(snapshot),
    });
    pendingSync = !res.ok;
  } catch {
    pendingSync = true;
  } finally {
    syncInFlight = false;
    notifySync();
  }
}

function scheduleSync() {
  if (!cloudSyncEnabled) return;
  pendingSync = true;
  notifySync();
  if (syncTimer) window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    void pushToServer(state);
  }, 1200);
}

window.addEventListener('online', () => {
  notifySync();
  if (cloudSyncEnabled && pendingSync) void pushToServer(state);
});

window.addEventListener('offline', () => {
  notifySync();
});

export function setCloudSync(enabled: boolean) {
  cloudSyncEnabled = enabled;
  if (!enabled) {
    if (syncTimer) {
      window.clearTimeout(syncTimer);
      syncTimer = undefined;
    }
    pendingSync = false;
    syncInFlight = false;
  }
  notifySync();
}

async function recordPracticeOnServer(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  if (!cloudSyncEnabled) return { ok: true };
  pendingSync = true;
  syncInFlight = true;
  notifySync();
  try {
    const res = await fetch('/api/practice/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      keepalive: true,
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { progress?: Progress; error?: string };
    if (!res.ok) {
      pendingSync = true;
      return { ok: false, error: data.error };
    }
    pendingSync = false;
    if (data.progress) {
      state = {
        ...empty,
        ...state,
        ...data.progress,
        kana: data.progress.kana ?? state.kana,
        vocab: data.progress.vocab ?? state.vocab,
        vocabSrs: data.progress.vocabSrs ?? state.vocabSrs ?? {},
        vocabStats: data.progress.vocabStats ?? state.vocabStats ?? {},
        kanji: data.progress.kanji ?? state.kanji ?? {},
        bunpou: data.progress.bunpou ?? state.bunpou ?? {},
        bunpouQuestions: data.progress.bunpouQuestions ?? state.bunpouQuestions ?? {},
        kaiwa: Array.isArray(data.progress.kaiwa) ? data.progress.kaiwa : (state.kaiwa ?? []),
      };
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
      subs.forEach((f) => f());
    }
    return { ok: true };
  } catch {
    pendingSync = true;
    return { ok: false, error: 'Gagal menghubungi server.' };
  } finally {
    syncInFlight = false;
    notifySync();
  }
}

export function mergeServerProgress(serverProg?: Partial<Progress> | null) {
  const local = state;
  const srv = serverProg ?? {};
  const mergedKana: Record<string, KanaStat> = { ...(srv.kana ?? {}) };
  for (const [ch, ls] of Object.entries(local.kana ?? {})) {
    const ss = mergedKana[ch];
    if (!ss || ls.t >= ss.t) {
      mergedKana[ch] = {
        c: Math.max(ls.c, ss?.c ?? 0),
        w: Math.max(ls.w, ss?.w ?? 0),
        s: ls.t >= (ss?.t ?? 0) ? ls.s : (ss?.s ?? 0),
        t: Math.max(ls.t, ss?.t ?? 0),
        i: ss?.i ?? ls.i ?? 1,
        r: ss?.r ?? ls.r ?? Date.now() + DAY_MS,
      };
    }
  }
  const mergedVocab: Record<string, boolean> = { ...(srv.vocab ?? {}) };
  for (const [id, val] of Object.entries(local.vocab ?? {})) {
    mergedVocab[id] = Boolean(mergedVocab[id] || val);
  }
  const merged: Progress = {
    kana: mergedKana,
    vocab: mergedVocab,
    vocabSrs: { ...(local.vocabSrs ?? {}), ...(srv.vocabSrs ?? {}) },
    vocabStats: { ...(local.vocabStats ?? {}), ...(srv.vocabStats ?? {}) },
    kanji: { ...(local.kanji ?? {}), ...(srv.kanji ?? {}) },
    bunpou: { ...(local.bunpou ?? {}), ...(srv.bunpou ?? {}) },
    bunpouQuestions: { ...(local.bunpouQuestions ?? {}), ...(srv.bunpouQuestions ?? {}) },
    kaiwa: Array.isArray(srv.kaiwa) ? srv.kaiwa : (local.kaiwa ?? []),
    // XP, hari aktif, kuis, dan review SRS mengikuti angka resmi server saat login.
    xp: typeof srv.xp === 'number' ? srv.xp : 0,
    days: Array.isArray(srv.days) ? srv.days : [],
    quizzes: typeof srv.quizzes === 'number' ? srv.quizzes : 0,
    perfectQuizzes: typeof srv.perfectQuizzes === 'number' ? srv.perfectQuizzes : 0,
    srsReviews: typeof srv.srsReviews === 'number' ? srv.srsReviews : 0,
    name: local.name || srv.name,
  };
  state = merged;
  try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch {}
  subs.forEach((f) => f());
  if (cloudSyncEnabled && local.name && !srv.name) void pushToServer(merged);
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw);
    return {
      ...empty,
      ...parsed,
      vocab: parsed.vocab ?? {},
      vocabSrs: parsed.vocabSrs ?? {},
      vocabStats: parsed.vocabStats ?? {},
      kanji: parsed.kanji ?? {},
      bunpou: parsed.bunpou ?? {},
      bunpouQuestions: parsed.bunpouQuestions ?? {},
      kaiwa: Array.isArray(parsed.kaiwa) ? parsed.kaiwa : [],
    };
  } catch {
    return { ...empty };
  }
}

function save(next: Progress) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  subs.forEach((f) => f());
  scheduleSync();
}

window.addEventListener('storage', (e) => {
  if (e.key === KEY) { state = load(); subs.forEach((f) => f()); }
});

export function useProgress(): Progress {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => state,
  );
}

export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
}

function saveLocalOnly(next: Progress) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  subs.forEach((f) => f());
}

export function recordAnswer(char: string, given: string, mode: string, localCorrect: boolean) {
  const prev = state.kana[char] ?? { c: 0, w: 0, s: 0, t: 0 };
  const now = Date.now();
  const nextI = localCorrect ? (prev.i || 1) * 2 : 1;
  const stat: KanaStat = localCorrect
    ? { c: prev.c + 1, w: prev.w, s: prev.s + 1, t: now, i: nextI, r: now + nextI * DAY_MS }
    : { c: prev.c, w: prev.w + 1, s: 0, t: now, i: 1, r: now + DAY_MS };
  const wasDue = prev.t > 0 && typeof prev.r === 'number' && prev.r <= now;
  const d = today();
  saveLocalOnly({
    ...state,
    kana: { ...state.kana, [char]: stat },
    xp: state.xp + (localCorrect ? 10 : 1),
    days: state.days.includes(d) ? state.days : [...state.days, d],
    srsReviews: (state.srsReviews ?? 0) + (wasDue ? 1 : 0),
  });
  void recordPracticeOnServer({ type: 'kana_answer', char, given, mode });
}

export type QuizFinishPayload =
  | { quizType?: 'kana'; isReview?: boolean; answers: Array<{ char: string; given: string; mode?: string }> }
  | { quizType: 'vocab'; isReview?: boolean; answers: Array<{ id: string; givenId: string }> }
  | { quizType: 'mixed'; isReview?: boolean; answers: Array<{ kind: 'kana'; char: string; given: string; mode?: string } | { kind: 'vocab'; id: string; givenId: string }> }
  | { quizType: 'kanji'; isReview?: boolean; answers: Array<{ char: string; given: string; mode: string }> };

export function finishQuiz(localBonusXp: number, payload: QuizFinishPayload) {
  saveLocalOnly({
    ...state,
    quizzes: state.quizzes + 1,
    perfectQuizzes: (state.perfectQuizzes ?? 0) + (localBonusXp >= 50 ? 1 : 0),
    srsReviews: (state.srsReviews ?? 0) + (payload.isReview && payload.answers.length > 0 ? 1 : 0),
    xp: state.xp + localBonusXp,
  });
  void recordPracticeOnServer({ type: 'quiz_finish', ...payload });
}

export function toggleVocab(id: string) {
  const prev = state.vocab ?? {};
  const nextVal = !prev[id];
  const firstTime = nextVal && !(id in prev);
  const nextSrs = { ...(state.vocabSrs ?? {}) };
  if (nextVal) nextSrs[id] = { i: 1, r: Date.now() + DAY_MS };
  else delete nextSrs[id];
  const d = today();
  saveLocalOnly({
    ...state,
    vocab: { ...prev, [id]: nextVal },
    vocabSrs: nextSrs,
    xp: state.xp + (firstTime ? 5 : 0),
    days: nextVal && !state.days.includes(d) ? [...state.days, d] : state.days,
  });
  void recordPracticeOnServer({ type: 'vocab_toggle', id });
}

export function markVocab(id: string, known: boolean) {
  const prev = state.vocab ?? {};
  const firstTime = known && !(id in prev);
  const nextSrs = { ...(state.vocabSrs ?? {}) };
  if (known) nextSrs[id] = { i: 1, r: Date.now() + DAY_MS };
  else delete nextSrs[id];
  const d = today();
  saveLocalOnly({
    ...state,
    vocab: { ...prev, [id]: known },
    vocabSrs: nextSrs,
    xp: state.xp + (firstTime ? 5 : 0),
    days: known && !state.days.includes(d) ? [...state.days, d] : state.days,
  });
  void recordPracticeOnServer({ type: 'vocab_mark', id, known });
}

export function recordKanjiAnswer(char: string, given: string, mode: string, localCorrect: boolean) {
  const prevMap = state.kanji ?? {};
  const prev = prevMap[char] ?? { c: 0, w: 0, s: 0, t: 0, i: 1, r: 0 };
  const now = Date.now();
  const nextI = localCorrect ? (prev.i || 1) * 2 : 1;
  const stat: KanjiStat = localCorrect
    ? { c: prev.c + 1, w: prev.w, s: prev.s + 1, t: now, i: nextI, r: now + nextI * DAY_MS }
    : { c: prev.c, w: prev.w + 1, s: 0, t: now, i: 1, r: now + DAY_MS };
  const wasDue = prev.t > 0 && typeof prev.r === 'number' && prev.r <= now;
  const d = today();
  saveLocalOnly({
    ...state,
    kanji: { ...prevMap, [char]: stat },
    xp: state.xp + (localCorrect ? 10 : 1),
    days: state.days.includes(d) ? state.days : [...state.days, d],
    srsReviews: (state.srsReviews ?? 0) + (wasDue ? 1 : 0),
  });
  void recordPracticeOnServer({ type: 'kanji_answer', char, given, mode });
}

export function recordBunpouAnswer(topicId: string, questionId: string, given: string, localCorrect: boolean) {
  const prevTopic = state.bunpou?.[topicId] ?? { c: 0, w: 0 };
  const prevQ = state.bunpouQuestions?.[questionId] ?? { c: 0, w: 0 };
  const d = today();
  saveLocalOnly({
    ...state,
    bunpou: {
      ...(state.bunpou ?? {}),
      [topicId]: localCorrect
        ? { c: prevTopic.c + 1, w: prevTopic.w }
        : { c: prevTopic.c, w: prevTopic.w + 1 },
    },
    bunpouQuestions: {
      ...(state.bunpouQuestions ?? {}),
      [questionId]: localCorrect
        ? { c: prevQ.c + 1, w: prevQ.w }
        : { c: prevQ.c, w: prevQ.w + 1 },
    },
    xp: state.xp + (localCorrect ? 10 : 1),
    days: state.days.includes(d) ? state.days : [...state.days, d],
  });
  void recordPracticeOnServer({ type: 'bunpou_answer', questionId, given });
}

export async function completeKaiwa(id: string): Promise<{ ok: boolean; error?: string }> {
  const prev = Array.isArray(state.kaiwa) ? state.kaiwa : [];
  if (prev.includes(id)) {
    return { ok: false, error: 'Dialog ini sudah pernah ditandai selesai.' };
  }
  if (!cloudSyncEnabled) {
    const d = today();
    saveLocalOnly({
      ...state,
      kaiwa: [...prev, id],
      xp: state.xp + 5,
      days: state.days.includes(d) ? state.days : [...state.days, d],
    });
    return { ok: true };
  }
  return recordPracticeOnServer({ type: 'kaiwa_complete', id });
}

export function dueToday(prog: Progress = state, now = Date.now()): { kana: string[]; vocab: string[]; total: number } {
  const kana: string[] = [];
  for (const [ch, st] of Object.entries(prog.kana ?? {})) {
    if (st && typeof st.r === 'number' && st.r <= now) {
      kana.push(ch);
    }
  }
  const vocab: string[] = [];
  for (const [id, srs] of Object.entries(prog.vocabSrs ?? {})) {
    if (prog.vocab?.[id] !== false && srs && typeof srs.r === 'number' && srs.r <= now) {
      vocab.push(id);
    }
  }
  return { kana, vocab, total: kana.length + vocab.length };
}

export function setName(name: string) {
  save({ ...state, name });
}

export async function resetProgress(): Promise<void> {
  if (cloudSyncEnabled) {
    const res = await fetch('/api/progress', {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(data.error || 'Gagal mereset progres di server.');
  }
  if (syncTimer) {
    window.clearTimeout(syncTimer);
    syncTimer = undefined;
  }
  pendingSync = false;
  syncInFlight = false;
  try { localStorage.removeItem(KEY); } catch {}
  saveLocalOnly({ ...empty });
  notifySync();
}

export function exportProgress(): string {
  return JSON.stringify(state);
}

export async function importProgress(json: string): Promise<void> {
  const data = JSON.parse(json) as Partial<Progress>;
  if (!data || typeof data !== 'object' || !data.kana || typeof data.kana !== 'object') {
    throw new Error('Format tidak dikenali');
  }
  if (cloudSyncEnabled) {
    const res = await fetch('/api/progress/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; progress?: Progress; error?: string };
    if (!res.ok || !body.progress) {
      throw new Error(body.error || 'Server menolak data cadangan progres.');
    }
    if (syncTimer) {
      window.clearTimeout(syncTimer);
      syncTimer = undefined;
    }
    pendingSync = false;
    syncInFlight = false;
    saveLocalOnly({ ...empty, ...body.progress });
    notifySync();
    return;
  }
  saveLocalOnly({ ...empty, ...data });
}

export type Mastery = 0 | 1 | 2 | 3; // 0 belum, 1 lemah, 2 sedang, 3 hafal

export function mastery(stat?: KanaStat): Mastery {
  if (!stat) return 0;
  if (stat.s >= 5) return 3;
  if (stat.s >= 2) return 2;
  return 1;
}

export function streak(days: string[]): number {
  const set = new Set(days);
  let n = 0;
  const [y, m, day] = today().split('-').map(Number);
  let cursorMs = Date.UTC(y, m - 1, day);
  const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  // Jika hari ini belum belajar, hitung dari kemarin
  if (!set.has(isoDay(cursorMs))) cursorMs -= 86_400_000;
  for (;;) {
    if (!set.has(isoDay(cursorMs))) break;
    n++;
    cursorMs -= 86_400_000;
  }
  return n;
}

export function level(xp: number) {
  // Level naik tiap 200 XP
  return { lv: Math.floor(xp / 200) + 1, cur: xp % 200, need: 200 };
}
