import { Component, type ReactNode } from 'react';

export class PageErrorBoundary extends Component<{ children: ReactNode; lang: 'mr' | 'en' }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    const mr = this.props.lang === 'mr';
    return <main className="page-error wrap" role="alert"><h1>{mr ? 'पान उघडता आले नाही' : 'This page could not be loaded'}</h1><p>{mr ? 'इंटरनेट जोडणी तपासा आणि पुन्हा प्रयत्न करा.' : 'Check your connection and try loading the page again.'}</p><button className="btn primary" onClick={() => window.location.reload()}>{mr ? 'पुन्हा प्रयत्न करा' : 'Try again'}</button><a className="link-arrow" href="/">{mr ? 'मुख्यपृष्ठावर जा' : 'Back to Home'} →</a></main>;
  }
}
