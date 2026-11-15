import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { KAIWA_LIST, type KaiwaDialog, type KaiwaLine } from '../data/kaiwa';
import { useAuth } from '../lib/auth';
import { completeKaiwa, useProgress } from '../lib/progress';
import { speechSupported } from '../lib/speech';

export default function KaiwaPage() {
  const { user } = useAuth();
  const prog = useProgress();
  const doneIds = useMemo(() => new Set(prog.kaiwa ?? []), [prog.kaiwa]);

  const [levelFilter, setLevelFilter] = useState<'ALL' | 'N5' | 'N4'>('ALL');
  const [active, setActive] = useState<KaiwaDialog | null>(null);
  const [rate, setRate] = useState<'normal' | 'slow'>('normal');
  const [hideHint, setHideHint] = useState(false);

  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [lastIdx, setLastIdx] = useState<number>(0);
  const [shadowing, setShadowing] = useState(false);
  const [shadowStatus, setShadowStatus] = useState('');
  const [notice, setNotice] = useState('');
  const [taskMsg, setTaskMsg] = useState('');
  const [completing, setCompleting] = useState(false);

  const seqRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objUrlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const filtered = useMemo(
    () => KAIWA_LIST.filter((d) => levelFilter === 'ALL' || d.level === levelFilter),
    [levelFilter],
  );

  function stopPlayback() {
    seqRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
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
    setShadowing(false);
    setPlayingIdx(null);
    setShadowStatus('');
  }

  useEffect(() => () => stopPlayback(), []);

  function speakBrowserAsync(text: string, slow: boolean, seq: number): Promise<void> {
    return new Promise((resolve) => {
      if (!speechSupported()) {
        timerRef.current = window.setTimeout(resolve, 1200);
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      const voices = window.speechSynthesis.getVoices();
      const ja = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('ja'));
      const chosen = ja.find((v) => /google/i.test(v.name)) ?? ja[0];
      if (chosen) u.voice = chosen;
      u.rate = slow ? 0.72 : 0.95;
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      u.onend = done;
      u.onerror = done;
      window.speechSynthesis.speak(u);
      // Fallback pengaman bila browser tidak memanggil onend
      timerRef.current = window.setTimeout(() => {
        if (seq === seqRef.current) done();
      }, Math.max(2000, text.length * 220));
    });
  }

  async function playSingleLineAudio(line: KaiwaLine, rateOverride: 'normal' | 'slow', seq: number): Promise<void> {
    const controller = new AbortController();
    abortRef.current = controller;
    const voice = line.voice === 'male' ? 'male' : 'female';
    try {
      const url = `/api/tts?text=${encodeURIComponent(line.jp)}&voice=${voice}&rate=${rateOverride}`;
      const res = await fetch(url, { signal: controller.signal, credentials: 'include' });
      if (seq !== seqRef.current) return;
      if (res.status === 401) {
        setNotice('Kamu belum login — memakai suara bawaan browser. Login untuk suara server yang jernih.');
        await speakBrowserAsync(line.jp, rateOverride === 'slow', seq);
        return;
      }
      if (!res.ok) throw new Error('TTS gagal');
      const blob = await res.blob();
      if (seq !== seqRef.current) return;
      const objUrl = URL.createObjectURL(blob);
      objUrlRef.current = objUrl;
      await new Promise<void>((resolve) => {
        const audio = new Audio(objUrl);
        audioRef.current = audio;
        const cleanup = () => {
          if (objUrlRef.current === objUrl) {
            URL.revokeObjectURL(objUrl);
            objUrlRef.current = null;
          }
          if (audioRef.current === audio) audioRef.current = null;
          resolve();
        };
        audio.onended = cleanup;
        audio.onerror = cleanup;
        audio.play().catch(cleanup);
      });
    } catch (e) {
      if ((e instanceof DOMException && e.name === 'AbortError') || seq !== seqRef.current) return;
      setNotice('Server TTS tidak terjangkau, memakai suara bawaan browser.');
      await speakBrowserAsync(line.jp, rateOverride === 'slow', seq);
    }
  }

  async function playLine(index: number) {
    if (!active) return;
    stopPlayback();
    setNotice('');
    setLastIdx(index);
    setPlayingIdx(index);
    const seq = seqRef.current;
    await playSingleLineAudio(active.lines[index], rate, seq);
    if (seq === seqRef.current) {
      setPlayingIdx(null);
    }
  }

  async function startShadowing(fromIdx = 0) {
    if (!active) return;
    stopPlayback();
    setNotice('');
    setShadowing(true);
    const seq = seqRef.current;

    for (let i = fromIdx; i < active.lines.length; i++) {
      if (seq !== seqRef.current) return;
      setLastIdx(i);
      setPlayingIdx(i);
      setShadowStatus(`Memutar baris ${i + 1} dari ${active.lines.length}…`);
      await playSingleLineAudio(active.lines[i], rate, seq);
      if (seq !== seqRef.current) return;

      if (i < active.lines.length - 1) {
        setShadowStatus('⏳ Jeda 2,5 detik — tirukan kalimat ini dengan suara…');
        await new Promise<void>((resolve) => {
          timerRef.current = window.setTimeout(resolve, 2500);
        });
      }
    }

    if (seq === seqRef.current) {
      setShadowing(false);
      setPlayingIdx(null);
      setShadowStatus('✔ Sesi shadowing selesai!');
    }
  }

  async function handleComplete(dialog: KaiwaDialog) {
    if (!user) {
      setTaskMsg('Silakan login terlebih dahulu untuk mencatat dialog selesai & menerima +5 XP.');
      return;
    }
    setCompleting(true);
    setTaskMsg('');
    const res = await completeKaiwa(dialog.id);
    setCompleting(false);
    if (!res.ok) {
      setTaskMsg(res.error || 'Gagal mencatat penyelesaian dialog.');
    } else {
      setTaskMsg('✔ Dialog ditandai selesai dipelajari (+5 XP)!');
    }
  }

  if (active) {
    const isCompleted = doneIds.has(active.id);
    return (
      <div className="page narrow">
        <div className="row between wrap gap-s" style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            className="btn small"
            onClick={() => {
              stopPlayback();
              setActive(null);
              setNotice('');
              setTaskMsg('');
            }}
          >
            ← Semua Dialog
          </button>
          <div className="row gap-s">
            <span className="pill">{active.level}</span>
            {isCompleted && (
              <span className="pill" style={{ background: 'var(--ok-soft)', color: 'var(--ok)' }}>
                ✓ Selesai
              </span>
            )}
          </div>
        </div>

        <section className="card">
          <div className="jp muted small">{active.jpTitle}</div>
          <h1 style={{ fontSize: '1.55rem', marginBottom: '.35rem' }}>{active.title}</h1>
          <p className="muted" style={{ marginTop: 0 }}>{active.situation}</p>

          <div className="kaiwa-controls row wrap gap-s">
            <button
              type="button"
              className={`btn ${shadowing ? 'danger' : 'primary'}`}
              onClick={() => (shadowing ? stopPlayback() : void startShadowing(0))}
            >
              {shadowing ? '⏹ Hentikan Shadowing' : '🎧 Mode Shadowing'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => void playLine(playingIdx ?? lastIdx)}
            >
              🔁 Ulangi baris ini
            </button>
            <button
              type="button"
              className={`btn ${rate === 'slow' ? 'primary' : ''}`}
              aria-pressed={rate === 'slow'}
              onClick={() => setRate((r) => (r === 'slow' ? 'normal' : 'slow'))}
            >
              🐢 Pelan {rate === 'slow' ? '(-25% Aktif)' : '(-25%)'}
            </button>
            <label className="check" style={{ marginLeft: 'auto' }}>
              <input type="checkbox" checked={hideHint} onChange={(e) => setHideHint(e.target.checked)} />
              Sembunyikan romaji &amp; arti
            </label>
          </div>

          {shadowStatus && (
            <div className="notice" style={{ marginTop: '.75rem' }}>
              <strong>{shadowStatus}</strong>
            </div>
          )}

          {notice && (
            <div className="notice" style={{ marginTop: '.75rem' }}>
              <span>{notice}</span>
              {!user && <Link to="/masuk" className="btn small primary">Login</Link>}
            </div>
          )}

          <div className="kaiwa-lines" style={{ marginTop: '1rem' }}>
            {active.lines.map((line, i) => {
              const isPlaying = playingIdx === i;
              return (
                <div
                  key={i}
                  className={`kaiwa-line ${isPlaying ? 'active-line' : ''}`}
                  onClick={() => setLastIdx(i)}
                >
                  <div className="kaiwa-speaker">
                    <span className="pill">{line.speaker}</span>
                    <button
                      type="button"
                      className={`btn speak small ${isPlaying ? 'primary' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        void playLine(i);
                      }}
                      aria-label={`Putar baris ${i + 1}`}
                    >
                      {isPlaying ? '🔊 Memutar…' : '🔊 Putar'}
                    </button>
                  </div>
                  <div className="kaiwa-jp jp">{line.jp}</div>
                  <div className={hideHint ? 'blurred' : ''}>
                    <div className="muted small">{line.romaji}</div>
                    <div style={{ marginTop: '.15rem' }}>{line.arti}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="kaiwa-complete-box">
            {isCompleted ? (
              <div className="row between wrap gap-s">
                <strong style={{ color: 'var(--ok)' }}>✔ Dialog sudah selesai dipelajari (+5 XP diterima)</strong>
                <button type="button" className="btn small" disabled>Selesai ✓</button>
              </div>
            ) : (
              <div className="row between wrap gap-s">
                <span className="muted small">Sudah lancar membaca dan menirukan seluruh baris dialog ini?</span>
                <button
                  type="button"
                  className="btn primary"
                  disabled={completing}
                  onClick={() => void handleComplete(active)}
                >
                  {completing ? 'Menyimpan…' : '✓ Selesai dipelajari (+5 XP)'}
                </button>
              </div>
            )}
            {taskMsg && <p className="small" style={{ margin: '.5rem 0 0' }}>{taskMsg}</p>}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Percakapan &amp; Shadowing <span className="jp muted">会話</span></h1>
          <p className="lead">
            {KAIWA_LIST.length} dialog situasi sekolah, kehidupan di Jepang, dan tempat kerja. Dengarkan lalu tirukan dengan mode shadowing.
          </p>
        </div>
        <div className="card mini-progress">
          <div className="muted small">Dialog selesai</div>
          <div className="big-num">{doneIds.size}<span className="muted small">/{KAIWA_LIST.length}</span></div>
          <div className="bar"><div style={{ width: `${(doneIds.size / KAIWA_LIST.length) * 100}%` }} /></div>
        </div>
      </header>

      <div className="row gap-s toolbar">
        {(['ALL', 'N5', 'N4'] as const).map((lv) => (
          <button
            key={lv}
            type="button"
            className={`btn small ${levelFilter === lv ? 'primary' : ''}`}
            onClick={() => setLevelFilter(lv)}
          >
            {lv === 'ALL' ? 'Semua Dialog' : lv}
          </button>
        ))}
      </div>

      <div className="bunpou-grid">
        {filtered.map((d, idx) => {
          const isDone = doneIds.has(d.id);
          return (
            <button
              key={d.id}
              type="button"
              className="card bunpou-card"
              onClick={() => {
                setActive(d);
                setLastIdx(0);
                setNotice('');
                setTaskMsg('');
              }}
            >
              <div className="row between gap-s">
                <span className="pill">{d.level} · Dialog #{idx + 1}</span>
                {isDone && <span className="small" style={{ color: 'var(--ok)', fontWeight: 700 }}>✓ Selesai</span>}
              </div>
              <h3>{d.title}</h3>
              <div className="jp muted small">{d.jpTitle}</div>
              <p className="muted small" style={{ margin: '.25rem 0 0' }}>{d.situation}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
