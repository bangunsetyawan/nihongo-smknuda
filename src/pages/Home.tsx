import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { allKana } from '../data/kana';
import { VOCAB } from '../data/vocab';
import { useAuth } from '../lib/auth';
import { formatUserAffiliation } from '../lib/education';
import { convertToJapaneseName } from '../lib/japaneseName';
import { exportProgress, importProgress, level, mastery, resetProgress, setName, streak, useProgress, useSyncStatus } from '../lib/progress';

export default function Home() {
  const prog = useProgress();
  const syncStatus = useSyncStatus();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const hira = allKana('hiragana');
  const kata = allKana('katakana');
  const mh = hira.filter((k) => mastery(prog.kana[k.char]) === 3).length;
  const mk = kata.filter((k) => mastery(prog.kana[k.char]) === 3).length;
  const mv = VOCAB.filter((v) => prog.vocab?.[v.id]).length;
  const st = streak(prog.days);
  const lv = level(prog.xp);

  const [nameInput, setNameInput] = useState(prog.name ?? '');
  const [editingGuestName, setEditingGuestName] = useState(false);

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
      </section>

      <h2>Fitur &amp; Pemantauan</h2>
      <section className="steps">
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
