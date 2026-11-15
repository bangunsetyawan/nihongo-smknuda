import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allKana } from '../data/kana';
import { VOCAB } from '../data/vocab';
import { useAuth } from '../lib/auth';
import { level } from '../lib/progress';

interface StudentRow {
  id: number;
  email: string;
  fullName: string;
  nickname: string;
  japaneseName: string;
  kelas: string;
  jurusan: string;
  role: string;
  profileCompleted: boolean;
  createdAt: string;
  lastLoginAt: string;
  xp: number;
  streak: number;
  hiraganaMastered: number;
  katakanaMastered: number;
  vocabMastered: number;
  progressUpdatedAt: string | null;
}

export default function TeacherPage() {
  const { user, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [kelasFilter, setKelasFilter] = useState('ALL');
  const [jurusanFilter, setJurusanFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const hiraTotal = allKana('hiragana').length;
  const kataTotal = allKana('katakana').length;
  const vocabTotal = VOCAB.length;

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.role !== 'teacher' && user.role !== 'owner')) {
      setLoading(false);
      return;
    }
    let active = true;
    fetch('/api/teacher/students', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Akses ditolak'))))
      .then((data: { students: StudentRow[] }) => {
        if (active) setStudents(data.students ?? []);
      })
      .catch(() => {
        if (active) setErr('Gagal memuat data rekap siswa.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user, authLoading]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (kelasFilter !== 'ALL' && s.kelas !== kelasFilter) return false;
      if (jurusanFilter !== 'ALL' && s.jurusan !== jurusanFilter) return false;
      if (q) {
        const hay = `${s.fullName} ${s.nickname} ${s.email} ${s.japaneseName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [students, kelasFilter, jurusanFilter, search]);

  const pct = (n: number, total: number) => Math.min(100, Math.round((n / total) * 100));

  function downloadExcelCsv() {
    const headers = [
      'No',
      'Nama Lengkap',
      'Panggilan',
      'Nama Jepang',
      'Email',
      'Kelas',
      'Jurusan',
      'Role',
      'Level',
      'XP',
      'Streak (Hari)',
      `Hiragana (${hiraTotal})`,
      'Hiragana (%)',
      `Katakana (${kataTotal})`,
      'Katakana (%)',
      `Kosakata (${vocabTotal})`,
      'Kosakata (%)',
      'Terakhir Login',
    ];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map((s, idx) => [
      idx + 1,
      s.fullName || s.nickname,
      s.nickname,
      s.japaneseName,
      s.email,
      s.kelas,
      s.jurusan,
      s.role,
      level(s.xp).lv,
      s.xp,
      s.streak,
      s.hiraganaMastered,
      `${pct(s.hiraganaMastered, hiraTotal)}%`,
      s.katakanaMastered,
      `${pct(s.katakanaMastered, kataTotal)}%`,
      s.vocabMastered,
      `${pct(s.vocabMastered, vocabTotal)}%`,
      s.lastLoginAt,
    ]);
    const csv = '\uFEFF' + [headers, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `rekap-nihongo-smknuda-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  async function toggleRole(s: StudentRow) {
    const nextRole = s.role === 'teacher' ? 'student' : 'teacher';
    if (!confirm(`Ubah role ${s.fullName || s.email} menjadi ${nextRole === 'teacher' ? 'Pembina/Guru' : 'Siswa'}?`)) {
      return;
    }
    const res = await fetch(`/api/teacher/students/${s.id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role: nextRole }),
    });
    if (res.ok) {
      setStudents((prev) => prev.map((item) => (item.id === s.id ? { ...item, role: nextRole } : item)));
    }
  }

  if (authLoading || loading) {
    return <div className="page"><div className="card">Memuat halaman pemantauan guru…</div></div>;
  }

  if (!user || (user.role !== 'teacher' && user.role !== 'owner')) {
    return (
      <div className="page narrow">
        <div className="card auth-card">
          <h1>Khusus Guru / Pembina</h1>
          <p className="muted">Halaman ini hanya dapat diakses oleh akun pembina ekstrakurikuler bahasa Jepang.</p>
          <Link className="btn primary" to="/">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const totalStudents = students.filter((s) => s.role === 'student').length;
  const avgXp = totalStudents > 0
    ? Math.round(students.filter((s) => s.role === 'student').reduce((acc, s) => acc + s.xp, 0) / totalStudents)
    : 0;

  return (
    <div className="page">
      <div className="print-header">
        <h2>LAPORAN PERKEMBANGAN BELAJAR BAHASA JEPANG</h2>
        <p>Ekstrakurikuler Nihongo — SMKN NU Darussalam Srono, Banyuwangi</p>
        <p className="small">Tanggal cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
      </div>

      <div className="page-head no-print">
        <div>
          <span className="hero-kicker jp">きょうし用レポート</span>
          <h1>Pemantauan &amp; Laporan Siswa</h1>
          <p className="muted">Pantau progres hafalan Hiragana, Katakana, dan Kosakata setiap siswa.</p>
        </div>
        <div className="row gap-s wrap">
          <button type="button" className="btn primary" onClick={downloadExcelCsv}>
            📊 Unduh Excel (CSV)
          </button>
          <button type="button" className="btn" onClick={() => window.print()}>
            🖨 Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {err && <div className="auth-alert">{err}</div>}

      <section className="stats no-print" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card stat"><div className="stat-icon">👥</div><div><div className="big-num">{totalStudents}</div><div className="muted small">Siswa terdaftar</div></div></div>
        <div className="card stat"><div className="stat-icon">⭐</div><div><div className="big-num">{avgXp}</div><div className="muted small">Rata-rata XP siswa</div></div></div>
        <div className="card stat"><div className="stat-icon">📋</div><div><div className="big-num">{filtered.length}</div><div className="muted small">Ditampilkan di tabel</div></div></div>
      </section>

      <div className="card teacher-filters no-print">
        <input
          className="input"
          placeholder="Cari nama, panggilan, atau email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={kelasFilter} onChange={(e) => setKelasFilter(e.target.value)}>
          <option value="ALL">Semua Kelas</option>
          <option value="X">Kelas X</option>
          <option value="XI">Kelas XI</option>
          <option value="XII">Kelas XII</option>
          <option value="Alumni / Pembina">Alumni / Pembina</option>
        </select>
        <select className="input" value={jurusanFilter} onChange={(e) => setJurusanFilter(e.target.value)}>
          <option value="ALL">Semua Jurusan</option>
          <option value="TJKT">TJKT</option>
          <option value="AKL">AKL</option>
          <option value="TKRO">TKRO</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div className="card table-wrap">
        <table className="rekap-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Kelas / Jurusan</th>
              <th>Lv / XP</th>
              <th>Streak</th>
              <th>Hiragana</th>
              <th>Katakana</th>
              <th>Kosakata</th>
              <th className="no-print">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={s.id}>
                <td>{idx + 1}</td>
                <td>
                  <strong>{s.fullName || s.nickname}</strong>
                  {s.japaneseName && <span className="jp muted small"> · {s.japaneseName}</span>}
                  <div className="muted small">{s.email}</div>
                </td>
                <td>{s.kelas || '-'} {s.jurusan || ''}</td>
                <td>Lv {level(s.xp).lv} ({s.xp} XP)</td>
                <td>{s.streak} hr</td>
                <td>{s.hiraganaMastered}/{hiraTotal} ({pct(s.hiraganaMastered, hiraTotal)}%)</td>
                <td>{s.katakanaMastered}/{kataTotal} ({pct(s.katakanaMastered, kataTotal)}%)</td>
                <td>{s.vocabMastered}/{vocabTotal} ({pct(s.vocabMastered, vocabTotal)}%)</td>
                <td className="no-print">
                  {s.id === user.id ? (
                    <span className="pill">Anda ({s.role === 'owner' ? 'Owner' : 'Pembina'})</span>
                  ) : s.role === 'owner' ? (
                    <span className="pill">Owner</span>
                  ) : s.role === 'teacher' && user.role !== 'owner' ? (
                    <span className="pill">Pembina</span>
                  ) : (
                    <button type="button" className="btn small" onClick={() => void toggleRole(s)}>
                      {s.role === 'teacher' ? 'Jadikan Siswa' : 'Jadikan Pembina'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="print-sign">
        <div>
          <p>Srono, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
          <p>Pembina Ekstrakurikuler Bahasa Jepang</p>
          <br /><br /><br />
          <p>______________________________</p>
        </div>
      </div>
    </div>
  );
}
