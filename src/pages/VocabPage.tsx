import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SpeakButton, VoiceNotice } from '../components/Speak';
import { VOCAB, VOCAB_CATS, type VocabCatId, type VocabItem } from '../data/vocab';
import { finishQuiz, markVocab, toggleVocab, useProgress } from '../lib/progress';
import { speak } from '../lib/speech';

type CatFilter = 'semua' | VocabCatId;
type TabMode = 'daftar' | 'flashcard' | 'kuis';

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export default function VocabPage() {
  const prog = useProgress();
  const vocabProg = prog.vocab ?? {};
  const [cat, setCat] = useState<CatFilter>('semua');
  const [tab, setTab] = useState<TabMode>('daftar');

  const masteredCount = useMemo(
    () => VOCAB.filter((v) => vocabProg[v.id]).length,
    [vocabProg],
  );

  const items = useMemo(
    () => (cat === 'semua' ? VOCAB : VOCAB.filter((v) => v.cat === cat)),
    [cat],
  );

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Kosakata & Ungkapan <span className="jp muted">ことば</span></h1>
          <p className="lead">
            Kosakata dasar selaras IRODORI A1 / JLPT N5 serta istilah kerja SMK & SSW. Dengarkan audio dan tandai yang sudah hafal.
          </p>
        </div>
        <div className="card mini-progress">
          <div className="muted small">Sudah hafal</div>
          <div className="big-num">{masteredCount}<span className="muted small">/{VOCAB.length}</span></div>
          <div className="bar"><div style={{ width: `${(masteredCount / VOCAB.length) * 100}%` }} /></div>
        </div>
      </header>

      <VoiceNotice />

      <div className="seg">
        <button className={cat === 'semua' ? 'active' : ''} onClick={() => setCat('semua')}>
          Semua
          <small>{VOCAB.length} kata</small>
        </button>
        {VOCAB_CATS.map((c) => (
          <button key={c.id} className={cat === c.id ? 'active' : ''} onClick={() => setCat(c.id)}>
            {c.label}
            <small>{c.desc}</small>
          </button>
        ))}
      </div>

      <div className="tabs vocab-tabs">
        <button className={tab === 'daftar' ? 'active' : ''} onClick={() => setTab('daftar')}>📋 Daftar Kata</button>
        <button className={tab === 'flashcard' ? 'active' : ''} onClick={() => setTab('flashcard')}>🃏 Flashcard</button>
        <button className={tab === 'kuis' ? 'active' : ''} onClick={() => setTab('kuis')}>🎯 Kuis Kosakata</button>
      </div>

      {tab === 'daftar' && <VocabList items={items} vocabProg={vocabProg} />}
      {tab === 'flashcard' && <FlashcardView key={cat} items={items} vocabProg={vocabProg} />}
      {tab === 'kuis' && <VocabQuiz key={cat} items={items} />}
    </div>
  );
}

