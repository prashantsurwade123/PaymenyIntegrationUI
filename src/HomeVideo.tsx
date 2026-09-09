import './home-video.css';

export function HomeVideo({ lang }: { lang: 'mr' | 'en' }) {
  return (
    <section id="home-video" className="home-video wrap" aria-labelledby="home-video-heading">
      <div className="home-video-heading">
        <div>
          <p className="eyebrow">{lang === 'mr' ? 'प्रेरणेचा वारसा' : 'A legacy of inspiration'}</p>
          <h2 id="home-video-heading">{lang === 'mr' ? 'व्हिडिओ पहा' : 'Watch the video'}</h2>
        </div>
        <a className="link-arrow" href="https://youtu.be/IlA-2prfgzI" target="_blank" rel="noopener noreferrer">
          {lang === 'mr' ? 'YouTube वर पहा' : 'Watch on YouTube'} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="home-video-player">
        <iframe
          src="https://www.youtube-nocookie.com/embed/IlA-2prfgzI"
          title={lang === 'mr' ? 'मुख्यपृष्ठावरील YouTube व्हिडिओ' : 'Featured YouTube video'}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <a className="link-arrow" href="#gallery" style={{ marginTop: 20 }}>
        {lang === 'mr' ? 'छायाचित्र व व्हिडिओ दालन पहा' : 'Explore the photo & video gallery'} <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
