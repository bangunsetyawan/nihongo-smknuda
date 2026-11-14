# LAPORAN IMPLEMENTASI WEBSITE BELAJAR BAHASA JEPANG ("Nihongo SMKNUDA")

Website pembelajaran Bahasa Jepang dari nol untuk siswa ekstrakurikuler SMK NU Darussalam telah dibangun, di-containerize dengan Docker, dan dijalankan di server `smknuda2`.

---

## 1. Ringkasan Layanan & Lokasi Workspace

- **Lokasi Proyek di Server:** `/home/smknuda2/laci/nihongo-smknuda/`
- **Container Docker:** `nihongo-smknuda` (image `nihongo-smknuda:latest`)
- **Port Layanan:** `8432` (host port `8432` -> container port `80` Nginx)
- **Teknologi:** React 19, TypeScript, Vite 8, React Router 7, WanaKana, Vite PWA (`vite-plugin-pwa`), disajikan via `nginx:1.27-alpine`.
- **Integritas Sistem:** Container lain (`smknuda-landing`, `gitea`, `seo-smknuda`, `auto-absen-dashboard`) dan server `siakanuda` tidak diubah.

---

## 2. Alamat Akses

| Jalur Akses | URL | Keterangan |
|---|---|---|
| **Publik (Cloudflare Tunnel)** | `https://japan.smknuda.qzz.io` | Akses siswa & guru dari internet/HP (HTTPS) |

---

## 3. Fitur Website (Tahap 1 — Tanpa Login)

1. **Beranda (`/`):**
   - Sapaan personal (nama panggilan disimpan di browser siswa), pelacak level XP, *streak* harian, serta progres Hiragana dan Katakana.
   - Alur panduan langkah demi langkah + fitur unduh/pulihkan cadangan progres (JSON) dari perangkat siswa.
2. **Hiragana (`/hiragana`) & Katakana (`/katakana`):**
   - Tabel lengkap (Dasar/Gojūon, Dakuten & Handakuten, Yōon, dan Katakana tambahan untuk kata serapan).
   - Ketuk huruf untuk mendengar pelafalan (Web Speech API `ja-JP`), melihat contoh kata bahasa Indonesia, animasi urutan goresan (KanjiVG), dan kanvas latihan menulis langsung di layar.
   - Mode sembunyikan romaji untuk uji diri dan pewarnaan penguasaan huruf.
3. **Kosakata & Ungkapan IRODORI / SSW (`/kosakata`):**
   - 102 kosakata dan ungkapan dalam 7 kategori (*Salam & Kelas*, *Perkenalan & SMK*, *Angka & Waktu*, *Makan & Belanja*, *Kata Kerja N5*, *Kata Sifat N5*, *Budaya Kerja Jepang & 5S SSW*).
   - Tiga mode belajar: **Daftar Kata** (pencarian + audio + tandai hafal), **Flashcard** interaktif, dan **Kuis Kosakata** pilihan ganda.
4. **Kuis Kana (`/kuis`):**
   - 4 mode kuis: *Huruf → Romaji*, *Romaji → Huruf*, *Dengar → Huruf*, dan *Ketik Romaji*.
   - Pembobotan adaptif: huruf yang masih lemah muncul lebih sering.
5. **Panduan Dasar (`/panduan`):**
   - Penjelasan bahasa Indonesia tentang 3 jenis huruf, dakuten/handakuten, huruf kecil (`ゃ ゅ ょ`, `っ`), vokal panjang, partikel `は へ を`, tips pelafalan, dan salam dasar.
6. **Jalur Menuju N4 / SSW (`/jalur`) & Sumber Belajar (`/sumber`):**
   - Peta belajar selaras buku gratis **IRODORI** (Japan Foundation) dari nol hingga persiapan **JLPT N4 / JFT-Basic (SSW)**.
   - Tautan resmi (IRODORI, Marugoto Plus, NHK Easy Japanese, JFT-Basic, JLPT) dan halaman **Kredit & Lisensi** (KanjiVG CC BY-SA 3.0, WanaKana MIT, dll.).
7. **PWA (Progressive Web App):**
   - Dapat dipasang ke layar utama HP Android/iOS (*Add to Home Screen*) dan bekerja secara offline untuk materi statis.

---

## 4. Perintah Operasional & Pemeliharaan

### Docker
```bash
cd /home/smknuda2/laci/nihongo-smknuda

# Cek status container
docker ps --filter name=nihongo-smknuda

# Lihat log container
docker logs -f nihongo-smknuda

# Rebuild & jalankan ulang setelah update kode
docker compose up -d --build
```

### Cloudflare Tunnel & UFW
```bash
# Cek status cloudflared
systemctl is-active cloudflared
sudo systemctl status cloudflared --no-pager

# Restart cloudflared setelah mengubah /etc/cloudflared/config.yml
sudo systemctl restart cloudflared

# Cek rule firewall UFW untuk port 8432
sudo ufw status | grep 8432
```
