import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { lazy, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { FundraisingProgress, useCampaign, type Lang } from '../components/Campaign';
import { HomeVideo } from '../HomeVideo';
const HeritageShowcase = lazy(() => import('../HeritageShowcase').then(module => ({ default: module.HeritageShowcase })));

function HeritageIcon({ kind }: { kind: 'culture' | 'people' | 'star' }) {
  return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind === 'culture' ? <><path d="m3 8 9-5 9 5H3ZM4 20h16M5 18V10m5 8V10m4 8V10m5 8V10"/></> : kind === 'people' ? <><circle cx="12" cy="7" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3M4 10a3 3 0 0 0 0 6m16-6a3 3 0 0 1 0 6M2 21v-2m20 2v-2"/></> : <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>}</svg>;
}

export default function HomePage({ lang }: { lang: Lang }) {
  const mr = lang === 'mr';
  const { summary } = useCampaign();
  const journey = [
    ['Concept', 'संकल्पना', 'Complete', 'पूर्ण'], ['Planning', 'नियोजन', 'Complete', 'पूर्ण'], ['Foundation', 'पाया', 'Complete', 'पूर्ण'], ['Construction', 'उभारणी', '65%', '65%'], ['Installation', 'स्थापना', 'Pending', 'प्रलंबित'],
  ];
  return <main className="campaign-home">
    <section className="hero campaign-hero"><div className="hero-art" aria-hidden="true"/><div className="hero-copy"><p className="eyebrow light">श्री शिव प्रतिष्ठान</p><h1>{mr ? <>छत्रपती शिवाजी महाराजांचा <em>भव्य पुतळा</em></> : <>A Grand Statue of <em>Chhatrapati Shivaji Maharaj</em></>}</h1><p>{mr ? 'आपल्या सहभागातून एक ऐतिहासिक संकल्पना साकारूया!' : 'Let us build a historic vision through your participation.'}</p><div className="cta"><NavLink to="/donate" className="btn primary">{mr ? 'देणगी द्या' : 'Donate Now'} <span aria-hidden="true">→</span></NavLink><NavLink to="/project" className="btn ghost">{mr ? 'प्रकल्प जाणून घ्या' : 'Explore the Project'}</NavLink></div><div className="hero-trust"><span><HeritageIcon kind="people"/><span><b>{summary ? new Intl.NumberFormat('en-IN').format(summary.donorCount) : mr ? 'लोकसहभाग' : 'Together'}</b><small>{mr ? 'सहभागी नागरिक' : 'Contributing citizens'}</small></span></span><span><HeritageIcon kind="culture"/><span><b>{mr ? 'आपला वारसा' : 'Our heritage'}</b><small>{mr ? 'आपला अभिमान' : 'Our pride'}</small></span></span></div></div></section>
    <FundraisingProgress lang={lang}/>
    <section className="heritage wrap campaign-vision"><div><p className="eyebrow">{mr ? 'आमची दृष्टी' : 'Our vision'}</p><h2>{mr ? 'इतिहासाचा वारसा, उद्याची प्रेरणा.' : <>Heritage for today.<br/>Inspiration for tomorrow.</>}</h2><p>{mr ? 'हा केवळ पुतळा नाही; स्वराज्याच्या मूल्यांचा प्रेरणादायी वारसा आहे.' : 'More than a monument: an enduring source of inspiration rooted in the values of Swarajya.'}</p><NavLink to="/about" className="link-arrow">{mr ? 'संस्थेबद्दल जाणून घ्या' : 'Discover the Sanstha'} →</NavLink></div><div className="heritage-cards">{([
      ['culture', 'Culture & history', 'संस्कृती व इतिहास', 'Preserving the Maratha heritage.', 'मराठा वारशाचे जतन आणि संवर्धन.'],
      ['people', 'Youth inspiration', 'युवा प्रेरणा', 'Leadership values for the next generation.', 'पुढच्या पिढीसाठी नेतृत्वाचे मूल्य.'],
      ['star', 'Community first', 'समाज सहभाग', 'A dignified role for every citizen.', 'प्रत्येक नागरिकाचा सन्माननीय सहभाग.'],
    ] as const).map(([icon, en, marathi, desc, description]) => <article key={icon}><HeritageIcon kind={icon}/><h3>{mr ? marathi : en}</h3><p>{mr ? description : desc}</p></article>)}</div></section>
    <section className="timeline-section campaign-journey"><div className="wrap"><p className="eyebrow light">{mr ? 'संकल्प ते साकार' : 'From vision to reality'}</p><h2>{mr ? 'प्रकल्पाचा प्रवास' : 'Project journey'}</h2><ol className="journey-steps">{journey.map(([en, marathi, status, marathiStatus], i) => <li key={en} className={i === 3 ? 'current' : ''} aria-current={i === 3 ? 'step' : undefined}><span className="journey-dot">0{i + 1}</span><div><h3>{mr ? marathi : en}</h3><span className={i < 3 ? 'journey-complete' : ''}>{mr ? marathiStatus : status}</span>{i === 3 && <progress value={65} max={100} aria-label={mr ? 'उभारणी' : 'Construction'}/>}</div></li>)}</ol><NavLink className="link-arrow" to="/progress">{mr ? 'प्रकल्पाचे तपशील पहा' : 'Explore the project roadmap'} →</NavLink></div></section>
    <HomeVideo lang={lang}/>
    <Suspense fallback={<LoadingSkeleton label={mr ? 'दालन उघडत आहे…' : 'Loading the gallery…'}/>}><HeritageShowcase lang={lang}/></Suspense>
    <section className="news wrap"><p className="eyebrow">{mr ? 'जोडलेले रहा' : 'Stay connected'}</p><h2>{mr ? 'वारसा, सहभाग आणि प्रकल्प' : 'Heritage, community & the journey ahead'}</h2><div className="news-grid">{[['Heritage', 'वारसा'], ['Community', 'लोकसहभाग'], ['Project', 'प्रकल्प']].map(([en, marathi]) => <article key={en}><span>{mr ? 'श्री शिव प्रतिष्ठान' : 'Shri Shiv Pratishthan'}</span><h3>{mr ? marathi : en}</h3><NavLink to="/news">{mr ? 'लेख वाचा' : 'Explore the stories'} →</NavLink></article>)}</div></section>
  </main>;
}
