import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile, useAuth } from '../lib/auth';

const JURUSAN_LIST = ['TJKT', 'AKL', 'TKRO', 'Lainnya'];
const KELAS_LIST = ['X', 'XI', 'XII', 'Alumni / Pembina'];

export default function CompleteProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [kelas, setKelas] = useState('X');
  const [jurusan, setJurusan] = useState('TJKT');
  const [japaneseName, setJapaneseName] = useState('');
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setNickname(user.nickname || '');
      setKelas(user.kelas || 'X');
      setJurusan(user.jurusan || 'TJKT');
      setJapaneseName(user.japaneseName || '');
      setShowOnLeaderboard(user.showOnLeaderboard !== false);
    }
  }, [user]);

  if (loading) {
    return <div className="page narrow"><div className="card">Memuat data akun…</div></div>;
  }

  if (!user) {
    return (
      <div className="page narrow">
        <div className="card auth-card">
          <h1>Silakan masuk dulu</h1>
          <p className="muted">Kamu perlu masuk sebelum melengkapi profil siswa.</p>
          <Link className="btn primary" to="/masuk">Ke Halaman Masuk →</Link>
        </div>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await updateProfile({
        fullName,
        nickname: nickname || fullName.split(' ')[0] || '',
        kelas,
        jurusan,
        japaneseName,
        showOnLeaderboard,
      });
      navigate('/');
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Gagal menyimpan profil.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page narrow">
      <div className="card auth-card">
        <div className="auth-head">
          <span className="hero-kicker jp">プロフィール</span>
          <h1>{user.profileCompleted ? 'Perbarui Profil Siswa' : 'Lengkapi Profil Dulu'}</h1>
          <p className="muted">
            {user.profileCompleted
              ? `Akun ${user.email}`
              : `Selamat datang, ${user.email}! Lengkapi data kelas dan jurusanmu agar progres belajarmu tercatat rapi.`}
          </p>
        </div>

        {err && <div className="auth-alert">{err}</div>}

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Nama Lengkap</span>
            <input
              className="input"
              required
              minLength={2}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <div className="auth-grid-2">
            <label className="field">
              <span>Nama Panggilan</span>
              <input
                className="input"
                required
                maxLength={24}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Nama Jepang (opsional)</span>
              <input
                className="input jp"
                placeholder="Contoh: アフマド"
                maxLength={32}
                value={japaneseName}
                onChange={(e) => setJapaneseName(e.target.value)}
              />
            </label>
          </div>

          <div className="auth-grid-2">
            <label className="field">
              <span>Kelas</span>
              <select className="input" value={kelas} onChange={(e) => setKelas(e.target.value)}>
                {KELAS_LIST.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Jurusan</span>
              <select className="input" value={jurusan} onChange={(e) => setJurusan(e.target.value)}>
                {JURUSAN_LIST.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </label>
          </div>

          <label className="row gap-s" style={{ alignItems: 'center', cursor: 'pointer', fontSize: '.92rem' }}>
            <input
              type="checkbox"
              checked={showOnLeaderboard}
              onChange={(e) => setShowOnLeaderboard(e.target.checked)}
            />
            <span>Tampilkan nama panggilan &amp; progres saya di Papan Peringkat</span>
          </label>

          <div className="row gap-s wrap">
            <button className="btn primary big" type="submit" disabled={busy}>
              {busy ? 'Menyimpan…' : 'Simpan Profil →'}
            </button>
            {user.profileCompleted && (
              <Link className="btn big" to="/">Batal</Link>
            )}
          </div>
        </form>

        {user.profileCompleted && (
          <form
            className="auth-form"
            style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--line)' }}
            onSubmit={async (e) => {
              e.preventDefault();
              setPwMsg('');
              setPwBusy(true);
              try {
                const res = await fetch('/api/profile/password', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ password: newPassword }),
                });
                const d = (await res.json()) as { ok?: boolean; error?: string };
                if (!res.ok) throw new Error(d.error || 'Gagal menyimpan password.');
                setNewPassword('');
                setPwMsg('✔ Password berhasil disimpan. Sekarang Anda juga bisa login manual dengan email.');
              } catch (e2) {
                setPwMsg(e2 instanceof Error ? e2.message : 'Gagal menyimpan password.');
              } finally {
                setPwBusy(false);
              }
            }}
          >
            <label className="field">
              <span>Atur / Ubah Password Login Manual (opsional)</span>
              <input
                className="input"
                type="password"
                minLength={6}
                required
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label className="row gap-s" style={{ alignItems: 'center', cursor: 'pointer', fontSize: '.92rem' }}>
            <input
              type="checkbox"
              checked={showOnLeaderboard}
              onChange={(e) => setShowOnLeaderboard(e.target.checked)}
            />
            <span>Tampilkan nama panggilan &amp; progres saya di Papan Peringkat</span>
          </label>

          <div className="row gap-s wrap">
              <button className="btn small" type="submit" disabled={pwBusy}>
                {pwBusy ? 'Menyimpan…' : 'Simpan Password'}
              </button>
              {pwMsg && <span className="small muted">{pwMsg}</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
