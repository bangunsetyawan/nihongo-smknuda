import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import KanaModal from '../components/KanaModal';
import { VoiceNotice } from '../components/Speak';
import { allKana, grid, GROUPS, SCRIPT_INFO, type GroupId, type Script } from '../data/kana';
import { mastery, useProgress } from '../lib/progress';

const HEAD: Record<GroupId, string[]> = {
  dasar: ['a', 'i', 'u', 'e', 'o'],
  dakuten: ['a', 'i', 'u', 'e', 'o'],
  yoon: ['ya', 'yu', 'yo'],
  tambahan: [],
};

export default function KanaPage({ script }: { script: Script }) {
  const info = SCRIPT_INFO[script];
  const groups = GROUPS.filter((g) => script === 'katakana' || g.id !== 'tambahan');
  const [group, setGroup] = useState<GroupId>('dasar');
  const [hideRomaji, setHideRomaji] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const prog = useProgress();

  const rows = useMemo(() => grid(script, group), [script, group]);
  const flat = useMemo(() => rows.flatMap((r) => r.cells.filter((c) => !!c)) as NonNullable<(typeof rows)[number]['cells'][number]>[], [rows]);
  const all = useMemo(() => allKana(script), [script]);
  const mastered = all.filter((k) => mastery(prog.kana[k.char]) === 3).length;
  const cols = group === 'tambahan' ? Math.max(...rows.map((r) => r.cells.length)) : HEAD[group].length;

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>{info.title} <span className="jp muted">{info.jp}</span></h1>
          <p className="lead">{info.desc}</p>
        </div>
        <div className="card mini-progress">
          <div className="muted small">Sudah hafal</div>
          <div className="big-num">{mastered}<span className="muted small">/{all.length}</span></div>
          <div className="bar"><div style={{ width: `${(mastered / all.length) * 100}%` }} /></div>
        </div>
      </header>

      <VoiceNotice />

      <div className="seg">
        {groups.map((g) => (
          <button key={g.id} className={group === g.id ? 'active' : ''} onClick={() => setGroup(g.id)}>
            {g.label}
            <small>{g.desc}</small>
          </button>
        ))}
      </div>

      <div className="row between wrap gap-s toolbar">
        <label className="check">
          <input type="checkbox" checked={hideRomaji} onChange={(e) => setHideRomaji(e.target.checked)} />
          Sembunyikan romaji (uji diri)
        </label>
        <Link className="btn primary" to={`/kuis?script=${script}&groups=${group}`}>🎯 Kuis bagian ini</Link>
      </div>

      <div className="kana-grid" style={{ gridTemplateColumns: `2.6rem repeat(${cols}, 1fr)` }}>
        <div />
        {group !== 'tambahan' && HEAD[group].map((h) => <div key={h} className="grid-head">{h}</div>)}
        {group === 'tambahan' && Array.from({ length: cols }, (_, i) => <div key={i} />)}
        {rows.map((r) => (
          <Row key={r.row} label={r.row} cells={r.cells} cols={cols} hideRomaji={hideRomaji}
            onPick={(char) => setOpen(flat.findIndex((k) => k.char === char))} prog={prog.kana} />
        ))}
      </div>

      <div className="legend">
        <span><i className="m0" /> Belum dilatih</span>
        <span><i className="m1" /> Perlu latihan</span>
        <span><i className="m2" /> Mulai hafal</span>
        <span><i className="m3" /> Sudah hafal (5× benar berturut-turut)</span>
      </div>
      <p className="muted small">Ketuk sebuah huruf untuk mendengar bunyinya, melihat urutan goresan, dan latihan menulis.</p>

      {open !== null && open >= 0 && (
        <KanaModal list={flat} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}

function Row({ label, cells, cols, hideRomaji, onPick, prog }: {
  label: string;
  cells: ({ char: string; romaji: string } | null)[];
  cols: number;
  hideRomaji: boolean;
  onPick: (c: string) => void;
  prog: Record<string, import('../lib/progress').KanaStat>;
}) {
  const padded = [...cells, ...Array(Math.max(0, cols - cells.length)).fill(null)];
  return (
    <>
      <div className="grid-row-label">{label}</div>
      {padded.map((c, i) =>
        c ? (
          <button key={i} className={`kana-cell m${mastery(prog[c.char])}`} onClick={() => onPick(c.char)}>
            <span className="jp-hand kc-char">{c.char}</span>
            <span className={`kc-romaji ${hideRomaji ? 'hidden' : ''}`}>{c.romaji}</span>
          </button>
        ) : <div key={i} className="kana-cell empty" />,
      )}
    </>
  );
}
