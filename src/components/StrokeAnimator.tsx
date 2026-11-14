import { useEffect, useRef, useState } from 'react';
import strokesData from '../data/kana-strokes.json';

const STROKES = strokesData as unknown as Record<string, { p: string[]; n: [number, number][] }>;

export function hasStrokes(text: string) {
  return [...text].every((ch) => STROKES[ch]);
}

/** Animasi urutan goresan (data KanjiVG). Mendukung gabungan seperti きゃ. */
export default function StrokeAnimator({ text, size = 200 }: { text: string; size?: number }) {
  const chars = [...text];
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const [showNums, setShowNums] = useState(true);
  const [playing, setPlaying] = useState(false);
  const anims = useRef<Animation[]>([]);

  const play = () => {
    anims.current.forEach((a) => a.cancel());
    anims.current = [];
    let delay = 200;
    svgRefs.current.forEach((svg) => {
      if (!svg) return;
      svg.querySelectorAll<SVGPathElement>('path.anim').forEach((path) => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        const duration = Math.max(350, len * 9);
        const a = path.animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration, delay, fill: 'both', easing: 'ease-in-out' },
        );
        anims.current.push(a);
        delay += duration + 180;
      });
    });
    setPlaying(true);
    const last = anims.current[anims.current.length - 1];
    if (last) last.onfinish = () => setPlaying(false);
  };

  useEffect(() => {
    const t = setTimeout(play, 150);
    return () => { clearTimeout(t); anims.current.forEach((a) => a.cancel()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!hasStrokes(text)) {
    return <div className="stroke-fallback jp-hand" style={{ fontSize: size * 0.6 }}>{text}</div>;
  }

  const each = chars.length > 1 ? size * 0.75 : size;
  return (
    <div className="stroke-box">
      <div className="stroke-row">
        {chars.map((ch, i) => {
          const d = STROKES[ch];
          return (
            <svg
              key={ch + i}
              ref={(el) => { svgRefs.current[i] = el; }}
              viewBox="0 0 109 109"
              width={each}
              height={each}
              className="stroke-svg"
              aria-label={`Urutan goresan ${ch}`}
            >
              <line x1="54.5" y1="4" x2="54.5" y2="105" className="guide" />
              <line x1="4" y1="54.5" x2="105" y2="54.5" className="guide" />
              {d.p.map((p, j) => <path key={'bg' + j} d={p} className="bg" />)}
              {d.p.map((p, j) => <path key={'a' + j} d={p} className="anim" />)}
              {showNums && d.n.map(([x, y], j) => (
                <text key={'n' + j} x={x} y={y} className="num">{j + 1}</text>
              ))}
            </svg>
          );
        })}
      </div>
      <div className="row gap-s center">
        <button className="btn small" onClick={play} disabled={playing}>
          {playing ? 'Memutar…' : '▶ Putar ulang'}
        </button>
        <label className="check small">
          <input type="checkbox" checked={showNums} onChange={(e) => setShowNums(e.target.checked)} /> Nomor goresan
        </label>
      </div>
    </div>
  );
}

export { STROKES };
