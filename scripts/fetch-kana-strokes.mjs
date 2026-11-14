// Mengunduh data urutan goresan kana dari KanjiVG (CC BY-SA 3.0, Ulrich Apel)
// lalu meringkasnya ke src/data/kana-strokes.json
// Pakai: npm run fetch-strokes
import { writeFile } from 'node:fs/promises';

const ranges = [
  [0x3041, 0x3096], // hiragana
  [0x30a1, 0x30fa], // katakana
  [0x30fc, 0x30fc], // ー
];
const codes = ranges.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => a + i));

const out = {};
const miss = [];
await Promise.all(
  codes.map(async (cp) => {
    const name = cp.toString(16).padStart(5, '0') + '.svg';
    const res = await fetch(`https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${name}`);
    if (!res.ok) { miss.push(String.fromCodePoint(cp)); return; }
    const svg = await res.text();
    const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
    const nums = [...svg.matchAll(/matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)/g)].map((m) => [+m[1], +m[2]]);
    out[String.fromCodePoint(cp)] = { p: paths, n: nums };
  })
);
const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.codePointAt(0) - b.codePointAt(0)));
await writeFile(new URL('../src/data/kana-strokes.json', import.meta.url), JSON.stringify(sorted));
console.log(`OK: ${Object.keys(out).length}, tidak tersedia: ${miss.join(' ')}`);
