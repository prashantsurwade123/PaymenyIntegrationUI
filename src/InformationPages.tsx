import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import heritageImage from './assets/shivaji-raigad.jpg';
import './information-pages.css';

type Lang = 'mr' | 'en';
type Pair = [string, string];
type Kind = 'about' | 'project' | 'progress' | 'news';
const titles: Record<Kind, Pair> = {
  about: ['आमच्याबद्दल', 'Rooted in heritage. United in purpose.'],
  project: ['भव्य पुतळा प्रकल्प', 'A tribute that inspires generations.'],
  progress: ['प्रकल्पाची वाटचाल', 'Every step, shared with you.'],
  news: ['बातम्या व चालू घडामोडी', 'Stories, ideas & community voices.'],
};
const intros: Record<Kind, Pair> = {
  about: ['छत्रपती शिवाजी महाराजांच्या विचारांचा वारसा जपत, समाजाला एका सामायिक ध्येयासाठी जोडण्याचा संकल्प.', 'Inspired by Chhatrapati Shivaji Maharaj, our purpose is to bring people together through heritage, learning and service.'],
  project: ['इतिहासाचा सन्मान आणि उद्याच्या पिढ्यांसाठी प्रेरणा — लोकसहभागातून साकारण्याचा स्मारकाचा संकल्प.', 'A proposed memorial shaped by public participation, respect for history and a commitment to future generations.'],
  progress: ['संकल्पनेपासून स्मारकापर्यंतचा प्रवास समजून घ्या. अधिकृत टप्पे आणि नोंदी येथे उपलब्ध होतील.', 'Explore the path from an initial vision to a completed memorial, with a place for verified milestones and supporting records.'],
  news: ['वारसा, लोकसहभाग आणि प्रकल्पाविषयी वाचा. अधिकृत घोषणा प्रसिद्ध झाल्यानंतर येथे जोडल्या जातील.', 'Explore heritage, participation and the project. Official announcements will be added here when they are published.'],
};
const values: { title: Pair; body: Pair }[] = [
  { title: ['वारशाचे जतन', 'Preserve our heritage'], body: ['इतिहास समजून घेणे, सांस्कृतिक स्मृती जपणे आणि नव्या पिढीपर्यंत त्या पोहोचवणे हे आमच्या संकल्पाचे केंद्र आहे.', 'Our vision places historical understanding and cultural memory at its centre, making heritage meaningful to each new generation.'] },
  { title: ['युवकांना प्रेरणा', 'Inspire young minds'], body: ['वाचन, संवाद आणि सांस्कृतिक सहभागातून नेतृत्व, जबाबदारी आणि समाजसेवेची आवड निर्माण व्हावी, हा आमचा प्रयत्न आहे.', 'We aim to encourage leadership, responsibility and service through reading, dialogue and cultural participation.'] },
  { title: ['लोकसहभाग', 'Bring people together'], body: ['प्रत्येकाचे ज्ञान, वेळ आणि कल्पना महत्त्वाच्या आहेत. सामायिक ध्येयासाठी आदरपूर्वक एकत्र येणे हीच आपली ताकद.', 'Every person brings time, knowledge and ideas. Working together with mutual respect gives a shared purpose its strength.'] },
];
const stages: { title: Pair; body: Pair }[] = [
  { title: ['संकल्पना व अभ्यास', 'Vision & research'], body: ['स्मारकाचा उद्देश, ऐतिहासिक संदर्भ आणि समाजाच्या अपेक्षा यांचा अभ्यास.', 'Define the memorial’s purpose, study historical references and understand community expectations.'] },
  { title: ['स्थळ व परवानग्या', 'Site & permissions'], body: ['स्थळाची योग्यता, आवश्यक परवानग्या आणि तांत्रिक निकषांची पडताळणी.', 'Assess site suitability, required permissions and technical requirements.'] },
  { title: ['रचना व नियोजन', 'Design & planning'], body: ['कलात्मक संकल्पना, अभियांत्रिकी आराखडा आणि खर्चाचे नियोजन.', 'Develop the artistic concept, engineering plans and a cost estimate.'] },
  { title: ['निर्मिती व उभारणी', 'Creation & construction'], body: ['मान्य आराखड्यानुसार निर्मिती, गुणवत्तेची तपासणी आणि सुरक्षित उभारणी.', 'Follow approved plans for fabrication and construction, with quality checks and safe installation.'] },
  { title: ['लोकार्पण व देखभाल', 'Opening & stewardship'], body: ['अंतिम तपासणी, भेट देणाऱ्यांची सुविधा आणि दीर्घकालीन देखभालीची तयारी.', 'Prepare for final inspections, visitor access and long-term maintenance.'] },
];
const stories: { category: 'heritage' | 'community' | 'project'; title: Pair; intro: Pair; body: Pair }[] = [
  { category: 'heritage', title: ['वारसा जपण्याची सुरुवात आपल्यापासून', 'Heritage begins with everyday care'], intro: ['इतिहासाशी जोडलेले राहण्यासाठी मोठ्या कार्यक्रमाचीच गरज नसते.', 'A connection with history can begin with a small, thoughtful habit.'], body: ['स्थानिक इतिहासाविषयी वाचा, विश्वसनीय संदर्भ शोधा आणि कुटुंबातील आठवणी ऐका. ऐतिहासिक स्थळांना भेट देताना स्वच्छता आणि स्थानिक नियम पाळा. माहिती शेअर करण्यापूर्वी तिचा संदर्भ तपासणे हीदेखील वारसा जपण्याची महत्त्वाची सवय आहे.', 'Read about local history, seek reliable references and listen to family memories. When visiting heritage sites, respect local rules and keep the surroundings clean. Checking the source before sharing a historical claim is another practical way to care for our shared heritage.'] },
  { category: 'community', title: ['लोकसहभागाची अनेक रूपे', 'Many ways to contribute'], intro: ['वेळ, कौशल्य आणि विधायक कल्पनाही महत्त्वाचे योगदान ठरतात.', 'Time, skills and constructive ideas can all support a shared purpose.'], body: ['अनुवाद, लेखन, छायाचित्रण, नियोजन आणि जनजागृती यांसारखी कौशल्ये समाजाभिमुख कामात उपयोगी पडू शकतात. सहभाग घेण्यापूर्वी संस्थेची अधिकृत सूचना, भूमिका आणि आवश्यक वेळ समजून घ्या. स्वयंसेवा संधी जाहीर झाल्यावर त्यांची माहिती येथे दिली जाईल.', 'Translation, writing, photography, planning and outreach can all serve community work. Before taking part, understand the organisation’s official instructions, the role and the time involved. Details of volunteer opportunities will appear here when they are announced.'] },
  { category: 'project', title: ['स्मारकाचा प्रवास समजून घेऊया', 'Understanding a memorial project'], intro: ['संकल्पना, नियोजन, परवानग्या आणि निर्मिती — प्रत्येक टप्प्याचे स्वतंत्र महत्त्व.', 'Research, design, permissions and construction each have a distinct role.'], body: ['भव्य स्मारकासाठी कलात्मक दृष्टीबरोबर अभियांत्रिकी, सुरक्षितता आणि दीर्घकालीन देखभालीचा विचार आवश्यक असतो. टप्प्यांची नोंद आणि संबंधित कागदपत्रे प्रकल्प समजून घेण्यास मदत करतात. या संकेतस्थळावरील नियोजित टप्पे ही मार्गदर्शक रूपरेषा आहे; प्रत्यक्ष स्थिती अधिकृत नोंदींनुसार जाहीर केली जाईल.', 'A memorial brings artistic vision together with engineering, safety and long-term maintenance. Milestone records and supporting documents help the public understand that work. The stages on this website describe a proposed roadmap; actual progress will be published through official updates.'] },
];

