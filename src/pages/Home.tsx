import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InstallAppBanner from '../components/InstallAppBanner';
import { BADGES, computeClientBadges, type BadgeStatus } from '../data/badges';
import { allKana } from '../data/kana';
import { KANJI_LIST } from '../data/kanji';
import { VOCAB } from '../data/vocab';
import { useAuth } from '../lib/auth';
import { formatUserAffiliation } from '../lib/education';
import { convertToJapaneseName } from '../lib/japaneseName';
import { dueToday, exportProgress, importProgress, level, mastery, resetProgress, setName, streak, useProgress, useSyncStatus } from '../lib/progress';

interface StudentTask {
  id: number;
  title: string;
  description: string;
  targetType: string;
  targetValue: number;
  dueDate: string;
  currentValue: number;
  completed: boolean;
  overdue: boolean;
}

export default function Home() {
  const prog = useProgress();
  const syncStatus = useSyncStatus();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const hira = allKana('hiragana');
  const kata = allKana('katakana');
  const n5Kanji = KANJI_LIST.filter((k) => k.level === 'N5');
  const mh = hira.filter((k) => mastery(prog.kana[k.char]) === 3).length;
  const mk = kata.filter((k) => mastery(prog.kana[k.char]) === 3).length;
  const mv = VOCAB.filter((v) => prog.vocab?.[v.id]).length;
  const mKanjiN5 = n5Kanji.filter((k) => mastery(prog.kanji?.[k.char]) === 3).length;
  const st = streak(prog.days);
  const lv = level(prog.xp);
  const due = dueToday(prog);

  const [nameInput, setNameInput] = useState(prog.name ?? '');
  const [editingGuestName, setEditingGuestName] = useState(false);
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [serverBadges, setServerBadges] = useState<BadgeStatus[] | null>(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setServerBadges(null);
      return;
    }
    let active = true;
    fetch('/api/tasks', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { tasks?: StudentTask[] } | null) => {
        if (active && data?.tasks) setTasks(data.tasks);
      })
      .catch(() => {});
    fetch('/api/badges', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { badges?: BadgeStatus[] } | null) => {
        if (active && Array.isArray(data?.badges)) setServerBadges(data.badges);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [user, prog.xp, prog.quizzes, prog.perfectQuizzes, prog.srsReviews, mh, mk, mv]);

  const badgeStatuses = useMemo(
    () => serverBadges ?? computeClientBadges(prog),
    [serverBadges, prog],
  );
  const badgeStatusMap = useMemo(
    () => new Map(badgeStatuses.map((b) => [b.id, b])),
    [badgeStatuses],
  );
  const unlockedBadges = BADGES.filter((b) => badgeStatusMap.get(b.id)?.unlocked);
  const previewBadges = [
    ...unlockedBadges.slice(0, 4),
    ...BADGES.filter((b) => !badgeStatusMap.get(b.id)?.unlocked).slice(0, Math.max(2, 6 - unlockedBadges.slice(0, 4).length)),
  ].slice(0, 6);

  const nextStep = mh < hira.length * 0.6
    ? { to: '/hiragana', label: 'Lanjut belajar Hiragana', jp: 'あ', targetTitle: 'Target 1: Kuasai Hiragana', cur: mh, total: hira.length }
    : mk < kata.length * 0.6
      ? { to: '/katakana', label: 'Lanjut belajar Katakana', jp: 'ア', targetTitle: 'Target 2: Kuasai Katakana', cur: mk, total: kata.length }
      : mv < VOCAB.length * 0.6
        ? { to: '/kosakata', label: 'Lanjut belajar Kosakata', jp: '語', targetTitle: 'Target 3: Hafal Kosakata IRODORI', cur: mv, total: VOCAB.length }
        : { to: '/jalur', label: 'Lanjut ke materi IRODORI', jp: '本', targetTitle: 'Target 4: Persiapan JLPT N4 / SSW', cur: mv, total: VOCAB.length };

  const activeName = (user?.nickname || nameInput || prog.name || '').trim();
  const jpPreview = convertToJapaneseName(activeName);
  const userJpName = user?.japaneseName || jpPreview.katakana;
  const targetPct = Math.min(100, Math.round((nextStep.cur / nextStep.total) * 100));

  return (
    <div className="page">
      {user ? (
        <section className="hero dash-hero">
          <div className="hero-text">
            <div className="dash-user-meta">
              <span className="dash-badge" title={formatUserAffiliation(user)}>
                {formatUserAffiliation(user) || `${user.kelas} ${user.jurusan}`.trim()}
              </span>
              {syncStatus === 'syncing' ? (
                <span className="sync-note">Menyinkronkan…</span>
              ) : syncStatus === 'synced' ? (
                <span className="sync-note ok">✓ Progres tersinkron</span>
              ) : (
                <span className="sync-note warn">⚠ Belum tersinkron — periksa koneksi</span>
              )}
              <Link to="/lengkapi-profil" className="dash-edit-link">Edit profil</Link>
            </div>
            <h1>Halo, {user.nickname}! 👋</h1>
            {userJpName && (
              <div className="jp-name-pill">
                <span className="jp">{userJpName}</span>
                {jpPreview.romaji && <span className="jp-name-latin">({jpPreview.romaji})</span>}
              </div>
            )}

            <div className="dash-milestone">
              <div className="row between gap-s">
                <strong>{nextStep.targetTitle}</strong>
                <span>{nextStep.cur}/{nextStep.total} ({targetPct}%)</span>
              </div>
              <div className="bar big"><div style={{ width: `${targetPct}%` }} /></div>
            </div>

            <div className="hero-actions">
              <div className="hero-btn-row">
                <Link className="btn primary big" to={nextStep.to}>
                  <span className="jp">{nextStep.jp}</span> {nextStep.label} →
                </Link>
                <Link className="btn big" to="/kuis">🎯 Kuis cepat</Link>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-kana jp-hand" aria-hidden="true">
              <span>あ</span><span>い</span><span>う</span>
            </div>
            <div className="hero-art-sub jp" aria-hidden="true">がんばろう！</div>
          </div>
        </section>
      ) : (
        <>
          <section className="hero">
            <div className="hero-text">
              <div className="hero-top-row">
                <span className="hero-kicker jp">ようこそ！</span>
                <div className="hero-kana-inline jp-hand" aria-hidden="true">
                  <span>あ</span><span>い</span><span>う</span>
                </div>
              </div>
              <h1>
                {prog.name && !editingGuestName
                  ? <>Halo, {prog.name}! 👋</>
                  : <>Belajar Bahasa Jepang dengan Cepat</>}
              </h1>
              <p className="lead">
                Dari <strong>SMKN NU Darussalam</strong> untuk belajar Hiragana, Katakana, dan kosakata IRODORI menuju <strong>JLPT N4 / SSW</strong>.
              </p>

              {!authLoading && (
                <div className="hero-actions">
                  <div className="hero-btn-row">
                    <Link className="btn primary big" to="/masuk">Login</Link>
                    <Link className="btn big" to="/masuk?tab=register">Daftar</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="hero-art">
              <div className="hero-kana jp-hand" aria-hidden="true">
                <span>あ</span><span>い</span><span>う</span>
              </div>
              <div className="hero-art-sub jp" aria-hidden="true">日本語を楽しく学ぼう</div>
            </div>
          </section>

          <form
            className="card quick-guest-card"
            onSubmit={(e) => {
              e.preventDefault();
              if (nameInput.trim()) setName(nameInput.trim());
              setEditingGuestName(false);
              navigate(nextStep.to);
            }}
          >
            <div className="quick-guest-head">
              <strong>Akses cepat tanpa login</strong>
              {jpPreview.katakana && (
                <span className="jp-preview-badge">
                  <span className="jp">{jpPreview.katakana}</span>
                  <span className="muted small">({jpPreview.romaji})</span>
                </span>
              )}
            </div>
            <div className="quick-name-row">
              <input
                id="guest-name-input"
                className="input"
                placeholder="Ketik nama panggilanmu (mis. Wahyu / Okta)…"
                maxLength={24}
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setEditingGuestName(true);
                }}
              />
              <button className="btn primary" type="submit">
                Mulai Belajar →
              </button>
            </div>
          </form>
        </>
      )}

      <section className="stats stats-5">
        <div className="card stat"><div className="stat-icon">🔥</div><div><div className="big-num">{st}</div><div className="muted small">hari berturut</div></div></div>
        <div className="card stat">
          <div className="stat-icon">⭐</div>
          <div className="grow"><div className="big-num">Lv {lv.lv}</div><div className="bar"><div style={{ width: `${(lv.cur / lv.need) * 100}%` }} /></div><div className="muted small">{prog.xp} XP</div></div>
        </div>
        <Link to="/hiragana" className="card stat link-card">
          <div className="stat-icon jp">あ</div>
          <div className="grow"><div className="big-num">{mh}<small className="muted">/{hira.length}</small></div><div className="bar"><div style={{ width: `${(mh / hira.length) * 100}%` }} /></div><div className="muted small">Hiragana</div></div>
        </Link>
        <Link to="/katakana" className="card stat link-card">
          <div className="stat-icon jp">ア</div>
          <div className="grow"><div className="big-num">{mk}<small className="muted">/{kata.length}</small></div><div className="bar"><div style={{ width: `${(mk / kata.length) * 100}%` }} /></div><div className="muted small">Katakana</div></div>
        </Link>
        <Link to="/kosakata" className="card stat link-card">
          <div className="stat-icon jp">語</div>
          <div className="grow"><div className="big-num">{mv}<small className="muted">/{VOCAB.length}</small></div><div className="bar"><div style={{ width: `${(mv / VOCAB.length) * 100}%` }} /></div><div className="muted small">Kosakata</div></div>
        </Link>
        <Link to="/kanji" className="card stat link-card">
          <div className="stat-icon jp">漢</div>
          <div className="grow"><div className="big-num">{mKanjiN5}<small className="muted">/{n5Kanji.length}</small></div><div className="bar"><div style={{ width: `${(mKanjiN5 / n5Kanji.length) * 100}%` }} /></div><div className="muted small">Kanji N5</div></div>
        </Link>
      </section>

      <section className="card srs-review-card">
        <div className="row between wrap gap-s">
          <div>
            <div className="srs-kicker">🔄 Review Hari Ini</div>
            <p className="muted" style={{ margin: '.25rem 0 0' }}>
              {due.total > 0
                ? `${due.kana.length} huruf + ${due.vocab.length} kosakata siap diulang sekarang.`
                : 'Tidak ada review hari ini — bagus!'}
            </p>
          </div>
          {due.total > 0 && (
            <Link to="/kuis?mode=review" className="btn primary">
              Mulai Review ({due.total}) →
            </Link>
          )}
        </div>
      </section>

      <section className="card tasks-card" style={{ marginTop: '.85rem' }}>
        <div className="row between wrap gap-s">
          <div className="srs-kicker">📌 Tugas Minggu Ini</div>
          {!user && <Link to="/masuk" className="btn small">Login siswa</Link>}
        </div>
        {!user ? (
          <p className="muted small" style={{ margin: '.35rem 0 0' }}>
            Belum ada tugas minggu ini — masuk dengan akun sekolah untuk melihat target dari guru.
          </p>
        ) : (() => {
          const activeTasks = tasks.filter((t) => !t.overdue);
          const pastTasks = tasks.filter((t) => t.overdue);
          return (
            <>
              {activeTasks.length === 0 && (
                <p className="muted" style={{ margin: '.35rem 0 0' }}>Belum ada tugas minggu ini</p>
              )}
              {tasks.length > 0 && (
                <div className="tasks-list">
                  {[...activeTasks, ...pastTasks].map((t) => {
                    const ratio = Math.min(100, Math.round((t.currentValue / Math.max(1, t.targetValue)) * 100));
                    const shownCur = Math.min(t.currentValue, t.targetValue);
                    return (
                      <div key={t.id} className={`task-row ${t.completed ? 'done' : t.overdue ? 'overdue' : ''}`}>
                        <div className="row between wrap gap-s">
                          <div>
                            <strong>{t.title}</strong>
                            {t.description && <div className="muted small">{t.description}</div>}
                          </div>
                          <span className={`pill ${t.completed ? 'pill-ok' : t.overdue ? 'pill-bad' : ''}`}>
                            {t.completed ? (t.overdue ? 'Selesai ✓' : 'Tercapai ✓') : t.overdue ? 'Terlambat' : `${shownCur}/${t.targetValue}`}
                          </span>
                        </div>
                        <div className="row between gap-s small muted" style={{ marginTop: '.35rem' }}>
                          <span>Progres: {t.currentValue}/{t.targetValue}</span>
                          <span>Tenggat: {t.dueDate}</span>
                        </div>
                        <div className="bar" style={{ marginTop: '.25rem' }}><div style={{ width: `${ratio}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}
      </section>

      <section className="card badges-home-card" style={{ marginTop: '.85rem' }}>
        <div className="row between wrap gap-s">
          <div>
            <div className="srs-kicker">🏆 Pencapaian ({unlockedBadges.length}/{BADGES.length})</div>
            <p className="muted small" style={{ margin: '.2rem 0 0' }}>
              Kumpulkan lencana pemula dengan rutin latihan harian, hafal huruf, dan selesaikan kuis.
            </p>
          </div>
          <Link to="/pencapaian" className="btn small">Lihat semua →</Link>
        </div>
        <div className="badge-mini-row">
          {previewBadges.map((b) => {
            const st = badgeStatusMap.get(b.id);
            const ok = Boolean(st?.unlocked);
            return (
              <Link
                key={b.id}
                to="/pencapaian"
                className={`badge-mini-chip ${ok ? 'earned' : 'locked'}`}
                title={`${b.title}: ${b.desc}`}
              >
                <span>{b.icon}</span>
                <span>{b.title}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <InstallAppBanner />

      <h2>Fitur &amp; Pemantauan</h2>
      <section className="steps">
        <Link to="/kanji" className="card step">
          <div className="step-n jp">漢</div>
          <div>
            <h3>Kanji N5 &amp; N4 <span className="jp muted">漢字</span></h3>
            <p className="muted">284 kanji dasar dengan bacaan on/kun, contoh kata, dan kuis adaptif.</p>
          </div>
        </Link>
        <Link to="/bunpou" className="card step">
          <div className="step-n">📘</div>
          <div>
            <h3>Tata Bahasa <span className="jp muted">文法</span></h3>
            <p className="muted">12 pola Bunpou inti N5/N4 dengan penjelasan Indonesia &amp; latihan soal.</p>
          </div>
        </Link>
        <Link to="/kaiwa" className="card step">
          <div className="step-n">💬</div>
          <div>
            <h3>Dialog &amp; Shadowing <span className="jp muted">会話</span></h3>
            <p className="muted">8 percakapan situasi sekolah &amp; kerja dengan audio pelan dan jeda tiru.</p>
          </div>
        </Link>
        <Link to="/suara" className="card step">
          <div className="step-n">🔊</div>
          <div>
            <h3>Ketik &amp; Suarakan <span className="jp muted">はつおん</span></h3>
            <p className="muted">Ketik kata/kalimat Romaji atau Jepang, dengar pelafalan jernih.</p>
          </div>
        </Link>
        <Link to="/peringkat" className="card step">
          <div className="step-n">🏆</div>
          <div>
            <h3>Papan Peringkat <span className="jp muted">ランキング</span></h3>
            <p className="muted">Lihat peringkat XP, streak, dan progres teman-teman.</p>
          </div>
        </Link>
        <Link to="/pencapaian" className="card step">
          <div className="step-n">🏅</div>
          <div>
            <h3>Lencana Pencapaian <span className="jp muted">バッジ</span></h3>
            <p className="muted">{unlockedBadges.length} dari {BADGES.length} lencana pemula terbuka.</p>
          </div>
        </Link>
        {(user?.role === 'teacher' || user?.role === 'owner') && (
          <Link to="/rekap" className="card step">
            <div className="step-n">📊</div>
            <div>
              <h3>Rekap &amp; Laporan Guru <span className="jp muted">レポート</span></h3>
              <p className="muted">Pantau seluruh siswa, unduh Excel (CSV) atau cetak PDF.</p>
            </div>
          </Link>
        )}
      </section>

      <h2>Mulai dari mana?</h2>
      <section className="steps">
        <Step n={1} title="Hiragana" jp="ひらがな" to="/hiragana" desc="46 huruf dasar + variasinya. Target: 1–2 minggu." done={mh >= hira.length * 0.6} />
        <Step n={2} title="Katakana" jp="カタカナ" to="/katakana" desc="Huruf untuk kata serapan. Target: 1–2 minggu." done={mk >= kata.length * 0.6} />
        <Step n={3} title="Aturan baca" jp="ルール" to="/panduan" desc="Huruf kecil っ ゃ, vokal panjang, partikel は へ を." />
        <Step n={4} title="Kosakata IRODORI" jp="ことば" to="/kosakata" desc="Salam, kata kerja N5, istilah SMK & budaya kerja 5S." done={mv >= VOCAB.length * 0.6} />
        <Step n={5} title="Jalur ke N4" jp="N4" to="/jalur" desc="Lanjut dengan buku gratis IRODORI (ada versi Indonesia)." />
      </section>

      <section className="card tips">
        <h3>💡 Tips belajar</h3>
        <ul>
          <li>Belajar <strong>10–15 menit setiap hari</strong> lebih efektif daripada 2 jam seminggu sekali.</li>
          <li>Hafalkan <strong>satu baris (5 huruf) per hari</strong>, lalu kerjakan kuisnya.</li>
          <li>Selalu <strong>ucapkan dengan suara</strong> dan <strong>tulis dengan tangan</strong> di buku.</li>
          <li>Kurangi romaji secepatnya. Biasakan membaca huruf Jepang langsung.</li>
        </ul>
      </section>

      <BackupCard onEditName={() => {
        if (user) navigate('/lengkapi-profil');
        else setEditingGuestName(true);
      }} />
    </div>
  );
}

function Step({ n, title, jp, desc, to, done }: { n: number; title: string; jp: string; desc: string; to: string; done?: boolean }) {
  return (
    <Link to={to} className="card step">
      <div className={`step-n ${done ? 'done' : ''}`}>{done ? '✓' : n}</div>
      <div>
        <h3>{title} <span className="jp muted">{jp}</span></h3>
        <p className="muted">{desc}</p>
      </div>
    </Link>
  );
}

function BackupCard({ onEditName }: { onEditName: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `progres-nihongo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
  return (
    <details className="card backup">
      <summary>⚙️ Pengaturan &amp; cadangan progres</summary>
      <p className="muted small">
        Jika belum masuk akun, progres tersimpan di browser perangkat ini. Kamu juga bisa mengunduh atau memulihkan cadangan JSON kapan saja.
      </p>
      <div className="row gap-s wrap">
        <button className="btn small" onClick={onEditName}>✏️ Ganti nama</button>
        <button className="btn small" onClick={download}>⬇️ Unduh cadangan</button>
        <button className="btn small" onClick={() => fileRef.current?.click()}>⬆️ Pulihkan cadangan</button>
        <button className="btn small danger" onClick={async () => {
          if (!confirm('Hapus semua progres belajar? Tindakan ini tidak bisa dibatalkan.')) return;
          try {
            await resetProgress();
            setMsg('✔ Progres berhasil direset.');
          } catch (err) {
            setMsg(`✘ ${err instanceof Error ? err.message : 'Gagal mereset progres.'}`);
          }
        }}>🗑 Reset progres</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (!f) return;
          try {
            await importProgress(await f.text());
            setMsg('✔ Progres berhasil dipulihkan.');
          } catch (err) {
            setMsg(`✘ ${err instanceof Error ? err.message : 'File tidak valid.'}`);
          }
        }} />
      </div>
      {msg && <p className="small">{msg}</p>}
    </details>
  );
}
