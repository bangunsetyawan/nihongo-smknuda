import { toHiragana, toKatakana } from 'wanakana';

export type Script = 'hiragana' | 'katakana';
export type GroupId = 'dasar' | 'dakuten' | 'yoon' | 'tambahan';

export interface Kana {
  char: string;
  romaji: string;
  /** hiragana-equivalent (untuk pengecekan jawaban) */
  hira: string;
  script: Script;
  group: GroupId;
  row: string;
}

export interface Example {
  word: string;
  romaji: string;
  arti: string;
}

// Baris dalam format: [nama baris, [hiragana, romaji] x5] — null = kosong
type Cell = [string, string] | null;
type Row = [string, Cell[]];

const DASAR: Row[] = [
  ['a', [['あ', 'a'], ['い', 'i'], ['う', 'u'], ['え', 'e'], ['お', 'o']]],
  ['ka', [['か', 'ka'], ['き', 'ki'], ['く', 'ku'], ['け', 'ke'], ['こ', 'ko']]],
  ['sa', [['さ', 'sa'], ['し', 'shi'], ['す', 'su'], ['せ', 'se'], ['そ', 'so']]],
  ['ta', [['た', 'ta'], ['ち', 'chi'], ['つ', 'tsu'], ['て', 'te'], ['と', 'to']]],
  ['na', [['な', 'na'], ['に', 'ni'], ['ぬ', 'nu'], ['ね', 'ne'], ['の', 'no']]],
  ['ha', [['は', 'ha'], ['ひ', 'hi'], ['ふ', 'fu'], ['へ', 'he'], ['ほ', 'ho']]],
  ['ma', [['ま', 'ma'], ['み', 'mi'], ['む', 'mu'], ['め', 'me'], ['も', 'mo']]],
  ['ya', [['や', 'ya'], null, ['ゆ', 'yu'], null, ['よ', 'yo']]],
  ['ra', [['ら', 'ra'], ['り', 'ri'], ['る', 'ru'], ['れ', 're'], ['ろ', 'ro']]],
  ['wa', [['わ', 'wa'], null, null, null, ['を', 'wo']]],
  ['n', [['ん', 'n'], null, null, null, null]],
];

const DAKUTEN: Row[] = [
  ['ga', [['が', 'ga'], ['ぎ', 'gi'], ['ぐ', 'gu'], ['げ', 'ge'], ['ご', 'go']]],
  ['za', [['ざ', 'za'], ['じ', 'ji'], ['ず', 'zu'], ['ぜ', 'ze'], ['ぞ', 'zo']]],
  ['da', [['だ', 'da'], ['ぢ', 'ji'], ['づ', 'zu'], ['で', 'de'], ['ど', 'do']]],
  ['ba', [['ば', 'ba'], ['び', 'bi'], ['ぶ', 'bu'], ['べ', 'be'], ['ぼ', 'bo']]],
  ['pa', [['ぱ', 'pa'], ['ぴ', 'pi'], ['ぷ', 'pu'], ['ぺ', 'pe'], ['ぽ', 'po']]],
];

const YOON: Row[] = [
  ['kya', [['きゃ', 'kya'], ['きゅ', 'kyu'], ['きょ', 'kyo']]],
  ['sha', [['しゃ', 'sha'], ['しゅ', 'shu'], ['しょ', 'sho']]],
  ['cha', [['ちゃ', 'cha'], ['ちゅ', 'chu'], ['ちょ', 'cho']]],
  ['nya', [['にゃ', 'nya'], ['にゅ', 'nyu'], ['にょ', 'nyo']]],
  ['hya', [['ひゃ', 'hya'], ['ひゅ', 'hyu'], ['ひょ', 'hyo']]],
  ['mya', [['みゃ', 'mya'], ['みゅ', 'myu'], ['みょ', 'myo']]],
  ['rya', [['りゃ', 'rya'], ['りゅ', 'ryu'], ['りょ', 'ryo']]],
  ['gya', [['ぎゃ', 'gya'], ['ぎゅ', 'gyu'], ['ぎょ', 'gyo']]],
  ['ja', [['じゃ', 'ja'], ['じゅ', 'ju'], ['じょ', 'jo']]],
  ['bya', [['びゃ', 'bya'], ['びゅ', 'byu'], ['びょ', 'byo']]],
  ['pya', [['ぴゃ', 'pya'], ['ぴゅ', 'pyu'], ['ぴょ', 'pyo']]],
];

