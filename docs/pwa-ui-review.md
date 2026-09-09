# PWA interface review

The existing React 19 / Vite application remains one web/PWA codebase. No native wrapper or new UI dependencies were added. The Spring Boot request paths, Razorpay order and verification payloads, and existing login behavior are preserved.

## Improvements

- Consolidated the homepage composition stylesheet; replaced tiny mobile metrics and squeezed vision cards with readable layouts.
- Added shared color, spacing and radius tokens, accessible saffron controls, focus states and reduced-motion support.
- Retained the compact hero, responsive drawer, gallery, project timeline and mobile donation bar.
- Added footer navigation using existing routes, loading placeholders and a recoverable page error screen.
- Improved donation labels, required-field guidance, error presentation, confirmation navigation and sharing feedback. Backend response bodies are not shown to visitors.
- Marked unpublished reports as unavailable instead of presenting non-working download links.
- Added bilingual route descriptions and retained titles, canonical URLs, social metadata and the PWA manifest.
- Lazy-loaded the below-fold video. Existing service-worker exclusions and delayed install prompts remain in place.

## Validation

Run `npm run build` followed by `npm test`. Browser coverage includes public routes in both languages at 320, 360, 375, 390, 412, 430, 768, 1024, 1366 and 1440 pixels; drawer and login; gallery; mocked payment order/verification; sharing fallback; offline caching; install engagement/dismissal; Marathi metadata; and route-load recovery.

Screenshots are written to the ignored `artifacts/` directory. Browser mocks validate frontend behavior, not live backend availability or actual bank transactions.

## Deployment inputs and device checks

- Set `VITE_SITE_URL` to the public HTTPS origin and `VITE_PAYMENT_API_BASE_URL` to the deployed payment API before building for production.
- Existing fundraising figures come from the existing mock API; existing administrator access is a development login. This UI work does not turn those into production backend integrations.
- Official contact details, policies and receipt download endpoints were not supplied. No contact details, policy links or receipts were invented.
- Verify installation on actual Android Chrome and iOS Safari, safe areas, virtual keyboards and live/test gateway handoff on devices before release.
- Client-side route metadata is updated during navigation. Social crawlers that do not execute JavaScript receive the existing index metadata; route-specific crawler previews would need prerendering or server rendering.
- Existing PWA users may need to accept the available update to see the new assets. Updates are not forced during checkout.
