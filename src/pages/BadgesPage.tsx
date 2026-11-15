import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BADGES, computeClientBadges, type BadgeCategory, type BadgeStatus } from '../data/badges';
import { useAuth } from '../lib/auth';
import { useProgress } from '../lib/progress';

const CATS: { id: 'all' | BadgeCategory; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'konsisten', label: 'Konsistensi & XP' },
  { id: 'huruf', label: 'Huruf' },
  { id: 'kosakata', label: 'Kosakata & Kaiwa' },
  { id: 'latihan', label: 'Kuis & Review' },
];

export default function BadgesPage() {
  const prog = useProgress();
  const { user } = useAuth();
  const [cat, setCat] = useState<'all' | BadgeCategory>('all');
  const [serverStatuses, setServerStatuses] = useState<BadgeStatus[] | null>(null);

  useEffect(() => {
    if (!user) {
      setServerStatuses(null);
      return;
    }
    let active = true;
    fetch('/api/badges', { credentials: 'include' })
      .then(async (res) => (res.ok ? ((await res.json()) as { badges?: BadgeStatus[] }) : null))
      .then((data) => {
        if (active && Array.isArray(data?.badges)) {
          setServerStatuses(data.badges);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, [user, prog.xp, prog.quizzes, prog.perfectQuizzes, prog.srsReviews, prog.kaiwa?.length, prog.days.length]);

  const localStatuses = useMemo(() => computeClientBadges(prog), [prog]);
  const statusMap = useMemo(() => {
    const list = serverStatuses ?? localStatuses;
    return new Map(list.map((s) => [s.id, s]));
  }, [serverStatuses, localStatuses]);

  const unlockedCount = BADGES.filter((b) => statusMap.get(b.id)?.unlocked).length;
  const visible = BADGES.filter((b) => cat === 'all' || b.category === cat);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>🏆 Pencapaian Pemula</h1>
          <p className="muted">
            Lencana tonggak awal belajar bahasa Jepang ({unlockedCount} / {BADGES.length} tercapai).
          </p>
        </div>
        <div className="pill-tabs">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`pill ${cat === c.id ? 'on' : ''}`}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card badge-summary-card" style={{ marginBottom: '1rem' }}>
        <div className="row between wrap gap-s" style={{ marginBottom: '.45rem' }}>
          <strong>Kemajuan Lencana Pemula</strong>
          <span className="tag ok">{unlockedCount} dari {BADGES.length} terbuka</span>
        </div>
        <div className="bar">
          <div style={{ width: `${Math.round((unlockedCount / BADGES.length) * 100)}%` }} />
        </div>
        {!user && (
          <p className="muted small" style={{ margin: '.5rem 0 0' }}>
            Masuk dengan <Link to="/masuk">akun sekolah</Link> agar pencapaian tersimpan dan diverifikasi di server.
          </p>
        )}
      </div>

      <div className="badge-grid">
        {visible.map((b) => {
          const st = statusMap.get(b.id) ?? { id: b.id, unlocked: false, current: 0, target: b.target };
          const pct = Math.min(100, Math.round((st.current / Math.max(1, st.target)) * 100));
          return (
            <div key={b.id} className={`card badge-card ${st.unlocked ? 'earned' : 'locked'}`}>
              <div className="badge-card-top">
                <div className="badge-icon" aria-hidden="true">{b.icon}</div>
                <span className={`badge-pill ${st.unlocked ? 'ok' : ''}`}>
                  {st.unlocked ? '✔ Tercapai' : '🔒 Terkunci'}
                </span>
              </div>
              <div className="badge-title">{b.title}</div>
              <div className="badge-desc muted small">{b.desc}</div>
              <div className="badge-prog">
                <div className="bar"><div style={{ width: `${pct}%` }} /></div>
                <span className="muted small">{st.current} / {st.target}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
