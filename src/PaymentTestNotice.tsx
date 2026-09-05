export function PaymentTestNotice({ lang }: { lang: 'mr' | 'en' }) {
  return <aside className="card" role="note" style={{ padding: 20, marginBottom: 20 }}>
    <strong>{lang === 'mr' ? 'Razorpay चाचणी मोड' : 'Razorpay test mode'}</strong>
    <p>{lang === 'mr'
      ? 'Razorpay चाचणी मोडमध्ये UPI पर्याय उपलब्ध असेलच असे नाही. UPI दिसत नसल्यास उपलब्ध असलेली कार्ड किंवा नेटबँकिंग चाचणी पद्धत वापरा.'
      : 'UPI may not be available in Razorpay test checkout. If it is missing, use an available card or netbanking test method.'}</p>
    <p>{lang === 'mr'
      ? 'UPI ID चा पर्याय उपलब्ध असल्यासच success@razorpay किंवा failure@razorpay वापरता येईल. UPI उपलब्धतेसाठी Razorpay Dashboard मधील Account & Settings → Payment Methods तपासा किंवा Razorpay Support शी संपर्क करा.'
      : 'Use success@razorpay or failure@razorpay only if UPI ID entry is available. Check Account & Settings → Payment Methods in Razorpay Dashboard, or contact Razorpay Support about UPI availability.'}</p>
    <a href="https://razorpay.com/docs/payments/payment-methods/upi/faqs/" target="_blank" rel="noreferrer">{lang === 'mr' ? 'Razorpay UPI माहिती' : 'Razorpay UPI guidance'}</a>
  </aside>;
}
