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

## Development admin account

Username: `Prashant`  
Password: `admin`

## Image attribution

The welcome-page photo, `src/assets/shivaji-raigad.jpg`, is **"Chhatrapati Shivaji statue Raigad"** by Nitin Darekar, used under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chhatrapati_Shivaji_statue_Raigad.jpg).
