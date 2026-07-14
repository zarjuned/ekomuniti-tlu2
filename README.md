# E-Komuniti Taman Langat Utama 2 — Prototype

A Vue 3 + Vite prototype of the community financial management web application for Taman Langat Utama 2.

## Stack
- Vue 3 (Composition API, `<script setup>`)
- Vite 6
- Pinia (state management)
- Vue Router 4
- vue-i18n (BM/EN)
- Chart.js + vue-chartjs
- Vanilla CSS (dark theme, glassmorphism)
- Supabase JS client (stubbed with mock data in prototype)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo Accounts

- **Admin**: email `admin@tlu2.my` / password `admin123` → any admin page
- **Resident**: House `No. 1` / PIN `1234` → resident portal

## Pages

| Route | Description |
|:------|:------------|
| `/login` | Admin email login |
| `/resident` | Resident PIN login |
| `/dashboard` | Admin dashboard (financial KPIs) |
| `/houses` | 64-house grid |
| `/payments` | Payment approval queue |
| `/expenses` | Expense ledger + budget tracker |
| `/penubuhan` | Association setup cost tracker |
| `/reports` | Financial report generator |
| `/attendance` | Meeting attendance |
| `/settings` | Admin settings + audit log |
| `/resident/dashboard` | Resident payment view |

## Project Structure

```
src/
├── main.js                    # entry
├── App.vue                    # root shell
├── router/index.js            # routes + guards
├── stores/                    # Pinia stores (mock data)
├── views/                     # page components
├── components/                # layout, dashboard, payments, etc.
├── composables/               # useAuth, useWhatsApp, etc.
├── i18n/                      # bm/en translations
├── lib/                       # constants, utils, supabase client
└── assets/styles/             # design tokens + global CSS
```

## Notes

This prototype uses local mock data — no Supabase connection required. To run against a real Supabase project, fill `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then remove the mock-mode flag in `src/lib/supabase.js`.
