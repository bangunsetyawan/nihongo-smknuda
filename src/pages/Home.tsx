import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { allKana } from '../data/kana';
import { VOCAB } from '../data/vocab';
import { useAuth } from '../lib/auth';
import { exportProgress, importProgress, level, mastery, resetProgress, setName, streak, useProgress } from '../lib/progress';

export default function Home() {
  const prog = useProgress();
  const { user, loading: authLoading } = useAuth();
  const hira = allKana('hiragana');
  const kata = allKana('katakana');
  const mh = hira.filter((k) => mastery(prog.kana[k.char]) === 3).length;
  const mk = kata.filter((k) => mastery(prog.kana[k.char]) === 3).length;
  const mv = VOCAB.filter((v) => prog.vocab?.[v.id]).length;
  const st = streak(prog.days);
  const lv = level(prog.xp);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(prog.name ?? '');
  const displayName = user?.nickname || prog.name;

  const nextStep = mh < hira.length * 0.6
    ? { to: '/hiragana', label: 'Lanjut belajar Hiragana', jp: 'あ' }
    : mk < kata.length * 0.6
      ? { to: '/katakana', label: 'Lanjut belajar Katakana', jp: 'ア' }
      : mv < VOCAB.length * 0.6
        ? { to: '/kosakata', label: 'Lanjut belajar Kosakata', jp: '語' }
        : { to: '/jalur', label: 'Lanjut ke materi IRODORI', jp: '本' };

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <div className="hero-club-badge">
            <img src="/logo-smk.png" alt="SMKN NU Darussalam" />
            <span>NIHONGO · SMKN NU DARUSSALAM <b className="jp">日本語</b></span>
          </div>
          <div className="hero-kicker jp">ようこそ！</div>
          <h1>
            {displayName && !editName
              ? <>Halo, {displayName}! 👋</>
              : <>Nihongo SMKN NU Darussalam</>}
          </h1>
          <p className="lead">
            Portal belajar Bahasa Jepang dari nol — mulai dari Hiragana &amp; Katakana, kosakata IRODORI, hingga persiapan <strong>JLPT N4 / SSW</strong> untuk semua jurusan (TJKT, AKL, TKRO).
          </p>

          {editName && !user ? (
            <form className="row gap-s wrap" onSubmit={(e) => { e.preventDefault(); if (nameInput.trim()) { setName(nameInput.trim()); setEditName(false); } }}>
              <input className="input" placeholder="Nama panggilanmu…" value={nameInput} onChange={(e) => setNameInput(e.target.value)} maxLength={24} />
              <button className="btn primary" type="submit">Simpan</button>
            </form>
          ) : !authLoading && !user ? (
            <div className="hero-actions">
              <div className="hero-btn-row">
                <Link className="btn primary big" to="/masuk">Masuk</Link>
                <Link className="btn big" to="/masuk?tab=register">Daftar Akun</Link>
              </div>
              <Link className="hero-guest-link" to={nextStep.to}>
                atau lanjut belajar sebagai tamu ({nextStep.label}) →
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <div className="hero-btn-row">
                <Link className="btn primary big" to={nextStep.to}><span className="jp">{nextStep.jp}</span> {nextStep.label} →</Link>
                <Link className="btn big" to="/kuis">🎯 Kuis cepat</Link>
              </div>
              {user && (
                <p className="sync-note ok">
                  ✓ Progres tersinkron · {user.kelas} {user.jurusan}
                  {user.japaneseName ? <> · <span className="jp">{user.japaneseName}</span></> : null}
                  {' · '}
                  <Link to="/lengkapi-profil">Edit profil</Link>
                </p>
              )}
            </div>
          )}
        </div>
        <div className="hero-art">
          <img src="/logo-smk.png" alt="Logo SMKN NU Darussalam" className="hero-logo-big" />
          <div className="hero-kana jp-hand" aria-hidden="true">
            <span>あ</span><span>い</span><span>う</span>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="card stat"><div className="stat-icon">🔥</div><div><div className="big-num">{st}</div><div className="muted small">hari berturut-turut</div></div></div>
        <div className="card stat">
          <div className="stat-icon">⭐</div>
          <div className="grow"><div className="big-num">Lv {lv.lv}</div><div className="bar"><div style={{ width: `${(lv.cur / lv.need) * 100}%` }} /></div><div className="muted small">{prog.xp} XP</div></div>
        </div>
        <Link to="/hiragana" className="card stat link-card">
          <div className="stat-icon jp">あ</div>
          <div className="grow"><div className="big-num">{mh}<small className="muted">/{hira.length}</small></div><div className="bar"><div style={{ width: `${(mh / hira.length) * 100}%` }} /></div><div className="muted small">Hiragana hafal</div></div>
        </Link>
        <Link to="/katakana" className="card stat link-card">
          <div className="stat-icon jp">ア</div>
          <div className="grow"><div className="big-num">{mk}<small className="muted">/{kata.length}</small></div><div className="bar"><div style={{ width: `${(mk / kata.length) * 100}%` }} /></div><div className="muted small">Katakana hafal</div></div>
        </Link>
      </section>

      <h2>Mulai dari mana?</h2>
      <section className="steps">
        <Step n={1} title="Hiragana" jp="ひらがな" to="/hiragana" desc="46 huruf dasar + variasinya. Target: 1–2 minggu." />
        <Step n={2} title="Katakana" jp="カタカナ" to="/katakana" desc="Huruf untuk kata serapan. Target: 1–2 minggu." />
        <Step n={3} title="Aturan baca" jp="ルール" to="/panduan" desc="Huruf kecil っ ゃ, vokal panjang, partikel は へ を." />
        <Step n={4} title="Kosakata IRODORI" jp="ことば" to="/kosakata" desc="Salam, kata kerja N5, istilah SMK & budaya kerja 5S." />
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

      <BackupCard onEditName={() => setEditName(true)} />
    </div>
  );
}

function Step({ n, title, jp, desc, to }: { n: number; title: string; jp: string; desc: string; to: string }) {
  return (
    <Link to={to} className="card step">
      <div className="step-n">{n}</div>
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
      <summary>⚙️ Pengaturan & cadangan progres</summary>
      <p className="muted small">
        Progres tersimpan di browser perangkat ini (tanpa akun). Jika ganti HP atau menghapus data browser,
        simpan cadangan dulu lalu pulihkan di perangkat baru.
      </p>
      <div className="row gap-s wrap">
        <button className="btn small" onClick={onEditName}>✏️ Ganti nama</button>
        <button className="btn small" onClick={download}>⬇️ Unduh cadangan</button>
        <button className="btn small" onClick={() => fileRef.current?.click()}>⬆️ Pulihkan cadangan</button>
        <button className="btn small danger" onClick={() => { if (confirm('Hapus semua progres di perangkat ini?')) resetProgress(); }}>🗑 Reset progres</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try { importProgress(await f.text()); setMsg('✔ Progres berhasil dipulihkan.'); } catch { setMsg('✘ File tidak valid.'); }
        }} />
      </div>
      {msg && <p className="small">{msg}</p>}
    </details>
  );
}
