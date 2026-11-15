import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { isRomaji, toHiragana, toKatakana, toRomaji } from 'wanakana';
import { useAuth } from '../lib/auth';
import { speak as browserSpeak } from '../lib/speech';

const ID_TEMPLATES = [
  'Selamat pagi semuanya',
  'Perkenalkan, nama saya Wahyu',
  'Saya siswa SMK jurusan teknik komputer',
  'Terima kasih banyak atas bantuannya',
  'Maaf, saya kurang mengerti',
  'Tolong ulangi sekali lagi pelan-pelan',
  'Saya ingin bekerja di Jepang',
  'Sampai jumpa besok',
];

const JP_SAMPLES = [
  { label: 'Selamat pagi', text: 'ohayou gozaimasu' },
  { label: 'Terima kasih', text: 'arigatou gozaimasu' },
  { label: 'Semangat!', text: 'ganbatte kudasai' },
  { label: 'Mohon bimbingannya', text: 'yoroshiku onegaishimasu' },
];

export default function TtsPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<'id-ja' | 'jp'>('id-ja');

  // Mode 1: Indonesia -> Jepang
  const [idText, setIdText] = useState('Selamat pagi, saya siswa SMKN NU Darussalam');
  const [translated, setTranslated] = useState<{ source: string; jp: string; romaji: string } | null>({
    source: 'Selamat pagi, saya siswa SMKN NU Darussalam',
    jp: 'おはようございます。私はSMKN NU Darussalamの生徒です。',
    romaji: 'Ohayōgozaimasu. Watashi wa SMKN NU Darussalam no seitodesu.',
  });
  const [translating, setTranslating] = useState(false);

  // Mode 2: Ketik Romaji / Jepang
  const [jpInput, setJpInput] = useState('ohayou gozaimasu');
  const [scriptMode, setScriptMode] = useState<'hiragana' | 'katakana' | 'raw'>('hiragana');

  // Pengaturan Suara
  const [voice, setVoice] = useState<'female' | 'male'>('female');
  const [rate, setRate] = useState<'normal' | 'slow'>('normal');
  const [speaking, setSpeaking] = useState(false);
  const [err, setErr] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objUrlRef = useRef<string | null>(null);
  const playSeqRef = useRef(0);
  const ttsAbortRef = useRef<AbortController | null>(null);
  const translateAbortRef = useRef<AbortController | null>(null);

  function stopAllAudio() {
    playSeqRef.current += 1;
    ttsAbortRef.current?.abort();
    ttsAbortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (objUrlRef.current) {
      URL.revokeObjectURL(objUrlRef.current);
      objUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  useEffect(() => () => stopAllAudio(), []);

  const jpConverted = useMemo(() => {
    const trimmed = jpInput.trim();
    if (!trimmed) return { jp: '', romaji: '' };
    if (scriptMode === 'raw' || !isRomaji(trimmed.replace(/[,.\s!?'-]/g, ''))) {
      return { jp: trimmed, romaji: toRomaji(trimmed) };
    }
    const jp = scriptMode === 'katakana'
      ? toKatakana(trimmed, { IMEMode: false })
      : toHiragana(trimmed, { IMEMode: false });
    return { jp, romaji: toRomaji(jp) };
  }, [jpInput, scriptMode]);

  async function playAudio(textToSpeak: string) {
    if (!textToSpeak) return;
    stopAllAudio();
    const seq = ++playSeqRef.current;
    const controller = new AbortController();
    ttsAbortRef.current = controller;
    setErr('');
    setSpeaking(true);
    try {
      const url = `/api/tts?text=${encodeURIComponent(textToSpeak)}&voice=${voice}&rate=${rate}`;
      const res = await fetch(url, { signal: controller.signal, credentials: 'include' });
      if (res.status === 401) {
        setErr('Kamu belum login — memakai suara browser. Login untuk suara server yang lebih jernih.');
        browserSpeak(textToSpeak, rate === 'slow' ? 0.72 : 0.95);
        if (seq === playSeqRef.current) setSpeaking(false);
        return;
      }
      if (!res.ok) throw new Error('Server TTS gagal merespons');
      const blob = await res.blob();
      if (seq !== playSeqRef.current) return;
      const objUrl = URL.createObjectURL(blob);
      objUrlRef.current = objUrl;
      const audio = new Audio(objUrl);
      audioRef.current = audio;
      audio.onended = () => {
        if (objUrlRef.current === objUrl) {
          URL.revokeObjectURL(objUrl);
          objUrlRef.current = null;
        }
        if (audioRef.current === audio) audioRef.current = null;
        if (seq === playSeqRef.current) setSpeaking(false);
      };
      await audio.play();
    } catch (e) {
      if ((e instanceof DOMException && e.name === 'AbortError') || seq !== playSeqRef.current) {
        return;
      }
      setErr('Server audio tidak terjangkau, memakai suara bawaan browser.');
      browserSpeak(textToSpeak, rate === 'slow' ? 0.72 : 0.95);
      setSpeaking(false);
    }
  }

  async function runTranslate(textOverride?: string, autoSpeak = false) {
    const q = (textOverride ?? idText).trim();
    if (!q) return;
    translateAbortRef.current?.abort();
    const controller = new AbortController();
    translateAbortRef.current = controller;
    setErr('');
    setTranslating(true);
    try {
      const res = await fetch(`/api/translate?q=${encodeURIComponent(q)}`, { signal: controller.signal, credentials: 'include' });
      if (res.status === 401) throw new Error('Silakan login terlebih dahulu untuk memakai terjemahan & suara AI.');
      const data = (await res.json()) as { source?: string; jp?: string; romaji?: string; error?: string };
      if (!res.ok || !data.jp) throw new Error(data.error || 'Gagal menerjemahkan.');
      setTranslated({ source: data.source || q, jp: data.jp, romaji: data.romaji || '' });
      if (autoSpeak) void playAudio(data.jp);
    } catch (e2) {
      if (e2 instanceof DOMException && e2.name === 'AbortError') return;
      setErr(e2 instanceof Error ? e2.message : 'Gagal menerjemahkan.');
    } finally {
      if (translateAbortRef.current === controller) {
        translateAbortRef.current = null;
        setTranslating(false);
      }
    }
  }

  const activeJp = tab === 'id-ja' ? (translated?.jp ?? '') : jpConverted.jp;
  const needsTranslate = tab === 'id-ja' && idText.trim().length > 0 && translated?.source !== idText.trim();

  return (
    <div className="page narrow">
      <div className="page-head">
        <div>
          <span className="hero-kicker jp">ほんやく・はつおん</span>
          <h1>Terjemah &amp; Suarakan Bahasa Jepang</h1>
          <p className="muted">
            Tulis kalimat Bahasa Indonesia (atau pilih contoh), lalu lihat teks Jepang, bacaan Latin, dan dengarkan suaranya.
          </p>
        </div>
      </div>

      {!authLoading && !user && (
        <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--sakura)', background: 'var(--sakura-soft)' }}>
          <div className="row between wrap gap-s">
            <div>
              <strong>Khusus Siswa &amp; Guru SMKN NU Darussalam</strong>
              <p className="muted small" style={{ margin: '.2rem 0 0' }}>
                Silakan masuk dengan akun sekolah/Google untuk memakai fitur terjemah &amp; suara AI server.
              </p>
            </div>
            <Link to="/masuk" className="btn primary small">Masuk / Daftar →</Link>
          </div>
        </div>
      )}

      <div className="auth-tabs" style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          className={`btn small ${tab === 'id-ja' ? 'primary' : ''}`}
          onClick={() => { setTab('id-ja'); setErr(''); }}
        >
          🇮🇩 Indonesia → 🇯🇵 Jepang
        </button>
        <button
          type="button"
          className={`btn small ${tab === 'jp' ? 'primary' : ''}`}
          onClick={() => { setTab('jp'); setErr(''); }}
        >
          🇯🇵 Ketik Romaji / Jepang
        </button>
      </div>

      <div className="card tts-card">
        {tab === 'id-ja' ? (
          <>
            <label className="field">
              <span>Tulis kalimat Bahasa Indonesia</span>
              <textarea
                className="input tts-textarea"
                rows={3}
                maxLength={500}
                placeholder="Contoh: Selamat pagi, nama saya Wahyu"
                value={idText}
                onChange={(e) => {
                  setIdText(e.target.value);
                  if (translated && e.target.value.trim() !== translated.source) {
                    setTranslated(null);
                  }
                }}
              />
            </label>

            <div className="tts-controls">
              <div className="row gap-s wrap">
                <button
                  type="button"
                  className="btn primary"
                  disabled={!idText.trim() || translating || speaking}
                  onClick={() => void runTranslate(undefined, true)}
                >
                  {translating ? 'Menerjemahkan…' : speaking ? 'Memutar suara…' : '✨ Terjemahkan & Suarakan'}
                </button>
                <button
                  type="button"
                  className="btn"
                  disabled={!idText.trim() || translating}
                  onClick={() => void runTranslate(undefined, false)}
                >
                  Terjemahkan saja
                </button>
              </div>
              <VoiceControls voice={voice} setVoice={setVoice} rate={rate} setRate={setRate} />
            </div>

            {translated && (
              <div className="tts-output">
                <div className="muted small">🇮🇩 {translated.source}</div>
                <div className="tts-jp jp">{translated.jp}</div>
                {translated.romaji && <div className="tts-romaji">{translated.romaji}</div>}
              </div>
            )}
          </>
        ) : (
          <>
            <label className="field">
              <span>Tulis Romaji / Hiragana / Katakana / Kanji</span>
              <textarea
                className="input tts-textarea"
                rows={3}
                maxLength={200}
                placeholder="Contoh: ohayou gozaimasu / おはようございます"
                value={jpInput}
                onChange={(e) => setJpInput(e.target.value)}
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
              <VoiceControls voice={voice} setVoice={setVoice} rate={rate} setRate={setRate} />
            </div>

            <div className="tts-output">
              {jpConverted.jp ? (
                <>
                  <div className="tts-jp jp">{jpConverted.jp}</div>
                  <div className="tts-romaji">{jpConverted.romaji}</div>
                </>
              ) : (
                <div className="muted">Ketik kata atau kalimat di atas untuk melihat hasil konversi…</div>
              )}
            </div>
          </>
        )}

        <div className="row gap-s wrap">
          <button
            type="button"
            className="btn primary big"
            disabled={(tab === 'id-ja' ? !idText.trim() : !activeJp) || speaking || translating}
            onClick={() => {
              if (needsTranslate) void runTranslate(undefined, true);
              else void playAudio(activeJp);
            }}
          >
            {translating ? 'Menerjemahkan…' : speaking ? 'Memutar suara…' : '🔊 Putar Suara Jepang'}
          </button>
          <button
            type="button"
            className="btn big"
            onClick={() => {
              stopAllAudio();
              setSpeaking(false);
              if (tab === 'id-ja') { setIdText(''); setTranslated(null); }
              else setJpInput('');
            }}
          >
            Bersihkan
          </button>
        </div>

        {err && <p className="muted small" style={{ marginTop: '.25rem', marginBottom: 0 }}>{err}</p>}
      </div>

      {tab === 'id-ja' ? (
        <>
          <h3 style={{ marginTop: '1.5rem' }}>Template kalimat Bahasa Indonesia (klik langsung terjemah &amp; suara)</h3>
          <div className="row gap-s wrap">
            {ID_TEMPLATES.map((t) => (
              <button
                key={t}
                type="button"
                className="btn small"
                onClick={() => {
                  setIdText(t);
                  void runTranslate(t, true);
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 style={{ marginTop: '1.5rem' }}>Coba frasa cepat</h3>
          <div className="row gap-s wrap">
            {JP_SAMPLES.map((s) => (
              <button
                key={s.label}
                type="button"
                className="btn small"
                onClick={() => { setScriptMode('hiragana'); setJpInput(s.text); }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function VoiceControls({
  voice,
  setVoice,
  rate,
  setRate,
}: {
  voice: 'female' | 'male';
  setVoice: (v: 'female' | 'male') => void;
  rate: 'normal' | 'slow';
  setRate: (r: 'normal' | 'slow') => void;
}) {
  return (
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
  );
}
