import { useMemo, useRef, useState } from 'react';
import { isRomaji, toHiragana, toKatakana, toRomaji } from 'wanakana';
import { speak as browserSpeak } from '../lib/speech';

const SAMPLES = [
  { label: 'Selamat pagi', text: 'ohayou gozaimasu' },
  { label: 'Terima kasih', text: 'arigatou gozaimasu' },
  { label: 'Perkenalan', text: 'hajimemashite, watashi wa gakusei desu' },
  { label: 'Semangat!', text: 'ganbatte kudasai' },
  { label: 'SMK NU Darussalam', text: 'esu emu kei enu yu darusaramu' },
  { label: 'Mohon bimbingannya', text: 'yoroshiku onegaishimasu' },
];

export default function TtsPage() {
  const [input, setInput] = useState('ohayou gozaimasu');
  const [scriptMode, setScriptMode] = useState<'hiragana' | 'katakana' | 'raw'>('hiragana');
  const [voice, setVoice] = useState<'female' | 'male'>('female');
  const [rate, setRate] = useState<'normal' | 'slow'>('normal');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const converted = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { jp: '', romaji: '' };
    if (scriptMode === 'raw' || !isRomaji(trimmed.replace(/[,.\s!?'-]/g, ''))) {
      return { jp: trimmed, romaji: toRomaji(trimmed) };
    }
    const jp = scriptMode === 'katakana'
      ? toKatakana(trimmed, { IMEMode: false })
      : toHiragana(trimmed, { IMEMode: false });
    return { jp, romaji: toRomaji(jp) };
  }, [input, scriptMode]);

  async function playServerTts() {
    if (!converted.jp) return;
    setErr('');
    setLoading(true);
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const url = `/api/tts?text=${encodeURIComponent(converted.jp)}&voice=${voice}&rate=${rate}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Server TTS gagal merespons');
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const audio = new Audio(objUrl);
      audioRef.current = audio;
      audio.onended = () => URL.revokeObjectURL(objUrl);
      await audio.play();
    } catch {
      setErr('Server audio tidak terjangkau, memakai suara bawaan browser.');
      browserSpeak(converted.jp, rate === 'slow' ? 0.72 : 0.95);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page narrow">
      <div className="page-head">
        <div>
          <span className="hero-kicker jp">はつおん・テキスト読み上げ</span>
          <h1>Ketik &amp; Suarakan Bahasa Jepang</h1>
          <p className="muted">
            Ketik huruf Romaji (Latin) atau huruf Jepang langsung — tampil tulisan Jepangnya, bacaan Latin, dan suara pelafalan jernih dari server.
          </p>
        </div>
      </div>

      <div className="card tts-card">
        <label className="field">
          <span>Tulis kata atau kalimat (Romaji / Hiragana / Katakana / Kanji)</span>
          <textarea
            className="input tts-textarea"
            rows={3}
            maxLength={200}
            placeholder="Contoh: ohayou gozaimasu / おはようございます"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </label>

        <div className="tts-controls">
          <div className="row gap-s wrap">
            <button type="button" className={`btn small ${scriptMode === 'hiragana' ? 'primary' : ''}`} onClick={() => setScriptMode('hiragana')}>
              あ Hiragana
            </button>
            <button type="button" className={`btn small ${scriptMode === 'katakana' ? 'primary' : ''}`} onClick={() => setScriptMode('katakana')}>
              ア Katakana
            </button>
            <button type="button" className={`btn small ${scriptMode === 'raw' ? 'primary' : ''}`} onClick={() => setScriptMode('raw')}>
              Apa adanya
            </button>
          </div>

          <div className="row gap-s wrap">
            <select className="input small-select" value={voice} onChange={(e) => setVoice(e.target.value as 'female' | 'male')}>
              <option value="female">Suara: Nanami (P)</option>
              <option value="male">Suara: Keita (L)</option>
            </select>
            <select className="input small-select" value={rate} onChange={(e) => setRate(e.target.value as 'normal' | 'slow')}>
              <option value="normal">Kecepatan: Normal</option>
              <option value="slow">Kecepatan: Pelan</option>
            </select>
          </div>
        </div>

        <div className="tts-output">
          {converted.jp ? (
            <>
              <div className="tts-jp jp">{converted.jp}</div>
              <div className="tts-romaji">{converted.romaji}</div>
            </>
          ) : (
            <div className="muted">Ketik kata atau kalimat di atas untuk melihat hasil konversi…</div>
          )}
        </div>

        <div className="row gap-s wrap">
          <button
            type="button"
            className="btn primary big"
            disabled={!converted.jp || loading}
            onClick={() => void playServerTts()}
          >
            {loading ? 'Menyiapkan suara…' : '🔊 Putar Suara Jepang'}
          </button>
          <button
            type="button"
            className="btn big"
            disabled={!converted.jp}
            onClick={() => setInput('')}
          >
            Bersihkan
          </button>
        </div>

        {err && <p className="muted small" style={{ marginTop: '.75rem', marginBottom: 0 }}>{err}</p>}
      </div>

      <h3 style={{ marginTop: '1.5rem' }}>Coba frasa cepat</h3>
      <div className="row gap-s wrap">
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            type="button"
            className="btn small"
            onClick={() => { setScriptMode('hiragana'); setInput(s.text); }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
