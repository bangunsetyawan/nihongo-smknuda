// Peta verifikasi soal Bunpou untuk server-side (/api/practice/record type: bunpou_answer).
export interface ServerBunpouQuestion {
  id: string;
  topicId: string;
  answer: string;
}

export const BUNPOU_QUESTIONS: ServerBunpouQuestion[] = [
  // desu-masu
  { id: 'bp-dm-1', topicId: 'desu-masu', answer: 'です' },
  { id: 'bp-dm-2', topicId: 'desu-masu', answer: 'ます' },
  { id: 'bp-dm-3', topicId: 'desu-masu', answer: 'ません' },
  { id: 'bp-dm-4', topicId: 'desu-masu', answer: 'じゃありません' },
  // partikel-dasar
  { id: 'bp-pt-1', topicId: 'partikel-dasar', answer: 'で' },
  { id: 'bp-pt-2', topicId: 'partikel-dasar', answer: 'を' },
  { id: 'bp-pt-3', topicId: 'partikel-dasar', answer: 'と' },
  { id: 'bp-pt-4', topicId: 'partikel-dasar', answer: 'で' },
  // bentuk-lampau
  { id: 'bp-lp-1', topicId: 'bentuk-lampau', answer: 'ました' },
  { id: 'bp-lp-2', topicId: 'bentuk-lampau', answer: 'でした' },
  { id: 'bp-lp-3', topicId: 'bentuk-lampau', answer: 'ませんでした' },
  { id: 'bp-lp-4', topicId: 'bentuk-lampau', answer: 'きました' },
  // tai
  { id: 'bp-ti-1', topicId: 'tai', answer: 'いきたいです' },
  { id: 'bp-ti-2', topicId: 'tai', answer: 'かいたいです' },
  { id: 'bp-ti-3', topicId: 'tai', answer: 'たいです' },
  { id: 'bp-ti-4', topicId: 'tai', answer: 'たくないです' },
  // te-form
  { id: 'bp-tf-1', topicId: 'te-form', answer: 'かいて' },
  { id: 'bp-tf-2', topicId: 'te-form', answer: 'よんで' },
  { id: 'bp-tf-3', topicId: 'te-form', answer: 'いって' },
  { id: 'bp-tf-4', topicId: 'te-form', answer: 'あけて' },
  // te-kudasai
  { id: 'bp-tk-1', topicId: 'te-kudasai', answer: 'よんで' },
  { id: 'bp-tk-2', topicId: 'te-kudasai', answer: 'きて' },
  { id: 'bp-tk-3', topicId: 'te-kudasai', answer: 'すわないで' },
  { id: 'bp-tk-4', topicId: 'te-kudasai', answer: 'して' },
  // te-iru
  { id: 'bp-ti2-1', topicId: 'te-iru', answer: 'おしえて います' },
  { id: 'bp-ti2-2', topicId: 'te-iru', answer: 'まって います' },
  { id: 'bp-ti2-3', topicId: 'te-iru', answer: 'まなんで います' },
  { id: 'bp-ti2-4', topicId: 'te-iru', answer: 'しって います' },
  // nakereba
  { id: 'bp-nk-1', topicId: 'nakereba', answer: 'わなければ' },
  { id: 'bp-nk-2', topicId: 'nakereba', answer: 'ださなければ' },
  { id: 'bp-nk-3', topicId: 'nakereba', answer: 'なければ なりません' },
  { id: 'bp-nk-4', topicId: 'nakereba', answer: 'しなければ' },
  // te-mo-ii
  { id: 'bp-pm-1', topicId: 'te-mo-ii', answer: 'もいいですか' },
  { id: 'bp-pm-2', topicId: 'te-mo-ii', answer: 'つかっても いいですよ' },
  { id: 'bp-pm-3', topicId: 'te-mo-ii', answer: 'ては いけません' },
  { id: 'bp-pm-4', topicId: 'te-mo-ii', answer: 'もいいです' },
  // perbandingan
  { id: 'bp-pb-1', topicId: 'perbandingan', answer: 'より' },
  { id: 'bp-pb-2', topicId: 'perbandingan', answer: 'のほうが' },
  { id: 'bp-pb-3', topicId: 'perbandingan', answer: 'どちら' },
  { id: 'bp-pb-4', topicId: 'perbandingan', answer: 'より' },
  // alasan
  { id: 'bp-al-1', topicId: 'alasan', answer: 'から' },
  { id: 'bp-al-2', topicId: 'alasan', answer: 'なので' },
  { id: 'bp-al-3', topicId: 'alasan', answer: 'ので' },
  { id: 'bp-al-4', topicId: 'alasan', answer: 'から' },
  // mashou
  { id: 'bp-ms-1', topicId: 'mashou', answer: 'ましょう' },
  { id: 'bp-ms-2', topicId: 'mashou', answer: 'ましょうか' },
  { id: 'bp-ms-3', topicId: 'mashou', answer: 'ましょう' },
  { id: 'bp-ms-4', topicId: 'mashou', answer: 'みましょう' },
];

export const BUNPOU_QUESTION_MAP: Record<string, ServerBunpouQuestion> = Object.fromEntries(
  BUNPOU_QUESTIONS.map((q) => [q.id, q]),
);

export function isBunpouAnswerCorrect(questionId: string, given: unknown): boolean {
  const q = BUNPOU_QUESTION_MAP[questionId];
  if (!q || typeof given !== 'string') return false;
  return given.trim() === q.answer;
}
