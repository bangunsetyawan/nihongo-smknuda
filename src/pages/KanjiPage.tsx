import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SpeakButton, VoiceNotice } from '../components/Speak';
import { KANJI_LIST, type KanjiItem, type KanjiLevel } from '../data/kanji';
import { finishQuiz, mastery, recordKanjiAnswer, useProgress } from '../lib/progress';
import { speak } from '../lib/speech';

type LevelFilter = 'semua' | KanjiLevel;
type TabMode = 'daftar' | 'kuis';
type QuizMode = 'arti-to-kanji' | 'kanji-to-arti' | 'kanji-to-reading';

interface KanjiQuestion {
  kanji: KanjiItem;
  options: KanjiItem[];
}

interface KanjiQuizAnswer {
  kanji: KanjiItem;
  given: string;
  correct: boolean;
  mode: QuizMode;
}

function formatKanjiReading(k: KanjiItem): string {
  const parts: string[] = [];
  if (k.onyomi.length) parts.push(k.onyomi.slice(0, 2).join('・'));
  if (k.kunyomi.length) parts.push(k.kunyomi.slice(0, 2).join('・'));
  return parts.join(' / ') || '-';
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export default function KanjiPage() {
  const prog = useProgress();
  const kanjiProg = prog.kanji ?? {};
  const [level, setLevel] = useState<LevelFilter>('N5');
  const [tab, setTab] = useState<TabMode>('daftar');
  const [selected, setSelected] = useState<KanjiItem | null>(null);
  const [focusChar, setFocusChar] = useState<string | null>(null);

  const n5Items = useMemo(() => KANJI_LIST.filter((k) => k.level === 'N5'), []);
  const n4Items = useMemo(() => KANJI_LIST.filter((k) => k.level === 'N4'), []);
  const n5Mastered = useMemo(() => n5Items.filter((k) => mastery(kanjiProg[k.char]) === 3).length, [n5Items, kanjiProg]);
  const n4Mastered = useMemo(() => n4Items.filter((k) => mastery(kanjiProg[k.char]) === 3).length, [n4Items, kanjiProg]);

  const items = useMemo(
    () => (level === 'semua' ? KANJI_LIST : KANJI_LIST.filter((k) => k.level === level)),
    [level],
  );

  const practiceSingle = (item: KanjiItem) => {
    setSelected(null);
    setLevel(item.level);
    setFocusChar(item.char);
    setTab('kuis');
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Kanji N5 &amp; N4 <span className="jp muted">漢字</span></h1>
          <p className="lead">
            {n5Items.length} Kanji JLPT N5 dan {n4Items.length} Kanji JLPT N4 lengkap dengan onyomi, kunyomi, dan contoh kata.
          </p>
        </div>
        <div className="card mini-progress">
          <div className="muted small">Kanji dikuasai</div>
          <div className="big-num">
            {n5Mastered + n4Mastered}<span className="muted small">/{KANJI_LIST.length}</span>
          </div>
          <div className="muted small">N5: {n5Mastered}/{n5Items.length} · N4: {n4Mastered}/{n4Items.length}</div>
        </div>
      </header>

      <VoiceNotice />

      <div className="seg">
        <button className={level === 'N5' ? 'active' : ''} onClick={() => setLevel('N5')}>
          JLPT N5
          <small>{n5Mastered}/{n5Items.length} hafal</small>
        </button>
        <button className={level === 'N4' ? 'active' : ''} onClick={() => setLevel('N4')}>
          JLPT N4
          <small>{n4Mastered}/{n4Items.length} hafal</small>
        </button>
        <button className={level === 'semua' ? 'active' : ''} onClick={() => setLevel('semua')}>
          Semua
          <small>{KANJI_LIST.length} kanji</small>
        </button>
      </div>

      <div className="tabs vocab-tabs">
        <button className={tab === 'daftar' ? 'active' : ''} onClick={() => { setTab('daftar'); setFocusChar(null); }}>
          📋 Daftar Kanji
        </button>
        <button className={tab === 'kuis' ? 'active' : ''} onClick={() => setTab('kuis')}>
          🎯 Kuis Kanji
        </button>
      </div>

      {tab === 'daftar' ? (
        <KanjiGrid items={items} kanjiProg={kanjiProg} onSelect={setSelected} />
      ) : (
        <KanjiQuizView
          key={`${level}:${focusChar ?? ''}`}
          items={items}
          kanjiProg={kanjiProg}
          focusChar={focusChar}
          onClearFocus={() => setFocusChar(null)}
        />
      )}

      {selected && (
        <div className="modal-bg" onClick={() => setSelected(null)}>
          <div className="modal kanji-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)} aria-label="Tutup">✕</button>
            <div className="row between gap-s wrap">
              <span className="pill">{selected.level}</span>
              <span className="muted small">{selected.strokes} goresan</span>
            </div>
            <div className="modal-char jp-hand">{selected.char}</div>
            <h2 className="center-text" style={{ marginTop: 0 }}>{selected.arti}</h2>
            <div className="kanji-readings">
              <div>
                <span className="muted small">Onyomi (音読み)</span>
                <div className="jp"><strong>{selected.onyomi.length ? selected.onyomi.join('、') : '—'}</strong></div>
              </div>
              <div>
                <span className="muted small">Kunyomi (訓読み)</span>
                <div className="jp"><strong>{selected.kunyomi.length ? selected.kunyomi.join('、') : '—'}</strong></div>
              </div>
            </div>

            <div className="kanji-examples">
              <div className="muted small" style={{ marginBottom: '.4rem' }}>Contoh Kata</div>
              {selected.examples.map((ex) => (
                <div key={ex.word} className="kanji-ex-row">
                  <div>
                    <strong className="jp">{ex.word}</strong>{' '}
                    <span className="muted jp">({ex.reading})</span>
                    <div className="small muted">{ex.arti}</div>
                  </div>
                  <SpeakButton text={ex.word} className="small" />
                </div>
              ))}
            </div>

            <div className="row gap-s center wrap" style={{ marginTop: '1rem' }}>
              <SpeakButton text={selected.examples[0]?.word ?? selected.char} label="Dengar Contoh" />
              <button type="button" className="btn primary" onClick={() => practiceSingle(selected)}>
                🎯 Latih kanji ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KanjiGrid({
  items,
  kanjiProg,
  onSelect,
}: {
  items: KanjiItem[];
  kanjiProg: Record<string, { c: number; w: number; s: number; t: number }>;
  onSelect: (item: KanjiItem) => void;
}) {
  const [query, setQuery] = useState('');
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'unlearned' | 'learning' | 'mastered'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((k) => {
      const m = mastery(kanjiProg[k.char]);
      if (masteryFilter === 'unlearned' && m !== 0) return false;
      if (masteryFilter === 'learning' && (m === 0 || m === 3)) return false;
      if (masteryFilter === 'mastered' && m !== 3) return false;
      if (!q) return true;
      return (
        k.char.includes(q) ||
        k.arti.toLowerCase().includes(q) ||
        k.onyomi.some((r) => r.toLowerCase().includes(q)) ||
        k.kunyomi.some((r) => r.toLowerCase().includes(q)) ||
        k.examples.some((ex) => ex.word.includes(q) || ex.reading.includes(q) || ex.arti.toLowerCase().includes(q))
      );
    });
  }, [items, query, masteryFilter, kanjiProg]);

  return (
    <div>
      <div className="row between wrap gap-s toolbar">
        <input
          type="search"
          className="input vocab-search"
          placeholder="Cari kanji, arti, bacaan (hiragana/katakana), atau contoh kata…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="row gap-s wrap">
          {([
            ['all', 'Semua'],
            ['unlearned', 'Belum'],
            ['learning', 'Diproses'],
            ['mastered', 'Hafal'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`btn small ${masteryFilter === id ? 'primary' : ''}`}
              onClick={() => setMasteryFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card center-text muted">Tidak ada kanji yang cocok dengan pencarianmu.</div>
      ) : (
        <div className="kanji-grid">
          {filtered.map((k) => {
            const m = mastery(kanjiProg[k.char]);
            const readingShort = k.kunyomi[0] || k.onyomi[0] || '-';
            return (
              <button
                key={k.char}
                type="button"
                className={`card kanji-card m-${m}`}
                onClick={() => onSelect(k)}
              >
                <span className="kanji-badge">{k.level}</span>
                <div className="kanji-char jp-hand">{k.char}</div>
                <div className="kanji-arti">{k.arti}</div>
                <div className="kanji-read jp muted small">{readingShort}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KanjiQuizView({
  items,
  kanjiProg,
  focusChar,
  onClearFocus,
}: {
  items: KanjiItem[];
  kanjiProg: Record<string, { c: number; w: number; s: number; t: number }>;
  focusChar: string | null;
  onClearFocus: () => void;
}) {
  const [mode, setMode] = useState<QuizMode>('arti-to-kanji');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<KanjiQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answers, setAnswers] = useState<KanjiQuizAnswer[]>([]);
  const [done, setDone] = useState(false);
  const pickedRef = useRef<string | null>(null);

  const buildQuestions = useCallback((source: KanjiItem[], n: number, priorityChar?: string | null): KanjiQuestion[] => {
    const weight = (k: KanjiItem) => [3, 4, 2, 1][mastery(kanjiProg[k.char])];
    const chosen: KanjiItem[] = [];
    let bag = [...source];
    if (priorityChar) {
      const idxP = bag.findIndex((x) => x.char === priorityChar);
      if (idxP >= 0) chosen.push(bag.splice(idxP, 1)[0]);
    }
    while (chosen.length < n && source.length) {
      if (!bag.length) bag = [...source];
      const total = bag.reduce((s, k) => s + weight(k), 0);
      let r = Math.random() * total;
      const i = bag.findIndex((k) => (r -= weight(k)) <= 0);
      chosen.push(bag.splice(i < 0 ? 0 : i, 1)[0]);
    }
    return chosen.map((k) => {
      const readingKey = formatKanjiReading(k);
      const others = shuffle(
        KANJI_LIST.filter(
          (o) =>
            o.char !== k.char &&
            o.arti !== k.arti &&
            formatKanjiReading(o) !== readingKey &&
            (o.level === k.level || source.length < 10),
        ),
      ).slice(0, 3);
      return { kanji: k, options: shuffle([k, ...others]) };
    });
  }, [kanjiProg]);

  const start = useCallback((priority?: string | null) => {
    const n = priority ? Math.min(8, items.length) : Math.min(count, items.length);
    setQuestions(buildQuestions(items, n, priority));
    setIdx(0);
    setPicked(null);
    pickedRef.current = null;
    setAnswers([]);
    setDone(false);
  }, [buildQuestions, count, items]);

  useEffect(() => {
    if (focusChar && !questions) {
      start(focusChar);
    }
  }, [focusChar, questions, start]);

  const q = questions?.[idx];

  const next = useCallback(() => {
    pickedRef.current = null;
    setPicked(null);
    setIdx((i) => {
      if (questions && i + 1 >= questions.length) {
        setDone(true);
        return i;
      }
      return i + 1;
    });
  }, [questions]);

  const answer = (opt: KanjiItem) => {
    if (!q || picked !== null) return;
    const isRight = opt.char === q.kanji.char;
    const given =
      mode === 'arti-to-kanji'
        ? opt.char
        : mode === 'kanji-to-reading'
          ? formatKanjiReading(opt)
          : opt.arti;
    pickedRef.current = opt.char;
    setPicked(opt.char);
    recordKanjiAnswer(q.kanji.char, given, mode, isRight);
    setAnswers((a) => [...a, { kanji: q.kanji, given, correct: isRight, mode }]);
    if (isRight) {
      setTimeout(() => {
        if (pickedRef.current !== null) next();
      }, 900);
    }
  };

  useEffect(() => {
    if (done && answers.length) {
      const right = answers.filter((a) => a.correct).length;
      finishQuiz(right === answers.length ? 50 : 10, {
        quizType: 'kanji',
        answers: answers.map((a) => ({ char: a.kanji.char, given: a.given, mode: a.mode })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (!questions) {
    return (
      <section className="card form narrow">
        <h3>Mode Kuis Kanji</h3>
        <div className="choice-grid">
          <button
            type="button"
            className={`choice ${mode === 'arti-to-kanji' ? 'active' : ''}`}
            onClick={() => setMode('arti-to-kanji')}
          >
            <strong>Arti → Kanji</strong>
            <small>Lihat arti Indonesia, pilih huruf kanji</small>
          </button>
          <button
            type="button"
            className={`choice ${mode === 'kanji-to-arti' ? 'active' : ''}`}
            onClick={() => setMode('kanji-to-arti')}
          >
            <strong>Kanji → Arti</strong>
            <small>Lihat kanji, pilih arti yang tepat</small>
          </button>
          <button
            type="button"
            className={`choice ${mode === 'kanji-to-reading' ? 'active' : ''}`}
            onClick={() => setMode('kanji-to-reading')}
          >
            <strong>Kanji → Bacaan</strong>
            <small>Lihat kanji, pilih onyomi / kunyomi</small>
          </button>
        </div>

        <h3>Jumlah Soal</h3>
        <div className="choice-row">
          {[5, 10, 20].map((n) => (
            <button key={n} type="button" className={`choice ${count === n ? 'active' : ''}`} onClick={() => setCount(n)}>
              {n} soal
            </button>
          ))}
        </div>

        <button type="button" className="btn primary big" onClick={() => start(null)}>
          Mulai Kuis Kanji ({items.length} kanji tersedia) →
        </button>
      </section>
    );
  }

  if (done) {
    const right = answers.filter((a) => a.correct).length;
    const pct = Math.round((right / answers.length) * 100);
    const wrong = [...new Map(answers.filter((a) => !a.correct).map((a) => [a.kanji.char, a.kanji])).values()];
    return (
      <section className="card result narrow">
        <div className="result-emoji">{pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '📚'}</div>
        <h2>{pct === 100 ? 'Hebat sekali! 漢字マスター！' : pct >= 70 ? 'Bagus! Teruskan!' : 'Ayo ulangi lagi!'}</h2>
        <div className="big-num">{right} / {answers.length}</div>
        <div className="bar big"><div style={{ width: `${pct}%` }} /></div>
        <p className="muted">+{answers.reduce((s, a) => s + (a.correct ? 10 : 1), 0) + (pct === 100 ? 50 : 10)} XP</p>
        {wrong.length > 0 && (
          <>
            <h3>Kanji yang perlu diulang</h3>
            <div className="wrong-list">
              {wrong.map((k) => (
                <button key={k.char} type="button" className="wrong-item" onClick={() => speak(k.examples[0]?.word ?? k.char)}>
                  <span className="jp-hand">{k.char}</span>
                  <small>{k.arti}</small>
                </button>
              ))}
            </div>
          </>
        )}
        <div className="row center gap-s wrap">
          <button type="button" className="btn primary" onClick={() => start(null)}>🔁 Kuis lagi</button>
          <button type="button" className="btn" onClick={() => { setQuestions(null); onClearFocus(); }}>Ubah mode</button>
        </div>
      </section>
    );
  }

  if (!q) return null;
  const k = q.kanji;
  const isRight = picked === k.char;

  return (
    <div className="narrow">
      <div className="quiz-top">
        <button type="button" className="btn small" onClick={() => { setQuestions(null); onClearFocus(); }}>✕ Keluar</button>
        <div className="bar grow"><div style={{ width: `${(idx / questions.length) * 100}%` }} /></div>
        <span className="muted small">{idx + 1}/{questions.length}</span>
      </div>

      <section className={`card quiz-card ${picked !== null ? (isRight ? 'right' : 'wrong') : ''}`}>
        <div className="prompt">
          {mode === 'arti-to-kanji' ? (
            <>
              <span className="pill">{k.level}</span>
              <div className="prompt-arti">{k.arti}</div>
            </>
          ) : (
            <>
              <div className="prompt-kana jp-hand">{k.char}</div>
              <div className="muted small">Pilih {mode === 'kanji-to-reading' ? 'bacaan (on / kun)' : 'arti yang tepat'}</div>
            </>
          )}
        </div>

        <div className="options">
          {q.options.map((o, i) => {
            const state = picked === null ? '' : o.char === k.char ? 'right' : o.char === picked ? 'wrong' : 'dim';
            const label =
              mode === 'arti-to-kanji'
                ? o.char
                : mode === 'kanji-to-reading'
                  ? formatKanjiReading(o)
                  : o.arti;
            return (
              <button
                key={o.char}
                type="button"
                className={`option ${mode === 'arti-to-kanji' ? '' : 'vocab-opt'} ${state}`}
                disabled={picked !== null}
                onClick={() => answer(o)}
              >
                <span className="opt-num">{i + 1}</span>
                <span className={mode === 'arti-to-kanji' ? 'jp-hand opt-kana' : mode === 'kanji-to-reading' ? 'jp' : ''}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className={`feedback ${isRight ? 'ok' : 'no'}`}>
            {isRight ? (
              <>✔ Benar! <span className="jp">{k.char}</span> = <strong>{k.arti}</strong> ({formatKanjiReading(k)})</>
            ) : (
              <>
                ✘ Jawaban benar: <span className="jp-hand fb-kana">{k.char}</span> = <strong>{k.arti}</strong> ({formatKanjiReading(k)})
                <button type="button" className="btn primary" onClick={next}>Lanjut →</button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
