import { Link } from 'react-router-dom';

const STAGES = [
  {
    n: 0, title: 'Huruf Kana', sub: 'Hiragana + Katakana', time: '± 3–5 minggu', level: 'Pra-A1',
    items: ['Hafal 46 hiragana + variasinya', 'Hafal 46 katakana + variasinya', 'Paham っ, ゃゅょ, vokal panjang', 'Salam sehari-hari'],
    here: true,
  },
  {
    n: 1, title: 'IRODORI Starter', sub: 'いろどり 入門 (A1)', time: '± 4–5 bulan', level: '≈ JLPT N5',
    items: ['Perkenalan diri, keluarga, hobi', 'Angka, waktu, harga, belanja', 'Kalimat dasar です／ます', '± 100 kanji, ± 800 kosakata'],
  },
  {
    n: 2, title: 'IRODORI Elementary 1', sub: 'いろどり 初級1 (A2)', time: '± 4–5 bulan', level: 'N5 → N4',
    items: ['Bentuk て, ない, た', 'Meminta izin, memberi saran', 'Percakapan di tempat kerja & kota', 'Mulai latihan soal JLPT/JFT'],
  },
  {
    n: 3, title: 'IRODORI Elementary 2', sub: 'いろどり 初級2 (A2)', time: '± 4–5 bulan', level: '≈ JLPT N4 / JFT-Basic',
    items: ['± 300 kanji, ± 1.500 kosakata', 'Bentuk potensial, keinginan, pasif dasar', 'Membaca pengumuman & instruksi kerja', 'Simulasi ujian JFT-Basic / JLPT N4'],
  },
];

export default function Roadmap() {
  return (
    <div className="page narrow prose">
      <h1>🗺️ Jalur Belajar Menuju N4 / SSW</h1>
      <p className="lead">
        Kurikulum ekstra ini mengikuti buku <strong>IRODORI: Japanese for Life in Japan</strong> dari The Japan Foundation.
        Buku ini <strong>gratis</strong>, tersedia <strong>versi bahasa Indonesia</strong>, dan dirancang untuk calon pekerja di Jepang,
        sehingga cocok untuk siswa SMK.
      </p>

      <div className="timeline">
        {STAGES.map((s) => (
          <div key={s.n} className={`card stage ${s.here ? 'here' : ''}`}>
            <div className="stage-n">{s.n === 0 ? 'あ' : s.n}</div>
            <div className="grow">
              <div className="row between wrap">
                <h3>{s.title} <span className="muted jp small">{s.sub}</span></h3>
                <span className="pill">{s.level}</span>
              </div>
              <div className="muted small">
                ⏱ {s.time}
                {s.here ? (
                  ' · 📍 Kamu mulai di sini (tersedia di website ini)'
                ) : s.n === 1 ? (
                  <> · 📘 <Link to="/kosakata">Latihan kosakata dasar sudah tersedia →</Link></>
                ) : (
                  ' · 🚧 Modul lanjutan segera hadir; sementara pakai buku IRODORI'
                )}
              </div>
              <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>

      <h2>JLPT N4 atau JFT-Basic? Apa hubungannya dengan SSW?</h2>
      <p>
        <strong>SSW / Tokutei Ginō</strong> (Pekerja Berketerampilan Spesifik) adalah program visa kerja ke Jepang.
        Syarat bahasa untuk SSW tipe 1 adalah <strong>salah satu</strong> dari:
      </p>
      <table className="tbl">
        <thead><tr><th></th><th>JLPT N4</th><th>JFT-Basic (A2)</th></tr></thead>
        <tbody>
          <tr><td>Penyelenggara</td><td>Japan Foundation & JEES</td><td>Japan Foundation</td></tr>
          <tr><td>Jadwal</td><td>2× setahun (Juli & Desember)</td><td>Hampir setiap bulan (berbasis komputer)</td></tr>
          <tr><td>Lulus</td><td>Skor minimum per bagian & total</td><td>Skor ≥ 200 dari 250</td></tr>
          <tr><td>Fokus</td><td>Kosakata, tata bahasa, membaca, menyimak</td><td>Komunikasi sehari-hari & kerja (sesuai IRODORI)</td></tr>
        </tbody>
      </table>
      <div className="callout">
        Selain ujian bahasa, SSW juga mensyaratkan <strong>ujian keterampilan bidang</strong> (mis. manufaktur, perhotelan,
        perawatan lansia, pertanian, otomotif). Bidang perawatan lansia juga mensyaratkan ujian bahasa Jepang khusus perawatan.
      </div>

      <h2>Target harian yang disarankan</h2>
      <ul>
        <li>📅 <strong>15–30 menit setiap hari</strong> di rumah + pertemuan ekstra tiap minggu.</li>
        <li>🔤 Tahap kana: <strong>5 huruf baru per hari</strong>, ulangi kuis sampai semua hijau.</li>
        <li>📘 Tahap IRODORI: <strong>1 bab per 1–2 minggu</strong>, dengarkan audionya berulang-ulang.</li>
        <li>🗣️ Praktikkan percakapan berpasangan setiap pertemuan.</li>
      </ul>
    </div>
  );
}
