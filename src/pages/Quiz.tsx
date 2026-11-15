import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toHiragana } from 'wanakana';
import { VoiceNotice } from '../components/Speak';
import { allKana, GROUPS, type GroupId, type Kana, type Script } from '../data/kana';
import { finishQuiz, mastery, recordAnswer, useProgress } from '../lib/progress';
import { speak } from '../lib/speech';

type Mode = 'pilih-romaji' | 'pilih-kana' | 'ketik' | 'dengar';
type ScriptOpt = Script | 'campur';

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'pilih-romaji', label: 'Huruf → Romaji', desc: 'Lihat huruf, pilih cara bacanya' },
  { id: 'pilih-kana', label: 'Romaji → Huruf', desc: 'Lihat bacaan, pilih hurufnya' },
  { id: 'dengar', label: 'Dengar → Huruf', desc: 'Dengarkan bunyi, pilih hurufnya' },
  { id: 'ketik', label: 'Ketik Romaji', desc: 'Lihat huruf, ketik bacaannya' },
];

interface Question { kana: Kana; options: Kana[] }
interface Answer { kana: Kana; correct: boolean; given: string }

const ALT: Record<string, string[]> = { を: ['o'], ヲ: ['o'], ぢ: ['di', 'dji'], ヂ: ['di'], づ: ['du', 'dzu'], ヅ: ['du'] };

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

function checkTyped(input: string, k: Kana) {
  const v = input.trim().toLowerCase().replace(/\s+/g, '');
  if (!v) return false;
  if (v === k.romaji) return true;
  if (ALT[k.char]?.includes(v)) return true;
  return toHiragana(v) === k.hira || toHiragana(v === 'n' ? 'nn' : v) === k.hira;
}

