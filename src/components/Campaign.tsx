import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { sansthaApi, type FundraisingSummary } from '../services/api';

export type Lang = 'mr' | 'en';
export const money = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const CampaignContext = createContext<{ summary: FundraisingSummary | null; loading: boolean; error: boolean; retry: () => void }>({ summary: null, loading: true, error: false, retry: () => {} });
export function CampaignProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<FundraisingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(false);
    sansthaApi.getFundraisingSummary().then(value => {
      if (active) setSummary(value);
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  return <CampaignContext.Provider value={{ summary, loading, error, retry: () => setAttempt(n => n + 1) }}>{children}</CampaignContext.Provider>;
}
export const useCampaign = () => useContext(CampaignContext);

export function FundraisingProgress({ lang }: { lang: Lang }) {
  const { summary, loading, error, retry } = useCampaign();
  const mr = lang === 'mr';
  const percentage = summary && summary.target > 0 ? Math.min(100, Math.max(0, summary.raised / summary.target * 100)) : 0;
  return <section className="campaign-progress wrap" aria-labelledby="fundraising-title">
    <div className="campaign-fund-card" aria-busy={loading}>
      <div className="campaign-fund-top"><div><h2 id="fundraising-title" className="eyebrow">{mr ? 'आतापर्यंत जमा' : 'Raised so far'}</h2><strong className={loading ? 'campaign-amount skeleton' : 'campaign-amount'}>{summary ? money(summary.raised) : loading ? '···' : '—'}</strong></div>{summary && <span className="campaign-percent"><b>{percentage.toFixed(1)}<small>%</small></b><span>{mr ? 'पूर्ण' : 'completed'}</span></span>}</div>
      {error ? <p role="alert">{mr ? 'निधीची माहिती मिळाली नाही.' : 'Fundraising information could not be loaded.'} <button type="button" onClick={retry}>{mr ? 'पुन्हा प्रयत्न करा' : 'Try again'}</button></p> : <>
        <div className="campaign-track" role="progressbar" aria-label={mr ? 'निधी संकलन' : 'Fundraising progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary ? percentage : undefined}><span style={{ width: `${percentage}%` }}/></div>
        <dl className="campaign-metrics"><div><dt>{mr ? 'निधी संकलनाचे उद्दिष्ट' : 'Fundraising target'}</dt><dd>{summary ? money(summary.target) : '—'}</dd></div><div><dt>{mr ? 'उर्वरित रक्कम' : 'Amount remaining'}</dt><dd>{summary ? money(Math.max(0, summary.target - summary.raised)) : '—'}</dd></div><div><dt>{mr ? 'सहभागी नागरिक' : 'Contributing citizens'}</dt><dd>{summary ? new Intl.NumberFormat('en-IN').format(summary.donorCount) : '—'}</dd></div></dl>
      </>}
      <NavLink className="btn primary campaign-donate" to="/donate">{mr ? 'देणगी द्या' : 'Donate Now'} <span aria-hidden="true">→</span></NavLink>
    </div>
  </section>;
}

export function MobileDonationBar({ lang }: { lang: Lang }) {
  const { pathname } = useLocation();
  const { summary } = useCampaign();
  const hidden = pathname.startsWith('/donate') || pathname.startsWith('/admin');
  useEffect(() => { document.body.classList.toggle('has-donation-bar', !hidden); return () => document.body.classList.remove('has-donation-bar'); }, [hidden]);
  if (hidden) return null;
  const mr = lang === 'mr';
  const percent = summary && summary.target > 0 ? Math.min(100, summary.raised / summary.target * 100).toFixed(1) : null;
  return <aside className="mobile-donation-bar" aria-label={mr ? 'देणगीसाठी झटपट दुवा' : 'Quick donation'}><div><strong>{summary ? money(summary.raised) : mr ? 'आपला सहभाग महत्त्वाचा' : 'Be part of the vision'}</strong><small>{percent ? `${percent}% ${mr ? 'उद्दिष्ट पूर्ण' : 'of our goal'}` : mr ? 'श्री शिव प्रतिष्ठान' : 'Shri Shiv Pratishthan'}</small></div><NavLink to="/donate" className="btn primary"><span aria-hidden="true">♥</span> {mr ? 'देणगी द्या' : 'Donate Now'}</NavLink></aside>;
}
