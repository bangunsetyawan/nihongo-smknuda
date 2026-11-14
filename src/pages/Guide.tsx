import { SpeakButton } from '../components/Speak';

interface Ex { jp: string; romaji: string; arti: string }

function Examples({ items }: { items: Ex[] }) {
  return (
    <div className="ex-table">
      {items.map((e) => (
        <div key={e.jp} className="ex-row">
          <span className="jp ex-jp">{e.jp}</span>
          <span className="ex-ro">{e.romaji}</span>
          <span className="ex-ar muted">{e.arti}</span>
          <SpeakButton text={e.jp} className="small" />
        </div>
      ))}
    </div>
  );
}

export default function Guide() {
  return (
    <div className="page narrow prose">
      <h1>📖 Panduan Dasar Huruf Jepang</h1>
      <p className="lead">Aturan penting yang wajib dipahami sebelum mulai membaca kata dan kalimat.</p>

      <nav className="toc card">
        <a href="#tiga-huruf">1. Tiga jenis huruf</a>
        <a href="#dakuten">2. Dakuten ゛ & handakuten ゜</a>
        <a href="#yoon">3. Huruf kecil ゃ ゅ ょ</a>
        <a href="#sokuon">4. Tsu kecil っ (konsonan ganda)</a>
        <a href="#panjang">5. Vokal panjang</a>
        <a href="#partikel">6. Partikel は へ を</a>
        <a href="#lafal">7. Tips pelafalan</a>
        <a href="#salam">8. Salam & ungkapan pertama</a>
      </nav>

      <section id="tiga-huruf">
        <h2>1. Tiga jenis huruf</h2>
        <p>Bahasa Jepang memakai <strong>tiga jenis huruf sekaligus</strong> dalam satu kalimat:</p>
        <ul>
          <li><strong>Hiragana</strong> (ひらがな): untuk kata asli Jepang, partikel, dan akhiran kata kerja.</li>
          <li><strong>Katakana</strong> (カタカナ): untuk kata serapan asing, nama negara, dan nama orang asing.</li>
          <li><strong>Kanji</strong> (漢字): huruf dari Tiongkok yang punya makna. Untuk N4 perlu sekitar 300 kanji.</li>
        </ul>
        <div className="callout">
          <span className="jp big-jp">わたしは<b className="hl-k">インドネシア</b>の<b className="hl-c">学生</b>です。</span>
          <div className="muted">Watashi wa Indoneshia no gakusei desu. Saya pelajar dari Indonesia.</div>
          <div className="small">Hitam = hiragana · <b className="hl-k">Merah</b> = katakana · <b className="hl-c">Biru</b> = kanji</div>
        </div>
        <p><strong>Romaji</strong> (huruf latin) hanya alat bantu di awal. Orang Jepang tidak menulis dengan romaji, jadi usahakan cepat lepas darinya.</p>
      </section>

      <section id="dakuten">
        <h2>2. Dakuten ゛ dan handakuten ゜</h2>
        <p>Dua garis kecil (<span className="jp">゛</span>) membuat bunyi menjadi "berat". Lingkaran kecil (<span className="jp">゜</span>) hanya untuk baris <em>h</em> dan membuatnya menjadi <em>p</em>.</p>
        <table className="tbl">
          <thead><tr><th>Asal</th><th>+ ゛</th><th>+ ゜</th></tr></thead>
          <tbody>
            <tr><td>k → か</td><td>g → が</td><td>–</td></tr>
            <tr><td>s → さ</td><td>z → ざ (じ = ji)</td><td>–</td></tr>
            <tr><td>t → た</td><td>d → だ (ぢ = ji, づ = zu)</td><td>–</td></tr>
            <tr><td>h → は</td><td>b → ば</td><td>p → ぱ</td></tr>
          </tbody>
        </table>
        <Examples items={[
          { jp: 'かぎ', romaji: 'kagi', arti: 'kunci' },
          { jp: 'ぶどう', romaji: 'budō', arti: 'anggur' },
          { jp: 'えんぴつ', romaji: 'enpitsu', arti: 'pensil' },
        ]} />
      </section>

      <section id="yoon">
        <h2>3. Huruf kecil ゃ ゅ ょ (yōon)</h2>
        <p>Huruf berakhiran <em>-i</em> (き, し, ち, に, ひ, み, り, ぎ, じ, び, ぴ) bisa digabung dengan <span className="jp">ゃ ゅ ょ</span> yang ditulis <strong>kecil</strong>. Hasilnya <strong>satu suku kata</strong>.</p>
        <Examples items={[
          { jp: 'きゃく', romaji: 'kyaku', arti: 'tamu' },
          { jp: 'しゃしん', romaji: 'shashin', arti: 'foto' },
          { jp: 'びょういん', romaji: 'byōin', arti: 'rumah sakit' },
          { jp: 'びよういん', romaji: 'biyōin', arti: 'salon kecantikan (よ besar!)' },
        ]} />
        <div className="callout warn">⚠️ Perhatikan ukuran huruf! <span className="jp">びょういん</span> (rumah sakit) berbeda dengan <span className="jp">びよういん</span> (salon).</div>
      </section>

      <section id="sokuon">
        <h2>4. Tsu kecil っ (konsonan ganda)</h2>
        <p><span className="jp">っ</span> kecil <strong>tidak dibaca "tsu"</strong>. Huruf ini tanda jeda sebentar, dan konsonan berikutnya digandakan.</p>
        <Examples items={[
          { jp: 'きって', romaji: 'kitte', arti: 'perangko' },
          { jp: 'きて', romaji: 'kite', arti: 'datanglah' },
          { jp: 'ざっし', romaji: 'zasshi', arti: 'majalah' },
          { jp: 'サッカー', romaji: 'sakkā', arti: 'sepak bola' },
        ]} />
      </section>

      <section id="panjang">
        <h2>5. Vokal panjang</h2>
        <p>Vokal yang dipanjangkan bisa <strong>mengubah arti</strong>. Di hiragana, vokal panjang ditulis dengan menambah huruf vokal. Di katakana, cukup memakai garis <span className="jp">ー</span>.</p>
        <table className="tbl">
          <thead><tr><th>Bunyi</th><th>Ditulis</th><th>Contoh</th></tr></thead>
          <tbody>
            <tr><td>ā</td><td>a + あ</td><td><span className="jp">おかあさん</span> (ibu)</td></tr>
            <tr><td>ī</td><td>i + い</td><td><span className="jp">おにいさん</span> (kakak laki-laki)</td></tr>
            <tr><td>ū</td><td>u + う</td><td><span className="jp">くうき</span> (udara)</td></tr>
            <tr><td>ē</td><td>e + い (umumnya)</td><td><span className="jp">せんせい</span> (guru)</td></tr>
            <tr><td>ō</td><td>o + う (umumnya)</td><td><span className="jp">がっこう</span> (sekolah)</td></tr>
          </tbody>
        </table>
        <Examples items={[
          { jp: 'おばさん', romaji: 'obasan', arti: 'bibi' },
          { jp: 'おばあさん', romaji: 'obāsan', arti: 'nenek' },
          { jp: 'コーヒー', romaji: 'kōhī', arti: 'kopi' },
        ]} />
      </section>

      <section id="partikel">
        <h2>6. Partikel は, へ, を</h2>
        <p>Jika dipakai sebagai <strong>partikel</strong>, tiga huruf ini dibaca berbeda dari biasanya:</p>
        <table className="tbl">
          <thead><tr><th>Huruf</th><th>Biasanya</th><th>Sebagai partikel</th><th>Fungsi</th></tr></thead>
          <tbody>
            <tr><td className="jp">は</td><td>ha</td><td><strong>wa</strong></td><td>penanda topik</td></tr>
            <tr><td className="jp">へ</td><td>he</td><td><strong>e</strong></td><td>arah ("ke")</td></tr>
            <tr><td className="jp">を</td><td>wo</td><td><strong>o</strong></td><td>penanda objek</td></tr>
          </tbody>
        </table>
        <Examples items={[
          { jp: 'わたしはアンディです。', romaji: 'Watashi wa Andi desu.', arti: 'Saya Andi.' },
          { jp: 'がっこうへいきます。', romaji: 'Gakkō e ikimasu.', arti: 'Pergi ke sekolah.' },
          { jp: 'パンをたべます。', romaji: 'Pan o tabemasu.', arti: 'Makan roti.' },
        ]} />
      </section>

      <section id="lafal">
        <h2>7. Tips pelafalan untuk orang Indonesia</h2>
        <ul>
          <li><strong>Vokal a i u e o</strong> dibaca seperti bahasa Indonesia. <em>e</em> selalu seperti "e" pada kata <em>bebek</em>.</li>
          <li><strong>う (u)</strong> sering hampir tidak terdengar di akhir kata: <span className="jp">です</span> terdengar "des", <span className="jp">ます</span> terdengar "mas".</li>
          <li><strong>ふ (fu)</strong> diucapkan di antara "hu" dan "fu", dengan bibir tidak menyentuh gigi.</li>
          <li><strong>Baris ら (ra)</strong> diucapkan di antara "r" dan "l". Lidahnya ringan, tidak bergetar seperti "r" Indonesia.</li>
          <li><strong>つ (tsu)</strong> bukan "su" atau "cu". Ucapkan "ts" seperti di akhir kata <em>cats</em>.</li>
          <li><strong>ん (n)</strong> adalah satu ketukan penuh: <span className="jp">ほん</span> = ho-n (2 ketukan).</li>
        </ul>
      </section>

      <section id="salam">
        <h2>8. Salam & ungkapan pertama</h2>
        <Examples items={[
          { jp: 'おはようございます', romaji: 'ohayō gozaimasu', arti: 'Selamat pagi' },
          { jp: 'こんにちは', romaji: 'konnichiwa', arti: 'Selamat siang / halo (は dibaca wa)' },
          { jp: 'こんばんは', romaji: 'konbanwa', arti: 'Selamat malam' },
          { jp: 'ありがとうございます', romaji: 'arigatō gozaimasu', arti: 'Terima kasih' },
          { jp: 'すみません', romaji: 'sumimasen', arti: 'Permisi / maaf' },
          { jp: 'はじめまして', romaji: 'hajimemashite', arti: 'Salam kenal (saat pertama bertemu)' },
          { jp: 'よろしくおねがいします', romaji: 'yoroshiku onegaishimasu', arti: 'Mohon bantuannya' },
          { jp: 'いただきます', romaji: 'itadakimasu', arti: 'Ucapan sebelum makan' },
          { jp: 'ごちそうさまでした', romaji: 'gochisōsama deshita', arti: 'Ucapan sesudah makan' },
          { jp: 'しつれいします', romaji: 'shitsurei shimasu', arti: 'Permisi (masuk/keluar ruangan, penting di tempat kerja)' },
          { jp: 'わたしは SMK NU Darussalam のがくせいです', romaji: 'watashi wa SMK NU Darussalam no gakusei desu', arti: 'Saya siswa SMK NU Darussalam' },
        ]} />
      </section>
    </div>
  );
}