function VocabList({ items, vocabProg }: { items: VocabItem[]; vocabProg: Record<string, boolean> }) {
  const [query, setQuery] = useState('');
  const [hideHint, setHideHint] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (v) =>
        v.jp.toLowerCase().includes(q) ||
        (v.kanji && v.kanji.toLowerCase().includes(q)) ||
        v.romaji.toLowerCase().includes(q) ||
        v.arti.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div>
      <div className="row between wrap gap-s toolbar">
        <input
          type="search"
          className="input vocab-search"
          placeholder="Cari kata Jepang, romaji, atau arti…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="check">
          <input type="checkbox" checked={hideHint} onChange={(e) => setHideHint(e.target.checked)} />
          Sembunyikan romaji & arti
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="card center-text muted">Tidak ada kata yang cocok dengan "{query}".</div>
      ) : (
        <div className="vocab-grid">
          {filtered.map((v) => {
            const known = !!vocabProg[v.id];
            return (
              <article key={v.id} className={`card vocab-card ${known ? 'known' : ''}`}>
                <div className="vocab-top">
                  <div>
                    <div className="vocab-jp jp-hand">{v.jp}</div>
                    {v.kanji && <div className="vocab-kanji jp muted small">Kanji: {v.kanji}</div>}
                  </div>
                  <SpeakButton text={v.jp} className="small" />
                </div>
                <div className={`vocab-hint ${hideHint ? 'blurred' : ''}`}>
                  <div className="vocab-romaji">{v.romaji}</div>
                  <div className="vocab-arti">{v.arti}</div>
                  {v.example && (
                    <div className="vocab-example">
                      <div className="vocab-ex-row">
                        <span className="jp">{v.example.jp}</span>
                        <SpeakButton text={v.example.jp} label="" className="tiny" />
                      </div>
                      <div className="vocab-ex-tr">
                        {v.example.romaji} — {v.example.arti}
                      </div>
                    </div>
                  )}
                </div>
                <div className="vocab-foot">
                  <button
                    className={`btn small ${known ? 'known-btn' : ''}`}
                    onClick={() => toggleVocab(v.id)}
                  >
                    {known ? '✔ Hafal' : 'Tandai hafal'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FlashcardView({ items, vocabProg }: { items: VocabItem[]; vocabProg: Record<string, boolean> }) {
  const [deck, setDeck] = useState<VocabItem[]>(items);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setDeck(items);
    setIdx(0);
    setFlipped(false);
  }, [items]);

  const card = deck[idx];
  if (!card) return null;

  const advance = (known?: boolean) => {
    if (known !== undefined) markVocab(card.id, known);
    setFlipped(false);
    setIdx((i) => (i + 1) % deck.length);
  };

  const reshuffle = () => {
    setDeck(shuffle(items));
    setIdx(0);
    setFlipped(false);
  };

  return (
    <div className="narrow fc-wrap">
      <div className="row between wrap gap-s toolbar">
        <span className="muted small">
          Kartu {idx + 1} dari {deck.length} {vocabProg[card.id] ? '· ✔ Sudah hafal' : ''}
        </span>
        <button className="btn small" onClick={reshuffle}>🔀 Acak</button>
      </div>

      <div
        className={`card flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
      >
        {!flipped ? (
          <div className="fc-face">
            <span className="pill">Ketuk kartu untuk lihat arti</span>
            <div className="fc-jp jp-hand">{card.jp}</div>
            <SpeakButton text={card.jp} label="Dengarkan" className="primary" />
          </div>
        ) : (
          <div className="fc-face">
            <div className="fc-jp-sm jp-hand">{card.jp}</div>
            {card.kanji && <div className="fc-kanji jp">{card.kanji}</div>}
            <div className="fc-romaji">{card.romaji}</div>
            <div className="fc-arti">{card.arti}</div>
            {card.example && (
              <div className="vocab-example fc-example">
                <div className="jp">{card.example.jp}</div>
                <div className="vocab-ex-tr">
                  {card.example.romaji} — {card.example.arti}
                </div>
              </div>
            )}
            <SpeakButton text={card.jp} label="Dengarkan" className="small" />
          </div>
        )}
      </div>

      <div className="row center gap-s wrap fc-actions">
        <button className="btn" onClick={() => { setFlipped(false); setIdx((i) => (i - 1 + deck.length) % deck.length); }}>
          ‹ Sebelumnya
        </button>
        <button className="btn danger" onClick={() => advance(false)}>
          Belum hafal
        </button>
        <button className="btn primary" onClick={() => advance(true)}>
          Sudah hafal ✔
        </button>
      </div>
    </div>
  );
}

interface VocabQ {
  item: VocabItem;
  options: VocabItem[];
}

interface VocabAns {
  item: VocabItem;
  givenId: string;
  correct: boolean;
}

function buildQuiz(pool: VocabItem[], n = 10): VocabQ[] {
  const chosen = shuffle(pool).slice(0, Math.min(n, pool.length));
  return chosen.map((item) => {
    const others = shuffle(VOCAB.filter((v) => v.id !== item.id && v.arti !== item.arti));
    const sameCat = others.filter((v) => v.cat === item.cat);
    const merged = [...sameCat, ...others.filter((v) => v.cat !== item.cat)].slice(0, 3);
    return { item, options: shuffle([item, ...merged]) };
  });
}

function VocabQuiz({ items }: { items: VocabItem[] }) {
  const [questions, setQuestions] = useState<VocabQ[]>(() => buildQuiz(items));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answers, setAnswers] = useState<VocabAns[]>([]);
  const [done, setDone] = useState(false);
  const pickedRef = useRef<string | null>(null);

  const restart = useCallback(() => {
    pickedRef.current = null;
    setQuestions(buildQuiz(items));
    setIdx(0);
    setPicked(null);
    setAnswers([]);
    setDone(false);
  }, [items]);

  const q = questions[idx];

  useEffect(() => {
    if (q && !done) {
      const t = setTimeout(() => speak(q.item.jp), 200);
      return () => clearTimeout(t);
    }
  }, [q, done]);

  const next = useCallback(() => {
    pickedRef.current = null;
    setPicked(null);
    setIdx((i) => {
      if (i + 1 >= questions.length) {
        setDone(true);
        return i;
      }
      return i + 1;
    });
  }, [questions.length]);

  const choose = (opt: VocabItem) => {
    if (!q || picked !== null) return;
    const isRight = opt.id === q.item.id;
    pickedRef.current = opt.id;
    setPicked(opt.id);
    markVocab(q.item.id, isRight);
    setAnswers((a) => [...a, { item: q.item, givenId: opt.id, correct: isRight }]);
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
        quizType: 'vocab',
        answers: answers.map((a) => ({ id: a.item.id, givenId: a.givenId })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (done) {
    const right = answers.filter((a) => a.correct).length;
    const pct = Math.round((right / answers.length) * 100);
    const wrong = answers.filter((a) => !a.correct).map((a) => a.item);
    return (
      <section className="card result narrow">
        <div className="result-emoji">{pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '📚'}</div>
        <h2>{pct === 100 ? 'Luar biasa! 完璧！' : pct >= 70 ? 'Bagus! よくできました！' : 'Terus latihan ya!'}</h2>
        <div className="big-num">{right} / {answers.length}</div>
        <div className="bar big"><div style={{ width: `${pct}%` }} /></div>
        {wrong.length > 0 && (
          <>
            <h3>Kata yang perlu diulang</h3>
            <div className="vocab-wrong-list">
              {wrong.map((w) => (
                <button key={w.id} className="wrong-item" onClick={() => speak(w.jp)}>
                  <span className="jp-hand">{w.jp}</span>
                  <small>{w.arti}</small>
                </button>
              ))}
            </div>
          </>
        )}
        <div className="row center gap-s wrap">
          <button className="btn primary" onClick={restart}>🔁 Kuis kosakata lagi</button>
        </div>
      </section>
    );
  }

  if (!q) return null;
  const isRight = picked === q.item.id;

  return (
    <div className="narrow">
      <div className="quiz-top">
        <div className="bar grow"><div style={{ width: `${(idx / questions.length) * 100}%` }} /></div>
        <span className="muted small">{idx + 1}/{questions.length}</span>
      </div>

      <section className={`card quiz-card ${picked !== null ? (isRight ? 'right' : 'wrong') : ''}`}>
        <div className="vocab-quiz-prompt">
          <div className="vocab-quiz-jp jp-hand">{q.item.jp}</div>
          {q.item.kanji && <div className="muted jp">{q.item.kanji}</div>}
          <SpeakButton text={q.item.jp} label="Dengarkan" className="small" />
        </div>

        <div className="options">
          {q.options.map((o, i) => {
            const state = picked === null ? '' : o.id === q.item.id ? 'right' : o.id === picked ? 'wrong' : 'dim';
            return (
              <button
                key={o.id}
                className={`option vocab-opt ${state}`}
                disabled={picked !== null}
                onClick={() => choose(o)}
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
              <>✔ Benar! ({q.item.romaji})</>
            ) : (
              <>
                ✘ Jawaban benar: <strong>{q.item.arti}</strong> <span className="muted">({q.item.romaji})</span>
                <button className="btn primary" onClick={next}>Lanjut →</button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
