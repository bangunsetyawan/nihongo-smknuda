// Pengucapan memakai Web Speech API (suara Jepang bawaan perangkat)
let jaVoice: SpeechSynthesisVoice | null = null;
const listeners = new Set<() => void>();

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  const ja = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('ja'));
  // Utamakan suara Google/online yang biasanya lebih natural
  jaVoice = ja.find((v) => /google/i.test(v.name)) ?? ja.find((v) => !v.localService) ?? ja[0] ?? null;
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function hasJapaneseVoice() {
  return !!jaVoice;
}

export function onVoicesChanged(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function speak(text: string, rate = 0.8) {
  if (!speechSupported()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  if (jaVoice) u.voice = jaVoice;
  u.rate = rate;
  speechSynthesis.speak(u);
}
