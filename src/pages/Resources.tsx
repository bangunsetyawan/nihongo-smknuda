const LINKS = [
  {
    cat: '📘 Buku & materi utama (gratis)',
    items: [
      { name: 'IRODORI: Japanese for Life in Japan', url: 'https://www.irodori.jpf.go.jp/', desc: 'Buku utama ekstra ini. PDF + audio MP3 gratis, ada versi bahasa Indonesia.' },
      { name: 'Marugoto Plus', url: 'https://marugotoweb.jp/', desc: 'Situs latihan interaktif dari Japan Foundation (A1–A2).' },
      { name: 'NHK World: Easy Japanese (Bahasa Indonesia)', url: 'https://www3.nhk.or.jp/nhkworld/lesson/id/', desc: 'Pelajaran audio dan video singkat dengan penjelasan bahasa Indonesia.' },
      { name: 'Erin\'s Challenge! I can speak Japanese', url: 'https://www.erin.jpf.go.jp/', desc: 'Video drama tentang kehidupan sekolah di Jepang, ada subtitle.' },
    ],
  },
  {
    cat: '📝 Ujian',
    items: [
      { name: 'JFT-Basic', url: 'https://www.jpf.go.jp/jft-basic/', desc: 'Ujian bahasa Jepang untuk syarat SSW. Ada contoh soal dan latihan online.' },
      { name: 'JLPT (resmi)', url: 'https://www.jlpt.jp/', desc: 'Informasi ujian dan contoh soal N5–N1.' },
      { name: 'The Japan Foundation Jakarta', url: 'https://www.jpf.or.id/', desc: 'Info pendaftaran JLPT di Indonesia dan kegiatan budaya Jepang.' },
    ],
  },
  {
    cat: '📱 Aplikasi pendamping',
    items: [
      { name: 'IRODORI Practice', url: 'https://play.google.com/store/search?q=irodori%20practice&c=apps', desc: 'Aplikasi resmi untuk latihan kosakata dan kanji sesuai buku IRODORI.' },
      { name: 'Kana Pro', url: 'https://kana.pro/', desc: 'Latihan hiragana & katakana tambahan.' },
      { name: 'Anki', url: 'https://apps.ankiweb.net/', desc: 'Flashcard dengan pengulangan berjarak untuk menghafal kosakata.' },
      { name: 'Jisho.org', url: 'https://jisho.org/', desc: 'Kamus Jepang–Inggris online yang lengkap.' },
    ],
  },
];

const CREDITS = [
  { name: 'KanjiVG', url: 'https://kanjivg.tagaini.net/', lic: 'CC BY-SA 3.0', what: 'Data urutan goresan huruf. © Ulrich Apel dan kontributor.' },
  { name: 'WanaKana', url: 'https://github.com/WaniKani/WanaKana', lic: 'MIT', what: 'Konversi romaji ⇄ kana untuk pemeriksaan jawaban.' },
  { name: 'Klee One & Noto Sans JP', url: 'https://fonts.google.com/', lic: 'SIL OFL 1.1', what: 'Huruf (font) Jepang.' },
  { name: 'React, Vite, React Router', url: 'https://react.dev/', lic: 'MIT', what: 'Kerangka aplikasi.' },
];

export default function Resources() {
  return (
    <div className="page narrow prose">
      <h1>🔗 Sumber Belajar</h1>
      <p className="lead">Kumpulan sumber gratis dan terpercaya untuk melanjutkan belajar di rumah.</p>
      {LINKS.map((g) => (
        <section key={g.cat}>
          <h2>{g.cat}</h2>
          <div className="link-list">
            {g.items.map((i) => (
              <a key={i.url} href={i.url} target="_blank" rel="noopener noreferrer" className="card link-item">
                <strong>{i.name} ↗</strong>
                <span className="muted small">{i.desc}</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <section id="kredit">
        <h2>🙏 Kredit & Lisensi</h2>
        <p className="small muted">Website ini dibuat untuk pendidikan non-komersial dan memakai karya open-source berikut:</p>
        <table className="tbl small">
          <thead><tr><th>Karya</th><th>Lisensi</th><th>Kegunaan</th></tr></thead>
          <tbody>
            {CREDITS.map((c) => (
              <tr key={c.name}><td><a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a></td><td>{c.lic}</td><td>{c.what}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="small muted">
          IRODORI, Marugoto, dan Erin adalah hak cipta The Japan Foundation. Website ini hanya menautkan ke materi tersebut,
          tidak menyalinnya.
        </p>
      </section>
    </div>
  );
}