// Katakana tambahan untuk kata serapan (ditulis langsung dalam katakana)
const TAMBAHAN: Row[] = [
  ['fa', [['ファ', 'fa'], ['フィ', 'fi'], ['フェ', 'fe'], ['フォ', 'fo']]],
  ['ti', [['ティ', 'ti'], ['ディ', 'di'], ['トゥ', 'tu'], ['ドゥ', 'du']]],
  ['she', [['シェ', 'she'], ['ジェ', 'je'], ['チェ', 'che'], ['ツァ', 'tsa']]],
  ['wi', [['ウィ', 'wi'], ['ウェ', 'we'], ['ウォ', 'wo']]],
  ['va', [['ヴァ', 'va'], ['ヴィ', 'vi'], ['ヴ', 'vu'], ['ヴェ', 've'], ['ヴォ', 'vo']]],
];

export interface GridRow {
  row: string;
  cells: (Kana | null)[];
}

function build(rows: Row[], script: Script, group: GroupId, katakanaSource = false): GridRow[] {
  return rows.map(([row, cells]) => ({
    row,
    cells: cells.map((c) => {
      if (!c) return null;
      const [src, romaji] = c;
      const char = katakanaSource ? src : script === 'katakana' ? toKatakana(src) : src;
      const hira = katakanaSource ? toHiragana(src) : src;
      return { char, romaji, hira, script, group, row };
    }),
  }));
}

export const GROUPS: { id: GroupId; label: string; desc: string }[] = [
  { id: 'dasar', label: 'Dasar (Gojūon)', desc: '46 huruf pokok' },
  { id: 'dakuten', label: 'Dakuten & Handakuten', desc: 'Tanda ゛ dan ゜' },
  { id: 'yoon', label: 'Yōon (gabungan)', desc: 'Dengan ゃ ゅ ょ kecil' },
  { id: 'tambahan', label: 'Tambahan (serapan)', desc: 'Khusus katakana' },
];

export function grid(script: Script, group: GroupId): GridRow[] {
  switch (group) {
    case 'dasar': return build(DASAR, script, group);
    case 'dakuten': return build(DAKUTEN, script, group);
    case 'yoon': return build(YOON, script, group);
    case 'tambahan': return script === 'katakana' ? build(TAMBAHAN, script, group, true) : [];
  }
}

export function allKana(script: Script, groups: GroupId[] = ['dasar', 'dakuten', 'yoon', 'tambahan']): Kana[] {
  return groups.flatMap((g) => grid(script, g).flatMap((r) => r.cells.filter((c): c is Kana => !!c)));
}

export const SCRIPT_INFO: Record<Script, { title: string; jp: string; desc: string }> = {
  hiragana: {
    title: 'Hiragana',
    jp: 'ひらがな',
    desc: 'Huruf dasar Jepang. Dipakai untuk kata asli Jepang, partikel, dan akhiran kata kerja. Pelajari ini lebih dulu!',
  },
  katakana: {
    title: 'Katakana',
    jp: 'カタカナ',
    desc: 'Dipakai untuk kata serapan dari bahasa asing (コーヒー kopi, テレビ televisi), nama negara, dan nama orang asing.',
  },
};

