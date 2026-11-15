export const JENJANG_LIST = ['SMP', 'SMA', 'SMK', 'Umum'] as const;
export type Jenjang = (typeof JENJANG_LIST)[number];

export const JURUSAN_LIST = ['TJKT', 'AKL', 'TKRO', 'Lainnya'] as const;

export const KELAS_BY_JENJANG: Record<Jenjang, string[]> = {
  SMP: ['VII', 'VIII', 'IX', 'Alumni / Pembina'],
  SMA: ['X', 'XI', 'XII', 'Alumni / Pembina'],
  SMK: ['X', 'XI', 'XII', 'Alumni / Pembina'],
  Umum: [],
};

export const SCHOOL_PLACEHOLDER: Record<Jenjang, string> = {
  SMP: 'cth. SMPN 1 Srono',
  SMA: 'cth. SMAN 1 Srono',
  SMK: 'cth. SMKN NU Darussalam',
  Umum: 'cth. Mandiri / Komunitas … (opsional)',
};

export function normalizeJenjang(raw?: string | null): Jenjang {
  if (raw === 'SMP' || raw === 'SMA' || raw === 'SMK' || raw === 'Umum') return raw;
  return 'SMK';
}

export function formatUserAffiliation(u: {
  jenjang?: string | null;
  school?: string | null;
  kelas?: string | null;
  jurusan?: string | null;
}): string {
  const jenjang = normalizeJenjang(u.jenjang);
  const school = (u.school ?? '').trim();
  const kelas = (u.kelas ?? '').trim();
  const jurusan = (u.jurusan ?? '').trim();

  if (jenjang === 'Umum') {
    if (!school || school.toLowerCase() === 'umum') return 'Umum';
    return `Umum · ${school}`;
  }
  if (jenjang === 'SMK') {
    return [kelas, jurusan, school || 'SMK NU Darussalam'].filter(Boolean).join(' · ');
  }
  return [kelas, school || jenjang].filter(Boolean).join(' · ');
}
