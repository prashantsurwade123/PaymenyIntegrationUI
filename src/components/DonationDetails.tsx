import type { Lang } from './Campaign';
import { money } from './Campaign';
export type PaymentConfirmation = { paymentId: string; amount: number; date: string };
export function DonationDetails({ lang, confirmation }: { lang: Lang; confirmation: PaymentConfirmation }) {
  const mr = lang === 'mr';
  return <div className="donation-confirmation"><p>{mr ? `${money(confirmation.amount)} च्या आपल्या योगदानाबद्दल धन्यवाद.` : `Thank you for your contribution of ${money(confirmation.amount)}.`}</p><dl><div><dt>{mr ? 'पेमेंट संदर्भ' : 'Payment reference'}</dt><dd>{confirmation.paymentId}</dd></div><div><dt>{mr ? 'पेमेंटची वेळ' : 'Payment recorded at'}</dt><dd>{new Intl.DateTimeFormat(mr ? 'mr-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(confirmation.date))}</dd></div></dl><p>{mr ? 'अधिकृत पावती उपलब्ध झाल्यानंतर संस्थेकडून दिली जाईल.' : 'The official receipt will be provided by the Sansthan when available.'}</p></div>;
}
