import { NavLink } from 'react-router-dom';
import type { Lang } from './Campaign';

export function SiteFooter({ lang }: { lang: Lang }) {
  const mr = lang === 'mr';
  return <footer className="site-footer"><div className="wrap footer-grid">
    <div><NavLink to="/" className="brand"><span className="seal" aria-hidden="true">छ</span><b>श्री शिव प्रतिष्ठान</b></NavLink><p>{mr ? 'छत्रपती शिवाजी महाराजांच्या विचारांना आणि स्वराज्याच्या मूल्यांना समर्पित.' : 'Dedicated to the ideals of Chhatrapati Shivaji Maharaj and the values of Swarajya.'}</p></div>
    <nav aria-label={mr ? 'तळातील दुवे' : 'Footer navigation'}><h2>{mr ? 'प्रकल्प जाणून घ्या' : 'Explore the initiative'}</h2><NavLink to="/about">{mr ? 'आमच्याबद्दल' : 'About the Sanstha'}</NavLink><NavLink to="/project">{mr ? 'पुतळा प्रकल्प' : 'Statue project'}</NavLink><NavLink to="/progress">{mr ? 'प्रकल्प प्रगती' : 'Project progress'}</NavLink><NavLink to="/news">{mr ? 'बातम्या व घडामोडी' : 'News & updates'}</NavLink></nav>
    <div><h2>{mr ? 'आपला सहभाग' : 'Your participation'}</h2><p>{mr ? 'प्रकल्प जाणून घ्या, निधीची माहिती पहा आणि या संकल्पात सहभागी व्हा.' : 'Explore the vision, review the fundraising information and be part of the journey.'}</p><NavLink className="link-arrow" to="/transparency">{mr ? 'पारदर्शकता' : 'Transparency'} →</NavLink><NavLink className="btn primary" to="/donate">{mr ? 'देणगी द्या' : 'Donate Now'}</NavLink></div>
  </div><div className="wrap footer-copyright">© {new Date().getFullYear()} श्री शिव प्रतिष्ठान</div></footer>;
}
