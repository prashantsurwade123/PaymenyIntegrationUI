import { PageErrorBoundary } from './components/PageErrorBoundary';
import { SiteFooter } from './components/SiteFooter';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { DonationDetails, type PaymentConfirmation } from './components/DonationDetails';
import Home from './pages/HomePage';
import { SiteHeader as Header } from './components/SiteHeader';
import { CampaignProvider, MobileDonationBar } from './components/Campaign';
import { ShareCampaign } from './components/ShareCampaign';
import { AppExperience } from './components/AppExperience';
const InformationPage = React.lazy(() => import('./InformationPages').then(module => ({ default: module.InformationPage })));
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './styles.css';
import './header-actions.css';
import './information-pages.css';
import './responsive.css';
import './home-reference.css';

type Lang = 'mr' | 'en';
const copy = {
  mr: { home:'मुख्यपृष्ठ', about:'आमच्याबद्दल', project:'भव्य पुतळा प्रकल्प', projectProgress:'प्रकल्प प्रगती', newsCurrent:'बातम्या व चालू घडामोडी', donate:'देणगी', transparency:'पारदर्शकता', activities:'उपक्रम', contact:'संपर्क', donateNow:'देणगी द्या', hero:'छत्रपती शिवाजी महाराजांचा भव्य पुतळा', sub:'आपल्या सहभागातून एक ऐतिहासिक संकल्पना साकारूया!', learn:'प्रकल्पाबद्दल जाणून घ्या', raised:'आतापर्यंत जमा', target:'एकूण अंदाजित उद्दिष्ट', donors:'सहभागी देणगीदार', remain:'उर्वरित रक्कम', vision:'इतिहासाचा वारसा, उद्याची प्रेरणा.', why:'हा केवळ पुतळा नाही; स्वराज्याच्या मूल्यांचा प्रेरणादायी वारसा आहे.', progress:'प्रकल्पाची प्रगती', view:'संपूर्ण माहिती पहा', records:'पारदर्शक नोंदी', name:'पूर्ण नाव', mobile:'मोबाईल क्रमांक', email:'ई-मेल', amount:'देणगी रक्कम', anonymous:'अनामिक देणगी', continue:'भरणा करण्यासाठी पुढे जा', formTitle:'या ऐतिहासिक कार्यात सहभागी व्हा', payment:'पेमेंट गेटवेवर पुढे जा', status:'पेमेंट स्टेटस', coming:'लवकरच उपलब्ध' },
  en: { home:'Home', about:'About Us', project:'Statue Project', projectProgress:'Project Progress', newsCurrent:'News & Current Affairs', donate:'Donate', transparency:'Transparency', activities:'Activities', contact:'Contact', donateNow:'Donate Now', hero:'A Grand Statue of Chhatrapati Shivaji Maharaj', sub:'Let us build an historic vision through your participation.', learn:'Explore the project', raised:'Raised so far', target:'Fundraising target', donors:'Contributing citizens', remain:'Amount remaining', vision:'Heritage for today. Inspiration for tomorrow.', why:'More than a monument: an enduring source of inspiration rooted in the values of Swarajya.', progress:'Project progress', view:'View full project details', records:'Transparent records', name:'Full name', mobile:'Mobile number', email:'Email address', amount:'Donation amount', anonymous:'Make this donation anonymous', continue:'Proceed to Payment', formTitle:'Join this historic undertaking', payment:'Continue to payment gateway', status:'Payment status', coming:'Coming soon' }
};
const fmt=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const paymentApiBase = (import.meta.env.VITE_PAYMENT_API_BASE_URL ?? 'http://localhost:8082/api/v1').replace(/\/$/, '');
const requireTestPayments = (import.meta.env.VITE_RAZORPAY_TEST_MODE ?? String(import.meta.env.DEV)) === 'true';

async function paymentApiError(response: Response, fallback: string) {
  return new Error(response.status === 429 ? 'Please wait a moment before trying again.' : `${fallback}. Please try again. If money was debited, contact the Sanstha before paying again.`);
}

