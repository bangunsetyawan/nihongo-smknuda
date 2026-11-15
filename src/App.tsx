import { useEffect } from 'react';
import { NavLink, Route, Routes, useLocation, useNavigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import KanaPage from './pages/KanaPage';
import Quiz from './pages/Quiz';
import VocabPage from './pages/VocabPage';
import Guide from './pages/Guide';
import Roadmap from './pages/Roadmap';
import Resources from './pages/Resources';
import LoginPage from './pages/LoginPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import { initAuth, logout, useAuth } from './lib/auth';

const NAV = [
  { to: '/', label: 'Beranda', icon: '🏠', end: true },
  { to: '/hiragana', label: 'Hiragana', icon: 'あ' },
  { to: '/katakana', label: 'Katakana', icon: 'ア' },
  { to: '/kosakata', label: 'Kosakata', icon: '語' },
  { to: '/kuis', label: 'Kuis', icon: '🎯' },
];

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { void initAuth(); }, []);
  useEffect(() => {
    if (!loading && user && !user.profileCompleted && pathname !== '/lengkapi-profil') {
      navigate('/lengkapi-profil', { replace: true });
    }
  }, [loading, user, pathname, navigate]);

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <img src="/logo-smk.png" alt="Logo SMK NU Darussalam" className="brand-img" />
          <span className="brand-text">
            <span>
              <strong>Japan Club</strong> <span className="brand-jp jp">日本語クラブ</span>
            </span>
            <span className="brand-sub">SMK NU Darussalam</span>
          </span>
        </Link>
        <div className="topbar-right">
          <nav className="topnav">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}>{n.label}</NavLink>
            ))}
            <NavLink to="/panduan">Panduan</NavLink>
            <NavLink to="/jalur">Jalur N4</NavLink>
            <NavLink to="/sumber">Sumber</NavLink>
          </nav>
          {!loading && (
            user ? (
              <div className="user-chip">
                <Link to="/lengkapi-profil" className="user-chip-link" title="Edit Profil">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.nickname} className="user-avatar" />
                  ) : (
                    <span className="user-avatar-fallback">{user.nickname.slice(0, 1).toUpperCase()}</span>
                  )}
                  <span>{user.nickname}</span>
                </Link>
                <button type="button" className="user-logout" onClick={() => void logout()} title="Keluar">
                  Keluar
                </button>
              </div>
            ) : (
              <Link to="/masuk" className="btn small primary">Masuk</Link>
            )
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hiragana" element={<KanaPage key="h" script="hiragana" />} />
          <Route path="/katakana" element={<KanaPage key="k" script="katakana" />} />
          <Route path="/kosakata" element={<VocabPage />} />
          <Route path="/kuis" element={<Quiz />} />
          <Route path="/panduan" element={<Guide />} />
          <Route path="/jalur" element={<Roadmap />} />
          <Route path="/sumber" element={<Resources />} />
          <Route path="/masuk" element={<LoginPage />} />
          <Route path="/lengkapi-profil" element={<CompleteProfilePage />} />
          <Route path="*" element={<div className="page narrow"><h1>Halaman tidak ditemukan</h1><Link to="/" className="btn primary">Kembali ke beranda</Link></div>} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <img src="/logo-smk.png" alt="Logo SMK NU Darussalam" />
          <strong>Japan Club SMK NU Darussalam</strong>
          <span className="muted">· Srono, Banyuwangi</span>
        </div>
        <div>Ekstrakurikuler Bahasa Jepang · <Link to="/panduan">Panduan</Link> · <Link to="/jalur">Jalur N4</Link> · <Link to="/sumber">Sumber belajar</Link> · <Link to="/sumber#kredit">Kredit</Link></div>
        <div className="muted small">がんばって！ Semangat belajar!</div>
      </footer>

      <nav className="bottomnav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}>
            <span className={`bn-icon ${/^[\u3040-\u30ff\u4e00-\u9fff]/.test(n.icon) ? 'jp' : ''}`}>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
