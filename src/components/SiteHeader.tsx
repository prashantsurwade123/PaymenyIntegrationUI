import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { openAdminLogin } from '../public-login-link';
import type { Lang } from './Campaign';

const links = [
  ['/', 'Home', 'मुख्यपृष्ठ'], ['/about', 'About Us', 'आमच्याबद्दल'], ['/project', 'Statue Project', 'पुतळा प्रकल्प'],
  ['/progress', 'Project Progress', 'प्रकल्प प्रगती'], ['/news', 'News & Updates', 'बातम्या व घडामोडी'], ['/transparency', 'Transparency', 'पारदर्शकता'], ['/donate', 'Donate', 'देणगी'],
];
export function SiteHeader({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const { pathname } = useLocation();
  const mr = lang === 'mr';
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const node = drawer.current;
    if (!open || !node) { node?.close(); return; }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node.showModal();
    return () => { node.close(); document.body.style.overflow = previous; };
  }, [open]);
  const language = <button type="button" className="language-button" lang={mr ? 'en' : 'mr'} aria-label={mr ? 'Switch to English' : 'मराठीमध्ये वाचा'} onClick={() => setLang(mr ? 'en' : 'mr')}>{mr ? 'English' : 'मराठी'}</button>;
  const navigation = links.map(([path, en, marathi]) => <NavLink end={path === '/'} key={path} to={path} onClick={() => setOpen(false)}>{mr ? marathi : en}</NavLink>);
  const login = () => { setOpen(false); window.setTimeout(openAdminLogin, 0); };
  return <>
    <a className="skip-link" href="#page-content">{mr ? 'मुख्य मजकुराकडे जा' : 'Skip to content'}</a>
    <header className="site-header">
      <button className="drawer-trigger" type="button" aria-label={mr ? 'मेनू उघडा' : 'Open menu'} aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-drawer" onClick={() => setOpen(true)}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
      <NavLink to="/" className="brand"><span className="seal" aria-hidden="true">छ</span><span><b>श्री शिव प्रतिष्ठान</b><small>{mr ? 'वारसा जपूया, प्रेरणा पोहोचवूया' : 'Preserving heritage, inspiring tomorrow'}</small></span></NavLink>
      <nav className="desktop-navigation" aria-label={mr ? 'मुख्य मेनू' : 'Main navigation'}>{navigation}</nav>
      <div className="site-header-actions"><button type="button" className="header-admin" onClick={openAdminLogin}>Admin Login</button>{language}<NavLink className="btn primary header-donate" to="/donate"><span aria-hidden="true">♥</span> {mr ? 'देणगी' : 'Donate'}</NavLink></div>
    </header>
    <dialog id="mobile-drawer" className="mobile-drawer" ref={drawer} aria-labelledby="drawer-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="drawer-panel"><div className="drawer-heading"><h2 id="drawer-title">श्री शिव प्रतिष्ठान</h2><button autoFocus type="button" className="drawer-close" onClick={() => setOpen(false)} aria-label={mr ? 'मेनू बंद करा' : 'Close menu'}>×</button></div><p>{mr ? 'वारशातून प्रेरणा, सहभागातून साकार' : 'Inspired by heritage. Built through participation.'}</p><nav aria-label={mr ? 'मोबाइल मेनू' : 'Mobile navigation'}>{navigation}</nav><div className="drawer-tools"><button type="button" className="header-admin" onClick={login}>Admin Login</button>{language}</div></div>
    </dialog>
  </>;
}