function Donate({lang}:{lang:Lang}) { const t=copy[lang]; const [amount,setAmount]=useState(1000); const [processing,setProcessing]=useState(false); const [success,setSuccess]=useState(false); const [error,setError]=useState<string|null>(null); const [confirmation,setConfirmation]=useState<PaymentConfirmation|null>(null);
 return <main className="page donate-page"><section className="info-hero"><div className="wrap"><p className="eyebrow light">{lang==='mr'?'आपले योगदान, आपला अभिमान':'Your contribution, a shared legacy'}</p><h1>{t.formTitle}</h1><p className="info-intro">{lang==='mr'?'ही देणगी सुरक्षित पेमेंट गेटवेद्वारे पूर्ण केली जाईल.':'You will be securely redirected to an approved payment gateway.'}</p><div className="info-hero-rule" aria-hidden="true"/></div></section>{success?<div className="success card"><span>✓</span><h2>{lang==='mr'?'देणगी पूर्ण झाली':'Donation successful'}</h2><p>{lang==='mr'?'पावती लवकरच उपलब्ध होईल.':'Your receipt will be available once the payment is verified.'}</p><>{confirmation && <DonationDetails lang={lang} confirmation={confirmation}/>}</><ShareCampaign lang={lang}/><NavLink className="btn primary" to="/">{lang === 'mr' ? 'मुख्यपृष्ठावर जा' : 'Back to Home'}</NavLink></div>:<form name="donationForm" className="donation-form card" aria-busy={processing} onSubmit={async (e)=>{
    e.preventDefault();
    setError(null);
    setProcessing(true);
    try{
      if (!navigator.onLine) throw new Error("An internet connection is required to make a payment.");
      if (!Number.isFinite(amount) || amount < 1 || !Number.isSafeInteger(Math.round(amount * 100))) throw new Error("Enter a valid donation amount.");
      const form = e.currentTarget as HTMLFormElement;
      const fd = new FormData(form);
      const name = (fd.get('name')||'').toString();
      const email = (fd.get('email')||'').toString();
      const mobile = (fd.get('mobile')||'').toString();
      const city = (fd.get('city')||'').toString();
      const country = (fd.get('country')||'').toString();
      const anonymous = fd.get('anonymous')==="on";

      // Validate the backend key before creating an order. Both must use the same account/mode.
      const cfgResp = await fetch(`${paymentApiBase}/checkout/config`);
      if(!cfgResp.ok) throw await paymentApiError(cfgResp, 'Failed to fetch checkout config');
      const cfg = await cfgResp.json();
      const key = cfg.key || cfg.keyId || cfg.key_id || cfg.razorpayKey || cfg.razorpay_key || '';
      if(typeof key !== 'string' || !/^rzp_(test|live)_.+/.test(key)) {
        throw new Error('The payment backend must return a valid Razorpay key ID.');
      }
      if(requireTestPayments && !key.startsWith('rzp_test_')) {
        throw new Error('Test mode requires the backend to use Razorpay test keys for checkout and order creation.');
      }

      // Create order on backend
      const amountInPaise = Math.round(amount * 100);
      const receipt = `donation_${Date.now()}`;
      const orderResp = await fetch(`${paymentApiBase}/orders`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes: { name, email, mobile, city, country, anonymous: String(anonymous) }
        })
      });
      if(!orderResp.ok) throw await paymentApiError(orderResp, 'Failed to create order');
      const order = await orderResp.json();

      const orderId = order.id || order.orderId;
      if(typeof orderId !== 'string' || !orderId.startsWith('order_')) {
        throw new Error('The payment backend did not return a valid Razorpay order ID.');
      }

      // Load Razorpay script if needed
      if(!(window as any).Razorpay){
        await new Promise((resolve,reject)=>{
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = resolve; s.onerror = ()=>{ s.remove(); reject(new Error('Unable to load Razorpay checkout. Check your connection and try again.')); }; document.head.appendChild(s);
        });
      }

      const options = {
        key,
        amount: order.amount || amountInPaise,
        currency: order.currency || 'INR',
        name: 'Shivaji Maharaj Sanstha',
        description: 'Donation',
        order_id: orderId,
        prefill: { name, email, contact: mobile },
        handler: async (razorResp:any) => {
          try{
            // Verify payment with backend
            const verifyResp = await fetch(`${paymentApiBase}/payments/verify`, {
              method: 'POST', headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                razorpay_order_id: razorResp.razorpay_order_id,
                razorpay_payment_id: razorResp.razorpay_payment_id,
                razorpay_signature: razorResp.razorpay_signature
              })
            });
            if(!verifyResp.ok) throw await paymentApiError(verifyResp, 'Payment verification failed');
            setConfirmation({ paymentId: razorResp.razorpay_payment_id, amount: amountInPaise / 100, date: new Date().toISOString() });
            setSuccess(true);
          }catch(ve){
            setError((ve as Error).message||'Verification failed');
          }finally{ setProcessing(false); }
        },
        modal: { ondismiss: ()=>{ setProcessing(false); } }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: { error?: { description?: string } }) => {
        setError(response.error?.description || 'Payment failed. Retry in checkout or close it to try again.');
      });
      rzp.open();
    }catch(err){ setError((err as Error).message||'Unexpected error'); setProcessing(false); }
  }}><div className="donation-frequency"><strong>{lang === "mr" ? "\u090f\u0915\u0930\u0915\u092e\u0940 \u0926\u0947\u0923\u0917\u0940" : "One-time donation"}</strong><small>{lang === "mr" ? "\u092e\u093e\u0938\u093f\u0915 \u0926\u0947\u0923\u0917\u0940 \u0938\u0927\u094d\u092f\u093e \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u093e\u0939\u0940." : "Monthly donations are not currently available."}</small></div><p className="form-guidance">{lang === 'mr' ? 'अनामिक देणगीचा पर्याय वगळता सर्व माहिती आवश्यक आहे.' : 'All details are required except the anonymous donation option.'}</p><div><label htmlFor="donation-amount">{t.amount}</label><div className="amounts">{[500,1000,5000,10000].map(v=><button type="button" aria-pressed={amount===v} className={amount===v?'selected':''} onClick={()=>setAmount(v)} key={v}>{fmt(v)}</button>)}</div><input id="donation-amount" name="amount" aria-label={t.amount} type="number" inputMode="decimal" step="0.01" required min="1" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></div><div className="fields"><label>{lang === "mr" ? "\u0926\u0947\u0936" : "Country"}<input name="country" autoComplete="country-name" required defaultValue="India"/></label><label>{t.name}<input name="name" autoComplete="name" required placeholder={lang==='mr'?'तुमचे पूर्ण नाव':'Your full name'}/></label><label>{t.mobile}<input name="mobile" autoComplete="tel" required type="tel" inputMode="numeric" placeholder="+91 00000 00000"/></label><label>{t.email}<input name="email" autoComplete="email" required type="email" placeholder="name@example.com"/></label><label>{lang==='mr'?'शहर':'City'}<input name="city" autoComplete="address-level2" required placeholder={lang==='mr'?'तुमचे शहर':'Your city'}/></label></div><label className="check"><input name="anonymous" type="checkbox"/> {t.anonymous}</label><p className="secure">⌘ {lang==='mr'?'वास्तविक पेमेंट प्रक्रिया बॅकएंड व गेटवेद्वारे सत्यापित केली जाईल.':'Payment status is verified by the backend and payment gateway.'}</p><div style={{display:'flex',gap:12,alignItems:'center'}}><button className="btn primary submit" disabled={processing}>{processing? 'Processing…' : t.continue + ' →'}</button>{error && <span role="alert" className="form-error">{error}</span>}</div></form>}</main> }
