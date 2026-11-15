import { useMemo, useState } from 'react';
import { SpeakButton, VoiceNotice } from '../components/Speak';
import { BUNPOU_LIST, type BunpouPoint } from '../data/bunpou';
import { recordBunpouAnswer, useProgress } from '../lib/progress';

export default function BunpouPage() {
  const prog = useProgress();
  const bunpouProg = prog.bunpou ?? {};
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'N5' | 'N4'>('ALL');
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<BunpouPoint | null>(null);
  const [quizTopic, setQuizTopic] = useState<BunpouPoint | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUNPOU_LIST.filter((b) => {
      if (levelFilter !== 'ALL' && b.level !== levelFilter) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.pattern.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q)
      );
    });
  }, [levelFilter, query]);

  const completedTopics = useMemo(
    () => BUNPOU_LIST.filter((b) => (bunpouProg[b.id]?.c ?? 0) > 0).length,
    [bunpouProg],
  );

  if (quizTopic) {
    return (
      <div className="page narrow">
        <BunpouQuiz
          topic={quizTopic}
          onBack={() => {
            setActiveTopic(quizTopic);
            setQuizTopic(null);
          }}
        />
      </div>
    );
  }

  if (activeTopic) {
    const st = bunpouProg[activeTopic.id];
    return (
      <div className="page narrow">
        <div className="row between wrap gap-s" style={{ marginBottom: '1rem' }}>
          <button type="button" className="btn small" onClick={() => setActiveTopic(null)}>
            ← Semua Tata Bahasa
          </button>
          <span className="pill">{activeTopic.level}</span>
        </div>

        <article className="card">
          <div className="row between wrap gap-s">
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{activeTopic.title}</h1>
            {st && st.c > 0 && <span className="pill" style={{ background: 'var(--ok-soft)', color: 'var(--ok)' }}>{st.c} benar</span>}
          </div>

          <div className="bunpou-pattern jp" style={{ marginTop: '.85rem' }}>
            {activeTopic.pattern}
          </div>

          <p style={{ marginTop: '1rem' }}>{activeTopic.explanation}</p>

          <h3 style={{ marginTop: '1.25rem' }}>Contoh Kalimat</h3>
          <div className="bunpou-examples">
            {activeTopic.examples.map((ex, i) => (
              <div key={i} className="bunpou-ex-card">
                <div className="grow">
                  <div className="jp" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{ex.jp}</div>
                  <div className="muted small">{ex.romaji}</div>
                  <div style={{ marginTop: '.15rem' }}>{ex.arti}</div>
                </div>
                <SpeakButton text={ex.jp} className="small" />
              </div>
            ))}
          </div>

          <div className="row gap-s wrap" style={{ marginTop: '1.25rem' }}>
            <button type="button" className="btn primary big" onClick={() => setQuizTopic(activeTopic)}>
              🎯 Kuis poin ini ({activeTopic.questions.length} soal) →
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Tata Bahasa Dasar <span className="jp muted">文法</span></h1>
          <p className="lead">
            {BUNPOU_LIST.length} pola tata bahasa inti JLPT N5 &amp; N4 untuk percakapan sekolah dan kerja di Jepang.
          </p>
        </div>
        <div className="card mini-progress">
          <div className="muted small">Poin dipelajari</div>
          <div className="big-num">{completedTopics}<span className="muted small">/{BUNPOU_LIST.length}</span></div>
          <div className="bar"><div style={{ width: `${(completedTopics / BUNPOU_LIST.length) * 100}%` }} /></div>
        </div>
      </header>

      <VoiceNotice />

      <div className="row between wrap gap-s toolbar">
        <input
          type="search"
          className="input vocab-search"
          placeholder="Cari pola tata bahasa (mis. たい, て, partikel)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="row gap-s">
          {(['ALL', 'N5', 'N4'] as const).map((lv) => (
            <button
              key={lv}
              type="button"
              className={`btn small ${levelFilter === lv ? 'primary' : ''}`}
              onClick={() => setLevelFilter(lv)}
            >
              {lv === 'ALL' ? 'Semua' : lv}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card center-text muted">Tidak ada poin tata bahasa yang cocok.</div>
      ) : (
        <div className="bunpou-grid">
          {filtered.map((b, idx) => {
            const st = bunpouProg[b.id];
            return (
              <button
                key={b.id}
                type="button"
                className="card bunpou-card"
                onClick={() => setActiveTopic(b)}
              >
                <div className="row between gap-s">
                  <span className="pill">{b.level} · #{idx + 1}</span>
                  {st && st.c > 0 && (
                    <span className="small" style={{ color: 'var(--ok)', fontWeight: 700 }}>
                      ✔ {st.c} benar
                    </span>
                  )}
                </div>
                <h3>{b.title}</h3>
                <div className="bunpou-pattern-mini jp">{b.pattern}</div>
                <p className="muted small" style={{ margin: 0 }}>{b.summary}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BunpouQuiz({ topic, onBack }: { topic: BunpouPoint; onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = topic.questions[idx];
  const isRight = picked !== null && picked === q.answerIndex;

  const choose = (optIdx: number) => {
    if (picked !== null) return;
    const ok = optIdx === q.answerIndex;
    setPicked(optIdx);
    if (ok) setScore((s) => s + 1);
    recordBunpouAnswer(topic.id, q.id, q.options[optIdx], ok);
  };

  const next = () => {
    if (idx + 1 >= topic.questions.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / topic.questions.length) * 100);
    return (
      <section className="card result">
        <div className="result-emoji">{pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '📘'}</div>
        <h1>{pct === 100 ? 'Sempurna! すごい！' : pct >= 70 ? 'Bagus! Paham polanya!' : 'Ayo baca ulang penjelasannya!'}</h1>
        <div className="big-num">{score} / {topic.questions.length}</div>
        <div className="bar big"><div style={{ width: `${pct}%` }} /></div>
        <p className="muted">{topic.title}</p>
        <div className="row center gap-s wrap">
          <button type="button" className="btn primary" onClick={restart}>🔁 Ulangi Kuis</button>
          <button type="button" className="btn" onClick={onBack}>← Kembali ke Materi</button>
        </div>
      </section>
    );
  }

  return (
    <div>
      <div className="quiz-top">
        <button type="button" className="btn small" onClick={onBack}>← Materi</button>
        <div className="bar grow"><div style={{ width: `${(idx / topic.questions.length) * 100}%` }} /></div>
        <span className="muted small">{idx + 1}/{topic.questions.length}</span>
      </div>

      <section className={`card quiz-card ${picked !== null ? (isRight ? 'right' : 'wrong') : ''}`}>
        <div className="muted small">{topic.title}</div>
        <div className="bunpou-q-sentence jp">{q.sentence}</div>

        <div className="options">
          {q.options.map((opt, i) => {
            const state = picked === null ? '' : i === q.answerIndex ? 'right' : i === picked ? 'wrong' : 'dim';
            return (
              <button
                key={i}
                type="button"
                className={`option vocab-opt ${state}`}
                disabled={picked !== null}
                onClick={() => choose(i)}
              >
                <span className="opt-num">{i + 1}</span>
                <span className="jp">{opt}</span>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className={`feedback ${isRight ? 'ok' : 'no'}`}>
            <div>
              <strong>{isRight ? '✔ Benar!' : `✘ Jawaban benar: ${q.options[q.answerIndex]}`}</strong>
              <p className="small" style={{ margin: '.25rem 0 0' }}>{q.explanation}</p>
            </div>
            <button type="button" className="btn primary" onClick={next}>
              {idx + 1 >= topic.questions.length ? 'Lihat Hasil →' : 'Lanjut →'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
