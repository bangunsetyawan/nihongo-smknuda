// Sumber acuan resmi: KANJIDIC (davidluzgouveia/kanji-data, pemetaan JLPT klasik Jonathan Waller)
// & kosakata contoh JLPT N5/N4 (open-anki-jlpt-decks).
// Total: 103 Kanji N5 + 181 Kanji N4 = 284 Kanji.

export type KanjiLevel = 'N5' | 'N4';

export interface KanjiExample {
  word: string;
  reading: string;
  arti: string;
}

export interface KanjiItem {
  char: string;
  level: KanjiLevel;
  arti: string;
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  examples: KanjiExample[];
}

export const KANJI_LIST: KanjiItem[] = [
  {
    "char": "日",
    "level": "N5",
    "arti": "hari / matahari / Jepang",
    "onyomi": [
      "ニチ",
      "ジツ"
    ],
    "kunyomi": [
      "ひ",
      "-び",
      "-か"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "日本",
        "reading": "にほん",
        "arti": "Jepang"
      },
      {
        "word": "毎日",
        "reading": "まいにち",
        "arti": "setiap hari"
      }
    ]
  },
  {
    "char": "一",
    "level": "N5",
    "arti": "satu",
    "onyomi": [
      "イチ",
      "イツ"
    ],
    "kunyomi": [
      "ひと-",
      "ひと.つ"
    ],
    "strokes": 1,
    "examples": [
      {
        "word": "一つ",
        "reading": "ひとつ",
        "arti": "satu buah"
      },
      {
        "word": "一日",
        "reading": "いちにち",
        "arti": "satu hari"
      }
    ]
  },
  {
    "char": "国",
    "level": "N5",
    "arti": "negara",
    "onyomi": [
      "コク"
    ],
    "kunyomi": [
      "くに"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "国",
        "reading": "くに",
        "arti": "negara"
      },
      {
        "word": "外国",
        "reading": "がいこく",
        "arti": "luar negeri"
      }
    ]
  },
  {
    "char": "会",
    "level": "N5",
    "arti": "bertemu / perkumpulan",
    "onyomi": [
      "カイ",
      "エ"
    ],
    "kunyomi": [
      "あ.う",
      "あ.わせる",
      "あつ.まる"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "会う",
        "reading": "あう",
        "arti": "bertemu"
      },
      {
        "word": "会社",
        "reading": "かいしゃ",
        "arti": "perusahaan"
      }
    ]
  },
  {
    "char": "人",
    "level": "N5",
    "arti": "orang",
    "onyomi": [
      "ジン",
      "ニン"
    ],
    "kunyomi": [
      "ひと",
      "-り",
      "-と"
    ],
    "strokes": 2,
    "examples": [
      {
        "word": "人",
        "reading": "ひと",
        "arti": "orang"
      },
      {
        "word": "日本人",
        "reading": "にほんじん",
        "arti": "orang Jepang"
      }
    ]
  },
  {
    "char": "年",
    "level": "N5",
    "arti": "tahun",
    "onyomi": [
      "ネン"
    ],
    "kunyomi": [
      "とし"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "年",
        "reading": "とし",
        "arti": "tahun / usia"
      },
      {
        "word": "今年",
        "reading": "ことし",
        "arti": "tahun ini"
      }
    ]
  },
  {
    "char": "大",
    "level": "N5",
    "arti": "besar",
    "onyomi": [
      "ダイ",
      "タイ"
    ],
    "kunyomi": [
      "おお-",
      "おお.きい",
      "-おお.いに"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "大きい",
        "reading": "おおきい",
        "arti": "besar"
      },
      {
        "word": "大学",
        "reading": "だいがく",
        "arti": "universitas"
      }
    ]
  },
  {
    "char": "十",
    "level": "N5",
    "arti": "sepuluh",
    "onyomi": [
      "ジュウ",
      "ジッ",
      "ジュッ"
    ],
    "kunyomi": [
      "とお",
      "と"
    ],
    "strokes": 2,
    "examples": [
      {
        "word": "十",
        "reading": "じゅう",
        "arti": "sepuluh"
      },
      {
        "word": "十日",
        "reading": "とおか",
        "arti": "tanggal 10 / 10 hari"
      }
    ]
  },
  {
    "char": "二",
    "level": "N5",
    "arti": "dua",
    "onyomi": [
      "ニ",
      "ジ"
    ],
    "kunyomi": [
      "ふた",
      "ふた.つ",
      "ふたたび"
    ],
    "strokes": 2,
    "examples": [
      {
        "word": "二",
        "reading": "に",
        "arti": "dua"
      },
      {
        "word": "二つ",
        "reading": "ふたつ",
        "arti": "dua buah"
      }
    ]
  },
  {
    "char": "本",
    "level": "N5",
    "arti": "buku / asal / pokok",
    "onyomi": [
      "ホン"
    ],
    "kunyomi": [
      "もと"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "本",
        "reading": "ほん",
        "arti": "buku"
      },
      {
        "word": "日本語",
        "reading": "にほんご",
        "arti": "bahasa Jepang"
      }
    ]
  },
  {
    "char": "中",
    "level": "N5",
    "arti": "dalam / tengah",
    "onyomi": [
      "チュウ"
    ],
    "kunyomi": [
      "なか",
      "うち",
      "あた.る"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "中",
        "reading": "なか",
        "arti": "di dalam"
      },
      {
        "word": "一日中",
        "reading": "いちにちじゅう",
        "arti": "seharian penuh"
      }
    ]
  },
  {
    "char": "長",
    "level": "N5",
    "arti": "panjang / ketua",
    "onyomi": [
      "チョウ"
    ],
    "kunyomi": [
      "なが.い",
      "おさ"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "長い",
        "reading": "ながい",
        "arti": "panjang"
      },
      {
        "word": "社長",
        "reading": "しゃちょう",
        "arti": "direktur perusahaan"
      }
    ]
  },
  {
    "char": "出",
    "level": "N5",
    "arti": "keluar / mengeluarkan",
    "onyomi": [
      "シュツ",
      "スイ"
    ],
    "kunyomi": [
      "で.る",
      "-で",
      "だ.す",
      "-だ.す",
      "い.でる",
      "い.だす"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "出る",
        "reading": "でる",
        "arti": "keluar"
      },
      {
        "word": "出口",
        "reading": "でぐち",
        "arti": "pintu keluar"
      }
    ]
  },
  {
    "char": "三",
    "level": "N5",
    "arti": "tiga",
    "onyomi": [
      "サン",
      "ゾウ"
    ],
    "kunyomi": [
      "み",
      "み.つ",
      "みっ.つ"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "三",
        "reading": "さん",
        "arti": "tiga"
      },
      {
        "word": "三日",
        "reading": "みっか",
        "arti": "tanggal 3 / 3 hari"
      }
    ]
  },
  {
    "char": "時",
    "level": "N5",
    "arti": "waktu / jam",
    "onyomi": [
      "ジ"
    ],
    "kunyomi": [
      "とき",
      "-どき"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "時間",
        "reading": "じかん",
        "arti": "waktu / durasi"
      },
      {
        "word": "何時",
        "reading": "なんじ",
        "arti": "jam berapa"
      }
    ]
  },
  {
    "char": "行",
    "level": "N5",
    "arti": "pergi / melaksanakan",
    "onyomi": [
      "コウ",
      "ギョウ",
      "アン"
    ],
    "kunyomi": [
      "い.く",
      "ゆ.く",
      "-ゆ.き",
      "-ゆき",
      "-い.き",
      "-いき",
      "おこな.う",
      "おこ.なう"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "行く",
        "reading": "いく",
        "arti": "pergi"
      },
      {
        "word": "銀行",
        "reading": "ぎんこう",
        "arti": "bank"
      }
    ]
  },
  {
    "char": "社",
    "level": "N5",
    "arti": "perusahaan / kuil Shinto",
    "onyomi": [
      "シャ"
    ],
    "kunyomi": [
      "やしろ"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "会社",
        "reading": "かいしゃ",
        "arti": "perusahaan"
      },
      {
        "word": "社会",
        "reading": "しゃかい",
        "arti": "masyarakat"
      }
    ]
  },
  {
    "char": "見",
    "level": "N5",
    "arti": "melihat",
    "onyomi": [
      "ケン"
    ],
    "kunyomi": [
      "み.る",
      "み.える",
      "み.せる"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "見る",
        "reading": "みる",
        "arti": "melihat / menonton"
      },
      {
        "word": "見せる",
        "reading": "みせる",
        "arti": "memperlihatkan"
      }
    ]
  },
  {
    "char": "月",
    "level": "N5",
    "arti": "bulan",
    "onyomi": [
      "ゲツ",
      "ガツ"
    ],
    "kunyomi": [
      "つき"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "月",
        "reading": "つき",
        "arti": "bulan (langit)"
      },
      {
        "word": "今月",
        "reading": "こんげつ",
        "arti": "bulan ini"
      }
    ]
  },
  {
    "char": "分",
    "level": "N5",
    "arti": "menit / membagi / mengerti",
    "onyomi": [
      "ブン",
      "フン",
      "ブ"
    ],
    "kunyomi": [
      "わ.ける",
      "わ.け",
      "わ.かれる",
      "わ.かる",
      "わ.かつ"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "分かる",
        "reading": "わかる",
        "arti": "mengerti"
      },
      {
        "word": "五分",
        "reading": "ごふん",
        "arti": "lima menit"
      }
    ]
  },
  {
    "char": "後",
    "level": "N5",
    "arti": "belakang / setelah",
    "onyomi": [
      "ゴ",
      "コウ"
    ],
    "kunyomi": [
      "のち",
      "うし.ろ",
      "うしろ",
      "あと",
      "おく.れる"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "後ろ",
        "reading": "うしろ",
        "arti": "belakang"
      },
      {
        "word": "午後",
        "reading": "ごご",
        "arti": "siang/sore (PM)"
      }
    ]
  },
  {
    "char": "前",
    "level": "N5",
    "arti": "depan / sebelum",
    "onyomi": [
      "ゼン"
    ],
    "kunyomi": [
      "まえ",
      "-まえ"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "前",
        "reading": "まえ",
        "arti": "depan / sebelum"
      },
      {
        "word": "午前",
        "reading": "ごぜん",
        "arti": "pagi (AM)"
      }
    ]
  },
  {
    "char": "生",
    "level": "N5",
    "arti": "hidup / lahir / siswa",
    "onyomi": [
      "セイ",
      "ショウ"
    ],
    "kunyomi": [
      "い.きる",
      "い.かす",
      "い.ける",
      "う.まれる",
      "うま.れる",
      "う.まれ",
      "うまれ",
      "う.む",
      "お.う",
      "は.える",
      "は.やす",
      "き",
      "なま",
      "なま-",
      "な.る",
      "な.す",
      "む.す",
      "-う"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "学生",
        "reading": "がくせい",
        "arti": "pelajar / mahasiswa"
      },
      {
        "word": "先生",
        "reading": "せんせい",
        "arti": "guru / pengajar"
      }
    ]
  },
  {
    "char": "五",
    "level": "N5",
    "arti": "lima",
    "onyomi": [
      "ゴ"
    ],
    "kunyomi": [
      "いつ",
      "いつ.つ"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "五",
        "reading": "ご",
        "arti": "lima"
      },
      {
        "word": "五つ",
        "reading": "いつつ",
        "arti": "lima buah"
      }
    ]
  },
  {
    "char": "間",
    "level": "N5",
    "arti": "jarak / antara / selang",
    "onyomi": [
      "カン",
      "ケン"
    ],
    "kunyomi": [
      "あいだ",
      "ま",
      "あい"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "間",
        "reading": "あいだ",
        "arti": "antara"
      },
      {
        "word": "時間",
        "reading": "じかん",
        "arti": "waktu"
      }
    ]
  },
  {
    "char": "上",
    "level": "N5",
    "arti": "atas / naik",
    "onyomi": [
      "ジョウ",
      "ショウ",
      "シャン"
    ],
    "kunyomi": [
      "うえ",
      "-うえ",
      "うわ-",
      "かみ",
      "あ.げる",
      "-あ.げる",
      "あ.がる",
      "-あ.がる",
      "あ.がり",
      "-あ.がり",
      "のぼ.る",
      "のぼ.り",
      "のぼ.せる",
      "のぼ.す",
      "たてまつ.る"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "上",
        "reading": "うえ",
        "arti": "atas"
      },
      {
        "word": "上手",
        "reading": "じょうず",
        "arti": "pandai / mahir"
      }
    ]
  },
  {
    "char": "東",
    "level": "N5",
    "arti": "timur",
    "onyomi": [
      "トウ"
    ],
    "kunyomi": [
      "ひがし"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "東",
        "reading": "ひがし",
        "arti": "timur"
      },
      {
        "word": "東京",
        "reading": "とうきょう",
        "arti": "Tokyo"
      }
    ]
  },
  {
    "char": "四",
    "level": "N5",
    "arti": "empat",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "よ",
      "よ.つ",
      "よっ.つ",
      "よん"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "四",
        "reading": "よん",
        "arti": "empat"
      },
      {
        "word": "四日",
        "reading": "よっか",
        "arti": "tanggal 4 / 4 hari"
      }
    ]
  },
  {
    "char": "今",
    "level": "N5",
    "arti": "sekarang",
    "onyomi": [
      "コン",
      "キン"
    ],
    "kunyomi": [
      "いま"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "今",
        "reading": "いま",
        "arti": "sekarang"
      },
      {
        "word": "今日",
        "reading": "きょう",
        "arti": "hari ini"
      }
    ]
  },
  {
    "char": "新",
    "level": "N5",
    "arti": "baru",
    "onyomi": [
      "シン"
    ],
    "kunyomi": [
      "あたら.しい",
      "あら.た",
      "あら-",
      "にい-"
    ],
    "strokes": 13,
    "examples": [
      {
        "word": "新しい",
        "reading": "あたらしい",
        "arti": "baru"
      },
      {
        "word": "新聞",
        "reading": "しんぶん",
        "arti": "koran"
      }
    ]
  },
  {
    "char": "金",
    "level": "N5",
    "arti": "emas / uang",
    "onyomi": [
      "キン",
      "コン",
      "ゴン"
    ],
    "kunyomi": [
      "かね",
      "かな-",
      "-がね"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "お金",
        "reading": "おかね",
        "arti": "uang"
      },
      {
        "word": "金曜日",
        "reading": "きんようび",
        "arti": "hari Jumat"
      }
    ]
  },
  {
    "char": "九",
    "level": "N5",
    "arti": "sembilan",
    "onyomi": [
      "キュウ",
      "ク"
    ],
    "kunyomi": [
      "ここの",
      "ここの.つ"
    ],
    "strokes": 2,
    "examples": [
      {
        "word": "九",
        "reading": "きゅう",
        "arti": "sembilan"
      },
      {
        "word": "九日",
        "reading": "ここのか",
        "arti": "tanggal 9 / 9 hari"
      }
    ]
  },
  {
    "char": "入",
    "level": "N5",
    "arti": "masuk / memasukkan",
    "onyomi": [
      "ニュウ",
      "ジュ"
    ],
    "kunyomi": [
      "い.る",
      "-い.る",
      "-い.り",
      "い.れる",
      "-い.れ",
      "はい.る"
    ],
    "strokes": 2,
    "examples": [
      {
        "word": "入る",
        "reading": "はいる",
        "arti": "masuk"
      },
      {
        "word": "入口",
        "reading": "いりぐち",
        "arti": "pintu masuk"
      }
    ]
  },
  {
    "char": "立",
    "level": "N5",
    "arti": "berdiri",
    "onyomi": [
      "リツ",
      "リュウ",
      "リットル"
    ],
    "kunyomi": [
      "た.つ",
      "-た.つ",
      "た.ち-",
      "た.てる",
      "-た.てる",
      "た.て-",
      "たて-",
      "-た.て",
      "-だ.て",
      "-だ.てる"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "立つ",
        "reading": "たつ",
        "arti": "berdiri"
      },
      {
        "word": "立てる",
        "reading": "たてる",
        "arti": "mendirikan"
      }
    ]
  },
  {
    "char": "手",
    "level": "N5",
    "arti": "tangan",
    "onyomi": [
      "シュ",
      "ズ"
    ],
    "kunyomi": [
      "て",
      "て-",
      "-て",
      "た-"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "手",
        "reading": "て",
        "arti": "tangan"
      },
      {
        "word": "切手",
        "reading": "きって",
        "arti": "prangko"
      }
    ]
  },
  {
    "char": "学",
    "level": "N5",
    "arti": "belajar / ilmu",
    "onyomi": [
      "ガク"
    ],
    "kunyomi": [
      "まな.ぶ"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "学校",
        "reading": "がっこう",
        "arti": "sekolah"
      },
      {
        "word": "学生",
        "reading": "がくせい",
        "arti": "siswa / mahasiswa"
      }
    ]
  },
  {
    "char": "高",
    "level": "N5",
    "arti": "tinggi / mahal",
    "onyomi": [
      "コウ"
    ],
    "kunyomi": [
      "たか.い",
      "たか",
      "-だか",
      "たか.まる",
      "たか.める"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "高い",
        "reading": "たかい",
        "arti": "tinggi / mahal"
      },
      {
        "word": "高校",
        "reading": "こうこう",
        "arti": "SMA / SMK"
      }
    ]
  },
  {
    "char": "円",
    "level": "N5",
    "arti": "yen / bulat",
    "onyomi": [
      "エン"
    ],
    "kunyomi": [
      "まる.い",
      "まる",
      "まど",
      "まど.か",
      "まろ.やか"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "百円",
        "reading": "ひゃくえん",
        "arti": "100 yen"
      },
      {
        "word": "丸い",
        "reading": "まるい",
        "arti": "bulat"
      }
    ]
  },
  {
    "char": "子",
    "level": "N5",
    "arti": "anak",
    "onyomi": [
      "シ",
      "ス",
      "ツ"
    ],
    "kunyomi": [
      "こ",
      "-こ",
      "ね"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "子ども",
        "reading": "こども",
        "arti": "anak-anak"
      },
      {
        "word": "女の子",
        "reading": "おんなのこ",
        "arti": "anak perempuan"
      }
    ]
  },
  {
    "char": "目",
    "level": "N5",
    "arti": "mata",
    "onyomi": [
      "モク",
      "ボク"
    ],
    "kunyomi": [
      "め",
      "-め",
      "ま-"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "目",
        "reading": "め",
        "arti": "mata"
      },
      {
        "word": "一日目",
        "reading": "いちにちめ",
        "arti": "hari pertama"
      }
    ]
  },
  {
    "char": "外",
    "level": "N5",
    "arti": "luar",
    "onyomi": [
      "ガイ",
      "ゲ"
    ],
    "kunyomi": [
      "そと",
      "ほか",
      "はず.す",
      "はず.れる",
      "と-"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "外",
        "reading": "そと",
        "arti": "luar"
      },
      {
        "word": "外国",
        "reading": "がいこく",
        "arti": "luar negeri"
      }
    ]
  },
  {
    "char": "言",
    "level": "N5",
    "arti": "berkata / kata",
    "onyomi": [
      "ゲン",
      "ゴン"
    ],
    "kunyomi": [
      "い.う",
      "こと"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "言う",
        "reading": "いう",
        "arti": "berkata"
      },
      {
        "word": "言葉",
        "reading": "ことば",
        "arti": "kata / bahasa"
      }
    ]
  },
  {
    "char": "八",
    "level": "N5",
    "arti": "delapan",
    "onyomi": [
      "ハチ"
    ],
    "kunyomi": [
      "や",
      "や.つ",
      "やっ.つ",
      "よう"
    ],
    "strokes": 2,
    "examples": [
      {
        "word": "八",
        "reading": "はち",
        "arti": "delapan"
      },
      {
        "word": "八日",
        "reading": "ようか",
        "arti": "tanggal 8 / 8 hari"
      }
    ]
  },
  {
    "char": "六",
    "level": "N5",
    "arti": "enam",
    "onyomi": [
      "ロク",
      "リク"
    ],
    "kunyomi": [
      "む",
      "む.つ",
      "むっ.つ",
      "むい"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "六",
        "reading": "ろく",
        "arti": "enam"
      },
      {
        "word": "六つ",
        "reading": "むっつ",
        "arti": "enam buah"
      }
    ]
  },
  {
    "char": "下",
    "level": "N5",
    "arti": "bawah / turun",
    "onyomi": [
      "カ",
      "ゲ"
    ],
    "kunyomi": [
      "した",
      "しも",
      "もと",
      "さ.げる",
      "さ.がる",
      "くだ.る",
      "くだ.り",
      "くだ.す",
      "-くだ.す",
      "くだ.さる",
      "お.ろす",
      "お.りる"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "下",
        "reading": "した",
        "arti": "bawah"
      },
      {
        "word": "靴下",
        "reading": "くつした",
        "arti": "kaus kaki"
      }
    ]
  },
  {
    "char": "来",
    "level": "N5",
    "arti": "datang",
    "onyomi": [
      "ライ",
      "タイ"
    ],
    "kunyomi": [
      "く.る",
      "きた.る",
      "きた.す",
      "き.たす",
      "き.たる",
      "き",
      "こ"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "来る",
        "reading": "くる",
        "arti": "datang"
      },
      {
        "word": "来週",
        "reading": "らいしゅう",
        "arti": "minggu depan"
      }
    ]
  },
  {
    "char": "気",
    "level": "N5",
    "arti": "semangat / udara / perasaan",
    "onyomi": [
      "キ",
      "ケ"
    ],
    "kunyomi": [
      "いき"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "元気",
        "reading": "げんき",
        "arti": "sehat / bersemangat"
      },
      {
        "word": "天気",
        "reading": "てんき",
        "arti": "cuaca"
      }
    ]
  },
  {
    "char": "小",
    "level": "N5",
    "arti": "kecil",
    "onyomi": [
      "ショウ"
    ],
    "kunyomi": [
      "ちい.さい",
      "こ-",
      "お-",
      "さ-"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "小さい",
        "reading": "ちいさい",
        "arti": "kecil"
      },
      {
        "word": "小学校",
        "reading": "しょうがっこう",
        "arti": "SD"
      }
    ]
  },
  {
    "char": "七",
    "level": "N5",
    "arti": "tujuh",
    "onyomi": [
      "シチ"
    ],
    "kunyomi": [
      "なな",
      "なな.つ",
      "なの"
    ],
    "strokes": 2,
    "examples": [
      {
        "word": "七",
        "reading": "なな",
        "arti": "tujuh"
      },
      {
        "word": "七日",
        "reading": "なのか",
        "arti": "tanggal 7 / 7 hari"
      }
    ]
  },
  {
    "char": "山",
    "level": "N5",
    "arti": "gunung",
    "onyomi": [
      "サン",
      "セン"
    ],
    "kunyomi": [
      "やま"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "山",
        "reading": "やま",
        "arti": "gunung"
      },
      {
        "word": "富士山",
        "reading": "ふじさん",
        "arti": "Gunung Fuji"
      }
    ]
  },
  {
    "char": "話",
    "level": "N5",
    "arti": "berbicara / cerita",
    "onyomi": [
      "ワ"
    ],
    "kunyomi": [
      "はな.す",
      "はなし"
    ],
    "strokes": 13,
    "examples": [
      {
        "word": "話す",
        "reading": "はなす",
        "arti": "berbicara"
      },
      {
        "word": "電話",
        "reading": "でんわ",
        "arti": "telepon"
      }
    ]
  },
  {
    "char": "多",
    "level": "N5",
    "arti": "banyak",
    "onyomi": [
      "タ"
    ],
    "kunyomi": [
      "おお.い",
      "まさ.に",
      "まさ.る"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "多い",
        "reading": "おおい",
        "arti": "banyak"
      },
      {
        "word": "多分",
        "reading": "たぶん",
        "arti": "mungkin"
      }
    ]
  },
  {
    "char": "安",
    "level": "N5",
    "arti": "murah / aman / tenang",
    "onyomi": [
      "アン"
    ],
    "kunyomi": [
      "やす.い",
      "やす.まる",
      "やす",
      "やす.らか"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "安い",
        "reading": "やすい",
        "arti": "murah"
      },
      {
        "word": "安心",
        "reading": "あんしん",
        "arti": "lega / tenang"
      }
    ]
  },
  {
    "char": "女",
    "level": "N5",
    "arti": "perempuan",
    "onyomi": [
      "ジョ",
      "ニョ",
      "ニョウ"
    ],
    "kunyomi": [
      "おんな",
      "め"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "女",
        "reading": "おんな",
        "arti": "perempuan"
      },
      {
        "word": "女性",
        "reading": "じょせい",
        "arti": "wanita"
      }
    ]
  },
  {
    "char": "北",
    "level": "N5",
    "arti": "utara",
    "onyomi": [
      "ホク"
    ],
    "kunyomi": [
      "きた"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "北",
        "reading": "きた",
        "arti": "utara"
      },
      {
        "word": "北口",
        "reading": "きたぐち",
        "arti": "pintu utara"
      }
    ]
  },
  {
    "char": "午",
    "level": "N5",
    "arti": "tengah hari / siang",
    "onyomi": [
      "ゴ"
    ],
    "kunyomi": [
      "うま"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "午前",
        "reading": "ごぜん",
        "arti": "pagi (AM)"
      },
      {
        "word": "午後",
        "reading": "ごご",
        "arti": "siang/sore (PM)"
      }
    ]
  },
  {
    "char": "百",
    "level": "N5",
    "arti": "seratus",
    "onyomi": [
      "ヒャク",
      "ビャク"
    ],
    "kunyomi": [
      "もも"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "百",
        "reading": "ひゃく",
        "arti": "seratus"
      },
      {
        "word": "三百",
        "reading": "さんびゃく",
        "arti": "tiga ratus"
      }
    ]
  },
  {
    "char": "書",
    "level": "N5",
    "arti": "menulis",
    "onyomi": [
      "ショ"
    ],
    "kunyomi": [
      "か.く",
      "-が.き",
      "-がき"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "書く",
        "reading": "かく",
        "arti": "menulis"
      },
      {
        "word": "辞書",
        "reading": "じしょ",
        "arti": "kamus"
      }
    ]
  },
  {
    "char": "先",
    "level": "N5",
    "arti": "duluan / lalu / depan",
    "onyomi": [
      "セン"
    ],
    "kunyomi": [
      "さき",
      "ま.ず"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "先生",
        "reading": "せんせい",
        "arti": "guru"
      },
      {
        "word": "先週",
        "reading": "せんしゅう",
        "arti": "minggu lalu"
      }
    ]
  },
  {
    "char": "名",
    "level": "N5",
    "arti": "nama",
    "onyomi": [
      "メイ",
      "ミョウ"
    ],
    "kunyomi": [
      "な",
      "-な"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "名前",
        "reading": "なまえ",
        "arti": "nama"
      },
      {
        "word": "有名",
        "reading": "ゆうめい",
        "arti": "terkenal"
      }
    ]
  },
  {
    "char": "川",
    "level": "N5",
    "arti": "sungai",
    "onyomi": [
      "セン"
    ],
    "kunyomi": [
      "かわ"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "川",
        "reading": "かわ",
        "arti": "sungai"
      },
      {
        "word": "山川",
        "reading": "やまかわ",
        "arti": "gunung dan sungai"
      }
    ]
  },
  {
    "char": "千",
    "level": "N5",
    "arti": "seribu",
    "onyomi": [
      "セン"
    ],
    "kunyomi": [
      "ち"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "千",
        "reading": "せん",
        "arti": "seribu"
      },
      {
        "word": "三千",
        "reading": "さんぜん",
        "arti": "tiga ribu"
      }
    ]
  },
  {
    "char": "道",
    "level": "N5",
    "arti": "jalan",
    "onyomi": [
      "ドウ",
      "トウ"
    ],
    "kunyomi": [
      "みち",
      "いう"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "道",
        "reading": "みち",
        "arti": "jalan"
      },
      {
        "word": "柔道",
        "reading": "じゅうどう",
        "arti": "judo"
      }
    ]
  },
  {
    "char": "水",
    "level": "N5",
    "arti": "air",
    "onyomi": [
      "スイ"
    ],
    "kunyomi": [
      "みず",
      "みず-"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "水",
        "reading": "みず",
        "arti": "air"
      },
      {
        "word": "水曜日",
        "reading": "すいようび",
        "arti": "hari Rabu"
      }
    ]
  },
  {
    "char": "半",
    "level": "N5",
    "arti": "setengah",
    "onyomi": [
      "ハン"
    ],
    "kunyomi": [
      "なか.ば"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "半分",
        "reading": "はんぶん",
        "arti": "setengah"
      },
      {
        "word": "一時半",
        "reading": "いちじはん",
        "arti": "jam setengah dua"
      }
    ]
  },
  {
    "char": "男",
    "level": "N5",
    "arti": "laki-laki",
    "onyomi": [
      "ダン",
      "ナン"
    ],
    "kunyomi": [
      "おとこ",
      "お"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "男",
        "reading": "おとこ",
        "arti": "laki-laki"
      },
      {
        "word": "男の子",
        "reading": "おとこのこ",
        "arti": "anak laki-laki"
      }
    ]
  },
  {
    "char": "西",
    "level": "N5",
    "arti": "barat",
    "onyomi": [
      "セイ",
      "サイ",
      "ス"
    ],
    "kunyomi": [
      "にし"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "西",
        "reading": "にし",
        "arti": "barat"
      },
      {
        "word": "西口",
        "reading": "にしぐち",
        "arti": "pintu barat"
      }
    ]
  },
  {
    "char": "電",
    "level": "N5",
    "arti": "listrik",
    "onyomi": [
      "デン"
    ],
    "kunyomi": [],
    "strokes": 13,
    "examples": [
      {
        "word": "電気",
        "reading": "でんき",
        "arti": "listrik / lampu"
      },
      {
        "word": "電車",
        "reading": "でんしゃ",
        "arti": "kereta listrik"
      }
    ]
  },
  {
    "char": "口",
    "level": "N5",
    "arti": "mulut / pintu masuk-keluar",
    "onyomi": [
      "コウ",
      "ク"
    ],
    "kunyomi": [
      "くち"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "口",
        "reading": "くち",
        "arti": "mulut"
      },
      {
        "word": "入口",
        "reading": "いりぐち",
        "arti": "pintu masuk"
      }
    ]
  },
  {
    "char": "少",
    "level": "N5",
    "arti": "sedikit",
    "onyomi": [
      "ショウ"
    ],
    "kunyomi": [
      "すく.ない",
      "すこ.し"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "少し",
        "reading": "すこし",
        "arti": "sedikit"
      },
      {
        "word": "少ない",
        "reading": "すくない",
        "arti": "jumlahnya sedikit"
      }
    ]
  },
  {
    "char": "校",
    "level": "N5",
    "arti": "sekolah",
    "onyomi": [
      "コウ",
      "キョウ"
    ],
    "kunyomi": [],
    "strokes": 10,
    "examples": [
      {
        "word": "学校",
        "reading": "がっこう",
        "arti": "sekolah"
      },
      {
        "word": "校長",
        "reading": "こうちょう",
        "arti": "kepala sekolah"
      }
    ]
  },
  {
    "char": "語",
    "level": "N5",
    "arti": "bahasa / kata",
    "onyomi": [
      "ゴ"
    ],
    "kunyomi": [
      "かた.る",
      "かた.らう"
    ],
    "strokes": 14,
    "examples": [
      {
        "word": "日本語",
        "reading": "にほんご",
        "arti": "bahasa Jepang"
      },
      {
        "word": "英語",
        "reading": "えいご",
        "arti": "bahasa Inggris"
      }
    ]
  },
  {
    "char": "空",
    "level": "N5",
    "arti": "langit / kosong",
    "onyomi": [
      "クウ"
    ],
    "kunyomi": [
      "そら",
      "あ.く",
      "あ.き",
      "あ.ける",
      "から",
      "す.く",
      "す.かす",
      "むな.しい"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "空",
        "reading": "そら",
        "arti": "langit"
      },
      {
        "word": "空気",
        "reading": "くうき",
        "arti": "udara"
      }
    ]
  },
  {
    "char": "土",
    "level": "N5",
    "arti": "tanah",
    "onyomi": [
      "ド",
      "ト"
    ],
    "kunyomi": [
      "つち"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "土曜日",
        "reading": "どようび",
        "arti": "hari Sabtu"
      },
      {
        "word": "お土産",
        "reading": "おみやげ",
        "arti": "oleh-oleh"
      }
    ]
  },
  {
    "char": "木",
    "level": "N5",
    "arti": "pohon / kayu",
    "onyomi": [
      "ボク",
      "モク"
    ],
    "kunyomi": [
      "き",
      "こ-"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "木",
        "reading": "き",
        "arti": "pohon"
      },
      {
        "word": "木曜日",
        "reading": "もくようび",
        "arti": "hari Kamis"
      }
    ]
  },
  {
    "char": "聞",
    "level": "N5",
    "arti": "mendengar / bertanya",
    "onyomi": [
      "ブン",
      "モン"
    ],
    "kunyomi": [
      "き.く",
      "き.こえる"
    ],
    "strokes": 14,
    "examples": [
      {
        "word": "聞く",
        "reading": "きく",
        "arti": "mendengar / bertanya"
      },
      {
        "word": "新聞",
        "reading": "しんぶん",
        "arti": "koran"
      }
    ]
  },
  {
    "char": "食",
    "level": "N5",
    "arti": "makan / makanan",
    "onyomi": [
      "ショク",
      "ジキ"
    ],
    "kunyomi": [
      "く.う",
      "く.らう",
      "た.べる",
      "は.む"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "食べる",
        "reading": "たべる",
        "arti": "makan"
      },
      {
        "word": "食堂",
        "reading": "しょくどう",
        "arti": "kantin / ruang makan"
      }
    ]
  },
  {
    "char": "車",
    "level": "N5",
    "arti": "mobil / kendaraan",
    "onyomi": [
      "シャ"
    ],
    "kunyomi": [
      "くるま"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "車",
        "reading": "くるま",
        "arti": "mobil"
      },
      {
        "word": "電車",
        "reading": "でんしゃ",
        "arti": "kereta listrik"
      }
    ]
  },
  {
    "char": "何",
    "level": "N5",
    "arti": "apa",
    "onyomi": [
      "カ"
    ],
    "kunyomi": [
      "なに",
      "なん",
      "なに-",
      "なん-"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "何",
        "reading": "なに / なん",
        "arti": "apa"
      },
      {
        "word": "何人",
        "reading": "なんにん",
        "arti": "berapa orang"
      }
    ]
  },
  {
    "char": "南",
    "level": "N5",
    "arti": "selatan",
    "onyomi": [
      "ナン",
      "ナ"
    ],
    "kunyomi": [
      "みなみ"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "南",
        "reading": "みなみ",
        "arti": "selatan"
      },
      {
        "word": "南口",
        "reading": "みなみぐち",
        "arti": "pintu selatan"
      }
    ]
  },
  {
    "char": "足",
    "level": "N5",
    "arti": "kaki / cukup",
    "onyomi": [
      "ソク"
    ],
    "kunyomi": [
      "あし",
      "た.りる",
      "た.る",
      "た.す"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "足",
        "reading": "あし",
        "arti": "kaki"
      },
      {
        "word": "足りる",
        "reading": "たりる",
        "arti": "cukup"
      }
    ]
  },
  {
    "char": "万",
    "level": "N5",
    "arti": "sepuluh ribu",
    "onyomi": [
      "マン",
      "バン"
    ],
    "kunyomi": [
      "よろず"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "一万",
        "reading": "いちまん",
        "arti": "sepuluh ribu"
      },
      {
        "word": "万年筆",
        "reading": "まんねんひつ",
        "arti": "pulpen tinta"
      }
    ]
  },
  {
    "char": "店",
    "level": "N5",
    "arti": "toko",
    "onyomi": [
      "テン"
    ],
    "kunyomi": [
      "みせ",
      "たな"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "店",
        "reading": "みせ",
        "arti": "toko"
      },
      {
        "word": "店員",
        "reading": "てんいん",
        "arti": "pegawai toko"
      }
    ]
  },
  {
    "char": "毎",
    "level": "N5",
    "arti": "setiap",
    "onyomi": [
      "マイ"
    ],
    "kunyomi": [
      "ごと",
      "-ごと.に"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "毎日",
        "reading": "まいにち",
        "arti": "setiap hari"
      },
      {
        "word": "毎朝",
        "reading": "まいあさ",
        "arti": "setiap pagi"
      }
    ]
  },
  {
    "char": "白",
    "level": "N5",
    "arti": "putih",
    "onyomi": [
      "ハク",
      "ビャク"
    ],
    "kunyomi": [
      "しろ",
      "しら-",
      "しろ.い"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "白い",
        "reading": "しろい",
        "arti": "putih"
      },
      {
        "word": "白",
        "reading": "しろ",
        "arti": "warna putih"
      }
    ]
  },
  {
    "char": "古",
    "level": "N5",
    "arti": "lama / tua (benda)",
    "onyomi": [
      "コ"
    ],
    "kunyomi": [
      "ふる.い",
      "ふる-",
      "-ふる.す"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "古い",
        "reading": "ふるい",
        "arti": "lama / tua (benda)"
      },
      {
        "word": "中古",
        "reading": "ちゅうこ",
        "arti": "barang bekas"
      }
    ]
  },
  {
    "char": "天",
    "level": "N5",
    "arti": "langit / surga",
    "onyomi": [
      "テン"
    ],
    "kunyomi": [
      "あまつ",
      "あめ",
      "あま-"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "天気",
        "reading": "てんき",
        "arti": "cuaca"
      },
      {
        "word": "天ぷら",
        "reading": "てんぷら",
        "arti": "tempura"
      }
    ]
  },
  {
    "char": "買",
    "level": "N5",
    "arti": "membeli",
    "onyomi": [
      "バイ"
    ],
    "kunyomi": [
      "か.う"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "買う",
        "reading": "かう",
        "arti": "membeli"
      },
      {
        "word": "買い物",
        "reading": "かいもの",
        "arti": "berbelanja"
      }
    ]
  },
  {
    "char": "週",
    "level": "N5",
    "arti": "minggu (pekan)",
    "onyomi": [
      "シュウ"
    ],
    "kunyomi": [],
    "strokes": 11,
    "examples": [
      {
        "word": "今週",
        "reading": "こんしゅう",
        "arti": "minggu ini"
      },
      {
        "word": "来週",
        "reading": "らいしゅう",
        "arti": "minggu depan"
      }
    ]
  },
  {
    "char": "母",
    "level": "N5",
    "arti": "ibu",
    "onyomi": [
      "ボ"
    ],
    "kunyomi": [
      "はは",
      "も"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "母",
        "reading": "はは",
        "arti": "ibu saya"
      },
      {
        "word": "お母さん",
        "reading": "おかあさん",
        "arti": "ibu"
      }
    ]
  },
  {
    "char": "火",
    "level": "N5",
    "arti": "api",
    "onyomi": [
      "カ"
    ],
    "kunyomi": [
      "ひ",
      "-び",
      "ほ-"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "火",
        "reading": "ひ",
        "arti": "api"
      },
      {
        "word": "火曜日",
        "reading": "かようび",
        "arti": "hari Selasa"
      }
    ]
  },
  {
    "char": "花",
    "level": "N5",
    "arti": "bunga",
    "onyomi": [
      "カ",
      "ケ"
    ],
    "kunyomi": [
      "はな"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "花",
        "reading": "はな",
        "arti": "bunga"
      },
      {
        "word": "花見",
        "reading": "はなみ",
        "arti": "melihat bunga sakura"
      }
    ]
  },
  {
    "char": "右",
    "level": "N5",
    "arti": "kanan",
    "onyomi": [
      "ウ",
      "ユウ"
    ],
    "kunyomi": [
      "みぎ"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "右",
        "reading": "みぎ",
        "arti": "kanan"
      },
      {
        "word": "右手",
        "reading": "みぎて",
        "arti": "tangan kanan"
      }
    ]
  },
  {
    "char": "読",
    "level": "N5",
    "arti": "membaca",
    "onyomi": [
      "ドク",
      "トク",
      "トウ"
    ],
    "kunyomi": [
      "よ.む",
      "-よ.み"
    ],
    "strokes": 14,
    "examples": [
      {
        "word": "読む",
        "reading": "よむ",
        "arti": "membaca"
      },
      {
        "word": "読書",
        "reading": "どくしょ",
        "arti": "kegiatan membaca"
      }
    ]
  },
  {
    "char": "友",
    "level": "N5",
    "arti": "teman",
    "onyomi": [
      "ユウ"
    ],
    "kunyomi": [
      "とも"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "友達",
        "reading": "ともだち",
        "arti": "teman"
      },
      {
        "word": "友人",
        "reading": "ゆうじん",
        "arti": "sahabat / teman"
      }
    ]
  },
  {
    "char": "左",
    "level": "N5",
    "arti": "kiri",
    "onyomi": [
      "サ",
      "シャ"
    ],
    "kunyomi": [
      "ひだり"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "左",
        "reading": "ひだり",
        "arti": "kiri"
      },
      {
        "word": "左手",
        "reading": "ひだりて",
        "arti": "tangan kiri"
      }
    ]
  },
  {
    "char": "休",
    "level": "N5",
    "arti": "istirahat / libur",
    "onyomi": [
      "キュウ"
    ],
    "kunyomi": [
      "やす.む",
      "やす.まる",
      "やす.める"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "休む",
        "reading": "やすむ",
        "arti": "beristirahat"
      },
      {
        "word": "休み",
        "reading": "やすみ",
        "arti": "hari libur"
      }
    ]
  },
  {
    "char": "父",
    "level": "N5",
    "arti": "ayah",
    "onyomi": [
      "フ"
    ],
    "kunyomi": [
      "ちち"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "父",
        "reading": "ちち",
        "arti": "ayah saya"
      },
      {
        "word": "お父さん",
        "reading": "おとうさん",
        "arti": "ayah"
      }
    ]
  },
  {
    "char": "駅",
    "level": "N5",
    "arti": "stasiun",
    "onyomi": [
      "エキ"
    ],
    "kunyomi": [],
    "strokes": 14,
    "examples": [
      {
        "word": "駅",
        "reading": "えき",
        "arti": "stasiun"
      },
      {
        "word": "駅前",
        "reading": "えきまえ",
        "arti": "depan stasiun"
      }
    ]
  },
  {
    "char": "雨",
    "level": "N5",
    "arti": "hujan",
    "onyomi": [
      "ウ"
    ],
    "kunyomi": [
      "あめ",
      "あま-",
      "-さめ"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "雨",
        "reading": "あめ",
        "arti": "hujan"
      },
      {
        "word": "大雨",
        "reading": "おおあめ",
        "arti": "hujan deras"
      }
    ]
  },
  {
    "char": "飲",
    "level": "N5",
    "arti": "minum",
    "onyomi": [
      "イン",
      "オン"
    ],
    "kunyomi": [
      "の.む",
      "-の.み"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "飲む",
        "reading": "のむ",
        "arti": "minum"
      },
      {
        "word": "飲み物",
        "reading": "のみもの",
        "arti": "minuman"
      }
    ]
  },
  {
    "char": "魚",
    "level": "N5",
    "arti": "ikan",
    "onyomi": [
      "ギョ"
    ],
    "kunyomi": [
      "うお",
      "さかな",
      "-ざかな"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "魚",
        "reading": "さかな",
        "arti": "ikan"
      },
      {
        "word": "金魚",
        "reading": "きんぎょ",
        "arti": "ikan mas hias"
      }
    ]
  },
  {
    "char": "耳",
    "level": "N5",
    "arti": "telinga",
    "onyomi": [
      "ジ"
    ],
    "kunyomi": [
      "みみ"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "耳",
        "reading": "みみ",
        "arti": "telinga"
      }
    ]
  },
  {
    "char": "同",
    "level": "N4",
    "arti": "sama",
    "onyomi": [
      "ドウ"
    ],
    "kunyomi": [
      "おな.じ"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "同じ",
        "reading": "おなじ",
        "arti": "sama"
      }
    ]
  },
  {
    "char": "事",
    "level": "N4",
    "arti": "hal / urusan",
    "onyomi": [
      "ジ",
      "ズ"
    ],
    "kunyomi": [
      "こと",
      "つか.う",
      "つか.える"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "事",
        "reading": "こと",
        "arti": "hal / perkara"
      },
      {
        "word": "大事",
        "reading": "だいじ",
        "arti": "penting"
      }
    ]
  },
  {
    "char": "自",
    "level": "N4",
    "arti": "diri sendiri",
    "onyomi": [
      "ジ",
      "シ"
    ],
    "kunyomi": [
      "みずか.ら",
      "おの.ずから",
      "おの.ずと"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "自分",
        "reading": "じぶん",
        "arti": "diri sendiri"
      },
      {
        "word": "自由",
        "reading": "じゆう",
        "arti": "bebas"
      }
    ]
  },
  {
    "char": "民",
    "level": "N4",
    "arti": "rakyat / warga",
    "onyomi": [
      "ミン"
    ],
    "kunyomi": [
      "たみ"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "市民",
        "reading": "しみん",
        "arti": "warga kota"
      },
      {
        "word": "国民",
        "reading": "こくみん",
        "arti": "warga negara"
      }
    ]
  },
  {
    "char": "発",
    "level": "N4",
    "arti": "berangkat / memancarkan",
    "onyomi": [
      "ハツ",
      "ホツ"
    ],
    "kunyomi": [
      "た.つ",
      "あば.く",
      "おこ.る",
      "つか.わす",
      "はな.つ"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "出発",
        "reading": "しゅっぱつ",
        "arti": "keberangkatan"
      },
      {
        "word": "発音",
        "reading": "はつおん",
        "arti": "pelafalan"
      }
    ]
  },
  {
    "char": "者",
    "level": "N4",
    "arti": "orang / pelaku",
    "onyomi": [
      "シャ"
    ],
    "kunyomi": [
      "もの"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "医者",
        "reading": "いしゃ",
        "arti": "dokter"
      },
      {
        "word": "歯医者",
        "reading": "はいしゃ",
        "arti": "dokter gigi"
      }
    ]
  },
  {
    "char": "地",
    "level": "N4",
    "arti": "tanah / bumi",
    "onyomi": [
      "チ",
      "ジ"
    ],
    "kunyomi": [],
    "strokes": 6,
    "examples": [
      {
        "word": "地図",
        "reading": "ちず",
        "arti": "peta"
      },
      {
        "word": "地下鉄",
        "reading": "ちかてつ",
        "arti": "kereta bawah tanah"
      }
    ]
  },
  {
    "char": "合",
    "level": "N4",
    "arti": "cocok / bertemu / sesuai",
    "onyomi": [
      "ゴウ",
      "ガッ",
      "カッ"
    ],
    "kunyomi": [
      "あ.う",
      "-あ.う",
      "あ.い",
      "あい-",
      "-あ.い",
      "-あい",
      "あ.わす",
      "あ.わせる",
      "-あ.わせる"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "場合",
        "reading": "ばあい",
        "arti": "situasi / keadaan"
      },
      {
        "word": "試合",
        "reading": "しあい",
        "arti": "pertandingan"
      }
    ]
  },
  {
    "char": "市",
    "level": "N4",
    "arti": "kota / pasar",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "いち"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "市",
        "reading": "し",
        "arti": "kota"
      },
      {
        "word": "市民",
        "reading": "しみん",
        "arti": "warga kota"
      }
    ]
  },
  {
    "char": "業",
    "level": "N4",
    "arti": "pekerjaan / industri",
    "onyomi": [
      "ギョウ",
      "ゴウ"
    ],
    "kunyomi": [
      "わざ"
    ],
    "strokes": 13,
    "examples": [
      {
        "word": "産業",
        "reading": "さんぎょう",
        "arti": "industri"
      },
      {
        "word": "卒業",
        "reading": "そつぎょう",
        "arti": "kelulusan"
      }
    ]
  },
  {
    "char": "方",
    "level": "N4",
    "arti": "arah / cara / beliau",
    "onyomi": [
      "ホウ"
    ],
    "kunyomi": [
      "かた",
      "-かた",
      "-がた"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "仕方",
        "reading": "しかた",
        "arti": "cara melakukan"
      },
      {
        "word": "夕方",
        "reading": "ゆうがた",
        "arti": "sore menjelang malam"
      }
    ]
  },
  {
    "char": "回",
    "level": "N4",
    "arti": "kali / berputar",
    "onyomi": [
      "カイ",
      "エ"
    ],
    "kunyomi": [
      "まわ.る",
      "-まわ.る",
      "-まわ.り",
      "まわ.す",
      "-まわ.す",
      "まわ.し-",
      "-まわ.し",
      "もとお.る",
      "か.える"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "回る",
        "reading": "まわる",
        "arti": "berputar"
      },
      {
        "word": "何回",
        "reading": "なんかい",
        "arti": "berapa kali"
      }
    ]
  },
  {
    "char": "場",
    "level": "N4",
    "arti": "lokasi / tempat (acara/kerja)",
    "onyomi": [
      "ジョウ",
      "チョウ"
    ],
    "kunyomi": [
      "ば"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "場所",
        "reading": "ばしょ",
        "arti": "tempat / lokasi"
      },
      {
        "word": "工場",
        "reading": "こうじょう",
        "arti": "pabrik"
      }
    ]
  },
  {
    "char": "員",
    "level": "N4",
    "arti": "anggota / pegawai",
    "onyomi": [
      "イン"
    ],
    "kunyomi": [],
    "strokes": 10,
    "examples": [
      {
        "word": "店員",
        "reading": "てんいん",
        "arti": "pegawai toko"
      },
      {
        "word": "会社員",
        "reading": "かいしゃいん",
        "arti": "karyawan perusahaan"
      }
    ]
  },
  {
    "char": "開",
    "level": "N4",
    "arti": "buka / membuka",
    "onyomi": [
      "カイ"
    ],
    "kunyomi": [
      "ひら.く",
      "ひら.き",
      "-びら.き",
      "ひら.ける",
      "あ.く",
      "あ.ける"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "開ける",
        "reading": "あける",
        "arti": "membuka"
      },
      {
        "word": "開く",
        "reading": "ひらく",
        "arti": "terbuka / mengadakan"
      }
    ]
  },
  {
    "char": "力",
    "level": "N4",
    "arti": "kekuatan / tenaga",
    "onyomi": [
      "リョク",
      "リキ",
      "リイ"
    ],
    "kunyomi": [
      "ちから"
    ],
    "strokes": 2,
    "examples": [
      {
        "word": "力",
        "reading": "ちから",
        "arti": "kekuatan / tenaga"
      }
    ]
  },
  {
    "char": "問",
    "level": "N4",
    "arti": "pertanyaan / masalah",
    "onyomi": [
      "モン"
    ],
    "kunyomi": [
      "と.う",
      "と.い",
      "とん"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "質問",
        "reading": "しつもん",
        "arti": "pertanyaan"
      },
      {
        "word": "問題",
        "reading": "もんだい",
        "arti": "soal / masalah"
      }
    ]
  },
  {
    "char": "代",
    "level": "N4",
    "arti": "mengganti / generasi / biaya",
    "onyomi": [
      "ダイ",
      "タイ"
    ],
    "kunyomi": [
      "か.わる",
      "かわ.る",
      "かわ.り",
      "か.わり",
      "-がわ.り",
      "-が.わり",
      "か.える",
      "よ",
      "しろ"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "時代",
        "reading": "じだい",
        "arti": "zaman / era"
      },
      {
        "word": "電車代",
        "reading": "でんしゃだい",
        "arti": "ongkos kereta"
      }
    ]
  },
  {
    "char": "明",
    "level": "N4",
    "arti": "terang / jelas",
    "onyomi": [
      "メイ",
      "ミョウ",
      "ミン"
    ],
    "kunyomi": [
      "あ.かり",
      "あか.るい",
      "あか.るむ",
      "あか.らむ",
      "あき.らか",
      "あ.ける",
      "-あ.け",
      "あ.く",
      "あ.くる",
      "あ.かす"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "明るい",
        "reading": "あかるい",
        "arti": "terang / ceria"
      },
      {
        "word": "説明",
        "reading": "せつめい",
        "arti": "penjelasan"
      }
    ]
  },
  {
    "char": "動",
    "level": "N4",
    "arti": "bergerak",
    "onyomi": [
      "ドウ"
    ],
    "kunyomi": [
      "うご.く",
      "うご.かす"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "動く",
        "reading": "うごく",
        "arti": "bergerak"
      },
      {
        "word": "運動",
        "reading": "うんどう",
        "arti": "olahraga / gerakan"
      }
    ]
  },
  {
    "char": "京",
    "level": "N4",
    "arti": "ibu kota",
    "onyomi": [
      "キョウ",
      "ケイ",
      "キン"
    ],
    "kunyomi": [
      "みやこ"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "東京",
        "reading": "とうきょう",
        "arti": "Tokyo"
      },
      {
        "word": "京都",
        "reading": "きょうと",
        "arti": "Kyoto"
      }
    ]
  },
  {
    "char": "通",
    "level": "N4",
    "arti": "melewati / pulang-pergi",
    "onyomi": [
      "ツウ",
      "ツ"
    ],
    "kunyomi": [
      "とお.る",
      "とお.り",
      "-とお.り",
      "-どお.り",
      "とお.す",
      "とお.し",
      "-どお.し",
      "かよ.う"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "通る",
        "reading": "とおる",
        "arti": "melewati"
      },
      {
        "word": "通う",
        "reading": "かよう",
        "arti": "pulang-pergi (sekolah/kerja)"
      }
    ]
  },
  {
    "char": "理",
    "level": "N4",
    "arti": "alasan / logika / mengurus",
    "onyomi": [
      "リ"
    ],
    "kunyomi": [
      "ことわり"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "料理",
        "reading": "りょうり",
        "arti": "masakan"
      },
      {
        "word": "無理",
        "reading": "むり",
        "arti": "mustahil / berlebihan"
      }
    ]
  },
  {
    "char": "体",
    "level": "N4",
    "arti": "tubuh / badan",
    "onyomi": [
      "タイ",
      "テイ"
    ],
    "kunyomi": [
      "からだ",
      "かたち"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "体",
        "reading": "からだ",
        "arti": "tubuh / badan"
      },
      {
        "word": "大体",
        "reading": "だいたい",
        "arti": "kira-kira / garis besar"
      }
    ]
  },
  {
    "char": "田",
    "level": "N4",
    "arti": "sawah",
    "onyomi": [
      "デン"
    ],
    "kunyomi": [
      "た"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "田舎",
        "reading": "いなか",
        "arti": "pedesaan"
      },
      {
        "word": "水田",
        "reading": "すいでん",
        "arti": "sawah berair"
      }
    ]
  },
  {
    "char": "主",
    "level": "N4",
    "arti": "utama / tuan / pemilik",
    "onyomi": [
      "シュ",
      "ス",
      "シュウ"
    ],
    "kunyomi": [
      "ぬし",
      "おも",
      "あるじ"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "ご主人",
        "reading": "ごしゅじん",
        "arti": "suami (orang lain)"
      },
      {
        "word": "持ち主",
        "reading": "もちぬし",
        "arti": "pemilik"
      }
    ]
  },
  {
    "char": "題",
    "level": "N4",
    "arti": "topik / judul / soal",
    "onyomi": [
      "ダイ"
    ],
    "kunyomi": [],
    "strokes": 18,
    "examples": [
      {
        "word": "宿題",
        "reading": "しゅくだい",
        "arti": "pekerjaan rumah (PR)"
      },
      {
        "word": "問題",
        "reading": "もんだい",
        "arti": "masalah / soal"
      }
    ]
  },
  {
    "char": "首",
    "level": "N4",
    "arti": "leher",
    "onyomi": [
      "シュ"
    ],
    "kunyomi": [
      "くび"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "首",
        "reading": "くび",
        "arti": "leher"
      }
    ]
  },
  {
    "char": "意",
    "level": "N4",
    "arti": "maksud / pikiran",
    "onyomi": [
      "イ"
    ],
    "kunyomi": [],
    "strokes": 13,
    "examples": [
      {
        "word": "意見",
        "reading": "いけん",
        "arti": "pendapat"
      },
      {
        "word": "注意",
        "reading": "ちゅうい",
        "arti": "perhatian / peringatan"
      }
    ]
  },
  {
    "char": "不",
    "level": "N4",
    "arti": "tidak / bukan (awalan negatif)",
    "onyomi": [
      "フ",
      "ブ"
    ],
    "kunyomi": [],
    "strokes": 4,
    "examples": [
      {
        "word": "不便",
        "reading": "ふべん",
        "arti": "tidak praktis"
      },
      {
        "word": "不安",
        "reading": "ふあん",
        "arti": "cemas / khawatir"
      }
    ]
  },
  {
    "char": "作",
    "level": "N4",
    "arti": "membuat / karya",
    "onyomi": [
      "サク",
      "サ"
    ],
    "kunyomi": [
      "つく.る",
      "つく.り",
      "-づく.り"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "作る",
        "reading": "つくる",
        "arti": "membuat"
      },
      {
        "word": "作文",
        "reading": "さくぶん",
        "arti": "karangan"
      }
    ]
  },
  {
    "char": "用",
    "level": "N4",
    "arti": "keperluan / memakai",
    "onyomi": [
      "ヨウ"
    ],
    "kunyomi": [
      "もち.いる"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "用事",
        "reading": "ようじ",
        "arti": "urusan"
      },
      {
        "word": "利用",
        "reading": "りよう",
        "arti": "memanfaatkan"
      }
    ]
  },
  {
    "char": "度",
    "level": "N4",
    "arti": "derajat / kali / kadar",
    "onyomi": [
      "ド",
      "ト",
      "タク"
    ],
    "kunyomi": [
      "たび",
      "-た.い"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "今度",
        "reading": "こんど",
        "arti": "kali ini / lain kali"
      },
      {
        "word": "一度",
        "reading": "いちど",
        "arti": "satu kali"
      }
    ]
  },
  {
    "char": "強",
    "level": "N4",
    "arti": "kuat",
    "onyomi": [
      "キョウ",
      "ゴウ"
    ],
    "kunyomi": [
      "つよ.い",
      "つよ.まる",
      "つよ.める",
      "し.いる",
      "こわ.い"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "強い",
        "reading": "つよい",
        "arti": "kuat"
      },
      {
        "word": "勉強",
        "reading": "べんきょう",
        "arti": "belajar"
      }
    ]
  },
  {
    "char": "持",
    "level": "N4",
    "arti": "membawa / memiliki",
    "onyomi": [
      "ジ"
    ],
    "kunyomi": [
      "も.つ",
      "-も.ち",
      "も.てる"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "持つ",
        "reading": "もつ",
        "arti": "memegang / membawa"
      },
      {
        "word": "気持ち",
        "reading": "きもち",
        "arti": "perasaan"
      }
    ]
  },
  {
    "char": "野",
    "level": "N4",
    "arti": "padang / lapangan",
    "onyomi": [
      "ヤ",
      "ショ"
    ],
    "kunyomi": [
      "の",
      "の-"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "野菜",
        "reading": "やさい",
        "arti": "sayuran"
      },
      {
        "word": "野球",
        "reading": "やきゅう",
        "arti": "bisbol"
      }
    ]
  },
  {
    "char": "都",
    "level": "N4",
    "arti": "metropolis / kota besar",
    "onyomi": [
      "ト",
      "ツ"
    ],
    "kunyomi": [
      "みやこ"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "都合",
        "reading": "つごう",
        "arti": "kondisi / kenyamanan jadwal"
      },
      {
        "word": "東京都",
        "reading": "とうきょうと",
        "arti": "Prefektur Metropolitan Tokyo"
      }
    ]
  },
  {
    "char": "以",
    "level": "N4",
    "arti": "dengan / mulai dari / kurang-lebih",
    "onyomi": [
      "イ"
    ],
    "kunyomi": [
      "もっ.て"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "以下",
        "reading": "いか",
        "arti": "di bawah / kurang dari"
      },
      {
        "word": "以上",
        "reading": "いじょう",
        "arti": "di atas / lebih dari"
      }
    ]
  },
  {
    "char": "思",
    "level": "N4",
    "arti": "berpikir / merasa",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "おも.う",
      "おもえら.く",
      "おぼ.す"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "思う",
        "reading": "おもう",
        "arti": "berpikir / mengira"
      },
      {
        "word": "思い出す",
        "reading": "おもいだす",
        "arti": "teringat"
      }
    ]
  },
  {
    "char": "家",
    "level": "N4",
    "arti": "rumah / keluarga",
    "onyomi": [
      "カ",
      "ケ"
    ],
    "kunyomi": [
      "いえ",
      "や",
      "うち"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "家",
        "reading": "いえ / うち",
        "arti": "rumah"
      },
      {
        "word": "家族",
        "reading": "かぞく",
        "arti": "keluarga"
      }
    ]
  },
  {
    "char": "世",
    "level": "N4",
    "arti": "dunia / generasi",
    "onyomi": [
      "セイ",
      "セ",
      "ソウ"
    ],
    "kunyomi": [
      "よ"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "世界",
        "reading": "せかい",
        "arti": "dunia"
      },
      {
        "word": "世話",
        "reading": "せわ",
        "arti": "merawat / mengurus"
      }
    ]
  },
  {
    "char": "区",
    "level": "N4",
    "arti": "distrik / kawasan",
    "onyomi": [
      "ク",
      "オウ",
      "コウ"
    ],
    "kunyomi": [],
    "strokes": 4,
    "examples": [
      {
        "word": "区",
        "reading": "く",
        "arti": "distrik kota"
      },
      {
        "word": "区別",
        "reading": "くべつ",
        "arti": "pembedaan"
      }
    ]
  },
  {
    "char": "県",
    "level": "N4",
    "arti": "prefektur (provinsi)",
    "onyomi": [
      "ケン"
    ],
    "kunyomi": [
      "か.ける"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "県",
        "reading": "けん",
        "arti": "prefektur"
      },
      {
        "word": "静岡県",
        "reading": "しずおかけん",
        "arti": "Prefektur Shizuoka"
      }
    ]
  },
  {
    "char": "進",
    "level": "N4",
    "arti": "maju",
    "onyomi": [
      "シン"
    ],
    "kunyomi": [
      "すす.む",
      "すす.める"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "進む",
        "reading": "すすむ",
        "arti": "maju / berkembang"
      }
    ]
  },
  {
    "char": "正",
    "level": "N4",
    "arti": "benar / lurus / tepat",
    "onyomi": [
      "セイ",
      "ショウ"
    ],
    "kunyomi": [
      "ただ.しい",
      "ただ.す",
      "まさ",
      "まさ.に"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "正しい",
        "reading": "ただしい",
        "arti": "benar / tepat"
      },
      {
        "word": "正月",
        "reading": "しょうがつ",
        "arti": "Tahun Baru"
      }
    ]
  },
  {
    "char": "院",
    "level": "N4",
    "arti": "lembaga / gedung",
    "onyomi": [
      "イン"
    ],
    "kunyomi": [],
    "strokes": 10,
    "examples": [
      {
        "word": "病院",
        "reading": "びょういん",
        "arti": "rumah sakit"
      },
      {
        "word": "入院",
        "reading": "にゅういん",
        "arti": "masuk rumah sakit"
      }
    ]
  },
  {
    "char": "心",
    "level": "N4",
    "arti": "hati / batin",
    "onyomi": [
      "シン"
    ],
    "kunyomi": [
      "こころ",
      "-ごころ"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "心",
        "reading": "こころ",
        "arti": "hati / jiwa"
      },
      {
        "word": "安心",
        "reading": "あんしん",
        "arti": "lega"
      }
    ]
  },
  {
    "char": "界",
    "level": "N4",
    "arti": "dunia / batas",
    "onyomi": [
      "カイ"
    ],
    "kunyomi": [],
    "strokes": 9,
    "examples": [
      {
        "word": "世界",
        "reading": "せかい",
        "arti": "dunia"
      }
    ]
  },
  {
    "char": "産",
    "level": "N4",
    "arti": "produksi / melahirkan",
    "onyomi": [
      "サン"
    ],
    "kunyomi": [
      "う.む",
      "う.まれる",
      "うぶ-",
      "む.す"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "生産",
        "reading": "せいさん",
        "arti": "produksi"
      },
      {
        "word": "産業",
        "reading": "さんぎょう",
        "arti": "industri"
      }
    ]
  },
  {
    "char": "教",
    "level": "N4",
    "arti": "mengajar / ajaran",
    "onyomi": [
      "キョウ"
    ],
    "kunyomi": [
      "おし.える",
      "おそ.わる"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "教える",
        "reading": "おしえる",
        "arti": "mengajar / memberitahu"
      },
      {
        "word": "教室",
        "reading": "きょうしつ",
        "arti": "ruang kelas"
      }
    ]
  },
  {
    "char": "文",
    "level": "N4",
    "arti": "kalimat / tulisan / budaya",
    "onyomi": [
      "ブン",
      "モン"
    ],
    "kunyomi": [
      "ふみ",
      "あや"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "文法",
        "reading": "ぶんぽう",
        "arti": "tata bahasa"
      },
      {
        "word": "文化",
        "reading": "ぶんか",
        "arti": "budaya"
      }
    ]
  },
  {
    "char": "元",
    "level": "N4",
    "arti": "asal / semula / sehat",
    "onyomi": [
      "ゲン",
      "ガン"
    ],
    "kunyomi": [
      "もと"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "元気",
        "reading": "げんき",
        "arti": "sehat / bugar"
      },
      {
        "word": "足元",
        "reading": "あしもと",
        "arti": "sekitar kaki"
      }
    ]
  },
  {
    "char": "重",
    "level": "N4",
    "arti": "berat / penting",
    "onyomi": [
      "ジュウ",
      "チョウ"
    ],
    "kunyomi": [
      "え",
      "おも.い",
      "おも.り",
      "おも.なう",
      "かさ.ねる",
      "かさ.なる",
      "おも"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "重い",
        "reading": "おもい",
        "arti": "berat"
      },
      {
        "word": "体重",
        "reading": "たいじゅう",
        "arti": "berat badan"
      }
    ]
  },
  {
    "char": "近",
    "level": "N4",
    "arti": "dekat",
    "onyomi": [
      "キン",
      "コン"
    ],
    "kunyomi": [
      "ちか.い"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "近い",
        "reading": "ちかい",
        "arti": "dekat"
      },
      {
        "word": "最近",
        "reading": "さいきん",
        "arti": "akhir-akhir ini"
      }
    ]
  },
  {
    "char": "考",
    "level": "N4",
    "arti": "memikirkan / mempertimbangkan",
    "onyomi": [
      "コウ"
    ],
    "kunyomi": [
      "かんが.える",
      "かんが.え"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "考える",
        "reading": "かんがえる",
        "arti": "berpikir / mempertimbangkan"
      }
    ]
  },
  {
    "char": "画",
    "level": "N4",
    "arti": "gambar / rencana / guratan",
    "onyomi": [
      "ガ",
      "カク",
      "エ",
      "カイ"
    ],
    "kunyomi": [
      "えが.く",
      "かく.する",
      "かぎ.る",
      "はかりごと",
      "はか.る"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "映画",
        "reading": "えいが",
        "arti": "film"
      },
      {
        "word": "計画",
        "reading": "けいかく",
        "arti": "rencana"
      }
    ]
  },
  {
    "char": "海",
    "level": "N4",
    "arti": "laut",
    "onyomi": [
      "カイ"
    ],
    "kunyomi": [
      "うみ"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "海",
        "reading": "うみ",
        "arti": "laut"
      },
      {
        "word": "海岸",
        "reading": "かいがん",
        "arti": "pantai"
      }
    ]
  },
  {
    "char": "売",
    "level": "N4",
    "arti": "menjual",
    "onyomi": [
      "バイ"
    ],
    "kunyomi": [
      "う.る",
      "う.れる"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "売る",
        "reading": "うる",
        "arti": "menjual"
      },
      {
        "word": "売り場",
        "reading": "うりば",
        "arti": "konter penjualan"
      }
    ]
  },
  {
    "char": "知",
    "level": "N4",
    "arti": "tahu / mengenal",
    "onyomi": [
      "チ"
    ],
    "kunyomi": [
      "し.る",
      "し.らせる"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "知る",
        "reading": "しる",
        "arti": "mengetahui"
      },
      {
        "word": "承知",
        "reading": "しょうち",
        "arti": "mengerti / menyetujui"
      }
    ]
  },
  {
    "char": "集",
    "level": "N4",
    "arti": "mengumpulkan / berkumpul",
    "onyomi": [
      "シュウ"
    ],
    "kunyomi": [
      "あつ.まる",
      "あつ.める",
      "つど.う"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "集める",
        "reading": "あつめる",
        "arti": "mengumpulkan"
      },
      {
        "word": "集まる",
        "reading": "あつまる",
        "arti": "berkumpul"
      }
    ]
  },
  {
    "char": "別",
    "level": "N4",
    "arti": "terpisah / lain / khusus",
    "onyomi": [
      "ベツ"
    ],
    "kunyomi": [
      "わか.れる",
      "わ.ける"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "特別",
        "reading": "とくべつ",
        "arti": "istimewa / spesial"
      },
      {
        "word": "別れる",
        "reading": "わかれる",
        "arti": "berpisah"
      }
    ]
  },
  {
    "char": "物",
    "level": "N4",
    "arti": "benda / barang",
    "onyomi": [
      "ブツ",
      "モツ"
    ],
    "kunyomi": [
      "もの",
      "もの-"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "物",
        "reading": "もの",
        "arti": "benda"
      },
      {
        "word": "品物",
        "reading": "しなもの",
        "arti": "barang dagangan"
      }
    ]
  },
  {
    "char": "引",
    "level": "N4",
    "arti": "menarik / mengurangi",
    "onyomi": [
      "イン"
    ],
    "kunyomi": [
      "ひ.く",
      "ひ.き",
      "ひ.き-",
      "-び.き",
      "ひ.ける"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "引く",
        "reading": "ひく",
        "arti": "menarik / membuka kamus"
      },
      {
        "word": "字引",
        "reading": "じびき",
        "arti": "kamus"
      }
    ]
  },
  {
    "char": "使",
    "level": "N4",
    "arti": "menggunakan",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "つか.う",
      "つか.い",
      "-つか.い",
      "-づか.い"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "使う",
        "reading": "つかう",
        "arti": "menggunakan / memakai"
      },
      {
        "word": "大使館",
        "reading": "たいしかん",
        "arti": "kedutaan besar"
      }
    ]
  },
  {
    "char": "所",
    "level": "N4",
    "arti": "tempat / bagian",
    "onyomi": [
      "ショ"
    ],
    "kunyomi": [
      "ところ",
      "-ところ",
      "どころ",
      "とこ"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "所",
        "reading": "ところ",
        "arti": "tempat"
      },
      {
        "word": "住所",
        "reading": "じゅうしょ",
        "arti": "alamat"
      }
    ]
  },
  {
    "char": "品",
    "level": "N4",
    "arti": "barang / kualitas",
    "onyomi": [
      "ヒン",
      "ホン"
    ],
    "kunyomi": [
      "しな"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "品物",
        "reading": "しなもの",
        "arti": "barang"
      },
      {
        "word": "食料品",
        "reading": "しょくりょうひん",
        "arti": "bahan makanan"
      }
    ]
  },
  {
    "char": "計",
    "level": "N4",
    "arti": "mengukur / rencana",
    "onyomi": [
      "ケイ"
    ],
    "kunyomi": [
      "はか.る",
      "はか.らう"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "時計",
        "reading": "とけい",
        "arti": "jam tangan / dinding"
      },
      {
        "word": "計画",
        "reading": "けいかく",
        "arti": "rencana"
      }
    ]
  },
  {
    "char": "死",
    "level": "N4",
    "arti": "mati / kematian",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "し.ぬ",
      "し.に-"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "死ぬ",
        "reading": "しぬ",
        "arti": "meninggal / mati"
      }
    ]
  },
  {
    "char": "特",
    "level": "N4",
    "arti": "khusus / spesial",
    "onyomi": [
      "トク"
    ],
    "kunyomi": [],
    "strokes": 10,
    "examples": [
      {
        "word": "特に",
        "reading": "とくに",
        "arti": "khususnya"
      },
      {
        "word": "特急",
        "reading": "とっきゅう",
        "arti": "kereta ekspres terbatas"
      }
    ]
  },
  {
    "char": "私",
    "level": "N4",
    "arti": "saya / pribadi",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "わたくし",
      "わたし"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "私",
        "reading": "わたし",
        "arti": "saya"
      },
      {
        "word": "私立",
        "reading": "しりつ",
        "arti": "swasta"
      }
    ]
  },
  {
    "char": "始",
    "level": "N4",
    "arti": "memulai / mulai",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "はじ.める",
      "-はじ.める",
      "はじ.まる"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "始める",
        "reading": "はじめる",
        "arti": "memulai"
      },
      {
        "word": "始まる",
        "reading": "はじまる",
        "arti": "dimulai"
      }
    ]
  },
  {
    "char": "朝",
    "level": "N4",
    "arti": "pagi",
    "onyomi": [
      "チョウ"
    ],
    "kunyomi": [
      "あさ"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "朝",
        "reading": "あさ",
        "arti": "pagi"
      },
      {
        "word": "今朝",
        "reading": "けさ",
        "arti": "tadi pagi"
      }
    ]
  },
  {
    "char": "村",
    "level": "N4",
    "arti": "desa",
    "onyomi": [
      "ソン"
    ],
    "kunyomi": [
      "むら"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "村",
        "reading": "むら",
        "arti": "desa"
      }
    ]
  },
  {
    "char": "運",
    "level": "N4",
    "arti": "mengangkut / nasib",
    "onyomi": [
      "ウン"
    ],
    "kunyomi": [
      "はこ.ぶ"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "運転",
        "reading": "うんてん",
        "arti": "mengemudi"
      },
      {
        "word": "運動",
        "reading": "うんどう",
        "arti": "olahraga"
      }
    ]
  },
  {
    "char": "終",
    "level": "N4",
    "arti": "selesai / berakhir",
    "onyomi": [
      "シュウ"
    ],
    "kunyomi": [
      "お.わる",
      "-お.わる",
      "おわ.る",
      "お.える",
      "つい",
      "つい.に"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "終わる",
        "reading": "おわる",
        "arti": "selesai"
      },
      {
        "word": "終わり",
        "reading": "おわり",
        "arti": "akhir"
      }
    ]
  },
  {
    "char": "台",
    "level": "N4",
    "arti": "meja tumpu / satuan mesin",
    "onyomi": [
      "ダイ",
      "タイ"
    ],
    "kunyomi": [
      "うてな",
      "われ",
      "つかさ"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "台風",
        "reading": "たいふう",
        "arti": "angin topan"
      },
      {
        "word": "台所",
        "reading": "だいどころ",
        "arti": "dapur"
      }
    ]
  },
  {
    "char": "広",
    "level": "N4",
    "arti": "luas / lebar",
    "onyomi": [
      "コウ"
    ],
    "kunyomi": [
      "ひろ.い",
      "ひろ.まる",
      "ひろ.める",
      "ひろ.がる",
      "ひろ.げる"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "広い",
        "reading": "ひろい",
        "arti": "luas / lebar"
      }
    ]
  },
  {
    "char": "住",
    "level": "N4",
    "arti": "tinggal / menetap",
    "onyomi": [
      "ジュウ",
      "ヂュウ",
      "チュウ"
    ],
    "kunyomi": [
      "す.む",
      "す.まう",
      "-ず.まい"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "住む",
        "reading": "すむ",
        "arti": "tinggal"
      },
      {
        "word": "住所",
        "reading": "じゅうしょ",
        "arti": "alamat"
      }
    ]
  },
  {
    "char": "真",
    "level": "N4",
    "arti": "benar / sejati / tengah",
    "onyomi": [
      "シン"
    ],
    "kunyomi": [
      "ま",
      "ま-",
      "まこと"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "写真",
        "reading": "しゃしん",
        "arti": "foto"
      },
      {
        "word": "真ん中",
        "reading": "まんなか",
        "arti": "tengah-tengah"
      }
    ]
  },
  {
    "char": "有",
    "level": "N4",
    "arti": "ada / memiliki",
    "onyomi": [
      "ユウ",
      "ウ"
    ],
    "kunyomi": [
      "あ.る"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "有名",
        "reading": "ゆうめい",
        "arti": "terkenal"
      },
      {
        "word": "有る",
        "reading": "ある",
        "arti": "ada (benda mati)"
      }
    ]
  },
  {
    "char": "町",
    "level": "N4",
    "arti": "kota kecil / distrik",
    "onyomi": [
      "チョウ"
    ],
    "kunyomi": [
      "まち"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "町",
        "reading": "まち",
        "arti": "kota kecil / lingkungan"
      }
    ]
  },
  {
    "char": "料",
    "level": "N4",
    "arti": "biaya / bahan",
    "onyomi": [
      "リョウ"
    ],
    "kunyomi": [],
    "strokes": 10,
    "examples": [
      {
        "word": "料理",
        "reading": "りょうり",
        "arti": "masakan"
      },
      {
        "word": "食料品",
        "reading": "しょくりょうひん",
        "arti": "bahan makanan"
      }
    ]
  },
  {
    "char": "工",
    "level": "N4",
    "arti": "teknik / pengerjaan",
    "onyomi": [
      "コウ",
      "ク",
      "グ"
    ],
    "kunyomi": [],
    "strokes": 3,
    "examples": [
      {
        "word": "工場",
        "reading": "こうじょう",
        "arti": "pabrik"
      },
      {
        "word": "工業",
        "reading": "こうぎょう",
        "arti": "industri manufaktur"
      }
    ]
  },
  {
    "char": "建",
    "level": "N4",
    "arti": "membangun",
    "onyomi": [
      "ケン",
      "コン"
    ],
    "kunyomi": [
      "た.てる",
      "た.て",
      "-だ.て",
      "た.つ"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "建物",
        "reading": "たてもの",
        "arti": "bangunan"
      },
      {
        "word": "建てる",
        "reading": "たてる",
        "arti": "membangun"
      }
    ]
  },
  {
    "char": "急",
    "level": "N4",
    "arti": "terburu-buru / mendadak",
    "onyomi": [
      "キュウ"
    ],
    "kunyomi": [
      "いそ.ぐ",
      "いそ.ぎ",
      "せ.く"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "急ぐ",
        "reading": "いそぐ",
        "arti": "bergegas"
      },
      {
        "word": "急行",
        "reading": "きゅうこう",
        "arti": "kereta ekspres"
      }
    ]
  },
  {
    "char": "止",
    "level": "N4",
    "arti": "berhenti / menghentikan",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "と.まる",
      "-ど.まり",
      "と.める",
      "-と.める",
      "-ど.め",
      "とど.める",
      "とど.め",
      "とど.まる",
      "や.める",
      "や.む",
      "-や.む",
      "よ.す",
      "-さ.す",
      "-さ.し"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "止まる",
        "reading": "とまる",
        "arti": "berhenti"
      },
      {
        "word": "止める",
        "reading": "やめる / とめる",
        "arti": "menghentikan"
      }
    ]
  },
  {
    "char": "送",
    "level": "N4",
    "arti": "mengirim / mengantar",
    "onyomi": [
      "ソウ"
    ],
    "kunyomi": [
      "おく.る"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "送る",
        "reading": "おくる",
        "arti": "mengirim"
      },
      {
        "word": "放送",
        "reading": "ほうそう",
        "arti": "siaran"
      }
    ]
  },
  {
    "char": "切",
    "level": "N4",
    "arti": "memotong / akrab",
    "onyomi": [
      "セツ",
      "サイ"
    ],
    "kunyomi": [
      "き.る",
      "-き.る",
      "き.り",
      "-き.り",
      "-ぎ.り",
      "き.れる",
      "-き.れる",
      "き.れ",
      "-き.れ",
      "-ぎ.れ"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "切る",
        "reading": "きる",
        "arti": "memotong"
      },
      {
        "word": "親切",
        "reading": "しんせつ",
        "arti": "ramah / baik hati"
      }
    ]
  },
  {
    "char": "説",
    "level": "N4",
    "arti": "menjelaskan / teori",
    "onyomi": [
      "セツ",
      "ゼイ"
    ],
    "kunyomi": [
      "と.く"
    ],
    "strokes": 14,
    "examples": [
      {
        "word": "説明",
        "reading": "せつめい",
        "arti": "penjelasan"
      },
      {
        "word": "小説",
        "reading": "しょうせつ",
        "arti": "novel"
      }
    ]
  },
  {
    "char": "転",
    "level": "N4",
    "arti": "berputar / berguling / pindah",
    "onyomi": [
      "テン"
    ],
    "kunyomi": [
      "ころ.がる",
      "ころ.げる",
      "ころ.がす",
      "ころ.ぶ",
      "まろ.ぶ",
      "うたた",
      "うつ.る",
      "くる.めく"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "運転",
        "reading": "うんてん",
        "arti": "menyetir"
      },
      {
        "word": "自転車",
        "reading": "じてんしゃ",
        "arti": "sepeda"
      }
    ]
  },
  {
    "char": "研",
    "level": "N4",
    "arti": "mengasah / meneliti",
    "onyomi": [
      "ケン"
    ],
    "kunyomi": [
      "と.ぐ"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "研究",
        "reading": "けんきゅう",
        "arti": "penelitian"
      },
      {
        "word": "研究室",
        "reading": "けんきゅうしつ",
        "arti": "ruang lab / penelitian"
      }
    ]
  },
  {
    "char": "究",
    "level": "N4",
    "arti": "meneliti / mendalami",
    "onyomi": [
      "キュウ",
      "ク"
    ],
    "kunyomi": [
      "きわ.める"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "研究",
        "reading": "けんきゅう",
        "arti": "penelitian"
      }
    ]
  },
  {
    "char": "楽",
    "level": "N4",
    "arti": "menyenangkan / musik / nyaman",
    "onyomi": [
      "ガク",
      "ラク",
      "ゴウ"
    ],
    "kunyomi": [
      "たの.しい",
      "たの.しむ",
      "この.む"
    ],
    "strokes": 13,
    "examples": [
      {
        "word": "楽しい",
        "reading": "たのしい",
        "arti": "menyenangkan"
      },
      {
        "word": "音楽",
        "reading": "おんがく",
        "arti": "musik"
      }
    ]
  },
  {
    "char": "起",
    "level": "N4",
    "arti": "bangun / terjadi",
    "onyomi": [
      "キ"
    ],
    "kunyomi": [
      "お.きる",
      "お.こる",
      "お.こす",
      "おこ.す",
      "た.つ"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "起きる",
        "reading": "おきる",
        "arti": "bangun tidur"
      },
      {
        "word": "起こす",
        "reading": "おこす",
        "arti": "membangunkan"
      }
    ]
  },
  {
    "char": "着",
    "level": "N4",
    "arti": "memakai (baju) / tiba",
    "onyomi": [
      "チャク",
      "ジャク"
    ],
    "kunyomi": [
      "き.る",
      "-ぎ",
      "き.せる",
      "-き.せ",
      "つ.く",
      "つ.ける"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "着る",
        "reading": "きる",
        "arti": "memakai (atasan)"
      },
      {
        "word": "着物",
        "reading": "きもの",
        "arti": "kimono"
      }
    ]
  },
  {
    "char": "乗",
    "level": "N4",
    "arti": "naik (kendaraan)",
    "onyomi": [
      "ジョウ",
      "ショウ"
    ],
    "kunyomi": [
      "の.る",
      "-の.り",
      "の.せる"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "乗る",
        "reading": "のる",
        "arti": "naik kendaraan"
      },
      {
        "word": "乗り物",
        "reading": "のりもの",
        "arti": "kendaraan"
      }
    ]
  },
  {
    "char": "病",
    "level": "N4",
    "arti": "sakit / penyakit",
    "onyomi": [
      "ビョウ",
      "ヘイ"
    ],
    "kunyomi": [
      "や.む",
      "-や.み",
      "やまい"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "病院",
        "reading": "びょういん",
        "arti": "rumah sakit"
      },
      {
        "word": "病気",
        "reading": "びょうき",
        "arti": "sakit / penyakit"
      }
    ]
  },
  {
    "char": "声",
    "level": "N4",
    "arti": "suara (vokal)",
    "onyomi": [
      "セイ",
      "ショウ"
    ],
    "kunyomi": [
      "こえ",
      "こわ-"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "声",
        "reading": "こえ",
        "arti": "suara"
      }
    ]
  },
  {
    "char": "質",
    "level": "N4",
    "arti": "kualitas / bertanya",
    "onyomi": [
      "シツ",
      "シチ",
      "チ"
    ],
    "kunyomi": [
      "たち",
      "ただ.す",
      "もと",
      "わりふ"
    ],
    "strokes": 15,
    "examples": [
      {
        "word": "質問",
        "reading": "しつもん",
        "arti": "pertanyaan"
      }
    ]
  },
  {
    "char": "待",
    "level": "N4",
    "arti": "menunggu",
    "onyomi": [
      "タイ"
    ],
    "kunyomi": [
      "ま.つ",
      "-ま.ち"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "待つ",
        "reading": "まつ",
        "arti": "menunggu"
      },
      {
        "word": "招待",
        "reading": "しょうたい",
        "arti": "undangan"
      }
    ]
  },
  {
    "char": "試",
    "level": "N4",
    "arti": "mencoba / ujian",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "こころ.みる",
      "ため.す"
    ],
    "strokes": 13,
    "examples": [
      {
        "word": "試験",
        "reading": "しけん",
        "arti": "ujian"
      },
      {
        "word": "試合",
        "reading": "しあい",
        "arti": "pertandingan"
      }
    ]
  },
  {
    "char": "族",
    "level": "N4",
    "arti": "keluarga / suku",
    "onyomi": [
      "ゾク"
    ],
    "kunyomi": [],
    "strokes": 11,
    "examples": [
      {
        "word": "家族",
        "reading": "かぞく",
        "arti": "keluarga"
      }
    ]
  },
  {
    "char": "銀",
    "level": "N4",
    "arti": "perak",
    "onyomi": [
      "ギン"
    ],
    "kunyomi": [
      "しろがね"
    ],
    "strokes": 14,
    "examples": [
      {
        "word": "銀行",
        "reading": "ぎんこう",
        "arti": "bank"
      }
    ]
  },
  {
    "char": "早",
    "level": "N4",
    "arti": "cepat / pagi-pagi",
    "onyomi": [
      "ソウ",
      "サッ"
    ],
    "kunyomi": [
      "はや.い",
      "はや",
      "はや-",
      "はや.まる",
      "はや.める",
      "さ-"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "早い",
        "reading": "はやい",
        "arti": "cepat (waktu) / awal"
      }
    ]
  },
  {
    "char": "映",
    "level": "N4",
    "arti": "memantulkan / menayangkan",
    "onyomi": [
      "エイ"
    ],
    "kunyomi": [
      "うつ.る",
      "うつ.す",
      "は.える",
      "-ば.え"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "映画",
        "reading": "えいが",
        "arti": "film"
      },
      {
        "word": "映画館",
        "reading": "えいがかん",
        "arti": "bioskop"
      }
    ]
  },
  {
    "char": "親",
    "level": "N4",
    "arti": "orang tua / akrab",
    "onyomi": [
      "シン"
    ],
    "kunyomi": [
      "おや",
      "おや-",
      "した.しい",
      "した.しむ"
    ],
    "strokes": 16,
    "examples": [
      {
        "word": "親",
        "reading": "おや",
        "arti": "orang tua"
      },
      {
        "word": "親切",
        "reading": "しんせつ",
        "arti": "ramah / baik hati"
      }
    ]
  },
  {
    "char": "験",
    "level": "N4",
    "arti": "menguji / pengalaman",
    "onyomi": [
      "ケン",
      "ゲン"
    ],
    "kunyomi": [
      "あかし",
      "しるし",
      "ため.す",
      "ためし"
    ],
    "strokes": 18,
    "examples": [
      {
        "word": "試験",
        "reading": "しけん",
        "arti": "ujian"
      },
      {
        "word": "経験",
        "reading": "けいけん",
        "arti": "pengalaman"
      }
    ]
  },
  {
    "char": "働",
    "level": "N4",
    "arti": "bekerja",
    "onyomi": [
      "ドウ"
    ],
    "kunyomi": [
      "はたら.く"
    ],
    "strokes": 13,
    "examples": [
      {
        "word": "働く",
        "reading": "はたらく",
        "arti": "bekerja"
      },
      {
        "word": "労働",
        "reading": "ろうどう",
        "arti": "tenaga kerja"
      }
    ]
  },
  {
    "char": "好",
    "level": "N4",
    "arti": "suka / menyukai",
    "onyomi": [
      "コウ"
    ],
    "kunyomi": [
      "この.む",
      "す.く",
      "よ.い",
      "い.い"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "好き",
        "reading": "すき",
        "arti": "suka"
      },
      {
        "word": "大好き",
        "reading": "だいすき",
        "arti": "sangat suka"
      }
    ]
  },
  {
    "char": "英",
    "level": "N4",
    "arti": "Inggris / unggul",
    "onyomi": [
      "エイ"
    ],
    "kunyomi": [
      "はなぶさ"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "英語",
        "reading": "えいご",
        "arti": "bahasa Inggris"
      }
    ]
  },
  {
    "char": "頭",
    "level": "N4",
    "arti": "kepala",
    "onyomi": [
      "トウ",
      "ズ",
      "ト"
    ],
    "kunyomi": [
      "あたま",
      "かしら",
      "-がしら",
      "かぶり"
    ],
    "strokes": 16,
    "examples": [
      {
        "word": "頭",
        "reading": "あたま",
        "arti": "kepala"
      }
    ]
  },
  {
    "char": "低",
    "level": "N4",
    "arti": "rendah",
    "onyomi": [
      "テイ"
    ],
    "kunyomi": [
      "ひく.い",
      "ひく.める",
      "ひく.まる"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "低い",
        "reading": "ひくい",
        "arti": "rendah"
      }
    ]
  },
  {
    "char": "医",
    "level": "N4",
    "arti": "medis / dokter",
    "onyomi": [
      "イ"
    ],
    "kunyomi": [
      "い.やす",
      "い.する",
      "くすし"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "医者",
        "reading": "いしゃ",
        "arti": "dokter"
      },
      {
        "word": "医学",
        "reading": "いがく",
        "arti": "ilmu kedokteran"
      }
    ]
  },
  {
    "char": "仕",
    "level": "N4",
    "arti": "melayani / bekerja",
    "onyomi": [
      "シ",
      "ジ"
    ],
    "kunyomi": [
      "つか.える"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "仕事",
        "reading": "しごと",
        "arti": "pekerjaan"
      },
      {
        "word": "仕方",
        "reading": "しかた",
        "arti": "cara"
      }
    ]
  },
  {
    "char": "去",
    "level": "N4",
    "arti": "pergi / yang lalu",
    "onyomi": [
      "キョ",
      "コ"
    ],
    "kunyomi": [
      "さ.る",
      "-さ.る"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "去年",
        "reading": "きょねん",
        "arti": "tahun lalu"
      }
    ]
  },
  {
    "char": "味",
    "level": "N4",
    "arti": "rasa",
    "onyomi": [
      "ミ"
    ],
    "kunyomi": [
      "あじ",
      "あじ.わう"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "味",
        "reading": "あじ",
        "arti": "rasa"
      },
      {
        "word": "意味",
        "reading": "いみ",
        "arti": "arti / makna"
      }
    ]
  },
  {
    "char": "門",
    "level": "N4",
    "arti": "gerbang",
    "onyomi": [
      "モン"
    ],
    "kunyomi": [
      "かど",
      "と"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "門",
        "reading": "もん",
        "arti": "gerbang"
      },
      {
        "word": "専門",
        "reading": "せんもん",
        "arti": "keahlian / jurusan"
      }
    ]
  },
  {
    "char": "写",
    "level": "N4",
    "arti": "menyalin / memotret",
    "onyomi": [
      "シャ",
      "ジャ"
    ],
    "kunyomi": [
      "うつ.す",
      "うつ.る",
      "うつ-",
      "うつ.し"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "写真",
        "reading": "しゃしん",
        "arti": "foto"
      },
      {
        "word": "写す",
        "reading": "うつす",
        "arti": "menyalin / memotret"
      }
    ]
  },
  {
    "char": "字",
    "level": "N4",
    "arti": "huruf / karakter",
    "onyomi": [
      "ジ"
    ],
    "kunyomi": [
      "あざ",
      "あざな",
      "-な"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "字",
        "reading": "じ",
        "arti": "huruf"
      },
      {
        "word": "漢字",
        "reading": "かんじ",
        "arti": "kanji"
      }
    ]
  },
  {
    "char": "答",
    "level": "N4",
    "arti": "menjawab / jawaban",
    "onyomi": [
      "トウ"
    ],
    "kunyomi": [
      "こた.える",
      "こた.え"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "答える",
        "reading": "こたえる",
        "arti": "menjawab"
      },
      {
        "word": "答え",
        "reading": "こたえ",
        "arti": "jawaban"
      }
    ]
  },
  {
    "char": "夜",
    "level": "N4",
    "arti": "malam",
    "onyomi": [
      "ヤ"
    ],
    "kunyomi": [
      "よ",
      "よる"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "夜",
        "reading": "よる",
        "arti": "malam"
      },
      {
        "word": "今夜",
        "reading": "こんや",
        "arti": "malam ini"
      }
    ]
  },
  {
    "char": "音",
    "level": "N4",
    "arti": "bunyi / suara",
    "onyomi": [
      "オン",
      "イン",
      "-ノン"
    ],
    "kunyomi": [
      "おと",
      "ね"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "音",
        "reading": "おと",
        "arti": "bunyi / suara"
      },
      {
        "word": "音楽",
        "reading": "おんがく",
        "arti": "musik"
      }
    ]
  },
  {
    "char": "注",
    "level": "N4",
    "arti": "menuang / memperhatikan",
    "onyomi": [
      "チュウ"
    ],
    "kunyomi": [
      "そそ.ぐ",
      "さ.す",
      "つ.ぐ"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "注意",
        "reading": "ちゅうい",
        "arti": "perhatian / hati-hati"
      },
      {
        "word": "注射",
        "reading": "ちゅうしゃ",
        "arti": "suntikan"
      }
    ]
  },
  {
    "char": "帰",
    "level": "N4",
    "arti": "pulang",
    "onyomi": [
      "キ"
    ],
    "kunyomi": [
      "かえ.る",
      "かえ.す",
      "おく.る",
      "とつ.ぐ"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "帰る",
        "reading": "かえる",
        "arti": "pulang"
      },
      {
        "word": "帰り",
        "reading": "かえり",
        "arti": "perjalanan pulang"
      }
    ]
  },
  {
    "char": "歌",
    "level": "N4",
    "arti": "lagu / menyanyi",
    "onyomi": [
      "カ"
    ],
    "kunyomi": [
      "うた",
      "うた.う"
    ],
    "strokes": 14,
    "examples": [
      {
        "word": "歌",
        "reading": "うた",
        "arti": "lagu"
      },
      {
        "word": "歌う",
        "reading": "うたう",
        "arti": "menyanyi"
      }
    ]
  },
  {
    "char": "光",
    "level": "N4",
    "arti": "cahaya / bersinar",
    "onyomi": [
      "コウ"
    ],
    "kunyomi": [
      "ひか.る",
      "ひかり"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "光",
        "reading": "ひかり",
        "arti": "cahaya"
      },
      {
        "word": "光る",
        "reading": "ひかる",
        "arti": "bersinar"
      }
    ]
  },
  {
    "char": "悪",
    "level": "N4",
    "arti": "buruk / jahat",
    "onyomi": [
      "アク",
      "オ"
    ],
    "kunyomi": [
      "わる.い",
      "わる-",
      "あ.し",
      "にく.い",
      "-にく.い",
      "ああ",
      "いずくに",
      "いずくんぞ",
      "にく.む"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "悪い",
        "reading": "わるい",
        "arti": "buruk / jelek"
      }
    ]
  },
  {
    "char": "図",
    "level": "N4",
    "arti": "gambar / peta / denah",
    "onyomi": [
      "ズ",
      "ト"
    ],
    "kunyomi": [
      "え",
      "はか.る"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "地図",
        "reading": "ちず",
        "arti": "peta"
      },
      {
        "word": "図書館",
        "reading": "としょかん",
        "arti": "perpustakaan"
      }
    ]
  },
  {
    "char": "室",
    "level": "N4",
    "arti": "ruangan",
    "onyomi": [
      "シツ"
    ],
    "kunyomi": [
      "むろ"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "教室",
        "reading": "きょうしつ",
        "arti": "ruang kelas"
      },
      {
        "word": "会議室",
        "reading": "かいぎしつ",
        "arti": "ruang rapat"
      }
    ]
  },
  {
    "char": "太",
    "level": "N4",
    "arti": "gemuk / tebal",
    "onyomi": [
      "タイ",
      "タ"
    ],
    "kunyomi": [
      "ふと.い",
      "ふと.る"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "太い",
        "reading": "ふとい",
        "arti": "tebal / besar"
      },
      {
        "word": "太る",
        "reading": "ふとる",
        "arti": "menjadi gemuk"
      }
    ]
  },
  {
    "char": "歩",
    "level": "N4",
    "arti": "berjalan kaki",
    "onyomi": [
      "ホ",
      "ブ",
      "フ"
    ],
    "kunyomi": [
      "ある.く",
      "あゆ.む"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "歩く",
        "reading": "あるく",
        "arti": "berjalan kaki"
      },
      {
        "word": "散歩",
        "reading": "さんぽ",
        "arti": "jalan-jalan santai"
      }
    ]
  },
  {
    "char": "風",
    "level": "N4",
    "arti": "angin / gaya",
    "onyomi": [
      "フウ",
      "フ"
    ],
    "kunyomi": [
      "かぜ",
      "かざ-",
      "-かぜ"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "風",
        "reading": "かぜ",
        "arti": "angin"
      },
      {
        "word": "台風",
        "reading": "たいふう",
        "arti": "topan"
      }
    ]
  },
  {
    "char": "紙",
    "level": "N4",
    "arti": "kertas",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "かみ"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "紙",
        "reading": "かみ",
        "arti": "kertas"
      },
      {
        "word": "手紙",
        "reading": "てがみ",
        "arti": "surat"
      }
    ]
  },
  {
    "char": "黒",
    "level": "N4",
    "arti": "hitam",
    "onyomi": [
      "コク"
    ],
    "kunyomi": [
      "くろ",
      "くろ.ずむ",
      "くろ.い"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "黒い",
        "reading": "くろい",
        "arti": "hitam"
      },
      {
        "word": "黒",
        "reading": "くろ",
        "arti": "warna hitam"
      }
    ]
  },
  {
    "char": "春",
    "level": "N4",
    "arti": "musim semi",
    "onyomi": [
      "シュン"
    ],
    "kunyomi": [
      "はる"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "春",
        "reading": "はる",
        "arti": "musim semi"
      },
      {
        "word": "春休み",
        "reading": "はるやすみ",
        "arti": "libur musim semi"
      }
    ]
  },
  {
    "char": "赤",
    "level": "N4",
    "arti": "merah",
    "onyomi": [
      "セキ",
      "シャク"
    ],
    "kunyomi": [
      "あか",
      "あか-",
      "あか.い",
      "あか.らむ",
      "あか.らめる"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "赤い",
        "reading": "あかい",
        "arti": "merah"
      },
      {
        "word": "赤ちゃん",
        "reading": "あかちゃん",
        "arti": "bayi"
      }
    ]
  },
  {
    "char": "青",
    "level": "N4",
    "arti": "biru",
    "onyomi": [
      "セイ",
      "ショウ"
    ],
    "kunyomi": [
      "あお",
      "あお-",
      "あお.い"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "青い",
        "reading": "あおい",
        "arti": "biru"
      },
      {
        "word": "青空",
        "reading": "あおぞら",
        "arti": "langit biru"
      }
    ]
  },
  {
    "char": "森",
    "level": "N4",
    "arti": "hutan lebat",
    "onyomi": [
      "シン"
    ],
    "kunyomi": [
      "もり"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "森",
        "reading": "もり",
        "arti": "hutan lebat"
      }
    ]
  },
  {
    "char": "館",
    "level": "N4",
    "arti": "gedung besar",
    "onyomi": [
      "カン"
    ],
    "kunyomi": [
      "やかた",
      "たて"
    ],
    "strokes": 16,
    "examples": [
      {
        "word": "図書館",
        "reading": "としょかん",
        "arti": "perpustakaan"
      },
      {
        "word": "映画館",
        "reading": "えいがかん",
        "arti": "bioskop"
      }
    ]
  },
  {
    "char": "屋",
    "level": "N4",
    "arti": "toko / atap / kamar",
    "onyomi": [
      "オク"
    ],
    "kunyomi": [
      "や"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "部屋",
        "reading": "へや",
        "arti": "kamar"
      },
      {
        "word": "本屋",
        "reading": "ほんや",
        "arti": "toko buku"
      }
    ]
  },
  {
    "char": "色",
    "level": "N4",
    "arti": "warna",
    "onyomi": [
      "ショク",
      "シキ"
    ],
    "kunyomi": [
      "いろ"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "色",
        "reading": "いろ",
        "arti": "warna"
      },
      {
        "word": "景色",
        "reading": "けしき",
        "arti": "pemandangan"
      }
    ]
  },
  {
    "char": "走",
    "level": "N4",
    "arti": "berlari",
    "onyomi": [
      "ソウ"
    ],
    "kunyomi": [
      "はし.る"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "走る",
        "reading": "はしる",
        "arti": "berlari"
      }
    ]
  },
  {
    "char": "秋",
    "level": "N4",
    "arti": "musim gugur",
    "onyomi": [
      "シュウ"
    ],
    "kunyomi": [
      "あき",
      "とき"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "秋",
        "reading": "あき",
        "arti": "musim gugur"
      }
    ]
  },
  {
    "char": "林",
    "level": "N4",
    "arti": "hutan kecil / rimba",
    "onyomi": [
      "リン"
    ],
    "kunyomi": [
      "はやし"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "林",
        "reading": "はやし",
        "arti": "hutan kecil"
      }
    ]
  },
  {
    "char": "夏",
    "level": "N4",
    "arti": "musim panas",
    "onyomi": [
      "カ",
      "ガ",
      "ゲ"
    ],
    "kunyomi": [
      "なつ"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "夏",
        "reading": "なつ",
        "arti": "musim panas"
      },
      {
        "word": "夏休み",
        "reading": "なつやすみ",
        "arti": "libur musim panas"
      }
    ]
  },
  {
    "char": "顔",
    "level": "N4",
    "arti": "wajah",
    "onyomi": [
      "ガン"
    ],
    "kunyomi": [
      "かお"
    ],
    "strokes": 18,
    "examples": [
      {
        "word": "顔",
        "reading": "かお",
        "arti": "wajah"
      }
    ]
  },
  {
    "char": "短",
    "level": "N4",
    "arti": "pendek",
    "onyomi": [
      "タン"
    ],
    "kunyomi": [
      "みじか.い"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "短い",
        "reading": "みじかい",
        "arti": "pendek"
      }
    ]
  },
  {
    "char": "薬",
    "level": "N4",
    "arti": "obat",
    "onyomi": [
      "ヤク"
    ],
    "kunyomi": [
      "くすり"
    ],
    "strokes": 16,
    "examples": [
      {
        "word": "薬",
        "reading": "くすり",
        "arti": "obat"
      }
    ]
  },
  {
    "char": "習",
    "level": "N4",
    "arti": "belajar / berlatih",
    "onyomi": [
      "シュウ",
      "ジュ"
    ],
    "kunyomi": [
      "なら.う",
      "なら.い"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "習う",
        "reading": "ならう",
        "arti": "belajar (dari guru)"
      },
      {
        "word": "練習",
        "reading": "れんしゅう",
        "arti": "latihan"
      }
    ]
  },
  {
    "char": "便",
    "level": "N4",
    "arti": "praktis / pos / surat",
    "onyomi": [
      "ベン",
      "ビン"
    ],
    "kunyomi": [
      "たよ.り"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "便利",
        "reading": "べんり",
        "arti": "praktis"
      },
      {
        "word": "不便",
        "reading": "ふべん",
        "arti": "tidak praktis"
      }
    ]
  },
  {
    "char": "洋",
    "level": "N4",
    "arti": "barat / samudra",
    "onyomi": [
      "ヨウ"
    ],
    "kunyomi": [],
    "strokes": 9,
    "examples": [
      {
        "word": "洋服",
        "reading": "ようふく",
        "arti": "pakaian gaya Barat"
      },
      {
        "word": "西洋",
        "reading": "せいよう",
        "arti": "dunia Barat"
      }
    ]
  },
  {
    "char": "旅",
    "level": "N4",
    "arti": "perjalanan / wisata",
    "onyomi": [
      "リョ"
    ],
    "kunyomi": [
      "たび"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "旅行",
        "reading": "りょこう",
        "arti": "perjalanan wisata"
      },
      {
        "word": "旅館",
        "reading": "りょかん",
        "arti": "penginapan tradisional"
      }
    ]
  },
  {
    "char": "軽",
    "level": "N4",
    "arti": "ringan",
    "onyomi": [
      "ケイ",
      "キョウ",
      "キン"
    ],
    "kunyomi": [
      "かる.い",
      "かろ.やか",
      "かろ.んじる"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "軽い",
        "reading": "かるい",
        "arti": "ringan"
      }
    ]
  },
  {
    "char": "池",
    "level": "N4",
    "arti": "kolam",
    "onyomi": [
      "チ"
    ],
    "kunyomi": [
      "いけ"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "池",
        "reading": "いけ",
        "arti": "kolam"
      }
    ]
  },
  {
    "char": "服",
    "level": "N4",
    "arti": "pakaian / baju",
    "onyomi": [
      "フク"
    ],
    "kunyomi": [],
    "strokes": 8,
    "examples": [
      {
        "word": "服",
        "reading": "ふく",
        "arti": "pakaian"
      },
      {
        "word": "洋服",
        "reading": "ようふく",
        "arti": "baju gaya Barat"
      }
    ]
  },
  {
    "char": "遠",
    "level": "N4",
    "arti": "jauh",
    "onyomi": [
      "エン",
      "オン"
    ],
    "kunyomi": [
      "とお.い"
    ],
    "strokes": 13,
    "examples": [
      {
        "word": "遠い",
        "reading": "とおい",
        "arti": "jauh"
      },
      {
        "word": "遠く",
        "reading": "とおく",
        "arti": "tempat jauh"
      }
    ]
  },
  {
    "char": "夕",
    "level": "N4",
    "arti": "senja / sore",
    "onyomi": [
      "セキ"
    ],
    "kunyomi": [
      "ゆう"
    ],
    "strokes": 3,
    "examples": [
      {
        "word": "夕方",
        "reading": "ゆうがた",
        "arti": "sore / petang"
      },
      {
        "word": "夕飯",
        "reading": "ゆうはん",
        "arti": "makan malam"
      }
    ]
  },
  {
    "char": "借",
    "level": "N4",
    "arti": "meminjam",
    "onyomi": [
      "シャク"
    ],
    "kunyomi": [
      "か.りる"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "借りる",
        "reading": "かりる",
        "arti": "meminjam"
      }
    ]
  },
  {
    "char": "曜",
    "level": "N4",
    "arti": "hari dalam seminggu",
    "onyomi": [
      "ヨウ"
    ],
    "kunyomi": [],
    "strokes": 18,
    "examples": [
      {
        "word": "月曜日",
        "reading": "げつようび",
        "arti": "hari Senin"
      },
      {
        "word": "何曜日",
        "reading": "なんようび",
        "arti": "hari apa"
      }
    ]
  },
  {
    "char": "弱",
    "level": "N4",
    "arti": "lemah",
    "onyomi": [
      "ジャク"
    ],
    "kunyomi": [
      "よわ.い",
      "よわ.る",
      "よわ.まる",
      "よわ.める"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "弱い",
        "reading": "よわい",
        "arti": "lemah"
      }
    ]
  },
  {
    "char": "肉",
    "level": "N4",
    "arti": "daging",
    "onyomi": [
      "ニク"
    ],
    "kunyomi": [
      "しし"
    ],
    "strokes": 6,
    "examples": [
      {
        "word": "肉",
        "reading": "にく",
        "arti": "daging"
      },
      {
        "word": "牛肉",
        "reading": "ぎゅうにく",
        "arti": "daging sapi"
      }
    ]
  },
  {
    "char": "貸",
    "level": "N4",
    "arti": "meminjamkan",
    "onyomi": [
      "タイ"
    ],
    "kunyomi": [
      "か.す",
      "か.し-",
      "かし-"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "貸す",
        "reading": "かす",
        "arti": "meminjamkan"
      }
    ]
  },
  {
    "char": "堂",
    "level": "N4",
    "arti": "aula / ruang besar",
    "onyomi": [
      "ドウ"
    ],
    "kunyomi": [],
    "strokes": 11,
    "examples": [
      {
        "word": "食堂",
        "reading": "しょくどう",
        "arti": "kantin / ruang makan"
      },
      {
        "word": "講堂",
        "reading": "こうどう",
        "arti": "aula"
      }
    ]
  },
  {
    "char": "暗",
    "level": "N4",
    "arti": "gelap / suram",
    "onyomi": [
      "アン"
    ],
    "kunyomi": [
      "くら.い",
      "くら.む",
      "くれ.る"
    ],
    "strokes": 13,
    "examples": [
      {
        "word": "暗い",
        "reading": "くらい",
        "arti": "gelap"
      }
    ]
  },
  {
    "char": "鳥",
    "level": "N4",
    "arti": "burung",
    "onyomi": [
      "チョウ"
    ],
    "kunyomi": [
      "とり"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "鳥",
        "reading": "とり",
        "arti": "burung"
      },
      {
        "word": "小鳥",
        "reading": "ことり",
        "arti": "burung kecil"
      }
    ]
  },
  {
    "char": "飯",
    "level": "N4",
    "arti": "nasi / makanan",
    "onyomi": [
      "ハン"
    ],
    "kunyomi": [
      "めし"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "ご飯",
        "reading": "ごはん",
        "arti": "nasi / makan"
      },
      {
        "word": "朝ご飯",
        "reading": "あさごはん",
        "arti": "sarapan"
      }
    ]
  },
  {
    "char": "勉",
    "level": "N4",
    "arti": "giat / berusaha",
    "onyomi": [
      "ベン"
    ],
    "kunyomi": [
      "つと.める"
    ],
    "strokes": 10,
    "examples": [
      {
        "word": "勉強",
        "reading": "べんきょう",
        "arti": "belajar"
      }
    ]
  },
  {
    "char": "冬",
    "level": "N4",
    "arti": "musim dingin",
    "onyomi": [
      "トウ"
    ],
    "kunyomi": [
      "ふゆ"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "冬",
        "reading": "ふゆ",
        "arti": "musim dingin"
      }
    ]
  },
  {
    "char": "昼",
    "level": "N4",
    "arti": "siang hari",
    "onyomi": [
      "チュウ"
    ],
    "kunyomi": [
      "ひる"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "昼",
        "reading": "ひる",
        "arti": "siang"
      },
      {
        "word": "昼ご飯",
        "reading": "ひるごはん",
        "arti": "makan siang"
      }
    ]
  },
  {
    "char": "茶",
    "level": "N4",
    "arti": "teh",
    "onyomi": [
      "チャ",
      "サ"
    ],
    "kunyomi": [],
    "strokes": 9,
    "examples": [
      {
        "word": "お茶",
        "reading": "おちゃ",
        "arti": "teh"
      },
      {
        "word": "紅茶",
        "reading": "こうちゃ",
        "arti": "teh hitam"
      }
    ]
  },
  {
    "char": "弟",
    "level": "N4",
    "arti": "adik laki-laki",
    "onyomi": [
      "テイ",
      "ダイ",
      "デ"
    ],
    "kunyomi": [
      "おとうと"
    ],
    "strokes": 7,
    "examples": [
      {
        "word": "弟",
        "reading": "おとうと",
        "arti": "adik laki-laki"
      },
      {
        "word": "兄弟",
        "reading": "きょうだい",
        "arti": "saudara kandung"
      }
    ]
  },
  {
    "char": "洗",
    "level": "N4",
    "arti": "mencuci",
    "onyomi": [
      "セン"
    ],
    "kunyomi": [
      "あら.う"
    ],
    "strokes": 9,
    "examples": [
      {
        "word": "洗う",
        "reading": "あらう",
        "arti": "mencuci"
      },
      {
        "word": "洗濯",
        "reading": "せんたく",
        "arti": "mencuci baju"
      }
    ]
  },
  {
    "char": "牛",
    "level": "N4",
    "arti": "sapi",
    "onyomi": [
      "ギュウ"
    ],
    "kunyomi": [
      "うし"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "牛肉",
        "reading": "ぎゅうにく",
        "arti": "daging sapi"
      },
      {
        "word": "牛乳",
        "reading": "ぎゅうにゅう",
        "arti": "susu sapi"
      }
    ]
  },
  {
    "char": "兄",
    "level": "N4",
    "arti": "kakak laki-laki",
    "onyomi": [
      "ケイ",
      "キョウ"
    ],
    "kunyomi": [
      "あに"
    ],
    "strokes": 5,
    "examples": [
      {
        "word": "兄",
        "reading": "あに",
        "arti": "kakak laki-laki saya"
      },
      {
        "word": "お兄さん",
        "reading": "おにいさん",
        "arti": "kakak laki-laki"
      }
    ]
  },
  {
    "char": "犬",
    "level": "N4",
    "arti": "anjing",
    "onyomi": [
      "ケン"
    ],
    "kunyomi": [
      "いぬ",
      "いぬ-"
    ],
    "strokes": 4,
    "examples": [
      {
        "word": "犬",
        "reading": "いぬ",
        "arti": "anjing"
      }
    ]
  },
  {
    "char": "菜",
    "level": "N4",
    "arti": "sayur",
    "onyomi": [
      "サイ"
    ],
    "kunyomi": [
      "な"
    ],
    "strokes": 11,
    "examples": [
      {
        "word": "野菜",
        "reading": "やさい",
        "arti": "sayuran"
      }
    ]
  },
  {
    "char": "暑",
    "level": "N4",
    "arti": "panas (cuaca)",
    "onyomi": [
      "ショ"
    ],
    "kunyomi": [
      "あつ.い"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "暑い",
        "reading": "あつい",
        "arti": "panas (udara)"
      }
    ]
  },
  {
    "char": "妹",
    "level": "N4",
    "arti": "adik perempuan",
    "onyomi": [
      "マイ"
    ],
    "kunyomi": [
      "いもうと"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "妹",
        "reading": "いもうと",
        "arti": "adik perempuan"
      }
    ]
  },
  {
    "char": "寒",
    "level": "N4",
    "arti": "dingin (cuaca)",
    "onyomi": [
      "カン"
    ],
    "kunyomi": [
      "さむ.い"
    ],
    "strokes": 12,
    "examples": [
      {
        "word": "寒い",
        "reading": "さむい",
        "arti": "dingin (udara)"
      }
    ]
  },
  {
    "char": "姉",
    "level": "N4",
    "arti": "kakak perempuan",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "あね",
      "はは"
    ],
    "strokes": 8,
    "examples": [
      {
        "word": "姉",
        "reading": "あね",
        "arti": "kakak perempuan saya"
      },
      {
        "word": "お姉さん",
        "reading": "おねえさん",
        "arti": "kakak perempuan"
      }
    ]
  },
  {
    "char": "漢",
    "level": "N4",
    "arti": "Tiongkok / aksara Han",
    "onyomi": [
      "カン"
    ],
    "kunyomi": [],
    "strokes": 13,
    "examples": [
      {
        "word": "漢字",
        "reading": "かんじ",
        "arti": "huruf kanji"
      }
    ]
  }
];

export const KANJI_MAP: Record<string, KanjiItem> = Object.fromEntries(
  KANJI_LIST.map((k) => [k.char, k]),
);
