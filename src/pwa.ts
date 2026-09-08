import { registerSW } from 'virtual:pwa-register';

// A waiting worker activates only after the visitor requests an update.
// No automatic reload can interrupt checkout or a partially filled form.
export const updateApp = registerSW({
  immediate: false,
  onNeedRefresh() { window.dispatchEvent(new Event('app-update-available')); },
});

export interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
export let deferredInstall: InstallEvent | null = null;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstall = event as InstallEvent;
  window.dispatchEvent(new Event('app-install-available'));
});
export function clearInstall() { deferredInstall = null; }
