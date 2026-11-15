// Sumber acuan: Tata bahasa standar JLPT N5/N4, buku IRODORI (Japan Foundation), dan Minna no Nihongo I & II.

export interface BunpouExample {
  jp: string;
  romaji: string;
  arti: string;
}

export interface BunpouQuestion {
  id: string;
  sentence: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface BunpouPoint {
  id: string;
  level: 'N5' | 'N4';
  title: string;
  pattern: string;
  summary: string;
  explanation: string;
  examples: BunpouExample[];
  questions: BunpouQuestion[];
}

export const BUNPOU_LIST: BunpouPoint[] = [
  {
    id: 'desu-masu',
    level: 'N5',
    title: 'Kalimat Sopan 〜です / 〜ます',
    pattern: '[Kata Benda / Sifat] + です ｜ [Kata Kerja] + ます',
    summary: 'Bentuk sopan dasar untuk berbicara dengan guru, rekan baru, dan atasan.',
    explanation:
      'Dalam bahasa Jepang sehari-hari dan dunia kerja, akhiran です (desu) dipakai untuk kalimat kata benda atau kata sifat (negatif: ではありません / じゃありません), sedangkan akhiran ます (masu) dipakai untuk kata kerja (negatif: ません).',
    examples: [
      {
        jp: 'わたしは SMK の せいと です。',
        romaji: 'Watashi wa SMK no seito desu.',
        arti: 'Saya adalah siswa SMK.',
      },
      {
        jp: 'まいにち にほんご を べんきょうします。',
        romaji: 'Mainichi nihongo o benkyou shimasu.',
        arti: 'Setiap hari saya belajar bahasa Jepang.',
      },
      {
        jp: 'きょう は あめ じゃありません。',
        romaji: 'Kyou wa ame ja arimasen.',
        arti: 'Hari ini tidak hujan.',
      },
    ],
    questions: [
      {
        id: 'bp-dm-1',
        sentence: 'わたしは インドネシアじん（　）。',
        options: ['です', 'ます', 'ません', 'を'],
        answerIndex: 0,
        explanation: 'インドネシアじん (orang Indonesia) adalah kata benda, sehingga kalimat sopannya ditutup dengan です.',
      },
      {
        id: 'bp-dm-2',
        sentence: 'あした ろくじ に おき（　）。',
        options: ['です', 'ます', 'じゃありません', 'でした'],
        answerIndex: 1,
        explanation: 'おき (dari kata kerja おきます = bangun) menggunakan akhiran kata kerja sopan ます.',
      },
      {
        id: 'bp-dm-3',
        sentence: 'おさけ は のみ（　）。(Saya tidak minum alkohol)',
        options: ['です', 'ではありません', 'ません', 'ました'],
        answerIndex: 2,
        explanation: 'Bentuk negatif sopan untuk kata kerja (のみます) adalah ません → のみません.',
      },
      {
        id: 'bp-dm-4',
        sentence: 'たなかさん は エンジニア（　）。(Bukan insinyur)',
        options: ['ません', 'じゃありません', 'ます', 'を'],
        answerIndex: 1,
        explanation: 'Bentuk negatif sopan untuk kata benda adalah ではありません atau じゃありません.',
      },
    ],
  },
  {
    id: 'partikel-dasar',
    level: 'N5',
    title: 'Partikel Dasar は・が・を・に・で・へ・と',
    pattern: 'は (topik) · が (subjek) · を (objek) · に/へ (tujuan/waktu) · で (tempat aksi/alat) · と (bersama/dan)',
    summary: 'Penanda fungsi kata dalam kalimat bahasa Jepang.',
    explanation:
      'は (dibaca wa) menandai topik kalimat; が menandai subjek atau benda yang ada/disukai; を (dibaca o) menandai objek tindakan; に menandai waktu spesifik atau titik tujuan; へ (dibaca e) menandai arah pergi/datang; で menandai tempat aktivitas berlangsung atau alat/kendaraan; と berarti "bersama" atau "dan" untuk kata benda.',
    examples: [
      {
        jp: 'じっしゅうせい は バス で こうじょう へ いきます。',
        romaji: 'Jisshuusei wa basu de koujou e ikimasu.',
        arti: 'Peserta magang pergi ke pabrik naik bus.',
      },
      {
        jp: 'ともだち と しょくどう で ごはん を たべます。',
        romaji: 'Tomodachi to shokudou de gohan o tabemasu.',
        arti: 'Saya makan nasi di kantin bersama teman.',
      },
      {
        jp: 'まいあさ しちじ に がっこう に きます。',
        romaji: 'Maiasa shichiji ni gakkou ni kimasu.',
        arti: 'Setiap pagi saya datang ke sekolah pukul 7.',
      },
    ],
    questions: [
      {
        id: 'bp-pt-1',
        sentence: 'としょかん（　）ほん を よみます。',
        options: ['に', 'で', 'へ', 'と'],
        answerIndex: 1,
        explanation: 'で dipakai untuk menandai tempat berlangsungnya suatu aktivitas (membaca buku di perpustakaan).',
      },
      {
        id: 'bp-pt-2',
        sentence: 'まいにち おちゃ（　）のみます。',
        options: ['は', 'が', 'を', 'に'],
        answerIndex: 2,
        explanation: 'を (dibaca o) menandai objek langsung dari kata kerja transitif のみます (minum).',
      },
      {
        id: 'bp-pt-3',
        sentence: 'かぞく（　）スーパー へ いきます。(bersama keluarga)',
        options: ['と', 'で', 'を', 'は'],
        answerIndex: 0,
        explanation: 'と menyatakan melakukan kegiatan bersama orang lain.',
      },
      {
        id: 'bp-pt-4',
        sentence: 'じてんしゃ（　）がっこう へ いきます。(naik sepeda)',
        options: ['に', 'を', 'で', 'が'],
        answerIndex: 2,
        explanation: 'で juga dipakai untuk menyatakan alat atau sarana transportasi yang digunakan.',
      },
    ],
  },
  {
    id: 'bentuk-lampau',
    level: 'N5',
    title: 'Bentuk Lampau 〜ました / 〜でした / 〜た',
    pattern: '〜ます → 〜ました ｜ 〜ません → 〜ませんでした ｜ 〜です → 〜でした',
    summary: 'Menyatakan kejadian atau keadaan yang sudah terjadi (kemarin, tadi, minggu lalu).',
    explanation:
      'Untuk kejadian lampau sopan, ubah ます menjadi ました (negatif: ませんでした), dan ubah です menjadi でした (negatif: じゃありませんでした). Dalam bentuk kasual/biasa, kata kerja memakai bentuk 〜た.',
    examples: [
      {
        jp: 'きのう ともだち と えいが を みました。',
        romaji: 'Kinou tomodachi to eiga o mimashita.',
        arti: 'Kemarin saya menonton film bersama teman.',
      },
      {
        jp: 'けさ パン を たべませんでした。',
        romaji: 'Kesa pan o tabemasen deshita.',
        arti: 'Tadi pagi saya tidak makan roti.',
      },
      {
        jp: 'せんしゅう の にちようび は やすみ でした。',
        romaji: 'Senshuu no nichiyoubi wa yasumi deshita.',
        arti: 'Hari Minggu minggu lalu adalah hari libur.',
      },
    ],
    questions: [
      {
        id: 'bp-lp-1',
        sentence: 'きのう いえ で にほんご を べんきょうし（　）。',
        options: ['ます', 'ました', 'でした', 'ません'],
        answerIndex: 1,
        explanation: 'Kata keterangan waktu きのう (kemarin) menunjukkan bentuk lampau → べんきょうしました.',
      },
      {
        id: 'bp-lp-2',
        sentence: 'おととい は あめ（　）。(Kemarin lusa hujan)',
        options: ['ました', 'です', 'でした', 'ません'],
        answerIndex: 2,
        explanation: 'あめ (hujan) adalah kata benda, sehingga bentuk lampau sopannya menggunakan でした.',
      },
      {
        id: 'bp-lp-3',
        sentence: 'きのう ぎんこう へ いき（　）。(tidak pergi)',
        options: ['ませんでした', 'じゃありませんでした', 'ました', 'ません'],
        answerIndex: 0,
        explanation: 'Bentuk negatif lampau sopan untuk kata kerja adalah 〜ませんでした.',
      },
      {
        id: 'bp-lp-4',
        sentence: 'せんげつ にほん へ （　）。(datang ke Jepang)',
        options: ['きます', 'きました', 'きません', 'でした'],
        answerIndex: 1,
        explanation: 'せんげつ (bulan lalu) menyatakan masa lampau, sehingga きます berubah menjadi きました.',
      },
    ],
  },
  {
    id: 'tai',
    level: 'N5',
    title: 'Menyatakan Keinginan 〜たいです',
    pattern: '[Kata Kerja bentuk ます (tanpa ます)] + たいです',
    summary: 'Mengungkapkan keinginan diri sendiri untuk melakukan sesuatu ("ingin ...").',
    explanation:
      'Hilangkan akhiran ます pada kata kerja sopan lalu tambahkan たいです (bentuk negatif: たくないです). Pola ini dipakai untuk menyatakan keinginan diri sendiri atau bertanya langsung kepada lawan bicara (〜たいですか). Objeknya boleh memakai を atau が.',
    examples: [
      {
        jp: 'にほん で はたらきたい です。',
        romaji: 'Nihon de hatarakitai desu.',
        arti: 'Saya ingin bekerja di Jepang.',
      },
      {
        jp: 'つめたい おちゃ が のみたい です。',
        romaji: 'Tsumetai ocha ga nomitai desu.',
        arti: 'Saya ingin minum teh dingin.',
      },
      {
        jp: 'きょう は なにも たべたくない です。',
        romaji: 'Kyou wa nanimo tabetakunai desu.',
        arti: 'Hari ini saya tidak ingin makan apa-apa.',
      },
    ],
    questions: [
      {
        id: 'bp-ti-1',
        sentence: 'らいねん とうきょう へ （　）。(ingin pergi)',
        options: ['いきます', 'いきたいです', 'いきました', 'いってください'],
        answerIndex: 1,
        explanation: 'Bentuk stem dari いきます adalah いき, ditambah たいです menjadi いきたいです.',
      },
      {
        id: 'bp-ti-2',
        sentence: 'あたらしい パソコン が （　）。(ingin membeli)',
        options: ['かいたいです', 'かいます', 'かいました', 'かってです'],
        answerIndex: 0,
        explanation: 'かいます → stem かい + たいです → かいたいです.',
      },
      {
        id: 'bp-ti-3',
        sentence: 'つかれた ので、はやく ね（　）。(tidak ingin tidur? Bukan, ingin tidur)',
        options: ['たいです', 'ます', 'ません', 'てください'],
        answerIndex: 0,
        explanation: 'ねます → stem ね + たいです → ねたいです (ingin tidur).',
      },
      {
        id: 'bp-ti-4',
        sentence: 'さむい から、そと へ で（　）。(tidak ingin keluar)',
        options: ['たいです', 'たくないです', 'ませんでした', 'ません'],
        answerIndex: 1,
        explanation: 'Negatif dari 〜たいです adalah 〜たくないです (tidak ingin).',
      },
    ],
  },
  {
    id: 'te-form',
    level: 'N5',
    title: 'Kata Kerja Bentuk 〜て (Te-Form)',
    pattern: 'Kelompok 1 (う/つ/る→って, む/ぶ/ぬ→んで, く→いて, ぐ→いで, す→して) · Kelompok 2 (ます→て)',
    summary: 'Bentuk penghubung paling penting untuk menyambung dua aksi, meminta tolong, izin, dan progres.',
    explanation:
      'Bentuk 〜て digunakan untuk menyatakan urutan kegiatan ("lakukan A, lalu B") serta menjadi dasar pola penting seperti 〜てください, 〜ている, dan 〜てもいいです. Pengecualian penting: いきます → いって, きます → きて, します → して.',
    examples: [
      {
        jp: 'あさ おきて、あさごはん を たべます。',
        romaji: 'Asa okite, asagohan o tabemasu.',
        arti: 'Pagi bangun tidur, lalu makan sarapan.',
      },
      {
        jp: 'うち へ かえって、しゅくだい を します。',
        romaji: 'Uchi e kaette, shukudai o shimasu.',
        arti: 'Pulang ke rumah, lalu mengerjakan PR.',
      },
      {
        jp: 'て を あらって から、しょくじ します。',
        romaji: 'Te o aratte kara, shokuji shimasu.',
        arti: 'Setelah mencuci tangan, saya makan.',
      },
    ],
    questions: [
      {
        id: 'bp-tf-1',
        sentence: 'Bentuk 〜て dari kata kerja かきます (menulis) adalah …',
        options: ['かいて', 'かって', 'かんで', 'かして'],
        answerIndex: 0,
        explanation: 'Kelompok 1 berakhiran き (く) berubah menjadi いて → かいて.',
      },
      {
        id: 'bp-tf-2',
        sentence: 'Bentuk 〜て dari kata kerja よみます (membaca) adalah …',
        options: ['よいて', 'よみって', 'よんで', 'よして'],
        answerIndex: 2,
        explanation: 'Kelompok 1 berakhiran み (む) berubah menjadi んで → よんで.',
      },
      {
        id: 'bp-tf-3',
        sentence: 'えき へ （　）、でんしゃ に のります。(Pergi ke stasiun lalu naik kereta)',
        options: ['いきて', 'いいて', 'いって', 'いで'],
        answerIndex: 2,
        explanation: 'いきます adalah pengecualian kelompok 1, bentuk 〜て-nya adalah いって (bukan いいて).',
      },
      {
        id: 'bp-tf-4',
        sentence: 'ドア を （　）、へや に はいります。(Membuka pintu lalu masuk kamar)',
        options: ['あけて', 'あけって', 'あけんで', 'あいて'],
        answerIndex: 0,
        explanation: 'あけます termasuk kelompok 2 (ichidan), cukup ganti ます dengan て → あけて.',
      },
    ],
  },
  {
    id: 'te-kudasai',
    level: 'N5',
    title: 'Meminta Tolong & Instruksi 〜てください',
    pattern: '[Kata Kerja bentuk 〜て] + ください',
    summary: 'Meminta orang lain melakukan sesuatu dengan sopan ("tolong ...").',
    explanation:
      'Gabungkan kata kerja bentuk 〜て dengan ください untuk meminta tolong atau memberi arahan dengan sopan, seperti di kelas atau di tempat kerja. Untuk melarang dengan sopan, gunakan bentuk 〜ないでください ("tolong jangan ...").',
    examples: [
      {
        jp: 'ここ に なまえ を かいて ください。',
        romaji: 'Koko ni namae o kaite kudasai.',
        arti: 'Tolong tulis nama Anda di sini.',
      },
      {
        jp: 'もう いちど ゆっくり いって ください。',
        romaji: 'Mou ichido yukkuri itte kudasai.',
        arti: 'Tolong ucapkan sekali lagi pelan-pelan.',
      },
      {
        jp: 'きかい に さわらないで ください。',
        romaji: 'Kikai ni sawaranaide kudasai.',
        arti: 'Tolong jangan menyentuh mesin.',
      },
    ],
    questions: [
      {
        id: 'bp-tk-1',
        sentence: 'すみません、この かんじ を （　）ください。(tolong baca)',
        options: ['よんで', 'よむ', 'よみます', 'よみて'],
        answerIndex: 0,
        explanation: 'Pola 〜てください memakai bentuk 〜て: よみます → よんでください.',
      },
      {
        id: 'bp-tk-2',
        sentence: 'あした くじ に （　）ください。(tolong datang)',
        options: ['きて', 'きます', 'くる', 'きって'],
        answerIndex: 0,
        explanation: 'きます bentuk 〜て-nya adalah きて → きてください.',
      },
      {
        id: 'bp-tk-3',
        sentence: 'きょうしつ で たばこ を （　）ください。(tolong jangan merokok)',
        options: ['すって', 'すわないで', 'すいません', 'すう'],
        answerIndex: 1,
        explanation: 'Larangan sopan memakai bentuk 〜ないでください: すう → すわないでください.',
      },
      {
        id: 'bp-tk-4',
        sentence: 'しごと が おわったら、ほうこく （　）ください。(tolong lapor)',
        options: ['して', 'します', 'した', 'すて'],
        answerIndex: 0,
        explanation: 'ほうこくします adalah kata kerja kelompok 3 (します → して).',
      },
    ],
  },
  {
    id: 'te-iru',
    level: 'N5',
    title: 'Sedang Berlangsung & Kebiasaan 〜ています',
    pattern: '[Kata Kerja bentuk 〜て] + います (kasual: 〜ている)',
    summary: 'Menyatakan aksi yang sedang berlangsung sekarang, kondisi berlanjut, atau rutinitas.',
    explanation:
      'Bentuk 〜ています mempunyai tiga fungsi utama: (1) aksi yang sedang berlangsung saat ini ("sedang ..."), (2) keadaan yang masih bertahan setelah terjadi (seperti すんでいます = tinggal, しっています = tahu, けっこんしています = sudah menikah), dan (3) kebiasaan berulang.',
    examples: [
      {
        jp: 'いま にほんご を べんきょうして います。',
        romaji: 'Ima nihongo o benkyou shite imasu.',
        arti: 'Sekarang saya sedang belajar bahasa Jepang.',
      },
      {
        jp: 'わたし は バニュワンギ に すんで います。',
        romaji: 'Watashi wa Banyuwangi ni sunde imasu.',
        arti: 'Saya tinggal di Banyuwangi.',
      },
      {
        jp: 'あね は びょういん で はたらいて います。',
        romaji: 'Ane wa byouin de hataraite imasu.',
        arti: 'Kakak perempuan saya bekerja di rumah sakit.',
      },
    ],
    questions: [
      {
        id: 'bp-ti2-1',
        sentence: 'いま、せんせい は じゅぎょう を （　）。(sedang mengajar)',
        options: ['おしえて います', 'おしえます', 'おしえました', 'おしえたいです'],
        answerIndex: 0,
        explanation: 'Kata いま (sekarang) menandakan aksi sedang berlangsung → 〜ています.',
      },
      {
        id: 'bp-ti2-2',
        sentence: 'あそこに やまださん が （　）。(sedang menunggu)',
        options: ['まって います', 'まて います', 'まって ください', 'まちます'],
        answerIndex: 0,
        explanation: 'まちます → bentuk 〜て adalah まって, ditambah います → まっています.',
      },
      {
        id: 'bp-ti2-3',
        sentence: 'わたし は SMK で ネットワーク を （　）。(sedang/rutin mempelajari)',
        options: ['まなびます', 'まなんで います', 'まなんで ください', 'まなんだ'],
        answerIndex: 1,
        explanation: 'Kegiatan studi berkelanjutan saat ini dinyatakan dengan 〜ています.',
      },
      {
        id: 'bp-ti2-4',
        sentence: 'すずきさん の でんわばんごう を （　）か。(Apakah kamu tahu?)',
        options: ['しって います', 'しります', 'しって ください', 'しりません'],
        answerIndex: 0,
        explanation: 'Mengetahui (しる) menyatakan kondisi pengetahuan yang berlanjut, sehingga selalu memakai しっています (negatif: しりません).',
      },
    ],
  },
  {
    id: 'nakereba',
    level: 'N5',
    title: 'Keharusan 〜なければなりません',
    pattern: '[Kata Kerja bentuk ない (tanpa い)] + なければなりません',
    summary: 'Menyatakan kewajiban atau peraturan yang harus dipatuhi ("harus ...").',
    explanation:
      'Ambil bentuk negatif pendek (ない-form), hilangkan い di akhir, lalu tambahkan なければなりません (atau dalam percakapan sehari-hari yang sedikit lebih ringan: 〜なくてはいけません / 〜ないと).',
    examples: [
      {
        jp: 'こうじょう では ヘルメット を かぶらなければ なりません。',
        romaji: 'Koujou dewa herumetto o kaburanakereba narimasen.',
        arti: 'Di pabrik wajib memakai helm pelindung.',
      },
      {
        jp: 'あした は やく おきなければ なりません。',
        romaji: 'Ashita wa hayaku okinakereba narimasen.',
        arti: 'Besok saya harus bangun pagi-pagi.',
      },
      {
        jp: 'まいにち くすり を のまなければ なりません。',
        romaji: 'Mainichi kusuri o nomanakereba narimasen.',
        arti: 'Setiap hari harus minum obat.',
      },
    ],
    questions: [
      {
        id: 'bp-nk-1',
        sentence: 'しごと の まえ に て を あら（　）なりません。(harus mencuci tangan)',
        options: ['わなければ', 'いなければ', 'ってなければ', 'うなければ'],
        answerIndex: 0,
        explanation: 'あらう → bentuk ない adalah あらわない → buang い jadi あらわ + なければなりません.',
      },
      {
        id: 'bp-nk-2',
        sentence: 'きんようび まで に レポート を （　）なりません。(harus menyerahkan/mengeluarkan)',
        options: ['ださなければ', 'だしなければ', 'だしてなければ', 'だすなければ'],
        answerIndex: 0,
        explanation: 'だす → ださない → ださなければなりません.',
      },
      {
        id: 'bp-nk-3',
        sentence: 'じかん を まもら（　）。(harus menepati waktu)',
        options: ['なければ なりません', 'ても いいです', 'たいです', 'ましょう'],
        answerIndex: 0,
        explanation: 'まもらない → まもらなければなりません (harus menepati).',
      },
      {
        id: 'bp-nk-4',
        sentence: 'きょう は テスト が ある から、べんきょう （　）なりません。',
        options: ['しなければ', 'しなくて', 'したければ', 'するば'],
        answerIndex: 0,
        explanation: 'する → しない → しなければなりません.',
      },
    ],
  },
  {
    id: 'te-mo-ii',
    level: 'N5',
    title: 'Meminta & Memberi Izin 〜てもいいです',
    pattern: '[Kata Kerja bentuk 〜て] + もいいです（か）',
    summary: 'Menanyakan atau memberi izin melakukan sesuatu ("boleh ..."), serta larangan (〜てはいけません).',
    explanation:
      'Gunakan 〜てもいいですか untuk meminta izin dengan sopan ("bolehkah saya ...?"). Untuk memberi izin, jawab dengan ええ、いいですよ / 〜てもいいです. Sebaliknya, larangan tegas dinyatakan dengan 〜てはいけません ("tidak boleh ...").',
    examples: [
      {
        jp: 'ここで しゃしん を とっても いいですか。',
        romaji: 'Koko de shashin o tottemo ii desu ka.',
        arti: 'Bolehkah saya mengambil foto di sini?',
      },
      {
        jp: 'はい、とっても いいですよ。',
        romaji: 'Hai, tottemo ii desu yo.',
        arti: 'Ya, silakan boleh mengambil foto.',
      },
      {
        jp: 'この へや に はいっては いけません。',
        romaji: 'Kono heya ni haitte wa ikemasen.',
        arti: 'Tidak boleh masuk ke ruangan ini.',
      },
    ],
    questions: [
      {
        id: 'bp-pm-1',
        sentence: 'すみません、トイレ に いって（　）。(Bolehkah pergi ke toilet?)',
        options: ['もいいですか', 'はいけませんか', 'ください', 'いますか'],
        answerIndex: 0,
        explanation: 'いって + もいいですか = Bolehkah saya pergi?',
      },
      {
        id: 'bp-pm-2',
        sentence: 'この ペン を つかっても いいですか。— はい、（　）。',
        options: ['つかっても いいですよ', 'つかっては いけません', 'つかわなければ なりません', 'つかいましょう'],
        answerIndex: 0,
        explanation: 'Memberi izin atas pertanyaan 〜てもいいですか dijawab dengan 〜てもいいですよ.',
      },
      {
        id: 'bp-pm-3',
        sentence: 'びょういん の なか で おおきい こえ で はなし（　）。(tidak boleh berbicara keras)',
        options: ['ては いけません', 'ても いいです', 'たいです', 'ました'],
        answerIndex: 0,
        explanation: 'Larangan dinyatakan dengan bentuk 〜て + はいけません → はなしてはいけません.',
      },
      {
        id: 'bp-pm-4',
        sentence: 'あつい ので、まど を あけて（　）。(Boleh membuka jendela)',
        options: ['もいいです', 'はいけません', 'なりません', 'ほしいです'],
        answerIndex: 0,
        explanation: 'あけて + もいいです = boleh membuka jendela.',
      },
    ],
  },
  {
    id: 'perbandingan',
    level: 'N4',
    title: 'Perbandingan 〜より / 〜のほうが',
    pattern: 'A は B より [Kata Sifat] です ｜ B より A のほうが [Kata Sifat] です',
    summary: 'Membandingkan dua benda, tempat, atau pilihan ("lebih ... daripada ...").',
    explanation:
      'より berarti "daripada" dan selalu menempel pada pembanding (yang lebih rendah derajatnya). 〜のほうが menandai pilihan yang unggul/lebih. Untuk bertanya perbandingan dua hal, gunakan: A と B と どちらが [Kata Sifat] ですか.',
    examples: [
      {
        jp: 'しんかんせん は バス より はやい です。',
        romaji: 'Shinkansen wa basu yori hayai desu.',
        arti: 'Shinkansen lebih cepat daripada bus.',
      },
      {
        jp: 'りんご より みかん のほうが すき です。',
        romaji: 'Ringo yori mikan no hou ga suki desu.',
        arti: 'Daripada apel, saya lebih suka jeruk.',
      },
      {
        jp: 'にほんご と えいご と どちらが むずかしい ですか。',
        romaji: 'Nihongo to eigo to dochira ga muzukashii desu ka.',
        arti: 'Antara bahasa Jepang dan bahasa Inggris, mana yang lebih sulit?',
      },
    ],
    questions: [
      {
        id: 'bp-pb-1',
        sentence: 'きょう は きのう（　）あつい です。(lebih panas daripada kemarin)',
        options: ['より', 'のほうが', 'ほど', 'と'],
        answerIndex: 0,
        explanation: 'より menempel setelah pembanding (きのう) untuk menyatakan "daripada kemarin".',
      },
      {
        id: 'bp-pb-2',
        sentence: 'わたし は コーヒー より おちゃ（　）すき です。',
        options: ['より', 'のほうが', 'から', 'ので'],
        answerIndex: 1,
        explanation: 'おちゃ のほうが すき です berarti "lebih suka teh".',
      },
      {
        id: 'bp-pb-3',
        sentence: 'なつ と ふゆ と （　）が すき ですか。',
        options: ['どちら', 'どれ', 'どこ', 'だれ'],
        answerIndex: 0,
        explanation: 'Saat membandingkan tepat 2 hal (A と B と), kata tanya yang dipakai adalah どちら.',
      },
      {
        id: 'bp-pb-4',
        sentence: 'でんしゃ のほうが くるま（　）はやくて べんり です。',
        options: ['より', 'のほうが', 'まで', 'に'],
        answerIndex: 0,
        explanation: 'Pola: A のほうが B より [sifat] です → くるま より (daripada mobil).',
      },
    ],
  },
  {
    id: 'alasan',
    level: 'N4',
    title: 'Menyatakan Alasan 〜から / 〜ので',
    pattern: '[Kalimat Alasan] + から / ので、[Kalimat Akibat]',
    summary: 'Menghubungkan sebab dan akibat ("karena ..., maka ...").',
    explanation:
      'Keduanya berarti "karena". から sedikit lebih subjektif dan umum dipakai dengan ajakan/perintah/opini (bisa menempel langsung ke です/ます maupun bentuk biasa). ので terasa lebih halus, objektif, dan sopan — sangat cocok saat menjelaskan alasan kepada guru atau atasan; untuk kata benda dan kata sifat-な bentuk biasa, tambahkan な sebelum ので (mis. びょうきなので, ひまなので).',
    examples: [
      {
        jp: 'あめ が ふっている から、かさ を もって いきます。',
        romaji: 'Ame ga futte iru kara, kasa o motte ikimasu.',
        arti: 'Karena sedang turun hujan, saya membawa payung.',
      },
      {
        jp: 'ねつ が ある ので、きょう は やすませて ください。',
        romaji: 'Netsu ga aru node, kyou wa yasumasete kudasai.',
        arti: 'Karena saya demam, mohon izinkan saya libur hari ini.',
      },
      {
        jp: 'しずか なので、この としょかん が すき です。',
        romaji: 'Shizuka na node, kono toshokan ga suki desu.',
        arti: 'Karena tenang, saya suka perpustakaan ini.',
      },
    ],
    questions: [
      {
        id: 'bp-al-1',
        sentence: 'じかん が ない（　）、タクシー で いきましょう。',
        options: ['から', 'より', 'まで', 'に'],
        answerIndex: 0,
        explanation: 'Alasan yang diikuti ajakan (〜ましょう) sangat natural menggunakan から.',
      },
      {
        id: 'bp-al-2',
        sentence: 'あした は テスト（　）、きょう は はやく かえります。',
        options: ['なので', 'ので', 'なのから', 'だので'],
        answerIndex: 0,
        explanation: 'テスト adalah kata benda, sehingga sebelum ので wajib memakai な → テストなので.',
      },
      {
        id: 'bp-al-3',
        sentence: 'でんしゃ が おくれた（　）、ちこく しました。',
        options: ['ので', 'より', 'のに', 'まで'],
        answerIndex: 0,
        explanation: 'Menjelaskan alasan keterlambatan secara objektif dan sopan cocok memakai ので.',
      },
      {
        id: 'bp-al-4',
        sentence: 'この みせ は おいしい です（　）、いつも おきゃくさん が おおい です。',
        options: ['から', 'ほど', 'より', 'ても'],
        answerIndex: 0,
        explanation: 'Setelah です・ます, penanda alasan yang langsung menempel alami adalah から.',
      },
    ],
  },
  {
    id: 'mashou',
    level: 'N5',
    title: 'Ajakan & Tawaran 〜ましょう / 〜ましょうか',
    pattern: '[Kata Kerja stem ます] + ましょう ｜ 〜ましょうか',
    summary: 'Mengajak melakukan sesuatu bersama ("ayo ...") dan menawarkan bantuan ("bagaimana kalau saya ...?").',
    explanation:
      'Ganti akhiran ます menjadi ましょう untuk mengajak lawan bicara ("ayo kita ..."). Jika ditambah か menjadi 〜ましょうか, artinya bisa berupa usulan bersama ("bagaimana kalau kita ...?") atau menawarkan bantuan kepada orang lain ("maukah saya bantu ...?").',
    examples: [
      {
        jp: 'いっしょに ひるごはん を たべましょう。',
        romaji: 'Issho ni hirugohan o tabemashou.',
        arti: 'Ayo kita makan siang bersama.',
      },
      {
        jp: 'すこし やすみましょうか。',
        romaji: 'Sukoshi yasumimashou ka.',
        arti: 'Bagaimana kalau kita beristirahat sebentar?',
      },
      {
        jp: 'にもつ を もちましょうか。',
        romaji: 'Nimotsu o mochimashou ka.',
        arti: 'Mari saya bawakan barangnya?',
      },
    ],
    questions: [
      {
        id: 'bp-ms-1',
        sentence: 'しごと が おわった ので、かえり（　）。(Ayo pulang)',
        options: ['ましょう', 'ます', 'ません', 'ました'],
        answerIndex: 0,
        explanation: 'Ajakan sopan menggunakan akhiran ましょう → かえりましょう.',
      },
      {
        id: 'bp-ms-2',
        sentence: 'おもい ですね。わたしが もち（　）。(Mau saya bantu bawakan?)',
        options: ['ましょうか', 'ましたか', 'たいですか', 'てください'],
        answerIndex: 0,
        explanation: 'Menawarkan bantuan kepada orang lain dinyatakan dengan 〜ましょうか.',
      },
      {
        id: 'bp-ms-3',
        sentence: 'じゅうじ に ここで あい（　）。(Ayo bertemu di sini jam 10)',
        options: ['ましょう', 'たい', 'ますか', 'て'],
        answerIndex: 0,
        explanation: 'あいます → stem あい + ましょう → あいましょう.',
      },
      {
        id: 'bp-ms-4',
        sentence: 'あした いっしょに えいが を みませんか。— ええ、（　）。',
        options: ['みましょう', 'みませんでした', 'みてはいけません', 'みたくないです'],
        answerIndex: 0,
        explanation: 'Menyetujui ajakan (〜ませんか) dijawab dengan antusias memakai 〜ましょう.',
      },
    ],
  },
];
