// Disalin & diselaraskan dengan src/data/kanji.ts untuk verifikasi jawaban server-side.
export interface ServerKanjiEntry {
  char: string;
  level: 'N5' | 'N4';
  arti: string;
  onyomi: string[];
  kunyomi: string[];
}

export const KANJI_ENTRIES: ServerKanjiEntry[] = [
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
    ]
  },
  {
    "char": "電",
    "level": "N5",
    "arti": "listrik",
    "onyomi": [
      "デン"
    ],
    "kunyomi": []
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
    "kunyomi": []
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
    ]
  },
  {
    "char": "週",
    "level": "N5",
    "arti": "minggu (pekan)",
    "onyomi": [
      "シュウ"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "駅",
    "level": "N5",
    "arti": "stasiun",
    "onyomi": [
      "エキ"
    ],
    "kunyomi": []
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
    "kunyomi": []
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
    ]
  },
  {
    "char": "員",
    "level": "N4",
    "arti": "anggota / pegawai",
    "onyomi": [
      "イン"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "題",
    "level": "N4",
    "arti": "topik / judul / soal",
    "onyomi": [
      "ダイ"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "意",
    "level": "N4",
    "arti": "maksud / pikiran",
    "onyomi": [
      "イ"
    ],
    "kunyomi": []
  },
  {
    "char": "不",
    "level": "N4",
    "arti": "tidak / bukan (awalan negatif)",
    "onyomi": [
      "フ",
      "ブ"
    ],
    "kunyomi": []
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
    "kunyomi": []
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
    ]
  },
  {
    "char": "院",
    "level": "N4",
    "arti": "lembaga / gedung",
    "onyomi": [
      "イン"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "界",
    "level": "N4",
    "arti": "dunia / batas",
    "onyomi": [
      "カイ"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "特",
    "level": "N4",
    "arti": "khusus / spesial",
    "onyomi": [
      "トク"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "料",
    "level": "N4",
    "arti": "biaya / bahan",
    "onyomi": [
      "リョウ"
    ],
    "kunyomi": []
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
    "kunyomi": []
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
    ]
  },
  {
    "char": "族",
    "level": "N4",
    "arti": "keluarga / suku",
    "onyomi": [
      "ゾク"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "洋",
    "level": "N4",
    "arti": "barat / samudra",
    "onyomi": [
      "ヨウ"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "服",
    "level": "N4",
    "arti": "pakaian / baju",
    "onyomi": [
      "フク"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "曜",
    "level": "N4",
    "arti": "hari dalam seminggu",
    "onyomi": [
      "ヨウ"
    ],
    "kunyomi": []
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
    ]
  },
  {
    "char": "堂",
    "level": "N4",
    "arti": "aula / ruang besar",
    "onyomi": [
      "ドウ"
    ],
    "kunyomi": []
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
    "kunyomi": []
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
    ]
  },
  {
    "char": "漢",
    "level": "N4",
    "arti": "Tiongkok / aksara Han",
    "onyomi": [
      "カン"
    ],
    "kunyomi": []
  }
];

export const KANJI_MAP: Record<string, ServerKanjiEntry> = Object.fromEntries(
  KANJI_ENTRIES.map((k) => [k.char, k]),
);

export function formatKanjiReading(entry: ServerKanjiEntry): string {
  const parts: string[] = [];
  if (entry.onyomi.length) parts.push(entry.onyomi.slice(0, 2).join('・'));
  if (entry.kunyomi.length) parts.push(entry.kunyomi.slice(0, 2).join('・'));
  return parts.join(' / ') || '-';
}

export function isKanjiAnswerCorrect(char: string, given: unknown, mode: unknown): boolean {
  const entry = KANJI_MAP[char];
  if (!entry || typeof given !== 'string') return false;
  const g = given.trim();
  if (!g) return false;
  const m = String(mode ?? 'kanji-to-arti');
  if (m === 'arti-to-kanji') {
    return g === entry.char;
  }
  if (m === 'kanji-to-reading') {
    return g === formatKanjiReading(entry);
  }
  return g.toLowerCase() === entry.arti.toLowerCase();
}
