export type VocabCatId =
  | 'salam'
  | 'perkenalan'
  | 'angka-waktu'
  | 'makanan-belanja'
  | 'kerja-harian'
  | 'kata-sifat'
  | 'ssw-kerja';

export interface VocabItem {
  id: string;
  jp: string; // bacaan kana (hiragana/katakana) untuk diucapkan TTS
  kanji?: string; // tulisan dengan kanji (opsional)
  romaji: string;
  arti: string; // arti bahasa Indonesia
  cat: VocabCatId;
}

export const VOCAB_CATS: { id: VocabCatId; label: string; desc: string }[] = [
  { id: 'salam', label: 'Salam & Kelas', desc: 'Aisatsu & ungkapan harian' },
  { id: 'perkenalan', label: 'Perkenalan & SMK', desc: 'Jikoshōkai & jurusan' },
  { id: 'angka-waktu', label: 'Angka & Waktu', desc: 'Bilangan, jam, hari' },
  { id: 'makanan-belanja', label: 'Makan & Belanja', desc: 'Menu & transaksi dasar' },
  { id: 'kerja-harian', label: 'Kata Kerja N5', desc: 'Aktivitas sehari-hari' },
  { id: 'kata-sifat', label: 'Kata Sifat N5', desc: 'Bentuk -i dan -na' },
  { id: 'ssw-kerja', label: 'Kerja & 5S (SSW)', desc: 'Budaya kerja & K3' },
];

