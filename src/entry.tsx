export {};
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/noto-serif-devanagari/devanagari-500.css';
import '@fontsource/noto-serif-devanagari/devanagari-600.css';
import '@fontsource/noto-serif-devanagari/devanagari-700.css';

if (location.pathname.startsWith('/admin')) {
  await import('./admin');
} else {
  await import('./main');

}
