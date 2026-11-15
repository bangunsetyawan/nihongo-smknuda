import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { allKana } from '../data/kana';
import { VOCAB } from '../data/vocab';
import { useAuth } from '../lib/auth';
import { formatUserAffiliation, JENJANG_LIST } from '../lib/education';
import { level } from '../lib/progress';

interface LeaderEntry {
  id: number;
  nickname: string;
  japaneseName: string;
  jenjang: string;
  school: string;
  kelas: string;
  jurusan: string;
  avatarUrl: string | null;
  role: string;
  xp: number;
  streak: number;
  hiraganaMastered: number;
  katakanaMastered: number;
  vocabMastered: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [jenjangFilter, setJenjangFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const hiraTotal = allKana('hiragana').length;
  const kataTotal = allKana('katakana').length;
  const vocabTotal = VOCAB.length;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setErr('');
    const qs = jenjangFilter !== 'ALL' ? `?jenjang=${encodeURIComponent(jenjangFilter)}` : '';
    fetch(`/api/leaderboard${qs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Gagal memuat peringkat'))))
      .then((data: { entries: LeaderEntry[] }) => {
        if (active) setEntries(data.entries ?? []);
      })
      .catch(() => {
        if (active) setErr('Belum bisa memuat papan peringkat dari server.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [jenjangFilter]);

  const pct = (n: number, total: number) => Math.min(100, Math.round((n / total) * 100));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="hero-kicker jp">ランキング</span>
          <h1>Papan Peringkat Siswa</h1>
          <p className="muted">Peringkat diurutkan berdasarkan total XP, streak harian, dan penguasaan Hiragana.</p>
        </div>
        <div className="row gap-s wrap">
          <select
            className="input"
            aria-label="Filter Jenjang"
            value={jenjangFilter}
            onChange={(e) => setJenjangFilter(e.target.value)}
            style={{ width: 'auto', minWidth: 150 }}
          >
            <option value="ALL">Semua Jenjang</option>
            {JENJANG_LIST.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
          {!user && <Link to="/masuk" className="btn primary">Login untuk ikut tercatat</Link>}
        </div>
      </div>

      {loading && <div className="card">Memuat papan peringkat…</div>}
      {err && <div className="auth-alert">{err}</div>}

      {!loading && !err && entries.length === 0 && (
        <div className="card">
          {jenjangFilter === 'ALL'
            ? 'Belum ada siswa yang melengkapi profil.'
            : `Belum ada peserta untuk jenjang ${jenjangFilter}.`}
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="lb-list">
          {entries.map((e, idx) => {
            const rank = idx + 1;
            const lv = level(e.xp).lv;
            const isMe = user?.id === e.id;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            return (
              <div key={e.id} className={`card lb-item ${isMe ? 'lb-me' : ''}`}>
                <div className="lb-rank">{medal}</div>
                {e.avatarUrl ? (
                  <img src={e.avatarUrl} alt={e.nickname} className="lb-avatar" />
                ) : (
                  <div className="lb-avatar lb-avatar-fallback">{e.nickname.slice(0, 1).toUpperCase()}</div>
                )}
                <div className="lb-info">
                  <div className="row gap-s wrap">
                    <strong>{e.nickname}</strong>
                    {e.japaneseName && <span className="jp muted small">{e.japaneseName}</span>}
                    {e.role === 'owner' && <span className="pill">Owner</span>}
                    {e.role === 'teacher' && <span className="pill">Pembina</span>}
                    {isMe && <span className="pill" style={{ background: 'var(--ok-soft)', color: 'var(--ok)' }}>Kamu</span>}
                  </div>
                  <div className="muted small">
                    {formatUserAffiliation(e)} · Lv {lv} · 🔥 {e.streak} hari
                  </div>
                </div>
                <div className="lb-metrics">
                  <div className="lb-xp">{e.xp} XP</div>
                  <div className="muted small">
                    あ {pct(e.hiraganaMastered, hiraTotal)}% · ア {pct(e.katakanaMastered, kataTotal)}% · 語 {pct(e.vocabMastered, vocabTotal)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
