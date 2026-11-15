export type KanaScript = 'hiragana' | 'katakana';

export interface ServerKanaEntry {
  char: string;
  romaji: string;
  hira: string;
  script: KanaScript;
}

const DASAR_ROWS: Array<[string, string, string]> = [
  ['あ', 'ア', 'a'], ['い', 'イ', 'i'], ['う', 'ウ', 'u'], ['え', 'エ', 'e'], ['お', 'オ', 'o'],
  ['か', 'カ', 'ka'], ['き', 'キ', 'ki'], ['く', 'ク', 'ku'], ['け', 'ケ', 'ke'], ['こ', 'コ', 'ko'],
  ['さ', 'サ', 'sa'], ['し', 'シ', 'shi'], ['す', 'ス', 'su'], ['せ', 'セ', 'se'], ['そ', 'ソ', 'so'],
  ['た', 'タ', 'ta'], ['ち', 'チ', 'chi'], ['つ', 'ツ', 'tsu'], ['て', 'テ', 'te'], ['と', 'ト', 'to'],
  ['な', 'ナ', 'na'], ['に', 'ニ', 'ni'], ['ぬ', 'ヌ', 'nu'], ['ね', 'ネ', 'ne'], ['の', 'ノ', 'no'],
  ['は', 'ハ', 'ha'], ['ひ', 'ヒ', 'hi'], ['ふ', 'フ', 'fu'], ['へ', 'ヘ', 'he'], ['ほ', 'ホ', 'ho'],
  ['ま', 'マ', 'ma'], ['み', 'ミ', 'mi'], ['む', 'ム', 'mu'], ['め', 'メ', 'me'], ['も', 'モ', 'mo'],
  ['や', 'ヤ', 'ya'], ['ゆ', 'ユ', 'yu'], ['よ', 'ヨ', 'yo'],
  ['ら', 'ラ', 'ra'], ['り', 'リ', 'ri'], ['る', 'ル', 'ru'], ['れ', 'レ', 're'], ['ろ', 'ロ', 'ro'],
  ['わ', 'ワ', 'wa'], ['を', 'ヲ', 'wo'], ['ん', 'ン', 'n'],
];

const DAKUTEN_ROWS: Array<[string, string, string]> = [
  ['が', 'ガ', 'ga'], ['ぎ', 'ギ', 'gi'], ['ぐ', 'グ', 'gu'], ['げ', 'ゲ', 'ge'], ['ご', 'ゴ', 'go'],
  ['ざ', 'ザ', 'za'], ['じ', 'ジ', 'ji'], ['ず', 'ズ', 'zu'], ['ぜ', 'ゼ', 'ze'], ['ぞ', 'ゾ', 'zo'],
  ['だ', 'ダ', 'da'], ['ぢ', 'ヂ', 'ji'], ['づ', 'ヅ', 'zu'], ['で', 'デ', 'de'], ['ど', 'ド', 'do'],
  ['ば', 'バ', 'ba'], ['び', 'ビ', 'bi'], ['ぶ', 'ブ', 'bu'], ['べ', 'ベ', 'be'], ['ぼ', 'ボ', 'bo'],
  ['ぱ', 'パ', 'pa'], ['ぴ', 'ピ', 'pi'], ['ぷ', 'プ', 'pu'], ['ぺ', 'ペ', 'pe'], ['ぽ', 'ポ', 'po'],
];

const YOON_ROWS: Array<[string, string, string]> = [
  ['きゃ', 'キャ', 'kya'], ['きゅ', 'キュ', 'kyu'], ['きょ', 'キョ', 'kyo'],
  ['しゃ', 'シャ', 'sha'], ['しゅ', 'シュ', 'shu'], ['しょ', 'ショ', 'sho'],
  ['ちゃ', 'チャ', 'cha'], ['ちゅ', 'チュ', 'chu'], ['ちょ', 'チョ', 'cho'],
  ['にゃ', 'ニャ', 'nya'], ['にゅ', 'ニュ', 'nyu'], ['にょ', 'ニョ', 'nyo'],
  ['ひゃ', 'ヒャ', 'hya'], ['ひゅ', 'ヒュ', 'hyu'], ['ひょ', 'ヒョ', 'hyo'],
  ['みゃ', 'ミャ', 'mya'], ['みゅ', 'ミュ', 'myu'], ['みょ', 'ミョ', 'myo'],
  ['りゃ', 'リャ', 'rya'], ['りゅ', 'リュ', 'ryu'], ['りょ', 'リョ', 'ryo'],
  ['ぎゃ', 'ギャ', 'gya'], ['ぎゅ', 'ギュ', 'gyu'], ['ぎょ', 'ギョ', 'gyo'],
  ['じゃ', 'ジャ', 'ja'], ['じゅ', 'ジュ', 'ju'], ['じょ', 'ジョ', 'jo'],
  ['びゃ', 'ビャ', 'bya'], ['びゅ', 'ビュ', 'byu'], ['びょ', 'ビョ', 'byo'],
  ['ぴゃ', 'ピャ', 'pya'], ['ぴゅ', 'ピュ', 'pyu'], ['ぴょ', 'ピョ', 'pyo'],
];