function Transparency({lang}:{lang:Lang}) {const t=copy[lang];return <main className="page"><section className="info-hero"><div className="wrap"><p className="eyebrow light">{t.records}</p><h1>{lang==='mr'?'विश्वासार्ह आणि स्पष्ट माहिती':'Every rupee, clearly accounted for'}</h1><p className="info-intro">{lang==='mr'?'अंतिम आकडेवारी आणि अहवाल बॅकएंड API मधून प्रकाशित होतील.':'Final figures and reports will be published through the backend API.'}</p><div className="info-hero-rule" aria-hidden="true"/></div></section><section className="wrap dashboard transparency-content"><div className="chart card"><h3>Fund collection</h3><div className="ring"><b>37.5%</b></div><p>{fmt(37500000)} of {fmt(100000000)}</p></div><div className="chart card"><h3>Fund utilization</h3><div className="bars">{[60,42,74,30,52].map((v,i)=><i key={i} style={{height:`${v}%`}}/>)}</div><small>Jan &nbsp; Feb &nbsp; Mar &nbsp; Apr &nbsp; May</small></div><div className="expense card"><h3>Utilization categories</h3>{[['Construction',42],['Statue design',23],['Site & land',18],['Administration',7]].map(([a,b])=><p key={String(a)}><span>{a}</span><b>{b}%</b></p>)}</div></section><section className="wrap report-list"><h2>{lang==='mr'?'अहवाल आणि कागदपत्रे':'Reports & documents'}</h2>{['Annual Report 2025–26','Approved Project Estimate','Fund Utilization Report'].map(x=><div className="report-unavailable" key={x}>▣ {x}<span>{lang === 'mr' ? 'प्रकाशित झाल्यावर उपलब्ध' : 'Available once published'}</span></div>)}</section></main>}
function Simple({lang,kind}:{lang:Lang;kind:string}) {const t=copy[lang];const title=kind==='about'?t.about:kind==='activities'?t.activities:t.contact;const isAbout=kind==='about';return <main className="page"><div className="page-title"><p className="eyebrow">Shivaji Maharaj Sanstha</p><h1>{title}</h1><p>{isAbout?(lang==='mr'?'स्वराज्याच्या मूल्यांनी प्रेरित समाजाभिमुख संस्था.':'A community-driven organisation inspired by the values of Swarajya.'):t.coming}</p></div><section className="wrap narrative">{isAbout?<>{<h2>{lang==='mr'?'आमचे उद्दिष्ट':'Our purpose'}</h2>}<p>{lang==='mr'?<>श्री शिव प्रतिष्ठान ही <strong>छत्रपती शिवाजी महाराजांचे विचार, मूल्ये आणि महान वारसा जतन व पुढील पिढ्यांपर्यंत पोहोचवण्याच्या उद्देशाने कार्य करणारी समाजाभिमुख संस्था</strong> आहे. छत्रपती शिवाजी महाराजांनी दिलेली स्वराज्याची संकल्पना, शौर्य, न्याय, सुशासन, स्वाभिमान आणि सामाजिक बांधिलकी या मूल्यांपासून प्रेरणा घेऊन संस्था विविध सामाजिक, सांस्कृतिक आणि जनजागृतीपर उपक्रम राबविण्यासाठी कार्यरत आहे.</>:<>Shivaji Maharaj Sanstha is a community-driven organization dedicated to preserving and promoting the ideals, values, and legacy of <strong>Chhatrapati Shivaji Maharaj</strong>. Inspired by his vision of Swarajya, courage, justice, good governance, and social responsibility, the Sanstha works towards bringing people together for meaningful cultural and social initiatives.</>}</p></>:<><h2>{kind==='activities'?'Culture, education and community participation':'Get in touch with the Sanstha'}</h2><p>{lang==='mr'?'संस्थेची अधिकृत माहिती लवकरच येथे उपलब्ध होईल.':'Official information from the Sanstha will be available here shortly.'}</p></>}</section></main>}
function App(){const [lang,setLang]=useState<Lang>(localStorage.getItem('lang') === 'en' ? 'en' : 'mr');const change=(l:Lang)=>{localStorage.setItem('lang',l);setLang(l)};return <><Header lang={lang} setLang={change}/><div id="page-content" tabIndex={-1}><PageErrorBoundary lang={lang}><React.Suspense fallback={<LoadingSkeleton label={lang === 'mr' ? 'पान उघडत आहे…' : 'Loading the page…'}/>}><Routes><Route path="/" element={<Home lang={lang}/>}/><Route path="/donate" element={<Donate lang={lang}/>}/><Route path="/project" element={<InformationPage lang={lang} kind="project"/>}/><Route path="/progress" element={<InformationPage lang={lang} kind="progress"/>}/><Route path="/news" element={<InformationPage lang={lang} kind="news"/>}/><Route path="/transparency" element={<Transparency lang={lang}/>}/><Route path="/about" element={<InformationPage lang={lang} kind="about"/>}/><Route path="/activities" element={<Simple lang={lang} kind="activities"/>}/><Route path="*" element={<Home lang={lang}/>}/></Routes></React.Suspense></PageErrorBoundary></div><SiteFooter lang={lang}/><MobileDonationBar lang={lang}/><AppExperience lang={lang}/></>};
createRoot(document.getElementById('root')!).render(<BrowserRouter><CampaignProvider><App/></CampaignProvider></BrowserRouter>);