export default function Quiz() {
  const [params] = useSearchParams();
  const prog = useProgress();

  const [script, setScript] = useState<ScriptOpt>((params.get('script') as ScriptOpt) || 'hiragana');
  const [groups, setGroups] = useState<GroupId[]>(
    (params.get('groups')?.split(',') as GroupId[]) || ['dasar'],
  );
  const [mode, setMode] = useState<Mode>('pilih-romaji');
  const [count, setCount] = useState(10);
  const [sound, setSound] = useState(true);

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickedRef = useRef<string | null>(null);

  const pool = useMemo(() => {
    const scripts: Script[] = script === 'campur' ? ['hiragana', 'katakana'] : [script];
    return scripts.flatMap((s) => allKana(s, groups));
  }, [script, groups]);

  const build = useCallback((source: Kana[], n: number): Question[] => {
    // Huruf yang lemah/belum dilatih lebih sering muncul
    const weight = (k: Kana) => [3, 4, 2, 1][mastery(prog.kana[k.char])];
    const chosen: Kana[] = [];
    let bag = [...source];
    while (chosen.length < n && source.length) {
      if (!bag.length) bag = [...source];
      const total = bag.reduce((s, k) => s + weight(k), 0);
      let r = Math.random() * total;
      const i = bag.findIndex((k) => (r -= weight(k)) <= 0);
      chosen.push(bag.splice(i < 0 ? 0 : i, 1)[0]);
    }
    return chosen.map((k) => {
      const others = shuffle(pool.filter((o) => o.romaji !== k.romaji && o.script === k.script));
      const similar = others.filter((o) => o.group === k.group);
      const opts = [...similar, ...others.filter((o) => o.group !== k.group)];
      const uniq: Kana[] = [];
      for (const o of opts) { if (!uniq.some((u) => u.romaji === o.romaji)) uniq.push(o); if (uniq.length === 3) break; }
      return { kana: k, options: shuffle([k, ...uniq]) };
    });
  }, [pool, prog.kana]);

  const start = (source = pool, n = count) => {
    setQuestions(build(source, n === 0 ? source.length : n));
    setIdx(0); setAnswers([]); setPicked(null); setTyped(''); setDone(false);
  };

  const q = questions?.[idx];

  useEffect(() => {
    if (!q) return;
    if (mode === 'dengar') setTimeout(() => speak(q.kana.char), 250);
    if (mode === 'ketik') setTimeout(() => inputRef.current?.focus(), 50);
  }, [q, mode]);

  const answer = (given: string, correct: boolean) => {
    if (!q || picked !== null) return;
    setPicked(given);
    pickedRef.current = given;
    recordAnswer(q.kana.char, correct);
    setAnswers((a) => [...a, { kana: q.kana, correct, given }]);
    if (sound && mode !== 'dengar') speak(q.kana.char);
    if (correct) setTimeout(() => { if (pickedRef.current !== null) next(); }, 850);
  };

  const next = useCallback(() => {
    pickedRef.current = null;
    setPicked(null); setTyped('');
    setIdx((i) => {
      if (questions && i + 1 >= questions.length) { setDone(true); return i; }
      return i + 1;
    });
  }, [questions]);

  useEffect(() => {
    if (done && answers.length) {
      const right = answers.filter((a) => a.correct).length;
      finishQuiz(right === answers.length ? 50 : 10, right, answers.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // Pintasan keyboard: 1–4 untuk memilih, Enter untuk lanjut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q || done) return;
      if (picked !== null && e.key === 'Enter') { e.preventDefault(); next(); return; }
      if (mode !== 'ketik' && picked === null && ['1', '2', '3', '4'].includes(e.key)) {
        const o = q.options[+e.key - 1];
        if (o) answer(o.char, o.char === q.kana.char);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---------- Layar pengaturan ----------
  if (!questions) {
    const availGroups = GROUPS.filter((g) => script !== 'hiragana' || g.id !== 'tambahan');
    return (
      <div className="page narrow">
        <h1>🎯 Kuis Kana</h1>
        <p className="lead">Pilih huruf dan jenis kuis. Huruf yang sering salah akan lebih sering muncul.</p>
        <VoiceNotice />

        <section className="card form">
          <h3>1. Jenis huruf</h3>
          <div className="choice-row">
            {(['hiragana', 'katakana', 'campur'] as ScriptOpt[]).map((s) => (
              <button key={s} className={`choice ${script === s ? 'active' : ''}`} onClick={() => {
                setScript(s);
                if (s === 'hiragana') {
                  setGroups((prev) => {
                    const nextG = prev.filter((g) => g !== 'tambahan');
                    return nextG.length ? nextG : ['dasar'];
                  });
                }
              }}>
                <span className="jp">{s === 'hiragana' ? 'あ' : s === 'katakana' ? 'ア' : 'あア'}</span>
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <h3>2. Bagian</h3>
          <div className="choice-row">
            {availGroups.map((g) => {
              const on = groups.includes(g.id);
              return (
                <button key={g.id} className={`choice ${on ? 'active' : ''}`}
                  onClick={() => setGroups(on ? groups.filter((x) => x !== g.id) : [...groups, g.id])}>
                  {on ? '☑' : '☐'} {g.label}
                </button>
              );
            })}
          </div>

          <h3>3. Mode</h3>
          <div className="choice-grid">
            {MODES.map((m) => (
              <button key={m.id} className={`choice ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)}>
                <strong>{m.label}</strong><small>{m.desc}</small>
              </button>
            ))}
          </div>

          <h3>4. Jumlah soal</h3>
          <div className="choice-row">
            {[10, 20, 30, 0].map((n) => (
              <button key={n} className={`choice ${count === n ? 'active' : ''}`} onClick={() => setCount(n)}>
                {n === 0 ? `Semua (${pool.length})` : n}
              </button>
            ))}
          </div>

          <label className="check"><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Bunyikan huruf setelah menjawab</label>

          <button className="btn primary big" disabled={pool.length < 4} onClick={() => start()}>
            Mulai kuis ({pool.length} huruf) →
          </button>
          {pool.length < 4 && <p className="muted small">Pilih minimal satu bagian.</p>}
        </section>
      </div>
    );
  }

  // ---------- Layar hasil ----------
  if (done) {
    const right = answers.filter((a) => a.correct).length;
    const wrong = answers.filter((a) => !a.correct);
    const pct = Math.round((right / answers.length) * 100);
    const wrongKana = [...new Map(wrong.map((a) => [a.kana.char, a.kana])).values()];
    return (
      <div className="page narrow">
        <section className="card result">
          <div className="result-emoji">{pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
          <h1>{pct === 100 ? 'Sempurna! すごい！' : pct >= 80 ? 'Hebat! よくできました！' : pct >= 50 ? 'Lumayan, terus latihan!' : 'Ayo ulangi lagi, pasti bisa!'}</h1>
          <div className="big-num">{right} / {answers.length}</div>
          <div className="bar big"><div style={{ width: `${pct}%` }} /></div>
          <p className="muted">+{answers.reduce((s, a) => s + (a.correct ? 10 : 1), 0) + (pct === 100 ? 50 : 10)} XP</p>

          {wrongKana.length > 0 && (
            <>
              <h3>Huruf yang perlu diulang</h3>
              <div className="wrong-list">
                {wrongKana.map((k) => (
                  <button key={k.char} className="wrong-item" onClick={() => speak(k.char)}>
                    <span className="jp-hand">{k.char}</span><small>{k.romaji}</small>
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="row gap-s center wrap">
            {wrongKana.length > 0 && wrongKana.length >= 1 && (
              <button className="btn primary" onClick={() => start(wrongKana.length >= 4 ? wrongKana : [...wrongKana, ...shuffle(pool).slice(0, 4)], wrongKana.length * 2)}>
                🔁 Latih yang salah
              </button>
            )}
            <button className="btn" onClick={() => start()}>Kuis lagi</button>
            <button className="btn" onClick={() => setQuestions(null)}>Ubah pengaturan</button>
            <Link className="btn" to={`/${script === 'katakana' ? 'katakana' : 'hiragana'}`}>Lihat tabel</Link>
          </div>
        </section>
      </div>
    );
  }

  // ---------- Layar soal ----------
  const k = q!.kana;
  const isRight = picked !== null && answers[answers.length - 1]?.correct;
  const showKanaAsOption = mode === 'pilih-kana' || mode === 'dengar';

  return (
    <div className="page narrow">
      <div className="quiz-top">
        <button className="btn small" onClick={() => setQuestions(null)}>✕ Keluar</button>
        <div className="bar grow"><div style={{ width: `${(idx / questions.length) * 100}%` }} /></div>
        <span className="muted small">{idx + 1}/{questions.length}</span>
      </div>

      <section className={`card quiz-card ${picked !== null ? (isRight ? 'right' : 'wrong') : ''}`}>
        <div className="prompt">
          {mode === 'pilih-romaji' || mode === 'ketik' ? (
            <div className="prompt-kana jp-hand">{k.char}</div>
          ) : mode === 'pilih-kana' ? (
            <div className="prompt-romaji">{k.romaji}</div>
          ) : (
            <button className="btn primary big-speak" onClick={() => speak(k.char)}>🔊 Putar suara</button>
          )}
        </div>

        {mode === 'ketik' ? (
          <form className="type-form" onSubmit={(e) => { e.preventDefault(); if (picked === null) answer(typed, checkTyped(typed, k)); else next(); }}>
            <input
              ref={inputRef}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="ketik romaji…"
              autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false}
              disabled={picked !== null}
              className="type-input"
            />
            <button className="btn primary" type="submit">{picked === null ? 'Periksa' : 'Lanjut →'}</button>
          </form>
        ) : (
          <div className="options">
            {q!.options.map((o, i) => {
              const state = picked === null ? '' : o.char === k.char ? 'right' : o.char === picked ? 'wrong' : 'dim';
              return (
                <button key={o.char} className={`option ${state}`} disabled={picked !== null}
                  onClick={() => answer(o.char, o.char === k.char)}>
                  <span className="opt-num">{i + 1}</span>
                  <span className={showKanaAsOption ? 'jp-hand opt-kana' : 'opt-romaji'}>{showKanaAsOption ? o.char : o.romaji}</span>
                </button>
              );
            })}
          </div>
        )}

        {picked !== null && (
          <div className={`feedback ${isRight ? 'ok' : 'no'}`}>
            {isRight ? '✔ Benar!' : (
              <>✘ Jawaban benar: <span className="jp-hand fb-kana">{k.char}</span> = <strong>{k.romaji}</strong>
                {ALT[k.char] && <small className="muted"> (juga diterima: {ALT[k.char].join(', ')})</small>}</>
            )}
            {!isRight && <button className="btn primary" onClick={next}>Lanjut →</button>}
          </div>
        )}
      </section>
      <p className="muted small center-text">Tip: tekan 1–4 untuk memilih, Enter untuk lanjut.</p>
    </div>
  );
}
