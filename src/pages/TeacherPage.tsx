import { Fragment, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { allKana } from '../data/kana';
import { KANJI_LIST } from '../data/kanji';
import { VOCAB } from '../data/vocab';
import { useAuth } from '../lib/auth';
import { JENJANG_LIST, JURUSAN_LIST, KELAS_BY_JENJANG, type Jenjang } from '../lib/education';
import { level } from '../lib/progress';
import {
  aggregateMissedItems,
  formatTaskTarget,
  getStudentTopMissed,
  TARGET_TYPE_OPTIONS,
  type ItemStatsMap,
  type TaskTargetType,
} from '../lib/teacherAnalytics';

interface StudentRow {
  id: number;
  email: string;
  fullName: string;
  nickname: string;
  japaneseName: string;
  jenjang: string;
  school: string;
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
  kanjiMastered: number;
  itemStats?: ItemStatsMap;
  progressUpdatedAt: string | null;
}

interface TeacherTaskRow {
  id: number;
  title: string;
  description: string;
  targetType: string;
  targetValue: number;
  dueDate: string;
  createdBy: number;
  createdAt: string;
  completedCount: number;
  totalStudents: number;
}

function defaultDueDate(): string {
  const d = new Date(Date.now() + 7 * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export default function TeacherPage() {
  const { user, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [tasks, setTasks] = useState<TeacherTaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState('ALL');
  const [schoolFilter, setSchoolFilter] = useState('ALL');
  const [kelasFilter, setKelasFilter] = useState('ALL');
  const [jurusanFilter, setJurusanFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskType, setTaskType] = useState<TaskTargetType>('kana_mastered');
  const [taskTarget, setTaskTarget] = useState('20');
  const [taskDue, setTaskDue] = useState(defaultDueDate);
  const [taskBusy, setTaskBusy] = useState(false);
  const [taskErr, setTaskErr] = useState('');
  const [taskMsg, setTaskMsg] = useState('');

  const hiraTotal = allKana('hiragana').length;
  const kataTotal = allKana('katakana').length;
  const vocabTotal = VOCAB.length;

  const kanjiTotal = useMemo(() => KANJI_LIST.filter((k) => k.level === 'N5').length, []);

  async function refreshTasks() {
    try {
      const r = await fetch('/api/teacher/tasks', { credentials: 'include' });
      if (!r.ok) return;
      const d = (await r.json()) as { tasks?: TeacherTaskRow[] };
      if (Array.isArray(d.tasks)) setTasks(d.tasks);
    } catch {
      // Abaikan jika gagal memuat tugas sementara
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.role !== 'teacher' && user.role !== 'owner')) {
      setLoading(false);
      return;
    }
    let active = true;
    Promise.all([
      fetch('/api/teacher/students', { credentials: 'include' }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error('Akses ditolak')),
      ),
      fetch('/api/teacher/tasks', { credentials: 'include' })
        .then((r) => (r.ok ? r.json() : { tasks: [] }))
        .catch(() => ({ tasks: [] })),
    ])
      .then(([studentData, taskData]: [{ students: StudentRow[] }, { tasks?: TeacherTaskRow[] }]) => {
        if (!active) return;
        setStudents(studentData.students ?? []);
        setTasks(taskData.tasks ?? []);
      })
      .catch(() => {
        if (active) setErr('Gagal memuat data rekap siswa.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user, authLoading]);

  const schoolOptions = useMemo(() => {
    const set = new Set<string>();
    for (const s of students) {
      if (jenjangFilter !== 'ALL' && s.jenjang !== jenjangFilter) continue;
      if (s.school) set.add(s.school);
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'id'));
  }, [students, jenjangFilter]);

  const kelasOptions = useMemo(() => {
    if (jenjangFilter === 'Umum') return [];
    if (jenjangFilter === 'SMP' || jenjangFilter === 'SMA' || jenjangFilter === 'SMK') {
      return KELAS_BY_JENJANG[jenjangFilter as Jenjang];
    }
    return ['VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'Alumni / Pembina'];
  }, [jenjangFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (jenjangFilter !== 'ALL' && s.jenjang !== jenjangFilter) return false;
      if (schoolFilter !== 'ALL' && s.school !== schoolFilter) return false;
      if (kelasFilter !== 'ALL' && s.kelas !== kelasFilter) return false;
      if (jurusanFilter !== 'ALL' && s.jurusan !== jurusanFilter) return false;
      if (q) {
        const hay = `${s.fullName} ${s.nickname} ${s.email} ${s.school} ${s.japaneseName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [students, jenjangFilter, schoolFilter, kelasFilter, jurusanFilter, search]);

  const filteredStudentCount = useMemo(() => filtered.filter((s) => s.role === 'student').length, [filtered]);
  const topMissedOverall = useMemo(() => aggregateMissedItems(filtered, 10), [filtered]);

  const pct = (n: number, total: number) => Math.min(100, Math.round((n / total) * 100));

  function formatLastLoginWib(raw: string): string {
    if (!raw) return '-';
    const iso = raw.includes('T') ? raw : `${raw.replace(' ', 'T')}Z`;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return raw;
    return `${d.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`;
  }

  function downloadExcelCsv() {
    const headers = [
      'No',
      'Nama Lengkap',
      'Panggilan',
      'Nama Jepang',
      'Email',
      'Jenjang',
      'Sekolah',
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
      `Kanji N5 (${kanjiTotal})`,
      'Terakhir Login (WIB)',
    ];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map((s, idx) => [
      idx + 1,
      s.fullName || s.nickname,
      s.nickname,
      s.japaneseName,
      s.email,
      s.jenjang,
      s.school,
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
      s.kanjiMastered ?? 0,
      formatLastLoginWib(s.lastLoginAt),
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
    setErr('');
    try {
      const res = await fetch(`/api/teacher/students/${s.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: nextRole }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error || 'Gagal mengubah role pengguna.');
        return;
      }
      setStudents((prev) => prev.map((item) => (item.id === s.id ? { ...item, role: nextRole } : item)));
    } catch {
      setErr('Tidak dapat terhubung ke server saat mengubah role.');
    }
  }

  async function handleCreateTask(e: FormEvent) {
    e.preventDefault();
    setTaskErr('');
    setTaskMsg('');
    const title = taskTitle.trim();
    const targetValue = Number(taskTarget);
    if (!title) {
      setTaskErr('Judul tugas wajib diisi.');
      return;
    }
    if (!Number.isInteger(targetValue) || targetValue < 1) {
      setTaskErr('Target angka harus bilangan bulat positif minimal 1.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(taskDue)) {
      setTaskErr('Batas tanggal tidak valid.');
      return;
    }
    setTaskBusy(true);
    try {
      const res = await fetch('/api/teacher/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description: taskDesc.trim(),
          targetType: taskType,
          targetValue,
          dueDate: taskDue,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setTaskErr(data.error || 'Gagal membuat tugas.');
        return;
      }
      setTaskTitle('');
      setTaskDesc('');
      setTaskMsg('Tugas berhasil ditambahkan.');
      await refreshTasks();
    } catch {
      setTaskErr('Tidak dapat terhubung ke server saat membuat tugas.');
    } finally {
      setTaskBusy(false);
    }
  }

  async function handleDeleteTask(taskId: number) {
    setTaskErr('');
    setTaskMsg('');
    try {
      const res = await fetch(`/api/teacher/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setTaskErr(d.error || 'Gagal menghapus tugas.');
        return;
      }
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setTaskMsg('Tugas dihapus.');
    } catch {
      setTaskErr('Tidak dapat terhubung ke server saat menghapus tugas.');
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
          placeholder="Cari nama, panggilan, sekolah, atau email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          aria-label="Filter Jenjang"
          value={jenjangFilter}
          onChange={(e) => {
            const next = e.target.value;
            setJenjangFilter(next);
            setSchoolFilter('ALL');
            setKelasFilter('ALL');
            if (next !== 'ALL' && next !== 'SMK') setJurusanFilter('ALL');
          }}
        >
          <option value="ALL">Semua Jenjang</option>
          {JENJANG_LIST.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>
        <select
          className="input"
          aria-label="Filter Sekolah"
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
        >
          <option value="ALL">Semua Sekolah</option>
          {schoolOptions.map((sc) => <option key={sc} value={sc}>{sc}</option>)}
        </select>
        <select
          className="input"
          aria-label="Filter Kelas"
          value={kelasFilter}
          onChange={(e) => setKelasFilter(e.target.value)}
          disabled={jenjangFilter === 'Umum'}
        >
          <option value="ALL">Semua Kelas</option>
          {kelasOptions.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <select
          className="input"
          aria-label="Filter Jurusan"
          value={jurusanFilter}
          onChange={(e) => setJurusanFilter(e.target.value)}
          disabled={jenjangFilter !== 'ALL' && jenjangFilter !== 'SMK'}
        >
          <option value="ALL">Semua Jurusan</option>
          {JURUSAN_LIST.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>
      </div>

      <div className="card table-wrap">
        <table className="rekap-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Jenjang</th>
              <th>Sekolah</th>
              <th>Kelas / Jurusan</th>
              <th>Lv / XP</th>
              <th>Streak</th>
              <th>Hiragana</th>
              <th>Katakana</th>
              <th>Kosakata</th>
              <th>Kanji N5</th>
              <th className="no-print">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => {
              const studentMissed = expandedId === s.id ? getStudentTopMissed(s.itemStats, 5) : [];
              return (
                <Fragment key={s.id}>
                  <tr>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{s.fullName || s.nickname}</strong>
                      {s.japaneseName && <span className="jp muted small"> · {s.japaneseName}</span>}
                      <div className="muted small">{s.email}</div>
                    </td>
                    <td>{s.jenjang}</td>
                    <td>{s.school || '-'}</td>
                    <td>{s.kelas || '-'} {s.jurusan || ''}</td>
                    <td>Lv {level(s.xp).lv} ({s.xp} XP)</td>
                    <td>{s.streak} hr</td>
                    <td>{s.hiraganaMastered}/{hiraTotal} ({pct(s.hiraganaMastered, hiraTotal)}%)</td>
                    <td>{s.katakanaMastered}/{kataTotal} ({pct(s.katakanaMastered, kataTotal)}%)</td>
                    <td>{s.vocabMastered}/{vocabTotal} ({pct(s.vocabMastered, vocabTotal)}%)</td>
                    <td>{s.kanjiMastered ?? 0}/{kanjiTotal}</td>
                    <td className="no-print">
                      <div className="row gap-s wrap">
                        <button
                          type="button"
                          className="btn small"
                          onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                        >
                          {expandedId === s.id ? 'Tutup Detail' : 'Butir Salah'}
                        </button>
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
                      </div>
                    </td>
                  </tr>
                  {expandedId === s.id && (
                    <tr className="student-detail-row no-print">
                      <td colSpan={12}>
                        <div className="student-detail-box">
                          <strong>Top 5 Butir Paling Sering Salah — {s.fullName || s.nickname}:</strong>
                          {studentMissed.length === 0 ? (
                            <p className="muted small" style={{ margin: '.35rem 0 0' }}>
                              Belum ada catatan jawaban salah untuk siswa ini.
                            </p>
                          ) : (
                            <ul className="missed-mini-list">
                              {studentMissed.map((m) => (
                                <li key={m.id}>
                                  <span className="pill">{m.kindLabel}</span>{' '}
                                  <strong className="jp">{m.title}</strong>{' '}
                                  <span className="muted small">({m.detail})</span> —{' '}
                                  <span className="missed-bad">{m.wrong}× salah</span>{' '}
                                  <span className="muted small">({m.right}× benar)</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="card teacher-section no-print" style={{ marginTop: '1.4rem' }}>
        <div className="row between wrap gap-s" style={{ marginBottom: '.65rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>📊 Analitik Butir Soal (Top 10 Paling Sering Salah)</h2>
            <p className="muted small" style={{ margin: '.2rem 0 0' }}>
              Mengikuti filter aktif di atas ({filteredStudentCount} siswa terfilter). Klik tombol &ldquo;Butir Salah&rdquo; pada baris siswa untuk detail Top 5 per siswa.
            </p>
          </div>
        </div>
        {topMissedOverall.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            Belum ada butir dengan jawaban salah pada kelompok siswa terfilter.
          </p>
        ) : (
          <div className="missed-grid">
            {topMissedOverall.map((m, i) => (
              <div key={m.id} className="missed-card">
                <div className="row between gap-s">
                  <span className="pill">#{i + 1} · {m.kindLabel}</span>
                  <strong className="missed-bad">{m.wrong}× salah</strong>
                </div>
                <div className="missed-title jp">{m.title}</div>
                <div className="muted small">{m.detail}</div>
                <div className="muted small">
                  {m.studentCount} siswa salah · {m.right}× benar ({m.wrongRate}% tingkat salah)
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card teacher-section no-print" style={{ marginTop: '1.4rem' }}>
        <h2 style={{ margin: '0 0 .35rem' }}>📌 Tugas Mingguan Siswa</h2>
        <p className="muted small" style={{ margin: '0 0 1rem' }}>
          Tugas tampil otomatis di Beranda siswa dan dicek dari progres aktual di server.
        </p>

        {taskErr && <div className="auth-alert">{taskErr}</div>}
        {taskMsg && <p className="sync-note ok" style={{ margin: '0 0 .75rem' }}>{taskMsg}</p>}

        <form className="task-form" onSubmit={handleCreateTask}>
          <div className="task-form-grid">
            <label className="field">
              <span>Judul Tugas</span>
              <input
                className="input"
                placeholder="Mis. Kuasai 20 huruf Hiragana"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Jenis Target</span>
              <select
                className="input"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as TaskTargetType)}
              >
                {TARGET_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Target Angka</span>
              <input
                className="input"
                type="number"
                min={1}
                value={taskTarget}
                onChange={(e) => setTaskTarget(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Batas Tanggal</span>
              <input
                className="input"
                type="date"
                value={taskDue}
                onChange={(e) => setTaskDue(e.target.value)}
                required
              />
            </label>
          </div>
          <label className="field">
            <span>Catatan Tambahan (Opsional)</span>
            <input
              className="input"
              placeholder="Mis. Kerjakan kuis Hiragana minimal 1x sehari"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </label>
          <div>
            <button type="submit" className="btn primary" disabled={taskBusy}>
              {taskBusy ? 'Menyimpan…' : '+ Tambah Tugas'}
            </button>
          </div>
        </form>

        <div className="teacher-task-list">
          {tasks.length === 0 ? (
            <p className="muted small" style={{ margin: '.75rem 0 0' }}>Belum ada tugas aktif.</p>
          ) : (
            tasks.map((t) => (
              <div key={t.id} className="teacher-task-item">
                <div>
                  <strong>{t.title}</strong>
                  {t.description && <div className="muted small">{t.description}</div>}
                  <div className="muted small">
                    Target: {formatTaskTarget(t.targetType, t.targetValue)} · Batas: {t.dueDate} ·{' '}
                    <strong>{t.completedCount}/{t.totalStudents} siswa selesai</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn small danger"
                  onClick={() => void handleDeleteTask(t.id)}
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>
      </section>

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
