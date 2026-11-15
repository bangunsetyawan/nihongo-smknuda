import { useState } from 'react';
import { triggerInstallPrompt, usePwaInstall } from '../lib/pwaInstall';

export default function InstallAppBanner({ compact = false }: { compact?: boolean }) {
  const { canPrompt, isInstalled, isIos } = usePwaInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) return null;

  const fallbackGuide = isIos
    ? 'Di iPhone/iPad (Safari): ketuk ikon Bagikan (Share ⬆) di bawah layar, lalu pilih "Tambah ke Layar Utama" (Add to Home Screen).'
    : 'Buka menu browser (⋮), lalu pilih "Install aplikasi" atau "Tambah ke Layar Utama" untuk memasang aplikasi di perangkatmu.';

  if (compact) {
    return (
      <div className="install-compact-wrap">
        {canPrompt ? (
          <button
            type="button"
            className="btn primary full"
            onClick={() => { void triggerInstallPrompt(); }}
          >
            📲 Install Aplikasi
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn full"
              onClick={() => setShowGuide((v) => !v)}
            >
              📲 Tambah ke Layar Utama
            </button>
            {showGuide && <p className="muted small install-guide-text">{fallbackGuide}</p>}
          </>
        )}
      </div>
    );
  }

  return (
    <section className="card install-card">
      <div className="row between wrap gap-s">
        <div>
          <div className="srs-kicker">📲 Aplikasi di HP &amp; Laptop</div>
          <p className="muted small" style={{ margin: '.25rem 0 0' }}>
            {canPrompt
              ? 'Pasang Nihongo SMKNUDA agar bisa dibuka cepat dari layar utama dan tetap nyaman di HP.'
              : 'Simpan sebagai pintasan aplikasi agar lebih cepat dibuka seperti aplikasi native.'}
          </p>
        </div>
        {canPrompt ? (
          <button
            type="button"
            className="btn primary"
            onClick={() => { void triggerInstallPrompt(); }}
          >
            📲 Install Aplikasi
          </button>
        ) : (
          <button
            type="button"
            className="btn"
            onClick={() => setShowGuide((v) => !v)}
          >
            📲 {showGuide ? 'Tutup Panduan' : 'Tambah ke Layar Utama'}
          </button>
        )}
      </div>
      {!canPrompt && showGuide && (
        <div className="install-guide-box muted small">{fallbackGuide}</div>
      )}
    </section>
  );
}
