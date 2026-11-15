import { BUNPOU_LIST } from '../data/bunpou';
import { allKana } from '../data/kana';
import { KANJI_LIST } from '../data/kanji';
import { VOCAB } from '../data/vocab';

export interface ItemStatEntry {
  c: number;
  w: number;
}

export type ItemStatBucket = Record<string, ItemStatEntry>;

export interface ItemStatsMap {
  kana?: ItemStatBucket;
  vocab?: ItemStatBucket;
  kanji?: ItemStatBucket;
  bunpou?: ItemStatBucket;
}

export type ItemKind = 'kana' | 'vocab' | 'kanji' | 'bunpou';

export interface MissedItem {
  id: string;
  kind: ItemKind;
  kindLabel: string;
  title: string;
  detail: string;
  right: number;
  wrong: number;
  studentCount: number;
  wrongRate: number;
}

export const TARGET_TYPE_OPTIONS = [
  { value: 'kana_mastered', label: 'Hafal Huruf Kana (Hiragana + Katakana)', unit: 'huruf' },
  { value: 'vocab_mastered', label: 'Hafal Kosakata', unit: 'kata' },
  { value: 'quiz_count', label: 'Selesaikan Kuis', unit: 'kuis' },
  { value: 'xp', label: 'Kumpulkan XP', unit: 'XP' },
] as const;

export type TaskTargetType = (typeof TARGET_TYPE_OPTIONS)[number]['value'];

export function formatTaskTarget(type: string, value: number): string {
  const found = TARGET_TYPE_OPTIONS.find((opt) => opt.value === type);
  if (!found) return `${type}: ${value}`;
  return `${found.label} (${value} ${found.unit})`;
}

const kanaMap = new Map(
  [...allKana('hiragana'), ...allKana('katakana')].map((k) => [k.char, k.romaji]),
);
const vocabMap = new Map(VOCAB.map((v) => [v.id, v]));
const kanjiMap = new Map(KANJI_LIST.map((k) => [k.char, k]));
const bunpouQuestionMap = new Map(
  BUNPOU_LIST.flatMap((pt) => pt.questions.map((q) => [q.id, { pointTitle: pt.title, sentence: q.sentence }])),
);

const KIND_LABELS: Record<ItemKind, string> = {
  kana: 'Kana',
  vocab: 'Kosakata',
  kanji: 'Kanji',
  bunpou: 'Bunpou',
};

function describeItem(kind: ItemKind, key: string): { title: string; detail: string } {
  if (kind === 'kana') {
    const romaji = kanaMap.get(key);
    return { title: key, detail: romaji ? `romaji: ${romaji}` : 'Huruf kana' };
  }
  if (kind === 'vocab') {
    const v = vocabMap.get(key);
    return v ? { title: v.kanji ? `${v.kanji} (${v.jp})` : v.jp, detail: v.arti } : { title: key, detail: 'Kosakata' };
  }
  if (kind === 'kanji') {
    const k = kanjiMap.get(key);
    return k ? { title: k.char, detail: `${k.arti} (${k.level})` } : { title: key, detail: 'Kanji' };
  }
  const b = bunpouQuestionMap.get(key);
  return b ? { title: b.pointTitle, detail: b.sentence } : { title: key, detail: 'Tata bahasa' };
}

export function aggregateMissedItems(
  students: Array<{ role: string; itemStats?: ItemStatsMap }>,
  limit = 10,
): MissedItem[] {
  const map = new Map<string, { kind: ItemKind; key: string; right: number; wrong: number; studentCount: number }>();

  for (const s of students) {
    if (s.role !== 'student' || !s.itemStats) continue;
    for (const kind of ['kana', 'vocab', 'kanji', 'bunpou'] as ItemKind[]) {
      const bucket = s.itemStats[kind];
      if (!bucket) continue;
      for (const [key, stat] of Object.entries(bucket)) {
        const w = Number(stat?.w) || 0;
        const c = Number(stat?.c) || 0;
        if (w <= 0 && c <= 0) continue;
        const id = `${kind}:${key}`;
        const prev = map.get(id) ?? { kind, key, right: 0, wrong: 0, studentCount: 0 };
        prev.right += c;
        prev.wrong += w;
        if (w > 0) prev.studentCount += 1;
        map.set(id, prev);
      }
    }
  }

  return [...map.entries()]
    .filter(([, v]) => v.wrong > 0)
    .map(([id, v]) => {
      const desc = describeItem(v.kind, v.key);
      const total = v.right + v.wrong;
      return {
        id,
        kind: v.kind,
        kindLabel: KIND_LABELS[v.kind],
        title: desc.title,
        detail: desc.detail,
        right: v.right,
        wrong: v.wrong,
        studentCount: v.studentCount,
        wrongRate: total > 0 ? Math.round((v.wrong / total) * 100) : 100,
      };
    })
    .sort((a, b) => b.wrong - a.wrong || b.wrongRate - a.wrongRate || b.studentCount - a.studentCount)
    .slice(0, limit);
}

export function getStudentTopMissed(itemStats: ItemStatsMap | undefined, limit = 5): MissedItem[] {
  if (!itemStats) return [];
  const items: MissedItem[] = [];
  for (const kind of ['kana', 'vocab', 'kanji', 'bunpou'] as ItemKind[]) {
    const bucket = itemStats[kind];
    if (!bucket) continue;
    for (const [key, stat] of Object.entries(bucket)) {
      const w = Number(stat?.w) || 0;
      const c = Number(stat?.c) || 0;
      if (w <= 0) continue;
      const desc = describeItem(kind, key);
      const total = c + w;
      items.push({
        id: `${kind}:${key}`,
        kind,
        kindLabel: KIND_LABELS[kind],
        title: desc.title,
        detail: desc.detail,
        right: c,
        wrong: w,
        studentCount: 1,
        wrongRate: total > 0 ? Math.round((w / total) * 100) : 100,
      });
    }
  }
  return items
    .sort((a, b) => b.wrong - a.wrong || b.wrongRate - a.wrongRate)
    .slice(0, limit);
}