const TAMBAHAN_ROWS: Array<[string, string, string]> = [
  ['ファ', 'ふぁ', 'fa'], ['フィ', 'ふぃ', 'fi'], ['フェ', 'ふぇ', 'fe'], ['フォ', 'ふぉ', 'fo'],
  ['ティ', 'てぃ', 'ti'], ['ディ', 'でぃ', 'di'], ['トゥ', 'とぅ', 'tu'], ['ドゥ', 'どぅ', 'du'],
  ['シェ', 'しぇ', 'she'], ['ジェ', 'じぇ', 'je'], ['チェ', 'ちぇ', 'che'], ['ツァ', 'つぁ', 'tsa'],
  ['ウィ', 'うぃ', 'wi'], ['ウェ', 'うぇ', 'we'], ['ウォ', 'うぉ', 'wo'],
  ['ヴァ', 'ゔぁ', 'va'], ['ヴィ', 'ゔぃ', 'vi'], ['ヴ', 'ゔ', 'vu'], ['ヴェ', 'ゔぇ', 've'], ['ヴォ', 'ゔぉ', 'vo'],
];

export const KANA_MAP: Record<string, ServerKanaEntry> = {};

for (const [hira, kata, romaji] of [...DASAR_ROWS, ...DAKUTEN_ROWS, ...YOON_ROWS]) {
  KANA_MAP[hira] = { char: hira, romaji, hira, script: 'hiragana' };
  KANA_MAP[kata] = { char: kata, romaji, hira, script: 'katakana' };
}

for (const [kata, hira, romaji] of TAMBAHAN_ROWS) {
  KANA_MAP[kata] = { char: kata, romaji, hira, script: 'katakana' };
}

/** Alternatif romaji baku (sejalan dengan ALT di src/pages/Quiz.tsx). */
export const ALT_ROMAJI: Record<string, string[]> = {
  を: ['o'],
  ヲ: ['o'],
  ぢ: ['di', 'dji'],
  ヂ: ['di', 'dji'],
  づ: ['du', 'dzu'],
  ヅ: ['du', 'dzu'],
};

/** Variasi ketikan romaji Wāpuro/Kunrei-shiki (dipakai pada mode ketik). */
const TYPED_ALIASES_BY_HIRA: Record<string, string[]> = {
  し: ['si'],
  ち: ['ti'],
  つ: ['tu'],
  ふ: ['hu'],
  ん: ['nn', "n'", 'xn'],
  じ: ['zi'],
  ぢ: ['di', 'dji'],
  づ: ['du', 'dzu'],
  しゃ: ['sya', 'shya'],
  しゅ: ['syu', 'shyu'],
  しょ: ['syo', 'shyo'],
  ちゃ: ['tya', 'cya', 'chya'],
  ちゅ: ['tyu', 'cyu', 'chyu'],
  ちょ: ['tyo', 'cyo', 'chyo'],
  じゃ: ['jya', 'zya'],
  じゅ: ['jyu', 'zyu'],
  じょ: ['jyo', 'zyo'],
  ふぁ: ['fwa'],
  ふぃ: ['fyi', 'fwi'],
  ふぇ: ['fye', 'fwe'],
  ふぉ: ['fwo'],
  てぃ: ['thi'],
  でぃ: ['dhi'],
  とぅ: ['twu'],
  どぅ: ['dwu'],
  しぇ: ['sye', 'shye'],
  じぇ: ['zye', 'jye'],
  ちぇ: ['tye', 'cye', 'chye'],
  うぃ: ['whi', 'uxi', 'uli'],
  うぇ: ['whe', 'uxe'],
  うぉ: ['who', 'uxo', 'ulo'],
  ゔぃ: ['vyi'],
  ゔぇ: ['vye'],
};

export function isKanaAnswerCorrect(char: string, givenRaw: unknown, mode?: unknown): boolean {
  const entry = KANA_MAP[char];
  if (!entry) return false;
  const given = String(givenRaw ?? '').trim().toLowerCase().replace(/\s+/g, '');
  if (!given) return false;
  if (given === entry.romaji) return true;
  if (ALT_ROMAJI[char]?.includes(given)) return true;
  if (mode === 'ketik' && TYPED_ALIASES_BY_HIRA[entry.hira]?.includes(given)) return true;
  return false;
}
