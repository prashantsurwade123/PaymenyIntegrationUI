import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    const siteUrl = env.VITE_SITE_URL ? new URL(env.VITE_SITE_URL).origin : '';
    return {
        plugins: [react(), {
                name: 'campaign-social-metadata',
                transformIndexHtml(html) { return html.replaceAll('__SITE_URL__', siteUrl); },
            }, VitePWA({
                registerType: 'prompt',
                injectRegister: false,
                includeAssets: ['icons/*.png', 'icons/*.svg', 'social-preview.jpg', 'offline.html'],
                manifest: {
                    id: '/', name: 'श्री शिव प्रतिष्ठान — Shivaji Maharaj Statue', short_name: 'Shiv Pratishthan',
                    description: 'Explore the Chhatrapati Shivaji Maharaj memorial initiative and participate in its journey.',
                    start_url: '/', scope: '/', display: 'standalone', background_color: '#FBF7F0', theme_color: '#D85B0B', lang: 'mr',
                    icons: [
                        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                        { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                    ],
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,png,jpg,svg,webp,woff,woff2}'],
                    globIgnores: ['**/admin-*.{js,css}', '**/public-login-link-*.js'],
                    cleanupOutdatedCaches: true,
                    skipWaiting: false,
                    clientsClaim: false,
                    // Only public informational routes receive the static offline shell.
                    // No runtime caches: API, Razorpay, auth and POST requests go to the network.
                    navigateFallback: '/index.html',
                    navigateFallbackAllowlist: [/^\/(?:about|project|progress|news|transparency|activities)?\/?$/],
                    navigateFallbackDenylist: [/^\/api(?:\/|$)/, /^\/admin(?:\/|$)/, /^\/donate(?:\/|$)/, /^\/payments?(?:\/|$)/, /^\/checkout(?:\/|$)/],
                    runtimeCaching: [],
                },
            })],
    };
});
