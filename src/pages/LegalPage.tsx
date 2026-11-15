import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="page narrow">
      <div className="card" style={{ padding: '1.5rem' }}>
        <span className="hero-kicker jp">プライバシーポリシー</span>
        <h1>Kebijakan Privasi</h1>
        <p className="muted small">Berlaku untuk Nihongo SMKN NU Darussalam (https://japan.smknuda.qzz.io)</p>

        <h3>1. Data yang Dikumpulkan</h3>
        <p>
          Saat Anda masuk menggunakan akun Google atau mendaftar secara manual, aplikasi ini hanya menyimpan data yang diperlukan untuk pembelajaran:
          alamat email, nama lengkap, nama panggilan, kelas, jurusan, foto profil (jika tersedia dari Google), serta progres belajar bahasa Jepang (Hiragana, Katakana, Kosakata, XP, dan kuis).
        </p>

        <h3>2. Penggunaan Data</h3>
        <p>
          Data digunakan semata-mata untuk menyimpan progres belajar siswa di server sekolah SMKN NU Darussalam dan memudahkan pemantauan pembelajaran oleh pembina/guru. Data tidak dijual atau dibagikan ke pihak ketiga mana pun.
        </p>

        <h3>3. Penghapusan Data</h3>
        <p>
          Siswa atau orang tua dapat meminta penghapusan akun dan data progres kapan saja melalui pembina ekstrakurikuler bahasa Jepang di SMKN NU Darussalam Srono, Banyuwangi.
        </p>

        <div className="row gap-s wrap" style={{ marginTop: '1.2rem' }}>
          <Link className="btn primary" to="/">Kembali ke Beranda</Link>
          <Link className="btn" to="/ketentuan">Ketentuan Layanan</Link>
        </div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="page narrow">
      <div className="card" style={{ padding: '1.5rem' }}>
        <span className="hero-kicker jp">利用規約</span>
        <h1>Ketentuan Layanan</h1>
        <p className="muted small">Nihongo SMKN NU Darussalam (https://japan.smknuda.qzz.io)</p>

        <h3>1. Tujuan Penggunaan</h3>
        <p>
          Portal ini disediakan gratis sebagai media pembelajaran bahasa Jepang bagi siswa dan peserta didik di lingkungan SMKN NU Darussalam.
        </p>

        <h3>2. Akun Pengguna</h3>
        <p>
          Pengguna diharapkan mengisi identitas kelas dan jurusan dengan benar agar progres belajar tercatat sesuai data siswa. Materi dasar tetap dapat diakses tanpa login.
        </p>

        <h3>3. Ketersediaan Layanan</h3>
        <p>
          Layanan dikelola secara mandiri oleh sekolah dan dapat diperbarui sewaktu-waktu untuk peningkatan materi serta fitur belajar.
        </p>

        <div className="row gap-s wrap" style={{ marginTop: '1.2rem' }}>
          <Link className="btn primary" to="/">Kembali ke Beranda</Link>
          <Link className="btn" to="/privasi">Kebijakan Privasi</Link>
        </div>
      </div>
    </div>
  );
}
