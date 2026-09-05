# Shivaji Maharaj Sanstha Portal

A responsive React + TypeScript frontend prototype for a bilingual (Marathi/English) crowdfunding and information portal.

## Run locally

```bash
npm install
npm run dev
```

## Included routes

- `/` — heritage-led public homepage and live fundraising progress
- `/donate` — donor amount, information, anonymous choice and gateway handoff UI
- `/project` — statue project overview and milestones
- `/transparency` — fundraising and utilization dashboard
- `/about`, `/activities` — public-content placeholders ready for the CMS API

## Backend integration

The contract and mock implementation are in `src/services/api.ts`. Swap `MockSansthaApi` for `HttpSansthaApi` when the Spring Boot API is available, and set `VITE_API_BASE_URL` if it is not served at `/api`.

Payment is intentionally not simulated: the UI creates an order but only a server-side gateway webhook can mark it as `SUCCESS` and issue a receipt.

## Razorpay UPI testing

Local development requires a Razorpay test key by default. Copy `.env.example` to `.env.local` to also enforce test mode in a build, then restart Vite after changing environment settings.

Configure the separate payment backend with the test key ID and matching test secret from your Razorpay dashboard. `/checkout/config` must return that public key ID, and `/orders` must create orders using the same credentials. Keep the secret on the backend; never put it in a `VITE_` variable. This repository contains only the frontend and cannot enable payment methods on your Razorpay account.

On `/donate`, complete the form and open checkout. If UPI ID entry is available, enter `success@razorpay` to test success or `failure@razorpay` to test failure. Real UPI app/Intent and QR payments require live-mode testing. If UPI is absent, confirm method availability with Razorpay; frontend settings cannot override account restrictions. Use another supported sandbox payment method in the meantime.

Successful checkout still calls `/payments/verify`; the backend must verify the signature before accepting payment. Test failures must not create successful donations or receipts. Close checkout to retry from the form.

For live payments, explicitly set `VITE_RAZORPAY_TEST_MODE=false` and configure matching live credentials on the backend. Setting this flag alone does not switch Razorpay modes.

Reference: [Razorpay test UPI details](https://razorpay.com/docs/payments/payments/test-upi-details/) and [Standard Checkout integration](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/).

## Development admin account

Username: `Prashant`  
Password: `admin`

## Image attribution

The welcome-page photo, `src/assets/shivaji-raigad.jpg`, is **"Chhatrapati Shivaji statue Raigad"** by Nitin Darekar, used under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chhatrapati_Shivaji_statue_Raigad.jpg).
