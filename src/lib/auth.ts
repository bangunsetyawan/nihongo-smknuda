import { useSyncExternalStore } from 'react';
import { mergeServerProgress, setCloudSync, setName, type Progress } from './progress';

export interface AuthUser {
  id: number;
  email: string;
  avatarUrl: string | null;
  fullName: string;
  nickname: string;
  jenjang: string;
  school: string;
  kelas: string;
  jurusan: string;
  japaneseName: string;
  role: string;
  profileCompleted: boolean;
  showOnLeaderboard: boolean;
  hasGoogle: boolean;
}

interface AuthState {
  loading: boolean;
  user: AuthUser | null;
  googleEnabled: boolean;
}

let state: AuthState = { loading: true, user: null, googleEnabled: false };
const subs = new Set<() => void>();

function setState(next: Partial<AuthState>) {
  state = { ...state, ...next };
  subs.forEach((f) => f());
}

export function useAuth(): AuthState {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => state,
  );
}

function applyLoggedInUser(user: AuthUser | null, progress?: Partial<Progress> | null) {
  if (user) {
    setCloudSync(true);
    if (user.nickname) setName(user.nickname);
    mergeServerProgress(progress);
  } else {
    setCloudSync(false);
  }
  setState({ user, loading: false });
}

export async function initAuth() {
  try {
    const [meRes, provRes] = await Promise.all([
      fetch('/api/auth/me', { credentials: 'include' }),
      fetch('/api/auth/providers'),
    ]);
    const prov = provRes.ok ? ((await provRes.json()) as { google?: boolean }) : { google: false };
    setState({ googleEnabled: Boolean(prov.google) });
    if (meRes.ok) {
      const data = (await meRes.json()) as { user: AuthUser | null; progress: Partial<Progress> | null };
      applyLoggedInUser(data.user, data.progress);
    } else {
      setState({ loading: false });
    }
  } catch {
    setState({ loading: false });
  }
}

export async function loginManual(email: string, password: string): Promise<AuthUser> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json()) as { user?: AuthUser; progress?: Partial<Progress>; error?: string };
  if (!res.ok || !data.user) throw new Error(data.error || 'Gagal masuk.');
  applyLoggedInUser(data.user, data.progress);
  return data.user;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  nickname: string;
  jenjang: string;
  school: string;
  kelas: string;
  jurusan: string;
  japaneseName?: string;
}

export async function registerManual(input: RegisterInput): Promise<AuthUser> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as { user?: AuthUser; progress?: Partial<Progress>; error?: string };
  if (!res.ok || !data.user) throw new Error(data.error || 'Gagal mendaftar.');
  applyLoggedInUser(data.user, data.progress);
  return data.user;
}

export interface ProfileInput {
  fullName: string;
  nickname: string;
  jenjang: string;
  school: string;
  kelas: string;
  jurusan: string;
  japaneseName?: string;
  showOnLeaderboard?: boolean;
}

export async function updateProfile(input: ProfileInput): Promise<AuthUser> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as { user?: AuthUser; error?: string };
  if (!res.ok || !data.user) throw new Error(data.error || 'Gagal menyimpan profil.');
  if (data.user.nickname) setName(data.user.nickname);
  setState({ user: data.user });
  return data.user;
}

export async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } finally {
    setCloudSync(false);
    setState({ user: null });
  }
}
