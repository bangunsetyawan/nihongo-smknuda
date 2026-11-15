import { useSyncExternalStore } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaInstallSnapshot {
  canPrompt: boolean;
  isStandalone: boolean;
  isInstalled: boolean;
  isIos: boolean;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installedFlag = false;
const subs = new Set<() => void>();

function checkStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const matchStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
  return matchStandalone || iosStandalone;
}

function checkIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

let cachedSnapshot: PwaInstallSnapshot = {
  canPrompt: false,
  isStandalone: checkStandalone(),
  isInstalled: checkStandalone(),
  isIos: checkIos(),
};

function notify() {
  const standalone = checkStandalone();
  cachedSnapshot = {
    canPrompt: deferredPrompt !== null,
    isStandalone: standalone,
    isInstalled: standalone || installedFlag,
    isIos: checkIos(),
  };
  subs.forEach((fn) => fn());
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installedFlag = true;
    notify();
  });

  window.matchMedia?.('(display-mode: standalone)').addEventListener('change', notify);
}

export async function triggerInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) return 'unavailable';
  const promptEvt = deferredPrompt;
  deferredPrompt = null;
  notify();
  await promptEvt.prompt();
  const choice = await promptEvt.userChoice.catch(() => ({ outcome: 'dismissed' as const }));
  if (choice.outcome === 'accepted') {
    installedFlag = true;
    notify();
  }
  return choice.outcome;
}

export function usePwaInstall(): PwaInstallSnapshot {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => cachedSnapshot,
  );
}
