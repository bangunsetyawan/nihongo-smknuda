import { useEffect, useState } from 'react';
import { EXAMPLES, type Kana } from '../data/kana';
import { mastery, useProgress } from '../lib/progress';
import { speak } from '../lib/speech';
import StrokeAnimator from './StrokeAnimator';
import WritingPad from './WritingPad';
import { SpeakButton } from './Speak';

const MASTERY_LABEL = ['Belum dilatih', 'Perlu latihan', 'Mulai hafal', 'Sudah hafal'];

export default function KanaModal({
  list, index, onClose, onIndex,
}: { list: Kana[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const kana = list[index];
  const [tab, setTab] = useState<'goresan' | 'tulis'>('goresan');
  const prog = useProgress();
  const ex = EXAMPLES[kana.char];
  const st = prog.kana[kana.char];
  const m = mastery(st);

  useEffect(() => { speak(kana.char); }, [kana.char]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % list.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + list.length) % list.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [index, list.length, onClose, onIndex]);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-x" onClick={onClose} aria-label="Tutup">✕</button>

        <div className="modal-head">
          <button className="btn icon" onClick={() => onIndex((index - 1 + list.length) % list.length)} aria-label="Sebelumnya">‹</button>
          <div className="big-kana-wrap">
            <div className="big-kana jp-hand">{kana.char}</div>
            <div className="big-romaji">{kana.romaji}</div>
          </div>
          <button className="btn icon" onClick={() => onIndex((index + 1) % list.length)} aria-label="Berikutnya">›</button>
        </div>

        <div className="row gap-s center wrap">
          <SpeakButton text={kana.char} label="Dengarkan" className="primary" />
          <span className={`pill m${m}`}>{MASTERY_LABEL[m]}{st ? ` · ${st.c}✔ ${st.w}✘` : ''}</span>
        </div>

        {ex && (
          <div className="example">
            <div>
              <span className="jp ex-word">{ex.word}</span>
              <span className="muted"> · {ex.romaji}</span>
            </div>
            <div className="ex-arti">{ex.arti}</div>
            {!ex.word.startsWith('(') && <SpeakButton text={ex.word} className="small" />}
          </div>
        )}

        <div className="tabs">
          <button className={tab === 'goresan' ? 'active' : ''} onClick={() => setTab('goresan')}>Urutan goresan</button>
          <button className={tab === 'tulis' ? 'active' : ''} onClick={() => setTab('tulis')}>✍ Latihan menulis</button>
        </div>
        <div className="tab-body">
          {tab === 'goresan' ? <StrokeAnimator text={kana.char} size={190} /> : <WritingPad text={kana.char} size={230} />}
        </div>
      </div>
    </div>
  );
}