// Contoh kata untuk tiap huruf dasar (arti dalam bahasa Indonesia)
export const EXAMPLES: Record<string, Example> = {
  // Hiragana
  あ: { word: 'あめ', romaji: 'ame', arti: 'hujan' },
  い: { word: 'いぬ', romaji: 'inu', arti: 'anjing' },
  う: { word: 'うみ', romaji: 'umi', arti: 'laut' },
  え: { word: 'えき', romaji: 'eki', arti: 'stasiun' },
  お: { word: 'おかね', romaji: 'okane', arti: 'uang' },
  か: { word: 'かさ', romaji: 'kasa', arti: 'payung' },
  き: { word: 'きもの', romaji: 'kimono', arti: 'kimono' },
  く: { word: 'くるま', romaji: 'kuruma', arti: 'mobil' },
  け: { word: 'けしごむ', romaji: 'keshigomu', arti: 'penghapus' },
  こ: { word: 'こども', romaji: 'kodomo', arti: 'anak-anak' },
  さ: { word: 'さかな', romaji: 'sakana', arti: 'ikan' },
  し: { word: 'しお', romaji: 'shio', arti: 'garam' },
  す: { word: 'すし', romaji: 'sushi', arti: 'sushi' },
  せ: { word: 'せんせい', romaji: 'sensei', arti: 'guru' },
  そ: { word: 'そら', romaji: 'sora', arti: 'langit' },
  た: { word: 'たまご', romaji: 'tamago', arti: 'telur' },
  ち: { word: 'ちず', romaji: 'chizu', arti: 'peta' },
  つ: { word: 'つくえ', romaji: 'tsukue', arti: 'meja' },
  て: { word: 'て', romaji: 'te', arti: 'tangan' },
  と: { word: 'とけい', romaji: 'tokei', arti: 'jam' },
  な: { word: 'なつ', romaji: 'natsu', arti: 'musim panas' },
  に: { word: 'にく', romaji: 'niku', arti: 'daging' },
  ぬ: { word: 'ぬの', romaji: 'nuno', arti: 'kain' },
  ね: { word: 'ねこ', romaji: 'neko', arti: 'kucing' },
  の: { word: 'のみもの', romaji: 'nomimono', arti: 'minuman' },
  は: { word: 'はな', romaji: 'hana', arti: 'bunga' },
  ひ: { word: 'ひと', romaji: 'hito', arti: 'orang' },
  ふ: { word: 'ふね', romaji: 'fune', arti: 'kapal' },
  へ: { word: 'へや', romaji: 'heya', arti: 'kamar' },
  ほ: { word: 'ほん', romaji: 'hon', arti: 'buku' },
  ま: { word: 'まど', romaji: 'mado', arti: 'jendela' },
  み: { word: 'みず', romaji: 'mizu', arti: 'air' },
  む: { word: 'むし', romaji: 'mushi', arti: 'serangga' },
  め: { word: 'め', romaji: 'me', arti: 'mata' },
  も: { word: 'もり', romaji: 'mori', arti: 'hutan' },
  や: { word: 'やま', romaji: 'yama', arti: 'gunung' },
  ゆ: { word: 'ゆき', romaji: 'yuki', arti: 'salju' },
  よ: { word: 'よる', romaji: 'yoru', arti: 'malam' },
  ら: { word: 'らいねん', romaji: 'rainen', arti: 'tahun depan' },
  り: { word: 'りんご', romaji: 'ringo', arti: 'apel' },
  る: { word: 'るす', romaji: 'rusu', arti: 'tidak di rumah' },
  れ: { word: 'れきし', romaji: 'rekishi', arti: 'sejarah' },
  ろ: { word: 'ろうそく', romaji: 'rōsoku', arti: 'lilin' },
  わ: { word: 'わたし', romaji: 'watashi', arti: 'saya' },
  を: { word: 'みずをのむ', romaji: 'mizu o nomu', arti: 'minum air (を = partikel objek, dibaca "o")' },
  ん: { word: 'でんわ', romaji: 'denwa', arti: 'telepon' },
  // Katakana
  ア: { word: 'アイス', romaji: 'aisu', arti: 'es krim' },
  イ: { word: 'インドネシア', romaji: 'indoneshia', arti: 'Indonesia' },
  ウ: { word: 'ウイルス', romaji: 'uirusu', arti: 'virus' },
  エ: { word: 'エアコン', romaji: 'eakon', arti: 'AC (pendingin ruangan)' },
  オ: { word: 'オレンジ', romaji: 'orenji', arti: 'jeruk' },
  カ: { word: 'カメラ', romaji: 'kamera', arti: 'kamera' },
  キ: { word: 'キロ', romaji: 'kiro', arti: 'kilo' },
  ク: { word: 'クラス', romaji: 'kurasu', arti: 'kelas' },
  ケ: { word: 'ケーキ', romaji: 'kēki', arti: 'kue' },
  コ: { word: 'コーヒー', romaji: 'kōhī', arti: 'kopi' },
  サ: { word: 'サッカー', romaji: 'sakkā', arti: 'sepak bola' },
  シ: { word: 'シャツ', romaji: 'shatsu', arti: 'kemeja' },
  ス: { word: 'スマホ', romaji: 'sumaho', arti: 'HP / smartphone' },
  セ: { word: 'セーター', romaji: 'sētā', arti: 'sweter' },
  ソ: { word: 'ソース', romaji: 'sōsu', arti: 'saus' },
  タ: { word: 'タクシー', romaji: 'takushī', arti: 'taksi' },
  チ: { word: 'チーズ', romaji: 'chīzu', arti: 'keju' },
  ツ: { word: 'ツアー', romaji: 'tsuā', arti: 'tur' },
  テ: { word: 'テレビ', romaji: 'terebi', arti: 'televisi' },
  ト: { word: 'トマト', romaji: 'tomato', arti: 'tomat' },
  ナ: { word: 'ナイフ', romaji: 'naifu', arti: 'pisau' },
  ニ: { word: 'ニュース', romaji: 'nyūsu', arti: 'berita' },
  ヌ: { word: 'ヌードル', romaji: 'nūdoru', arti: 'mi' },
  ネ: { word: 'ネクタイ', romaji: 'nekutai', arti: 'dasi' },
  ノ: { word: 'ノート', romaji: 'nōto', arti: 'buku catatan' },
  ハ: { word: 'ハンバーガー', romaji: 'hanbāgā', arti: 'hamburger' },
  ヒ: { word: 'ヒーター', romaji: 'hītā', arti: 'pemanas ruangan' },
  フ: { word: 'フルーツ', romaji: 'furūtsu', arti: 'buah-buahan' },
  ヘ: { word: 'ヘルメット', romaji: 'herumetto', arti: 'helm' },
  ホ: { word: 'ホテル', romaji: 'hoteru', arti: 'hotel' },
  マ: { word: 'マスク', romaji: 'masuku', arti: 'masker' },
  ミ: { word: 'ミルク', romaji: 'miruku', arti: 'susu' },
  ム: { word: 'ムービー', romaji: 'mūbī', arti: 'film / video' },
  メ: { word: 'メール', romaji: 'mēru', arti: 'email / pesan' },
  モ: { word: 'モニター', romaji: 'monitā', arti: 'monitor' },
  ヤ: { word: 'ヤクルト', romaji: 'yakuruto', arti: 'Yakult' },
  ユ: { word: 'ユニフォーム', romaji: 'yunifōmu', arti: 'seragam' },
  ヨ: { word: 'ヨーグルト', romaji: 'yōguruto', arti: 'yogurt' },
  ラ: { word: 'ラジオ', romaji: 'rajio', arti: 'radio' },
  リ: { word: 'リモコン', romaji: 'rimokon', arti: 'remote control' },
  ル: { word: 'ルール', romaji: 'rūru', arti: 'aturan' },
  レ: { word: 'レモン', romaji: 'remon', arti: 'lemon' },
  ロ: { word: 'ロボット', romaji: 'robotto', arti: 'robot' },
  ワ: { word: 'ワイファイ', romaji: 'waifai', arti: 'Wi-Fi' },
  ヲ: { word: '(jarang dipakai)', romaji: 'wo', arti: 'hampir selalu ditulis dengan hiragana を' },
  ン: { word: 'パン', romaji: 'pan', arti: 'roti' },
};
