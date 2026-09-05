import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import raigadPhoto from './assets/shivaji-raigad.jpg';
import './heritage-showcase.css';

type Props = { lang: 'mr' | 'en' };

export function CommitteeSection({ lang }: Props) {
  const mr = lang === 'mr';
  return <section className="wrap hs-section" aria-labelledby="committee-title">
    <div className="hs-committee">
      <div className="hs-emblem" aria-hidden="true">छ</div>
      <div><p className="eyebrow">{mr ? 'श्री शिव प्रतिष्ठान • संस्थेची ओळख' : 'Shri Shiv Pratishthan • Our organisation'}</p>
        <h2 id="committee-title">{mr ? 'एक संकल्प. सामायिक जबाबदारी.' : 'One vision. A shared responsibility.'}</h2>
        <p>{mr ? 'स्मारकाचा संकल्प पुढे नेण्यासाठी लोकसहभाग आणि जबाबदार नियोजन महत्त्वाचे आहे. संस्थेची अधिकृत समिती, सदस्यांची कार्यक्षेत्रे आणि सार्वजनिक संपर्क तपशील मंजुरीनंतर येथे प्रसिद्ध केले जातील.' : 'Public participation and responsible planning are central to the memorial vision. The official committee, members’ responsibilities and public contact details will be published here after approval.'}</p>
        <span className="hs-label">{mr ? 'समितीची अधिकृत माहिती लवकरच' : 'Official committee details to follow'}</span>
      </div>
    </div>
  </section>;
}

export function HeritageShowcase({ lang }: Props) {
  const mr = lang === 'mr';
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const current = dialog.current;
    return () => current?.close();
  }, []);
  const caption = mr ? 'रायगडावरील छत्रपती शिवाजी महाराजांचा पुतळा' : 'Statue of Chhatrapati Shivaji Maharaj at Raigad';
  return <>
    <section className="hs-showcase" aria-labelledby="showcase-title"><div className="wrap hs-section hs-showcase-grid">
      <div className="hs-showcase-copy"><p className="eyebrow light">{mr ? 'स्मारकाची प्रेरणा' : 'The inspiration behind the memorial'}</p>
        <h2 id="showcase-title">{mr ? 'वारशाला अभिवादन. उद्याला प्रेरणा.' : 'Honouring a legacy. Inspiring tomorrow.'}</h2>
        <p>{mr ? 'छत्रपती शिवाजी महाराजांच्या स्मृतीला साजेसा स्मारकाचा संकल्प — इतिहासाविषयी आदर, शिकण्याची प्रेरणा आणि समाजाला जोडणारी एक जागा.' : 'A memorial vision that honours Chhatrapati Shivaji Maharaj through respect for history, an invitation to learn and a place that brings people together.'}</p>
        <div className="hs-principles"><span>{mr ? 'सन्मान' : 'Respect'}</span><span>{mr ? 'प्रेरणा' : 'Inspiration'}</span><span>{mr ? 'लोकसहभाग' : 'Participation'}</span></div>
        <NavLink to="/project" className="btn ghost">{mr ? 'स्मारकाचा संकल्प पहा' : 'Explore the memorial vision'} <span aria-hidden="true">→</span></NavLink>
      </div>
      <figure className="hs-feature-photo"><img src={raigadPhoto} alt={caption} loading="lazy" width="640" height="480"/><figcaption>{mr ? 'संदर्भ छायाचित्र • रायगड; प्रस्तावित स्मारकाचा मंजूर आराखडा नाही.' : 'Reference photograph • Raigad; not an approved design for the proposed memorial.'}</figcaption></figure>
    </div></section>

    <section id="gallery" className="wrap hs-section" aria-labelledby="gallery-title">
      <div className="hs-section-heading"><div><p className="eyebrow">{mr ? 'दृश्यांचा वारसा' : 'Heritage in focus'}</p><h2 id="gallery-title">{mr ? 'छायाचित्र व व्हिडिओ दालन' : 'Photo & video gallery'}</h2></div><p>{mr ? 'छायाचित्र मोठे करून पहा किंवा मुख्यपृष्ठावरील व्हिडिओकडे जा.' : 'Take a closer look at the photograph or explore the featured video.'}</p></div>
      <div className="hs-gallery">
        <button type="button" className="hs-gallery-photo" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog" aria-label={mr ? 'रायगडचे छायाचित्र मोठे करून पहा' : 'Enlarge the Raigad photograph'}>
          <img src={raigadPhoto} alt={caption} loading="lazy" width="640" height="480"/>
          <span className="hs-photo-caption"><span>{mr ? 'रायगड • संदर्भ छायाचित्र' : 'Raigad • Reference photograph'}</span><span className="hs-open-icon" aria-hidden="true">↗</span></span>
        </button>
        <a href="#home-video" className="hs-video-card"><span className="hs-play" aria-hidden="true">▶</span><span className="eyebrow">{mr ? 'विशेष व्हिडिओ' : 'Featured video'}</span><h3>{mr ? 'पहा. जाणून घ्या. प्रेरणा घ्या.' : 'Watch. Reflect. Be inspired.'}</h3><p>{mr ? 'मुख्यपृष्ठावरील व्हिडिओ येथे पहा.' : 'Visit the video featured on our home page.'}</p><span className="link-arrow">{mr ? 'व्हिडिओकडे जा' : 'Go to the video'} ↑</span></a>
      </div>
      <p className="hs-gallery-note">{mr ? 'प्रकल्पस्थळाची आणि संस्थेच्या उपक्रमांची अधिकृत छायाचित्रे उपलब्ध झाल्यावर या दालनात जोडली जातील.' : 'Official photographs of the project site and Sansthan activities will be added as they become available.'}</p>
      <p className="hs-credit">{mr ? 'रायगड छायाचित्र' : 'Raigad photograph'}: <a href="https://commons.wikimedia.org/wiki/File:Chhatrapati_Shivaji_statue_Raigad.jpg" target="_blank" rel="noreferrer">Nitin Darekar</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a></p>
    </section>
    <CommitteeSection lang={lang}/>
    <dialog ref={dialog} className="hs-lightbox" aria-labelledby="photo-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="hs-lightbox-inner"><button type="button" className="hs-close" onClick={() => dialog.current?.close()} autoFocus>{mr ? 'बंद करा' : 'Close'} ×</button><img src={raigadPhoto} alt={caption}/><h2 id="photo-dialog-title">{caption}</h2><p>{mr ? 'संदर्भ छायाचित्र; प्रस्तावित प्रकल्पस्थळाचे छायाचित्र नाही.' : 'Reference photograph; this is not the proposed project site.'}</p><p className="hs-credit">Nitin Darekar · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a></p></div>
    </dialog>
  </>;
}
