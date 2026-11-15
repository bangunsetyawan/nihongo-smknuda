import { toKatakana, toRomaji } from 'wanakana';

/**
 * Mengonversi nama panggilan Indonesia/Latin menjadi tulisan Katakana Jepang yang rapi
 * beserta bacaan Romaji-nya.
 */
export function convertToJapaneseName(raw: string): { katakana: string; romaji: string } {
  const clean = raw.trim().toLowerCase().replace(/[^a-z\s'-]/g, '');
  if (!clean) return { katakana: '', romaji: '' };

  const words = clean.split(/\s+/).filter(Boolean);
  const convertedWords = words.map((word) => {
    let w = word
      .replace(/sy/g, 'sh')
      .replace(/ny/g, 'ny')
      .replace(/kh/g, 'h')
      .replace(/c(?=[aeiou])/g, 'ch')
      .replace(/v/g, 'b');

    // Pecah suku kata sederhana agar konsonan mati di tengah/akhir tidak tertinggal sebagai huruf Latin
    let out = '';
    const vowels = new Set(['a', 'i', 'u', 'e', 'o']);
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      const next = w[i + 1] ?? '';
      if (vowels.has(ch)) {
        out += ch;
        continue;
      }
      // 'n' sebelum konsonan (selain y) atau di akhir kata tetap 'n' (ン)
      if (ch === 'n' && (!next || (!vowels.has(next) && next !== 'y'))) {
        // Handle 'ng' di akhir atau sebelum konsonan -> 'ngu' / 'ng'
        if (next === 'g' && (!w[i + 2] || !vowels.has(w[i + 2]))) {
          out += 'ngu';
          i++;
          continue;
        }
        out += 'n';
        continue;
      }
      // Digraf konsonan (sh, ch, ts, ky, ny, hy, my, ry, gy, py, by)
      const pair = ch + next;
      if (['sh', 'ch', 'ts', 'ky', 'ny', 'hy', 'my', 'ry', 'gy', 'py', 'by'].includes(pair)) {
        const afterPair = w[i + 2] ?? '';
        if (vowels.has(afterPair)) {
          out += pair;
          i++;
          continue;
        }
      }
      if (next && vowels.has(next)) {
        out += ch;
      } else if (ch === 't' || ch === 'd') {
        out += ch + 'o';
      } else {
        out += ch + 'u';
      }
    }

    const kata = toKatakana(out, { IMEMode: false });
    // Bersihkan jika masih ada sisa huruf Latin langka
    return kata.replace(/[a-zA-Z]/g, '');
  }).filter(Boolean);

  const katakana = convertedWords.join('・');
  const romaji = katakana ? toRomaji(katakana.replace(/・/g, ' ')) : '';
  return { katakana, romaji };
}
