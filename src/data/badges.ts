export type BadgeCategory = 'konsisten' | 'huruf' | 'kosakata' | 'latihan';

export interface BadgeDef {
  id: string;
  icon: string;
  title: string;
  desc: string;
  target: number;
  category: BadgeCategory;
}

export interface BadgeStatus {
  id: string;
  unlocked: boolean;
  current: number;
  target: number;
}

export interface BadgeInput {
  kana?: Record<string, { s?: number }>;
  kanji?: Record<string, { s?: number }>;
  vocab?: Record<string, boolean>;
  kaiwa?: string[];
  xp?: number;
  days?: string[];
  quizzes?: number;
  perfectQuizzes?: number;
  srsReviews?: number;
}

export const BADGES: BadgeDef[] = [
  { id: 'streak_3', icon: '🔥', title: 'Langkah Awal', desc: 'Belajar 3 hari berturut-turut', target: 3, category: 'konsisten' },
  { id: 'streak_7', icon: '⚡', title: 'Seminggu Konsisten', desc: 'Belajar 7 hari berturut-turut', target: 7, category: 'konsisten' },
  { id: 'xp_100', icon: '⭐', title: 'Bintang Pemula', desc: 'Kumpulkan 100 XP', target: 100, category: 'konsisten' },
  { id: 'xp_500', icon: '🌟', title: 'Pejuang Semangat', desc: 'Kumpulkan 500 XP', target: 500, category: 'konsisten' },

  { id: 'hira_10', icon: 'あ', title: 'Kenal Hiragana', desc: 'Kuasai 10 huruf Hiragana', target: 10, category: 'huruf' },
  { id: 'hira_46', icon: '🇯🇵', title: 'Penakluk Hiragana', desc: 'Kuasai 46 huruf Hiragana', target: 46, category: 'huruf' },
  { id: 'kata_10', icon: 'ア', title: 'Kenal Katakana', desc: 'Kuasai 10 huruf Katakana', target: 10, category: 'huruf' },
  { id: 'kanji_10', icon: '字', title: 'Kanji Pemula', desc: 'Kuasai 10 huruf Kanji', target: 10, category: 'huruf' },
  { id: 'kanji_50', icon: '漢', title: 'Ksatria Kanji N5', desc: 'Kuasai 50 huruf Kanji', target: 50, category: 'huruf' },

  { id: 'vocab_25', icon: '📚', title: 'Bekal Kosakata', desc: 'Kuasai 25 kosakata N5', target: 25, category: 'kosakata' },
  { id: 'vocab_100', icon: '🗂️', title: 'Kamus Berjalan', desc: 'Kuasai 100 kosakata N5', target: 100, category: 'kosakata' },
  { id: 'kaiwa_1', icon: '🗣️', title: 'Berani Bicara', desc: 'Selesaikan 1 dialog Kaiwa', target: 1, category: 'kosakata' },
  { id: 'kaiwa_8', icon: '🎙️', title: 'Teman Ngobrol', desc: 'Selesaikan semua 8 dialog Kaiwa', target: 8, category: 'kosakata' },

  { id: 'quiz_1', icon: '📝', title: 'Ujian Pertama', desc: 'Selesaikan 1 kali kuis', target: 1, category: 'latihan' },
  { id: 'quiz_perfect', icon: '💯', title: 'Skor Sempurna', desc: 'Raih nilai 100% di kuis', target: 1, category: 'latihan' },
  { id: 'srs_1', icon: '🔄', title: 'Ingatan Tajam', desc: 'Selesaikan 1 review SRS', target: 1, category: 'latihan' },
];

function computeLongestStreak(days: string[] | undefined): number {
  if (!Array.isArray(days) || days.length === 0) return 0;
  const uniq = [...new Set(days)].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  if (uniq.length === 0) return 0;
  const toUtcDay = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  };
  let best = 1;
  let cur = 1;
  let prev = toUtcDay(uniq[0]);
  for (let i = 1; i < uniq.length; i++) {
    const dayNum = toUtcDay(uniq[i]);
    if (dayNum === prev + 1) {
      cur++;
      if (cur > best) best = cur;
    } else if (dayNum > prev + 1) {
      cur = 1;
    }
    prev = dayNum;
  }
  return best;
}

/** Hitung status badge di sisi klien untuk mode tamu (saat login memakai data resmi server). */
export function computeClientBadges(prog: BadgeInput): BadgeStatus[] {
  let hiraganaMastered = 0;
  let katakanaMastered = 0;
  for (const [ch, st] of Object.entries(prog.kana ?? {})) {
    if ((st?.s ?? 0) < 5) continue;
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0x3040 && code <= 0x309f) hiraganaMastered++;
    else if (code >= 0x30a0 && code <= 0x30ff) katakanaMastered++;
  }
  const kanjiMastered = Object.values(prog.kanji ?? {}).filter((st) => (st?.s ?? 0) >= 5).length;
  const vocabMastered = Object.values(prog.vocab ?? {}).filter(Boolean).length;
  const kaiwaCount = Array.isArray(prog.kaiwa) ? prog.kaiwa.length : 0;
  const bestStreak = computeLongestStreak(prog.days);
  const xp = Math.max(0, Math.floor(prog.xp ?? 0));
  const quizzes = Math.max(0, Math.floor(prog.quizzes ?? 0));
  const perfectQuizzes = Math.max(0, Math.floor(prog.perfectQuizzes ?? 0));
  const srsReviews = Math.max(0, Math.floor(prog.srsReviews ?? 0));

  const metricMap: Record<string, number> = {
    streak_3: bestStreak,
    streak_7: bestStreak,
    xp_100: xp,
    xp_500: xp,
    hira_10: hiraganaMastered,
    hira_46: hiraganaMastered,
    kata_10: katakanaMastered,
    kanji_10: kanjiMastered,
    kanji_50: kanjiMastered,
    vocab_25: vocabMastered,
    vocab_100: vocabMastered,
    kaiwa_1: kaiwaCount,
    kaiwa_8: kaiwaCount,
    quiz_1: quizzes,
    quiz_perfect: perfectQuizzes,
    srs_1: srsReviews,
  };

  return BADGES.map((b) => {
    const raw = metricMap[b.id] ?? 0;
    return {
      id: b.id,
      unlocked: raw >= b.target,
      current: Math.min(raw, b.target),
      target: b.target,
    };
  });
}
