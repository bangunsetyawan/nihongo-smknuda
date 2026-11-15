// Progres belajar disimpan di perangkat siswa (localStorage) dan disinkronkan ke server saat login.
import { useSyncExternalStore } from 'react';

export interface KanaStat {
  c: number; // total benar
  w: number; // total salah
  s: number; // benar berturut-turut
  t: number; // terakhir dilatih (ms)
}

export interface Progress {
  kana: Record<string, KanaStat>;
  vocab?: Record<string, boolean>;
  xp: number;
  days: string[]; // tanggal belajar (YYYY-MM-DD)
  quizzes: number;
  name?: string;
}

const KEY = 'nihongo-smk:v1';
const empty: Progress = { kana: {}, vocab: {}, xp: 0, days: [], quizzes: 0 };

let state: Progress = load();
const subs = new Set<() => void>();
let cloudSyncEnabled = false;
let syncTimer: number | undefined;
let pendingSync = false;

async function pushToServer(snapshot: Progress) {
  try {
    const res = await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(snapshot),
    });
    if (res.ok) pendingSync = false;
    else pendingSync = true;
  } catch {
    pendingSync = true;
  }
}

function scheduleSync() {
  if (!cloudSyncEnabled) return;
  pendingSync = true;
  if (syncTimer) window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    void pushToServer(state);
  }, 1200);
}

window.addEventListener('online', () => {
  if (cloudSyncEnabled && pendingSync) void pushToServer(state);
});

export function setCloudSync(enabled: boolean) {
  cloudSyncEnabled = enabled;
  if (!enabled && syncTimer) {
    window.clearTimeout(syncTimer);
    syncTimer = undefined;
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
      };
    }
  }
  const mergedVocab: Record<string, boolean> = { ...(srv.vocab ?? {}) };
  for (const [id, val] of Object.entries(local.vocab ?? {})) {
    mergedVocab[id] = Boolean(mergedVocab[id] || val);
  }
  const mergedDays = Array.from(new Set([...(srv.days ?? []), ...(local.days ?? [])])).sort();
  const merged: Progress = {
    kana: mergedKana,
    vocab: mergedVocab,
    xp: Math.max(local.xp ?? 0, srv.xp ?? 0),
    days: mergedDays,
    quizzes: Math.max(local.quizzes ?? 0, srv.quizzes ?? 0),
    name: local.name || srv.name,
  };
  state = merged;
  try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch {}
  subs.forEach((f) => f());
  if (cloudSyncEnabled) void pushToServer(merged);
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed, vocab: parsed.vocab ?? {} };
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
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function recordAnswer(char: string, correct: boolean) {
  const prev = state.kana[char] ?? { c: 0, w: 0, s: 0, t: 0 };
  const stat: KanaStat = correct
    ? { c: prev.c + 1, w: prev.w, s: prev.s + 1, t: Date.now() }
    : { c: prev.c, w: prev.w + 1, s: 0, t: Date.now() };
  const d = today();
  save({
    ...state,
    kana: { ...state.kana, [char]: stat },
    xp: state.xp + (correct ? 10 : 1),
    days: state.days.includes(d) ? state.days : [...state.days, d],
  });
}

export function finishQuiz(bonusXp: number) {
  save({ ...state, quizzes: state.quizzes + 1, xp: state.xp + bonusXp });
}

export function toggleVocab(id: string) {
  const prev = state.vocab ?? {};
  const nextVal = !prev[id];
  const firstTime = nextVal && !(id in prev);
  const d = today();
  save({
    ...state,
    vocab: { ...prev, [id]: nextVal },
    xp: state.xp + (firstTime ? 5 : 0),
    days: nextVal && !state.days.includes(d) ? [...state.days, d] : state.days,
  });
}

export function markVocab(id: string, known: boolean) {
  const prev = state.vocab ?? {};
  const d = today();
  save({
    ...state,
    vocab: { ...prev, [id]: known },
    xp: state.xp + (known ? 10 : 1),
    days: state.days.includes(d) ? state.days : [...state.days, d],
  });
}

export function setName(name: string) {
  save({ ...state, name });
}

export function resetProgress() {
  save({ ...empty });
}

export function exportProgress(): string {
  return JSON.stringify(state);
}

export function importProgress(json: string) {
  const data = JSON.parse(json);
  if (typeof data !== 'object' || !data.kana) throw new Error('Format tidak dikenali');
  save({ ...empty, ...data });
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
  const d = new Date();
  // Jika hari ini belum belajar, hitung dari kemarin
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  for (;;) {
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!set.has(k)) break;
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function level(xp: number) {
  // Level naik tiap 200 XP
  return { lv: Math.floor(xp / 200) + 1, cur: xp % 200, need: 200 };
}