export function InformationPage({ lang, kind }: { lang: Lang; kind: Kind }) {
  const tr = (pair: Pair) => pair[lang === 'mr' ? 0 : 1];
  const [filter, setFilter] = useState('all');
  const categories: Record<string, Pair> = { all: ['सर्व लेख', 'All articles'], heritage: ['वारसा', 'Heritage'], community: ['लोकसहभाग', 'Community'], project: ['प्रकल्प', 'Project'] };
  return <main className="info-page">
    <section className="info-hero">
      <div className="wrap">
        <p className="eyebrow light">{tr(['श्री शिव प्रतिष्ठान', 'Shri Shiv Pratishthan'])}</p>
        <h1>{tr(titles[kind])}</h1>
        <p className="info-intro">{tr(intros[kind])}</p>
        <div className="info-hero-rule" aria-hidden="true"/>
      </div>
    </section>

    {kind === 'about' && <>
      <section className="wrap info-section info-split">
        <figure className="info-photo"><img src={heritageImage} alt={tr(['रायगडावरील छत्रपती शिवाजी महाराजांचा पुतळा', 'Statue of Chhatrapati Shivaji Maharaj at Raigad'])}/><figcaption>{tr(['वारशातून प्रेरणा • रायगड', 'Inspiration from our heritage • Raigad'])} · <a href="https://commons.wikimedia.org/wiki/File:Chhatrapati_Shivaji_statue_Raigad.jpg" target="_blank" rel="noreferrer">Nitin Darekar / CC BY-SA 3.0</a></figcaption></figure>
        <div><p className="eyebrow">{tr(['आमचा संकल्प', 'Our purpose'])}</p><h2>{tr(['इतिहासाशी नाते. समाजाशी बांधिलकी.', 'Connected to history. Committed to community.'])}</h2><p>{tr(['श्री शिव प्रतिष्ठानचा संकल्प छत्रपती शिवाजी महाराजांचे विचार आणि वारसा पुढील पिढ्यांपर्यंत पोहोचवण्याचा आहे. स्वराज्य, स्वाभिमान आणि समाजाप्रती जबाबदारी या मूल्यांपासून प्रेरणा घेऊन एकत्र येण्याचे हे व्यासपीठ आहे.', 'Shri Shiv Pratishthan’s vision is to carry the ideals and legacy of Chhatrapati Shivaji Maharaj to future generations. It is a platform for coming together around Swarajya, dignity and responsibility towards society.'])}</p><p>{tr(['स्मारकाचा संकल्प हा या प्रेरणेचा एक भाग आहे. इतिहासाविषयी जिज्ञासा, सांस्कृतिक जाण आणि लोकसहभाग यांनाही या प्रवासात तितकेच महत्त्व आहे.', 'The proposed memorial is one expression of that inspiration. Curiosity about history, cultural understanding and public participation are equally important parts of the journey.'])}</p><NavLink className="link-arrow" to="/project">{tr(['स्मारकाचा संकल्प जाणून घ्या', 'Explore the memorial vision'])} →</NavLink></div>
      </section>
      <section className="info-tint"><div className="wrap info-section"><p className="eyebrow">{tr(['आपली मूल्ये', 'What guides us'])}</p><h2>{tr(['विचारांना कृतीची जोड', 'Giving purpose a practical direction'])}</h2><div className="info-cards">{values.map((v, i) => <article className="info-card" key={v.title[1]}><span className="info-number">0{i + 1}</span><h3>{tr(v.title)}</h3><p>{tr(v.body)}</p></article>)}</div></div></section>
    </>}

    {kind === 'project' && <>
      <section className="wrap info-section"><div className="info-section-heading"><p className="eyebrow">{tr(['स्मारकाची संकल्पना', 'The memorial vision'])}</p><h2>{tr(['सन्मान, प्रेरणा आणि जतन', 'A place for remembrance and reflection'])}</h2><p>{tr(['छत्रपती शिवाजी महाराजांच्या स्मृतीला अभिवादन करणारा आणि त्यांच्या विचारांविषयी जाणून घेण्याची प्रेरणा देणारा परिसर उभारण्याचा संकल्प.', 'The vision is a setting that honours Chhatrapati Shivaji Maharaj and encourages visitors to reflect on his legacy.'])}</p></div><div className="info-cards">{[
        { title: ['कलात्मक अभिव्यक्ती', 'Artistic expression'] as Pair, body: ['इतिहासाचा आदर करणारी रचना आणि शिल्पातील बारकाव्यांचा विचार हा संकल्पनेचा महत्त्वाचा भाग असेल.', 'A design respectful of history, with careful consideration of sculptural detail, is central to the concept.'] as Pair },
        { title: ['शिकण्याची प्रेरणा', 'A space to learn'] as Pair, body: ['भेट देणाऱ्यांमध्ये इतिहासाविषयी कुतूहल निर्माण करणारी माहिती आणि सांस्कृतिक संदर्भ देण्याची संकल्पना.', 'The concept includes opportunities to spark curiosity through historical context and accessible information.'] as Pair },
        { title: ['दीर्घकालीन काळजी', 'Care for the future'] as Pair, body: ['सुरक्षितता, प्रवेशसुलभता आणि देखभाल यांचा आराखड्यात विचार करण्याचा उद्देश.', 'Safety, accessibility and ongoing maintenance are considerations for the project’s planning.'] as Pair },
      ].map((v, i) => <article className="info-card" key={v.title[1]}><span className="info-number">0{i + 1}</span><h3>{tr(v.title)}</h3><p>{tr(v.body)}</p></article>)}</div></section>
      <section className="wrap info-section info-split info-project-details"><div><p className="eyebrow">{tr(['प्रकल्पाची माहिती', 'Project at a glance'])}</p><h2>{tr(['भक्कम नियोजनातून पुढे', 'Thoughtful planning comes first'])}</h2><p>{tr(['अंतिम स्थळ, उंची, खर्च आणि वेळापत्रक अधिकृत मंजुरीनंतर जाहीर केले जातील. येथे दिलेली माहिती प्रकल्पाची संकल्पना मांडते.', 'Final location, dimensions, budget and timelines will be announced following official approvals. The information here describes the project vision.'])}</p><NavLink to="/progress" className="link-arrow">{tr(['नियोजित टप्पे पहा', 'Explore the project roadmap'])} →</NavLink></div><dl className="info-facts">{([
        [['प्रकल्प', 'Project'], ['छत्रपती शिवाजी महाराज स्मारक', 'Chhatrapati Shivaji Maharaj memorial']],
        [['स्थळ व परिमाणे', 'Location & dimensions'], ['अधिकृत घोषणेची प्रतीक्षा', 'Awaiting official announcement']],
        [['अंदाजपत्रक', 'Budget'], ['मंजूर तपशील प्रसिद्ध केले जातील', 'Approved details to be published']],
        [['पूर्णत्वाचे वेळापत्रक', 'Completion timeline'], ['अद्याप जाहीर झालेले नाही', 'Not yet announced']],
      ] as [Pair, Pair][]).map(([a, b]) => <div key={a[1]}><dt>{tr(a)}</dt><dd>{tr(b)}</dd></div>)}</dl></section>
    </>}

    {kind === 'progress' && <section className="wrap info-section info-progress-layout"><div><p className="eyebrow">{tr(['नियोजित प्रवास', 'Proposed roadmap'])}</p><h2>{tr(['टप्प्याटप्प्याने, जबाबदारीने', 'A considered path forward'])}</h2><p className="info-status-note">{tr(['ही नियोजित टप्प्यांची रूपरेषा आहे; पूर्ण झालेल्या कामाचा अहवाल नाही. पडताळलेली प्रगती आणि तारखा अद्याप प्रकाशित झालेल्या नाहीत.', 'This is a proposed sequence of work, not a completion report. Verified progress and milestone dates have not yet been published.'])}</p><ol className="info-roadmap">{stages.map((s, i) => <li key={s.title[1]}><span className="info-step">0{i + 1}</span><div><h3>{tr(s.title)}</h3><p>{tr(s.body)}</p></div></li>)}</ol></div><aside className="info-progress-aside"><span className="info-tag">{tr(['अधिकृत नोंदी', 'Official records'])}</span><h3>{tr(['प्रगतीसोबत पुरावे', 'Updates with context'])}</h3><p>{tr(['प्रगतीची माहिती प्रसिद्ध करताना दिनांक, कामाचा तपशील आणि संबंधित छायाचित्रे किंवा कागदपत्रे जोडण्याचे उद्दिष्ट आहे.', 'Published updates should include the reporting date, a description of work and relevant photographs or documents.'])}</p><ul><li>{tr(['टप्प्यांची स्थिती आणि पुढील काम', 'Milestone status and next steps'])}</li><li>{tr(['मंजुरी आणि तांत्रिक नोंदी', 'Approvals and technical records'])}</li><li>{tr(['खर्च आणि निधीविषयक माहिती', 'Expenditure and funding information'])}</li></ul><NavLink to="/news" className="link-arrow">{tr(['लेख व घोषणा पहा', 'Visit articles & announcements'])} →</NavLink></aside></section>}

    {kind === 'news' && <section className="wrap info-section"><div className="info-announcement"><span className="info-tag">{tr(['सूचना फलक', 'Noticeboard'])}</span><div><h2>{tr(['अधिकृत घोषणांसाठी हे पान पहा', 'A home for official announcements'])}</h2><p>{tr(['सध्या दिनांकित अधिकृत घोषणा उपलब्ध नाहीत. खालील लेख वारसा आणि सहभागाविषयी माहिती देतात.', 'There are no dated official announcements to display yet. The articles below offer background on heritage and participation.'])}</p></div></div><div className="info-filters" role="group" aria-label={tr(['लेखांचे विषय', 'Article topics'])}>{Object.entries(categories).map(([key, label]) => <button type="button" key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{tr(label)}</button>)}</div><div className="info-cards">{stories.filter(s => filter === 'all' || s.category === filter).map(s => <article className="info-card info-story" key={s.category}><span className="info-tag">{tr(categories[s.category])}</span><h2>{tr(s.title)}</h2><p>{tr(s.intro)}</p><details><summary>{tr(['संपूर्ण लेख वाचा', 'Read the article'])}</summary><p>{tr(s.body)}</p></details></article>)}</div></section>}

    <section className="wrap info-section"><div className="info-closing"><div><p className="eyebrow light">{tr(['एकत्र पुढे जाऊया', 'Move forward together'])}</p><h2>{tr(['वारसा जपूया. प्रेरणा पोहोचवूया.', 'Preserve a legacy. Share its inspiration.'])}</h2><p>{tr(['संकल्पना समजून घ्या, लेख वाचा आणि या प्रवासाशी जोडलेले रहा.', 'Explore the vision, read the stories and stay connected to the journey.'])}</p></div><NavLink className="btn ghost" to={kind === 'news' ? '/about' : '/news'}>{tr(kind === 'news' ? ['आमच्याबद्दल जाणून घ्या', 'Get to know us'] : ['लेख व घोषणा', 'Articles & announcements'])} →</NavLink></div></section>
  </main>;
}
