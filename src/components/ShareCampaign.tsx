import { useState } from 'react';
import type { Lang } from './Campaign';
export function ShareCampaign({ lang }: { lang: Lang }) {
  const [message, setMessage] = useState('');
  const [manual, setManual] = useState(false);
  const url = `${window.location.origin}/`;
  const mr = lang === 'mr';
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'श्री शिव प्रतिष्ठान', text: mr ? 'छत्रपती शिवाजी महाराज स्मारकाचा संकल्प जाणून घ्या.' : 'Explore the Chhatrapati Shivaji Maharaj memorial vision.', url });
      else { await navigator.clipboard.writeText(url); setMessage(mr ? 'दुवा कॉपी झाला.' : 'Campaign link copied.'); }
    } catch (error) { if ((error as Error).name !== 'AbortError') setManual(true); }
  };
  return <div className="share-campaign"><button type="button" className="btn secondary" onClick={share}>{mr ? 'प्रकल्पाचा दुवा शेअर करा' : 'Share Campaign'} ↗</button><span role="status">{message}</span>{manual && <label>{mr ? 'हा दुवा कॉपी करा' : 'Copy this link'}<input readOnly value={url} onFocus={e => e.currentTarget.select()}/></label>}</div>;
}
