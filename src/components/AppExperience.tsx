import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { clearInstall, deferredInstall, updateApp } from '../pwa';
import type { Lang } from './Campaign';

const pageNames: Record<string, [string, string]> = {
  '/': ['Statue initiative', 'भव्य स्मारक प्रकल्प'], '/about': ['About Us', 'आमच्याबद्दल'], '/project': ['Statue Project', 'पुतळा प्रकल्प'], '/progress': ['Project Progress', 'प्रकल्प प्रगती'], '/news': ['News & Updates', 'बातम्या'], '/transparency': ['Transparency', 'पारदर्शकता'], '/donate': ['Donate', 'देणगी'],
};
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
const iosSafari = () => /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
function recentlyDismissed() { try { return Date.now() - Number(localStorage.getItem('install-dismissed-at') || 0) < 7 * 24 * 60 * 60 * 1000; } catch { return false; } }

export function AppExperience({ lang }: { lang: Lang }) {
  const location = useLocation();
  const [online, setOnline] = useState(navigator.onLine);
  const [engaged, setEngaged] = useState(false);
  const [eligible, setEligible] = useState(Boolean(deferredInstall));
  const [dismissed, setDismissed] = useState(recentlyDismissed);
  const [installed, setInstalled] = useState(standalone);
  const [update, setUpdate] = useState(false);
  const [message, setMessage] = useState('');
  const mr = lang === 'mr';
  const checkout = location.pathname.startsWith('/donate') || location.pathname.startsWith('/admin');
  useEffect(() => {
    const onlineChanged = () => setOnline(navigator.onLine);
    const available = () => setEligible(true);
    const installDone = () => { setInstalled(true); clearInstall(); };
    const updateReady = () => setUpdate(true);
    // Wait at least 30 seconds AND for the visitor to scroll through content.
    let ready = false;
    const checkEngagement = () => { if (ready && window.scrollY > 350) setEngaged(true); };
    const timer = window.setTimeout(() => { ready = true; checkEngagement(); }, 30000);
    window.addEventListener('scroll', checkEngagement, { passive: true });
    window.addEventListener('online', onlineChanged); window.addEventListener('offline', onlineChanged);
    window.addEventListener('app-install-available', available); window.addEventListener('appinstalled', installDone);
    window.addEventListener('app-update-available', updateReady);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', checkEngagement); window.removeEventListener('online', onlineChanged); window.removeEventListener('offline', onlineChanged); window.removeEventListener('app-install-available', available); window.removeEventListener('appinstalled', installDone); window.removeEventListener('app-update-available', updateReady); };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    const title = `${pageNames[location.pathname]?.[mr ? 1 : 0] || (mr ? 'श्री शिव प्रतिष्ठान' : 'Shri Shiv Pratishthan')} | श्री शिव प्रतिष्ठान`;
    document.title = title;
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    const publicOrigin = import.meta.env.VITE_SITE_URL || window.location.origin;
    const url = new URL(location.pathname, publicOrigin).href;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
  }, [location.pathname, lang, mr]);
  useEffect(() => {
    if (location.hash) {
      const node = document.getElementById(location.hash.slice(1));
      node?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
      document.getElementById('page-content')?.focus({ preventScroll: true });
    }
  }, [location.pathname, location.hash]);
  const dismiss = () => { setDismissed(true); try { localStorage.setItem('install-dismissed-at', String(Date.now())); } catch { /* Private browsing may disallow storage. */ } };
  const install = async () => {
    if (!deferredInstall) return;
    try { await deferredInstall.prompt(); const choice = await deferredInstall.userChoice; clearInstall(); setEligible(false); if (choice.outcome === 'accepted') setInstalled(true); else dismiss(); }
    catch { setMessage(mr ? 'ब्राउझरच्या मेनूमधून अॅप स्थापित करा.' : 'Use your browser menu to install the app.'); }
  };
  return <>
    {!online && <div className="experience-notice" role="status">{mr ? 'तुम्ही ऑफलाइन आहात. जतन केलेली सार्वजनिक पाने वाचता येतील. देणगी आणि लॉगिनसाठी इंटरनेट आवश्यक आहे.' : 'You are offline. Saved public pages are available; donations and login require an internet connection.'}</div>}
    {!checkout && update && <aside className="experience-notice"><strong>{mr ? 'नवीन आवृत्ती उपलब्ध' : 'An updated version is available'}</strong><div className="notice-actions"><button type="button" onClick={() => void updateApp(true)}>{mr ? 'आता अद्ययावत करा' : 'Update now'}</button><button type="button" onClick={() => setUpdate(false)}>{mr ? 'नंतर' : 'Later'}</button></div></aside>}
    {!checkout && engaged && !installed && !dismissed && (eligible || iosSafari()) && <aside className="experience-notice" aria-label={mr ? 'अॅप स्थापित करा' : 'Install the app'}><strong>{mr ? 'श्री शिव प्रतिष्ठान तुमच्या होम स्क्रीनवर' : 'Keep Shri Shiv Pratishthan on your Home Screen'}</strong><p>{eligible ? (mr ? 'पुढील भेटीसाठी झटपट प्रवेश. देणगी देण्यासाठी अॅप स्थापित करणे आवश्यक नाही.' : 'Quick access for your next visit. Installation is optional; you can donate in your browser.') : (mr ? 'Safari मधील Share → Add to Home Screen निवडा.' : 'In Safari, tap Share → Add to Home Screen.')}</p><div className="notice-actions">{eligible && <button type="button" onClick={install}>{mr ? 'स्थापित करा' : 'Install'}</button>}<button type="button" onClick={dismiss}>{mr ? 'आत्ता नको' : 'Not now'}</button></div><p role="status">{message}</p></aside>}
  </>;
}
