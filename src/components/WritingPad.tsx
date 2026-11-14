import { useEffect, useRef, useState } from 'react';
import { STROKES } from './StrokeAnimator';

/** Kanvas latihan menulis dengan jari / mouse, dengan huruf panduan samar. */
export default function WritingPad({ text, size = 260 }: { text: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [guide, setGuide] = useState(true);
  const drawing = useRef(false);
  const last = useRef<[number, number] | null>(null);
  const chars = [...text];
  const w = size * Math.max(1, chars.length * 0.85);
  const h = size;

  const drawGuide = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    // garis bantu
    ctx.strokeStyle = '#e8dccd';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1;
    const cell = w / chars.length;
    chars.forEach((_, i) => {
      ctx.beginPath(); ctx.moveTo(cell * i + cell / 2, 0); ctx.lineTo(cell * i + cell / 2, h); ctx.stroke();
      if (i > 0) { ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(cell * i, 0); ctx.lineTo(cell * i, h); ctx.stroke(); ctx.setLineDash([6, 6]); }
    });
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.setLineDash([]);
    if (!guide) return;
    chars.forEach((ch, i) => {
      const d = STROKES[ch];
      if (d) {
        const s = Math.min(cell, h) / 109;
        ctx.save();
        ctx.translate(cell * i + (cell - 109 * s) / 2, (h - 109 * s) / 2);
        ctx.scale(s, s);
        ctx.strokeStyle = '#d9d2ea';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        d.p.forEach((p) => ctx.stroke(new Path2D(p)));
        ctx.restore();
      } else {
        ctx.fillStyle = '#e4def0';
        ctx.font = `${h * 0.7}px "Klee One", "Noto Sans JP", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ch, cell * i + cell / 2, h / 2);
      }
    });
  };

  useEffect(() => {
    const cv = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    cv.width = w * dpr;
    cv.height = h * dpr;
    drawGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, guide, w, h]);

  const pos = (e: React.PointerEvent): [number, number] => {
    const r = canvasRef.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * w, ((e.clientY - r.top) / r.height) * h];
  };

  const down = (e: React.PointerEvent) => {
    e.preventDefault();
    canvasRef.current!.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = pos(e);
    ctx.strokeStyle = '#1e2a5a';
    ctx.lineWidth = Math.max(6, h / 30);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(...last.current);
    ctx.lineTo(...p);
    ctx.stroke();
    last.current = p;
  };
  const up = () => { drawing.current = false; last.current = null; };

  return (
    <div className="pad-box">
      <canvas
        ref={canvasRef}
        className="pad"
        style={{ width: '100%', maxWidth: w, aspectRatio: `${w} / ${h}` }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      />
      <div className="row gap-s center">
        <button className="btn small" onClick={drawGuide}>🧽 Hapus</button>
        <label className="check small">
          <input type="checkbox" checked={guide} onChange={(e) => setGuide(e.target.checked)} /> Tampilkan panduan
        </label>
      </div>
    </div>
  );
}
