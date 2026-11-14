import { useEffect, useState } from 'react';
import { hasJapaneseVoice, onVoicesChanged, speak, speechSupported } from '../lib/speech';

export function SpeakButton({ text, label, className = '' }: { text: string; label?: string; className?: string }) {
  return (
    <button
      className={`btn speak ${className}`}
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      aria-label={`Dengarkan ${text}`}
      title="Dengarkan"
    >
      🔊{label ? ` ${label}` : ''}
    </button>
  );
}

/** Peringatan jika perangkat belum punya suara bahasa Jepang. */
export function VoiceNotice() {
  const [ok, setOk] = useState(hasJapaneseVoice());
  const [hide, setHide] = useState(() => sessionStorage.getItem('hideVoiceNotice') === '1');
  useEffect(() => {
    const off = onVoicesChanged(() => setOk(hasJapaneseVoice()));
    const t = setTimeout(() => setOk(hasJapaneseVoice()), 1500);
    return () => { off(); clearTimeout(t); };
  }, []);
  if (ok || hide) return null;
  return (
    <div className="notice">
      <strong>🔈 Suara bahasa Jepang belum tersedia di perangkat ini.</strong>
      <span>
        {speechSupported()
          ? ' Di Android: buka Setelan → cari "Text-to-speech" → Mesin Google → Instal data suara → pilih Bahasa Jepang. Di laptop, gunakan Google Chrome atau Microsoft Edge.'
          : ' Browser ini tidak mendukung suara. Coba gunakan Google Chrome.'}
      </span>
      <button className="link" onClick={() => { sessionStorage.setItem('hideVoiceNotice', '1'); setHide(true); }}>Tutup</button>
    </div>
  );
}