export const VOCAB: VocabItem[] = [
  // 1. Salam & Ungkapan Kelas/Kerja
  { id: 'sal-1', jp: 'おはようございます', romaji: 'ohayō gozaimasu', arti: 'Selamat pagi', cat: 'salam' },
  { id: 'sal-2', jp: 'こんにちは', romaji: 'konnichiwa', arti: 'Selamat siang / halo', cat: 'salam' },
  { id: 'sal-3', jp: 'こんばんは', romaji: 'konbanwa', arti: 'Selamat malam', cat: 'salam' },
  { id: 'sal-4', jp: 'ありがとうございます', romaji: 'arigatō gozaimasu', arti: 'Terima kasih banyak', cat: 'salam' },
  { id: 'sal-5', jp: 'すみません', romaji: 'sumimasen', arti: 'Permisi / maaf', cat: 'salam' },
  { id: 'sal-6', jp: 'ごめんなさい', romaji: 'gomennasai', arti: 'Maaf (lebih akrab)', cat: 'salam' },
  { id: 'sal-7', jp: 'よろしくおねがいします', kanji: 'よろしくお願いします', romaji: 'yoroshiku onegaishimasu', arti: 'Mohon bantuannya / kerja samanya', cat: 'salam' },
  { id: 'sal-8', jp: 'おつかれさまです', kanji: 'お疲れ様です', romaji: 'otsukaresama desu', arti: 'Terima kasih atas kerja kerasnya', cat: 'salam' },
  { id: 'sal-9', jp: 'しつれいします', kanji: '失礼します', romaji: 'shitsurei shimasu', arti: 'Permisi (masuk/keluar ruangan)', cat: 'salam' },
  { id: 'sal-10', jp: 'わかりました', kanji: '分かりました', romaji: 'wakarimashita', arti: 'Saya mengerti / paham', cat: 'salam' },
  { id: 'sal-11', jp: 'わかりません', kanji: '分かりません', romaji: 'wakarimasen', arti: 'Saya tidak mengerti', cat: 'salam' },
  { id: 'sal-12', jp: 'もういちどおねがいします', kanji: 'もう一度お願いします', romaji: 'mō ichido onegaishimasu', arti: 'Tolong ulangi sekali lagi', cat: 'salam' },
  { id: 'sal-13', jp: 'だいじょうぶです', kanji: '大丈夫です', romaji: 'daijōbu desu', arti: 'Tidak apa-apa / aman', cat: 'salam' },
  { id: 'sal-14', jp: 'おさきにしつれいします', kanji: 'お先に失礼します', romaji: 'osaki ni shitsurei shimasu', arti: 'Permisi pulang duluan', cat: 'salam' },

  // 2. Perkenalan & Sekolah SMK
  { id: 'pk-1', jp: 'わたし', kanji: '私', romaji: 'watashi', arti: 'Saya', cat: 'perkenalan' },
  { id: 'pk-2', jp: 'なまえ', kanji: '名前', romaji: 'namae', arti: 'Nama', cat: 'perkenalan' },
  { id: 'pk-3', jp: 'がくせい', kanji: '学生', romaji: 'gakusei', arti: 'Siswa / pelajar', cat: 'perkenalan' },
  { id: 'pk-4', jp: 'せんせい', kanji: '先生', romaji: 'sensei', arti: 'Guru / instruktur', cat: 'perkenalan' },
  { id: 'pk-5', jp: 'インドネシア', romaji: 'Indoneshia', arti: 'Indonesia', cat: 'perkenalan' },
  { id: 'pk-6', jp: 'にほん', kanji: '日本', romaji: 'Nihon', arti: 'Jepang', cat: 'perkenalan' },
  { id: 'pk-7', jp: 'にほんご', kanji: '日本語', romaji: 'Nihongo', arti: 'Bahasa Jepang', cat: 'perkenalan' },
  { id: 'pk-8', jp: 'こうこう', kanji: '高校', romaji: 'kōkō', arti: 'SMA / SMK', cat: 'perkenalan' },
  { id: 'pk-9', jp: 'せんもんがっこう', kanji: '専門学校', romaji: 'senmon gakkō', arti: 'Sekolah kejuruan', cat: 'perkenalan' },
  { id: 'pk-10', jp: 'じょうほう', kanji: '情報', romaji: 'jōhō', arti: 'Informasi / IT (TJKT)', cat: 'perkenalan' },
  { id: 'pk-11', jp: 'コンピューター', romaji: 'konpyūtā', arti: 'Komputer', cat: 'perkenalan' },
  { id: 'pk-12', jp: 'かいけい', kanji: '会計', romaji: 'kaikei', arti: 'Akuntansi (AKL)', cat: 'perkenalan' },
  { id: 'pk-13', jp: 'じどうしゃ', kanji: '自動車', romaji: 'jidōsha', arti: 'Mobil / otomotif (TKRO)', cat: 'perkenalan' },
  { id: 'pk-14', jp: 'しゅみ', kanji: '趣味', romaji: 'shumi', arti: 'Hobi', cat: 'perkenalan' },
  { id: 'pk-15', jp: 'ともだち', kanji: '友達', romaji: 'tomodachi', arti: 'Teman', cat: 'perkenalan' },
  { id: 'pk-16', jp: 'かぞく', kanji: '家族', romaji: 'kazoku', arti: 'Keluarga', cat: 'perkenalan' },

  // 3. Angka, Waktu & Hari
  { id: 'aw-1', jp: 'いち・に・さん', kanji: '一・二・三', romaji: 'ichi, ni, san', arti: '1, 2, 3', cat: 'angka-waktu' },
  { id: 'aw-2', jp: 'よん・ご・ろく', kanji: '四・五・六', romaji: 'yon, go, roku', arti: '4, 5, 6', cat: 'angka-waktu' },
  { id: 'aw-3', jp: 'なな・はち・きゅう・じゅう', kanji: '七・八・九・十', romaji: 'nana, hachi, kyū, jū', arti: '7, 8, 9, 10', cat: 'angka-waktu' },
  { id: 'aw-4', jp: 'ひゃく', kanji: '百', romaji: 'hyaku', arti: 'Seratus (100)', cat: 'angka-waktu' },
  { id: 'aw-5', jp: 'せん', kanji: '千', romaji: 'sen', arti: 'Seribu (1.000)', cat: 'angka-waktu' },
  { id: 'aw-6', jp: 'いま', kanji: '今', romaji: 'ima', arti: 'Sekarang', cat: 'angka-waktu' },
  { id: 'aw-7', jp: 'なんじ', kanji: '何時', romaji: 'nanji', arti: 'Jam berapa', cat: 'angka-waktu' },
  { id: 'aw-8', jp: 'きょう', kanji: '今日', romaji: 'kyō', arti: 'Hari ini', cat: 'angka-waktu' },
  { id: 'aw-9', jp: 'あした', kanji: '明日', romaji: 'ashita', arti: 'Besok', cat: 'angka-waktu' },
  { id: 'aw-10', jp: 'きのう', kanji: '昨日', romaji: 'kinō', arti: 'Kemarin', cat: 'angka-waktu' },
  { id: 'aw-11', jp: 'まいにち', kanji: '毎日', romaji: 'mainichi', arti: 'Setiap hari', cat: 'angka-waktu' },
  { id: 'aw-12', jp: 'げつようび', kanji: '月曜日', romaji: 'getsuyōbi', arti: 'Hari Senin', cat: 'angka-waktu' },
  { id: 'aw-13', jp: 'かようび', kanji: '火曜日', romaji: 'kayōbi', arti: 'Hari Selasa', cat: 'angka-waktu' },
  { id: 'aw-14', jp: 'すいようび', kanji: '水曜日', romaji: 'suiyōbi', arti: 'Hari Rabu', cat: 'angka-waktu' },
  { id: 'aw-15', jp: 'もくようび', kanji: '木曜日', romaji: 'mokuyōbi', arti: 'Hari Kamis', cat: 'angka-waktu' },
  { id: 'aw-16', jp: 'きんようび', kanji: '金曜日', romaji: 'kin’yōbi', arti: 'Hari Jumat', cat: 'angka-waktu' },
  { id: 'aw-17', jp: 'どようび', kanji: '土曜日', romaji: 'doyōbi', arti: 'Hari Sabtu', cat: 'angka-waktu' },
  { id: 'aw-18', jp: 'にちようび', kanji: '日曜日', romaji: 'nichiyōbi', arti: 'Hari Minggu', cat: 'angka-waktu' },

  // 4. Makanan, Minuman & Belanja
  { id: 'mb-1', jp: 'みず', kanji: '水', romaji: 'mizu', arti: 'Air putih', cat: 'makanan-belanja' },
  { id: 'mb-2', jp: 'ごはん', kanji: 'ご飯', romaji: 'gohan', arti: 'Nasi / makanan', cat: 'makanan-belanja' },
  { id: 'mb-3', jp: 'パン', romaji: 'pan', arti: 'Roti', cat: 'makanan-belanja' },
  { id: 'mb-4', jp: 'さかな', kanji: '魚', romaji: 'sakana', arti: 'Ikan', cat: 'makanan-belanja' },
  { id: 'mb-5', jp: 'にく', kanji: '肉', romaji: 'niku', arti: 'Daging', cat: 'makanan-belanja' },
  { id: 'mb-6', jp: 'やさい', kanji: '野菜', romaji: 'yasai', arti: 'Sayuran', cat: 'makanan-belanja' },
  { id: 'mb-7', jp: 'くだもの', kanji: '果物', romaji: 'kudamono', arti: 'Buah-buahan', cat: 'makanan-belanja' },
  { id: 'mb-8', jp: 'いくらですか', romaji: 'ikura desu ka', arti: 'Berapa harganya?', cat: 'makanan-belanja' },
  { id: 'mb-9', jp: 'これをください', kanji: 'これを下さい', romaji: 'kore o kudasai', arti: 'Tolong beri yang ini', cat: 'makanan-belanja' },
  { id: 'mb-10', jp: 'おかね', kanji: 'お金', romaji: 'okane', arti: 'Uang', cat: 'makanan-belanja' },
  { id: 'mb-11', jp: 'コンビニ', romaji: 'konbini', arti: 'Minimarket 24 jam', cat: 'makanan-belanja' },
  { id: 'mb-12', jp: 'レストラン', romaji: 'resutoran', arti: 'Restoran', cat: 'makanan-belanja' },

  // 5. Kata Kerja Dasar N5
  { id: 'kk-1', jp: 'いきます', kanji: '行きます', romaji: 'ikimasu', arti: 'Pergi', cat: 'kerja-harian' },
  { id: 'kk-2', jp: 'きます', kanji: '来ます', romaji: 'kimasu', arti: 'Datang', cat: 'kerja-harian' },
  { id: 'kk-3', jp: 'かえります', kanji: '帰ります', romaji: 'kaerimasu', arti: 'Pulang', cat: 'kerja-harian' },
  { id: 'kk-4', jp: 'たべます', kanji: '食べます', romaji: 'tabemasu', arti: 'Makan', cat: 'kerja-harian' },
  { id: 'kk-5', jp: 'のみます', kanji: '飲みます', romaji: 'nomimasu', arti: 'Minum', cat: 'kerja-harian' },
  { id: 'kk-6', jp: 'みます', kanji: '見ます', romaji: 'mimasu', arti: 'Melihat / menonton', cat: 'kerja-harian' },
  { id: 'kk-7', jp: 'ききます', kanji: '聞きます', romaji: 'kikimasu', arti: 'Mendengar / bertanya', cat: 'kerja-harian' },
  { id: 'kk-8', jp: 'よみます', kanji: '読みます', romaji: 'yomimasu', arti: 'Membaca', cat: 'kerja-harian' },
  { id: 'kk-9', jp: 'かきます', kanji: '書きます', romaji: 'kakimasu', arti: 'Menulis', cat: 'kerja-harian' },
  { id: 'kk-10', jp: 'はなします', kanji: '話します', romaji: 'hanashimasu', arti: 'Berbicara', cat: 'kerja-harian' },
  { id: 'kk-11', jp: 'べんきょうします', kanji: '勉強します', romaji: 'benkyō shimasu', arti: 'Belajar', cat: 'kerja-harian' },
  { id: 'kk-12', jp: 'はたらきます', kanji: '働きます', romaji: 'hatarakimasu', arti: 'Bekerja', cat: 'kerja-harian' },
  { id: 'kk-13', jp: 'やすみます', kanji: '休みます', romaji: 'yasumimasu', arti: 'Beristirahat / libur', cat: 'kerja-harian' },
  { id: 'kk-14', jp: 'おきます', kanji: '起きます', romaji: 'okimasu', arti: 'Bangun tidur', cat: 'kerja-harian' },
  { id: 'kk-15', jp: 'ねます', kanji: '寝ます', romaji: 'nemasu', arti: 'Tidur', cat: 'kerja-harian' },

  // 6. Kata Sifat Dasar N5
  { id: 'ks-1', jp: 'おおきい', kanji: '大きい', romaji: 'ōkii', arti: 'Besar', cat: 'kata-sifat' },
  { id: 'ks-2', jp: 'ちいさい', kanji: '小さい', romaji: 'chiisai', arti: 'Kecil', cat: 'kata-sifat' },
  { id: 'ks-3', jp: 'あたらしい', kanji: '新しい', romaji: 'atarashii', arti: 'Baru', cat: 'kata-sifat' },
  { id: 'ks-4', jp: 'ふるい', kanji: '古い', romaji: 'furui', arti: 'Lama / tua (benda)', cat: 'kata-sifat' },
  { id: 'ks-5', jp: 'いい', kanji: '良い', romaji: 'ii', arti: 'Bagus / baik', cat: 'kata-sifat' },
  { id: 'ks-6', jp: 'わるい', kanji: '悪い', romaji: 'warui', arti: 'Buruk / jelek', cat: 'kata-sifat' },
  { id: 'ks-7', jp: 'たかい', kanji: '高い', romaji: 'takai', arti: 'Mahal / tinggi', cat: 'kata-sifat' },
  { id: 'ks-8', jp: 'やすい', kanji: '安い', romaji: 'yasui', arti: 'Murah', cat: 'kata-sifat' },
  { id: 'ks-9', jp: 'おいしい', romaji: 'oishii', arti: 'Enak / lezat', cat: 'kata-sifat' },
  { id: 'ks-10', jp: 'いそがしい', kanji: '忙しい', romaji: 'isogashii', arti: 'Sibuk', cat: 'kata-sifat' },
  { id: 'ks-11', jp: 'たのしい', kanji: '楽しい', romaji: 'tanoshii', arti: 'Menyenangkan', cat: 'kata-sifat' },
  { id: 'ks-12', jp: 'むずかしい', kanji: '難しい', romaji: 'muzukashii', arti: 'Sulit', cat: 'kata-sifat' },
  { id: 'ks-13', jp: 'かんたん', kanji: '簡単', romaji: 'kantan', arti: 'Mudah / sederhana', cat: 'kata-sifat' },
  { id: 'ks-14', jp: 'げんき', kanji: '元気', romaji: 'genki', arti: 'Sehat / bersemangat', cat: 'kata-sifat' },
  { id: 'ks-15', jp: 'すき', kanji: '好き', romaji: 'suki', arti: 'Suka', cat: 'kata-sifat' },

  // 7. Budaya Kerja Jepang & 5S SSW
  { id: 'ssw-1', jp: 'あんぜんだいいち', kanji: '安全第一', romaji: 'anzen daiichi', arti: 'Utamakan keselamatan kerja', cat: 'ssw-kerja' },
  { id: 'ssw-2', jp: 'せいり', kanji: '整理', romaji: 'seiri', arti: 'Ringkas (pilah barang perlu & tidak)', cat: 'ssw-kerja' },
  { id: 'ssw-3', jp: 'せいとん', kanji: '整頓', romaji: 'seiton', arti: 'Rapi (tata barang pada tempatnya)', cat: 'ssw-kerja' },
  { id: 'ssw-4', jp: 'せいそう', kanji: '清掃', romaji: 'seisō', arti: 'Resik (bersihkan tempat kerja)', cat: 'ssw-kerja' },
  { id: 'ssw-5', jp: 'せいけつ', kanji: '清潔', romaji: 'seiketsu', arti: 'Rawat (jaga kebersihan rutin)', cat: 'ssw-kerja' },
  { id: 'ssw-6', jp: 'しつけ', kanji: '躾', romaji: 'shitsuke', arti: 'Rajin (disiplin mengikuti aturan)', cat: 'ssw-kerja' },
  { id: 'ssw-7', jp: 'ほうれんそう', kanji: '報連相', romaji: 'hōrensō', arti: 'Lapor, komunikasi, konsultasi', cat: 'ssw-kerja' },
  { id: 'ssw-8', jp: 'じかんをまもる', kanji: '時間を守る', romaji: 'jikan o mamoru', arti: 'Tepat waktu / disiplin waktu', cat: 'ssw-kerja' },
  { id: 'ssw-9', jp: 'きけん', kanji: '危険', romaji: 'kiken', arti: 'Bahaya', cat: 'ssw-kerja' },
  { id: 'ssw-10', jp: 'ちゅうい', kanji: '注意', romaji: 'chūi', arti: 'Perhatian / hati-hati', cat: 'ssw-kerja' },
  { id: 'ssw-11', jp: 'こうじょう', kanji: '工場', romaji: 'kōjō', arti: 'Pabrik', cat: 'ssw-kerja' },
  { id: 'ssw-12', jp: 'かいご', kanji: '介護', romaji: 'kaigo', arti: 'Perawatan lansia', cat: 'ssw-kerja' },
];
