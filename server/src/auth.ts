import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, type UserRow } from './db.js';

export const COOKIE_NAME = 'nihongo_session';
const FORBIDDEN_DEFAULT_SECRETS = new Set([
  'nihongo-smknuda-dev-secret-change-me',
  'nihongo-smknuda-secret-ubah-di-env',
]);
const rawJwtSecret = process.env.JWT_SECRET?.trim() ?? '';
if (!rawJwtSecret || FORBIDDEN_DEFAULT_SECRETS.has(rawJwtSecret)) {
  throw new Error('JWT_SECRET belum diset di .env (atau masih memakai nilai default lama).');
}
const JWT_SECRET = rawJwtSecret;

export interface AuthRequest extends Request {
  user?: UserRow;
}

export function signSession(userId: number): string {
  return jwt.sign({ uid: userId }, JWT_SECRET, { expiresIn: '30d' });
}

export function setSessionCookie(res: Response, token: string, secure: boolean) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

export function isRequestSecure(req: Request): boolean {
  if (req.secure) return true;
  const proto = req.headers['x-forwarded-proto'];
  if (typeof proto === 'string' && proto.split(',')[0].trim() === 'https') return true;
  return false;
}

export function readSessionUser(req: Request): UserRow | undefined {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token || typeof token !== 'string') return undefined;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { uid?: number };
    if (!payload.uid) return undefined;
    return db.prepare('SELECT * FROM users WHERE id = ?').get(payload.uid) as UserRow | undefined;
  } catch {
    return undefined;
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const user = readSessionUser(req);
  if (!user) {
    res.status(401).json({ error: 'Silakan masuk terlebih dahulu.' });
    return;
  }
  req.user = user;
  next();
}

export function isStaffRole(role: string): boolean {
  return role === 'teacher' || role === 'owner';
}

export function requireTeacher(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || !isStaffRole(req.user.role)) {
    res.status(403).json({ error: 'Halaman ini khusus untuk guru / pembina.' });
    return;
  }
  next();
}

export function getOwnerEmails(): Set<string> {
  const raw = process.env.OWNER_EMAILS || 'bangun164@gmail.com';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function getTeacherEmails(): Set<string> {
  const raw = process.env.TEACHER_EMAILS || 'bangun164@gmail.com,siakanuda@gmail.com';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function getGoogleConfig() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const appUrl = (process.env.APP_URL || '').trim().replace(/\/$/, '');
  return {
    enabled: Boolean(clientId && clientSecret),
    clientId,
    clientSecret,
    appUrl,
  };
}
