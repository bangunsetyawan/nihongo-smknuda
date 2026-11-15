import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginManual, registerManual, useAuth } from '../lib/auth';

const JURUSAN_LIST = ['TJKT', 'AKL', 'TKRO', 'Lainnya'];
const KELAS_LIST = ['X', 'XI', 'XII', 'Alumni / Pembina'];

const ERROR_MSG: Record<string, string> = {
  google_not_configured: 'Login Google belum diaktifkan di server. Silakan daftar/masuk manual dulu.',
  google_state: 'Sesi login Google kedaluwarsa. Silakan coba lagi.',
  google_token: 'Gagal memverifikasi token Google. Silakan coba lagi.',
  google_profile: 'Gagal membaca profil akun Google.',
  google_failed: 'Terjadi gangguan saat masuk dengan Google.',
};

export default function LoginPage() {
  const { user, googleEnabled } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(() => {
    const code = params.get('error');
    return code ? ERROR_MSG[code] || 'Login gagal, silakan coba lagi.' : '';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [kelas, setKelas] = useState('X');
  const [jurusan, setJurusan] = useState('TJKT');
  const [japaneseName, setJapaneseName] = useState('');

  if (user) {
    return (
      <div className="page narrow">
        <div className="card auth-card">
          <h1>Sudah masuk sebagai {user.nickname}</h1>
          <p className="muted">Akun: {user.email} · {user.kelas} {user.jurusan}</p>
          <div className="row gap-s wrap">
            <Link className="btn primary" to="/">Ke Beranda →</Link>
            <Link className="btn" to="/lengkapi-profil">Edit Profil</Link>
          </div>
        </div>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      if (mode === 'login') {
        const u = await loginManual(email, password);
        navigate(u.profileCompleted ? '/' : '/lengkapi-profil');
      } else {
        await registerManual({
          email,
          password,
          fullName,
          nickname: nickname || fullName.split(' ')[0] || '',
          kelas,
          jurusan,
          japaneseName,
        });
        navigate('/');
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page narrow">
      <div className="card auth-card">
        <div className="auth-head">
          <span className="hero-kicker jp">アカウント</span>
          <h1>{mode === 'login' ? 'Masuk ke Japan Club' : 'Daftar Akun Siswa'}</h1>
          <p className="muted">
            Simpan progres hafalan Hiragana, Katakana, dan Kosakata kamu secara permanen di server sekolah.
          </p>
        </div>

        <div className="auth-google-box">
          {googleEnabled ? (
            <a href="/api/auth/google" className="btn google-btn">
              <GoogleIcon />
              <span>Masuk dengan Google</span>
            </a>
          ) : (
            <button
              type="button"
              className="btn google-btn"
              onClick={() => setErr(ERROR_MSG.google_not_configured)}
            >
              <GoogleIcon />
              <span>Masuk dengan Google</span>
            </button>
          )}
        </div>

        <div className="auth-divider"><span>atau pakai email</span></div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            className={`btn small ${mode === 'login' ? 'primary' : ''}`}
            onClick={() => { setMode('login'); setErr(''); }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`btn small ${mode === 'register' ? 'primary' : ''}`}
            onClick={() => { setMode('register'); setErr(''); }}
          >
            Daftar Baru
          </button>
        </div>

        {err && <div className="auth-alert">{err}</div>}

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              type="email"
              required
              autoComplete="email"
              placeholder="nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              className="input"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {mode === 'register' && (
            <>
              <label className="field">
                <span>Nama Lengkap</span>
                <input
                  className="input"
                  required
                  minLength={2}
                  placeholder="Contoh: Ahmad Fauzi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>

              <div className="auth-grid-2">
                <label className="field">
                  <span>Nama Panggilan</span>
                  <input
                    className="input"
                    placeholder="Contoh: Fauzi"
                    maxLength={24}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Nama Jepang (opsional)</span>
                  <input
                    className="input jp"
                    placeholder="Contoh: ファウジ"
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
            </>
          )}

          <button className="btn primary big" type="submit" disabled={busy}>
            {busy ? 'Memproses…' : mode === 'login' ? 'Masuk Sekarang →' : 'Daftar & Simpan Progres →'}
          </button>
        </form>

        <p className="muted small center-text" style={{ marginTop: '1rem', marginBottom: 0 }}>
          Mau lihat materi dulu tanpa login? <Link to="/">Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
    </svg>
  );
}
