# Nihongo SMKNUDA 🇯🇵

Website belajar bahasa Jepang dari nol untuk siswa ekstrakurikuler SMK NU Darussalam, Srono, Banyuwangi.

Belajar Hiragana, Katakana, kosakata sehari-hari, sampai persiapan JLPT N4 / SSW — semuanya gratis, tanpa login, bisa dibuka dari HP.

🌐 **Coba langsung:** https://japan.smknuda.qzz.io

---

## Fitur

### 🏠 Beranda

- Sapaan personal (nama panggilan tersimpan di browser)
- Pelacak level XP dan *streak* harian
- Progres penguasaan Hiragana & Katakana
- Cadangan progres (unduh/pulihkan file JSON)

### あ Hiragana & Katakana

- Tabel lengkap: Gojūon, Dakuten & Handakuten, Yōon, plus Katakana tambahan
- Ketuk huruf untuk mendengar pelafalan (Web Speech API `ja-JP`)
- Contoh kata, animasi urutan goresan (KanjiVG), dan kanvas latihan menulis
- Mode sembunyikan romaji untuk uji diri, plus pewarnaan huruf yang sudah dikuasai

### 📚 Kosakata & Ungkapan (IRODORI / SSW)

- 102 kosakata dan ungkapan dalam 7 kategori: Salam & Kelas, Perkenalan & SMK, Angka & Waktu, Makan & Belanja, Kata Kerja N5, Kata Sifat N5, Budaya Kerja Jepang & 5S SSW
- Tiga mode belajar: Daftar Kata (cari + audio + tandai hafal), Flashcard, dan Kuis pilihan ganda

### ✏️ Kuis Kana

- 4 mode: Huruf → Romaji, Romaji → Huruf, Dengar → Huruf, Ketik Romaji
- Pembobotan adaptif: huruf yang masih lemah muncul lebih sering

### 📖 Panduan Dasar

- 3 jenis huruf, dakuten/handakuten, huruf kecil (ゃ ゅ ょ, っ), vokal panjang, partikel は へ を, tips pelafalan, dan salam dasar

### 🗺️ Jalur Menuju N4 / SSW & Sumber Belajar

- Peta belajar selaras buku gratis IRODORI (Japan Foundation), dari nol sampai persiapan JLPT N4 / JFT-Basic (SSW)
- Tautan resmi: IRODORI, Marugoto Plus, NHK Easy Japanese, JFT-Basic, JLPT

### 📱 PWA

- Bisa dipasang ke layar utama HP Android/iOS (*Add to Home Screen*)
- Materi statis tetap bisa dibaca offline

---

## Teknologi

- **React 19 + TypeScript + Vite 8** — antarmuka & build
- **React Router 7** — navigasi antar halaman
- **WanaKana** — konversi romaji ↔ kana
- **KanjiVG** — data animasi urutan goresan
- **Vite PWA** — dukungan offline & instalasi
- **nginx:1.27-alpine** — penyajian hasil build
- **Docker & Docker Compose** — containerisasi

---

## Menjalankan

### Pakai Docker (cara yang dipakai di server)

```bash
docker compose up -d --build
```

Lalu buka http://localhost:8432 (port host bisa diubah di `docker-compose.yml`).

### Mode pengembangan

```bash
npm install
npm run dev
```

Perintah lain:

```bash
npm run build       # build produksi ke folder dist/
npm run typecheck   # cek tipe TypeScript
npm run preview     # pratinjau hasil build
```

---

## Akses

🌐 **Publik:** https://japan.smknuda.qzz.io

---

## Struktur proyek

```
.
├── public/            # aset statis (ikon, logo, favicon)
├── scripts/           # skrip bantu (mis. fetch-kana-strokes.mjs)
├── src/
│   ├── components/    # KanaModal, Speak, StrokeAnimator, WritingPad
│   ├── data/          # data kana & kosakata (kana.ts, vocab.ts, kana-strokes.json)
│   ├── lib/           # progres belajar & text-to-speech
│   ├── pages/         # Home, KanaPage, VocabPage, Quiz, Guide, Roadmap, Resources
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── vite.config.ts
```

---

## Kredit & lisensi

- Materi belajar selaras buku **IRODORI** (Japan Foundation) — gratis untuk pembelajar bahasa Jepang.
- Data goresan huruf: **KanjiVG** (CC BY-SA 3.0).
- Konversi kana: **WanaKana** (MIT).
- Proyek ini dibuat untuk keperluan belajar di SMK NU Darussalam. Silakan dipakai dan dikembangkan untuk pendidikan.

---

Dibangun dan dijalankan di server lab `smknuda2` (Docker).
