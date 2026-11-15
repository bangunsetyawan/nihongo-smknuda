import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toHiragana } from 'wanakana';
import { SpeakButton, VoiceNotice } from '../components/Speak';
import { allKana, GROUPS, type GroupId, type Kana, type Script } from '../data/kana';
import { VOCAB, type VocabItem } from '../data/vocab';
import { dueToday, finishQuiz, markVocab, mastery, recordAnswer, useProgress } from '../lib/progress';
import { speak } from '../lib/speech';

type Mode = 'pilih-romaji' | 'pilih-kana' | 'ketik' | 'dengar';
type ScriptOpt = Script | 'campur';

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'pilih-romaji', label: 'Huruf → Romaji', desc: 'Lihat huruf, pilih cara bacanya' },
  { id: 'pilih-kana', label: 'Romaji → Huruf', desc: 'Lihat bacaan, pilih hurufnya' },
  { id: 'dengar', label: 'Dengar → Huruf', desc: 'Dengarkan bunyi, pilih hurufnya' },
  { id: 'ketik', label: 'Ketik Romaji', desc: 'Lihat huruf, ketik bacaannya' },
];

type Question =
  | { kind: 'kana'; kana: Kana; options: Kana[] }
  | { kind: 'vocab'; vocab: VocabItem; options: VocabItem[] };

type Answer =
  | { kind: 'kana'; kana: Kana; correct: boolean; given: string; mode: Mode }
  | { kind: 'vocab'; vocab: VocabItem; correct: boolean; givenId: string };

