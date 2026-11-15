import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = process.env.DB_PATH || '/data/nihongo.db';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    google_id TEXT UNIQUE,
    avatar_url TEXT,
    full_name TEXT NOT NULL DEFAULT '',
    nickname TEXT NOT NULL DEFAULT '',
    jenjang TEXT NOT NULL DEFAULT 'SMK',
    school TEXT NOT NULL DEFAULT 'SMK NU Darussalam',
    kelas TEXT NOT NULL DEFAULT '',
    jurusan TEXT NOT NULL DEFAULT '',
    japanese_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'student',
    profile_completed INTEGER NOT NULL DEFAULT 0,
    show_on_leaderboard INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    data_json TEXT NOT NULL DEFAULT '{"kana":{},"vocab":{},"xp":0,"days":[],"quizzes":0}',
    xp INTEGER NOT NULL DEFAULT 0,
    hiragana_mastered INTEGER NOT NULL DEFAULT 0,
    katakana_mastered INTEGER NOT NULL DEFAULT 0,
    vocab_mastered INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS translations_cache (
    q_hash TEXT PRIMARY KEY,
    source_text TEXT NOT NULL,
    jp_text TEXT NOT NULL,
    romaji TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const userCols = db.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>;
if (!userCols.some((c) => c.name === 'show_on_leaderboard')) {
  db.exec('ALTER TABLE users ADD COLUMN show_on_leaderboard INTEGER NOT NULL DEFAULT 1');
}
if (!userCols.some((c) => c.name === 'jenjang')) {
  db.exec("ALTER TABLE users ADD COLUMN jenjang TEXT NOT NULL DEFAULT 'SMK'");
}
if (!userCols.some((c) => c.name === 'school')) {
  db.exec("ALTER TABLE users ADD COLUMN school TEXT NOT NULL DEFAULT 'SMK NU Darussalam'");
}

export interface UserRow {
  id: number;
  email: string;
  password_hash: string | null;
  google_id: string | null;
  avatar_url: string | null;
  full_name: string;
  nickname: string;
  jenjang: string;
  school: string;
  kelas: string;
  jurusan: string;
  japanese_name: string;
  role: string;
  profile_completed: number;
  show_on_leaderboard: number;
  created_at: string;
  last_login_at: string;
}

export interface PublicUser {
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

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    email: row.email,
    avatarUrl: row.avatar_url,
    fullName: row.full_name,
    nickname: row.nickname || row.full_name.split(' ')[0] || row.email.split('@')[0],
    jenjang: row.jenjang || 'SMK',
    school: row.school || 'SMK NU Darussalam',
    kelas: row.kelas,
    jurusan: row.jurusan,
    japaneseName: row.japanese_name,
    role: row.role,
    profileCompleted: row.profile_completed === 1,
    showOnLeaderboard: row.show_on_leaderboard !== 0,
    hasGoogle: Boolean(row.google_id),
  };
}