const ALT: Record<string, string[]> = { を: ['o'], ヲ: ['o'], ぢ: ['di', 'dji'], ヂ: ['di', 'dji'], づ: ['du', 'dzu'], ヅ: ['du', 'dzu'] };

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
  const [params, setParams] = useSearchParams();
  const prog = useProgress();
  const allKanaItems = useMemo(() => [...allKana('hiragana'), ...allKana('katakana')], []);
  const due = useMemo(() => dueToday(prog), [prog]);
  const isReviewParam = params.get('mode') === 'review';

  const [script, setScript] = useState<ScriptOpt>((params.get('script') as ScriptOpt) || 'hiragana');
  const [groups, setGroups] = useState<GroupId[]>(
    (params.get('groups')?.split(',') as GroupId[]) || ['dasar'],
  );
  const [mode, setMode] = useState<Mode>('pilih-romaji');
  const [count, setCount] = useState(10);
  const [sound, setSound] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickedRef = useRef<string | null>(null);
  const autoStartedReviewRef = useRef(false);

  const pool = useMemo(() => {
    const scripts: Script[] = script === 'campur' ? ['hiragana', 'katakana'] : [script];
    return scripts.flatMap((s) => allKana(s, groups));
  }, [script, groups]);

  const buildKanaQuestions = useCallback((source: Kana[], n: number): Question[] => {
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
    const distractorSource = pool.length >= 4 ? pool : allKanaItems;
    return chosen.map((k) => {
      const others = shuffle(distractorSource.filter((o) => o.romaji !== k.romaji && o.script === k.script));
      const fallbackOthers = others.length >= 3
        ? others
        : shuffle(allKanaItems.filter((o) => o.romaji !== k.romaji && o.script === k.script));
      const similar = fallbackOthers.filter((o) => o.group === k.group);
      const opts = [...similar, ...fallbackOthers.filter((o) => o.group !== k.group)];
      const uniq: Kana[] = [];
      for (const o of opts) { if (!uniq.some((u) => u.romaji === o.romaji)) uniq.push(o); if (uniq.length === 3) break; }
      return { kind: 'kana', kana: k, options: shuffle([k, ...uniq]) };
    });
  }, [pool, allKanaItems, prog.kana]);

  const buildReviewQuestions = useCallback((kanaChars: string[], vocabIds: string[]): Question[] => {
    const kanaMap = new Map(allKanaItems.map((k) => [k.char, k]));
    const vocabMap = new Map(VOCAB.map((v) => [v.id, v]));
    const list: Question[] = [];

    for (const ch of kanaChars) {
      const k = kanaMap.get(ch);
      if (!k) continue;
      const others = shuffle(allKanaItems.filter((o) => o.romaji !== k.romaji && o.script === k.script));
      const similar = others.filter((o) => o.group === k.group);
      const opts = [...similar, ...others.filter((o) => o.group !== k.group)];
      const uniq: Kana[] = [];
      for (const o of opts) { if (!uniq.some((u) => u.romaji === o.romaji)) uniq.push(o); if (uniq.length === 3) break; }
      list.push({ kind: 'kana', kana: k, options: shuffle([k, ...uniq]) });
    }

    for (const id of vocabIds) {
      const v = vocabMap.get(id);
      if (!v) continue;
      const others = shuffle(VOCAB.filter((o) => o.id !== v.id && o.arti !== v.arti)).slice(0, 3);
      list.push({ kind: 'vocab', vocab: v, options: shuffle([v, ...others]) });
    }

    return shuffle(list);
  }, [allKanaItems]);

  const start = (source = pool, n = count) => {
    setReviewMode(false);
    setQuestions(buildKanaQuestions(source, n === 0 ? source.length : n));
    setIdx(0); setAnswers([]); setPicked(null); setTyped(''); setDone(false);
  };

  const startReview = useCallback(() => {
    const curDue = dueToday(prog);
    const qs = buildReviewQuestions(curDue.kana, curDue.vocab);
    if (!qs.length) return;
    setReviewMode(true);
    setMode('pilih-romaji');
    setQuestions(qs);
    setIdx(0); setAnswers([]); setPicked(null); setTyped(''); setDone(false);
  }, [prog, buildReviewQuestions]);

  useEffect(() => {
    if (isReviewParam && !questions && due.total > 0 && !autoStartedReviewRef.current) {
      autoStartedReviewRef.current = true;
      startReview();
    }
  }, [isReviewParam, questions, due.total, startReview]);

  const q = questions?.[idx];

  useEffect(() => {
    if (!q) return;
    if (q.kind === 'kana') {
      if (mode === 'dengar') setTimeout(() => speak(q.kana.char), 250);
      if (mode === 'ketik') setTimeout(() => inputRef.current?.focus(), 50);
    } else if (sound) {
      setTimeout(() => speak(q.vocab.jp), 200);
    }
  }, [q, mode, sound]);

  const next = useCallback(() => {
    pickedRef.current = null;
    setPicked(null); setTyped('');
    setIdx((i) => {
      if (questions && i + 1 >= questions.length) { setDone(true); return i; }
      return i + 1;
    });
  }, [questions]);

  const answerKana = (pickedVal: string, givenRomaji: string, correct: boolean) => {
    if (!q || q.kind !== 'kana' || picked !== null) return;
    const activeMode: Mode = reviewMode ? 'pilih-romaji' : mode;
    setPicked(pickedVal);
    pickedRef.current = pickedVal;
    recordAnswer(q.kana.char, givenRomaji, activeMode, correct);
    setAnswers((a) => [...a, { kind: 'kana', kana: q.kana, correct, given: givenRomaji, mode: activeMode }]);
    if (sound && activeMode !== 'dengar') speak(q.kana.char);
    if (correct) setTimeout(() => { if (pickedRef.current !== null) next(); }, 850);
  };

  const answerVocab = (opt: VocabItem) => {
    if (!q || q.kind !== 'vocab' || picked !== null) return;
    const correct = opt.id === q.vocab.id;
    setPicked(opt.id);
    pickedRef.current = opt.id;
    markVocab(q.vocab.id, correct);
    setAnswers((a) => [...a, { kind: 'vocab', vocab: q.vocab, correct, givenId: opt.id }]);
    if (correct) setTimeout(() => { if (pickedRef.current !== null) next(); }, 850);
  };

  useEffect(() => {
    if (done && answers.length) {
      const right = answers.filter((a) => a.correct).length;
      const bonus = right === answers.length ? 50 : 10;
      const hasKana = answers.some((a) => a.kind === 'kana');
      const hasVocab = answers.some((a) => a.kind === 'vocab');
      if (hasKana && !hasVocab) {
        finishQuiz(bonus, {
          quizType: 'kana',
          isReview: reviewMode,
          answers: answers.map((a) => a.kind === 'kana'
            ? { char: a.kana.char, given: a.given, mode: a.mode }
            : { char: '', given: '', mode: 'pilih-romaji' }),
        });
      } else if (hasVocab && !hasKana) {
        finishQuiz(bonus, {
          quizType: 'vocab',
          isReview: reviewMode,
          answers: answers.map((a) => a.kind === 'vocab'
            ? { id: a.vocab.id, givenId: a.givenId }
            : { id: '', givenId: '' }),
        });
      } else {
        finishQuiz(bonus, {
          quizType: 'mixed',
          isReview: reviewMode,
          answers: answers.map((a) => a.kind === 'vocab'
            ? { kind: 'vocab', id: a.vocab.id, givenId: a.givenId }
            : { kind: 'kana', char: a.kana.char, given: a.given, mode: a.mode }),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // Pintasan keyboard: 1–4 untuk memilih, Enter untuk lanjut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q || done) return;
      if (picked !== null && e.key === 'Enter') { e.preventDefault(); next(); return; }
      const effectiveMode = q.kind === 'vocab' ? 'vocab' : reviewMode ? 'pilih-romaji' : mode;
      if (effectiveMode !== 'ketik' && picked === null && ['1', '2', '3', '4'].includes(e.key)) {
        const index = +e.key - 1;
        if (q.kind === 'vocab') {
          const o = q.options[index];
          if (o) answerVocab(o);
        } else {
          const o = q.options[index];
          if (o) answerKana(o.char, o.romaji, o.char === q.kana.char);
        }
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

        {(isReviewParam || due.total > 0) && (
          <section className="card review-banner" style={{ marginBottom: '1rem' }}>
            <div>
              <strong>🔄 Review Hari Ini (SRS)</strong>
              <p className="muted small" style={{ margin: '.25rem 0 0' }}>
                {due.total > 0
                  ? `${due.kana.length} huruf + ${due.vocab.length} kosakata siap diulang sekarang.`
                  : 'Tidak ada review jatuh tempo hari ini — bagus!'}
              </p>
            </div>
            {due.total > 0 ? (
              <button type="button" className="btn primary" onClick={startReview}>
                Mulai Review ({due.total}) →
              </button>
            ) : (
              <button type="button" className="btn small" onClick={() => setParams({})}>
                Kuis Biasa
              </button>
            )}
          </section>
        )}

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
    const wrongKana = [...new Map(
      wrong.filter((a): a is Extract<Answer, { kind: 'kana' }> => a.kind === 'kana').map((a) => [a.kana.char, a.kana]),
    ).values()];
    const wrongVocab = [...new Map(
      wrong.filter((a): a is Extract<Answer, { kind: 'vocab' }> => a.kind === 'vocab').map((a) => [a.vocab.id, a.vocab]),
    ).values()];
    return (
      <div className="page narrow">
        <section className="card result">
          <div className="result-emoji">{pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
          <h1>{pct === 100 ? 'Sempurna! すごい！' : pct >= 80 ? 'Hebat! よくできました！' : pct >= 50 ? 'Lumayan, terus latihan!' : 'Ayo ulangi lagi, pasti bisa!'}</h1>
          <div className="big-num">{right} / {answers.length}</div>
          <div className="bar big"><div style={{ width: `${pct}%` }} /></div>
          <p className="muted">+{answers.reduce((s, a) => s + (a.correct ? 10 : 1), 0) + (pct === 100 ? 50 : 10)} XP</p>

          {(wrongKana.length > 0 || wrongVocab.length > 0) && (
            <>
              <h3>Butir yang perlu diulang</h3>
              <div className="wrong-list">
                {wrongKana.map((k) => (
                  <button key={k.char} className="wrong-item" onClick={() => speak(k.char)}>
                    <span className="jp-hand">{k.char}</span><small>{k.romaji}</small>
                  </button>
                ))}
                {wrongVocab.map((v) => (
                  <button key={v.id} className="wrong-item" onClick={() => speak(v.jp)}>
                    <span className="jp-hand" style={{ fontSize: '1.15rem' }}>{v.jp}</span><small>{v.arti}</small>
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="row gap-s center wrap">
            {wrongKana.length > 0 && !reviewMode && (
              <button className="btn primary" onClick={() => start(wrongKana.length >= 4 ? wrongKana : [...wrongKana, ...shuffle(pool).slice(0, 4)], wrongKana.length * 2)}>
                🔁 Latih yang salah
              </button>
            )}
            {reviewMode && due.total > 0 && (
              <button className="btn primary" onClick={startReview}>🔄 Review sisa ({due.total})</button>
            )}
            {!reviewMode && <button className="btn" onClick={() => start()}>Kuis lagi</button>}
            <button className="btn" onClick={() => { setReviewMode(false); setQuestions(null); if (isReviewParam) setParams({}); }}>Ubah pengaturan</button>
            <Link className="btn" to={reviewMode ? '/' : `/${script === 'katakana' ? 'katakana' : 'hiragana'}`}>
              {reviewMode ? 'Kembali ke Beranda' : 'Lihat tabel'}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // ---------- Layar soal ----------
  const exitQuiz = () => {
    setReviewMode(false);
    setQuestions(null);
    if (isReviewParam) setParams({});
  };

  if (q!.kind === 'vocab') {
    const v = q!.vocab;
    const isRight = picked === v.id;
    return (
      <div className="page narrow">
        <div className="quiz-top">
          <button className="btn small" onClick={exitQuiz}>✕ Keluar</button>
          <div className="bar grow"><div style={{ width: `${(idx / questions.length) * 100}%` }} /></div>
          <span className="muted small">Review {idx + 1}/{questions.length}</span>
        </div>

        <section className={`card quiz-card ${picked !== null ? (isRight ? 'right' : 'wrong') : ''}`}>
          <div className="vocab-quiz-prompt">
            <div className="vocab-quiz-jp jp-hand">{v.jp}</div>
            {v.kanji && <div className="muted jp">{v.kanji}</div>}
            <SpeakButton text={v.jp} label="Dengarkan" className="small" />
          </div>

          <div className="options">
            {q!.options.map((o, i) => {
              const state = picked === null ? '' : o.id === v.id ? 'right' : o.id === picked ? 'wrong' : 'dim';
              return (
                <button
                  key={o.id}
                  className={`option vocab-opt ${state}`}
                  disabled={picked !== null}
                  onClick={() => answerVocab(o)}
                >
                  <span className="opt-num">{i + 1}</span>
                  <span>{o.arti}</span>
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className={`feedback ${isRight ? 'ok' : 'no'}`}>
              {isRight ? (
                <>✔ Benar! ({v.romaji})</>
              ) : (
                <>
                  ✘ Jawaban benar: <strong>{v.arti}</strong> <span className="muted">({v.romaji})</span>
                  <button className="btn primary" onClick={next}>Lanjut →</button>
                </>
              )}
            </div>
          )}
        </section>
        <p className="muted small center-text">Tip: tekan 1–4 untuk memilih, Enter untuk lanjut.</p>
      </div>
    );
  }

  const k = q!.kana;
  const activeMode: Mode = reviewMode ? 'pilih-romaji' : mode;
  const isRight = picked !== null && answers[answers.length - 1]?.correct;
  const showKanaAsOption = activeMode === 'pilih-kana' || activeMode === 'dengar';

  return (
    <div className="page narrow">
      <div className="quiz-top">
        <button className="btn small" onClick={exitQuiz}>✕ Keluar</button>
        <div className="bar grow"><div style={{ width: `${(idx / questions.length) * 100}%` }} /></div>
        <span className="muted small">{reviewMode ? `Review ${idx + 1}/${questions.length}` : `${idx + 1}/${questions.length}`}</span>
      </div>

      <section className={`card quiz-card ${picked !== null ? (isRight ? 'right' : 'wrong') : ''}`}>
        <div className="prompt">
          {activeMode === 'pilih-romaji' || activeMode === 'ketik' ? (
            <div className="prompt-kana jp-hand">{k.char}</div>
          ) : activeMode === 'pilih-kana' ? (
            <div className="prompt-romaji">{k.romaji}</div>
          ) : (
            <button className="btn primary big-speak" onClick={() => speak(k.char)}>🔊 Putar suara</button>
          )}
        </div>

        {activeMode === 'ketik' ? (
          <form className="type-form" onSubmit={(e) => { e.preventDefault(); if (picked === null) answerKana(typed, typed, checkTyped(typed, k)); else next(); }}>
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
                  onClick={() => answerKana(o.char, o.romaji, o.char === k.char)}>
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
