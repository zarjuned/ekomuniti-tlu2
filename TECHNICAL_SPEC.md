# Technical Specification: E-Komuniti Taman Langat Utama 2
**Version 1.0 | July 2026**

---

## 1. Tech Stack Overview

| Layer | Technology | Version | Purpose |
|:------|:-----------|:--------|:--------|
| Build Tool | Vite | 6.x | Fast dev server, optimized production builds |
| Framework | Vue 3 | 3.5+ | UI framework (Composition API, `<script setup>`) |
| State Management | Pinia | 3.x | Centralized reactive state stores |
| Routing | Vue Router | 4.x | SPA client-side routing with guards |
| Internationalization | vue-i18n | 10.x | BM (default) / EN language toggle |
| Charts | Chart.js + vue-chartjs | 4.x / 5.x | Dashboard visualizations |
| Backend | Supabase JS Client | 2.x | Database, Auth, Storage, Realtime |
| Auth | Supabase Auth | — | Email/password (admin), custom PIN (resident) |
| PWA | vite-plugin-pwa | 0.20+ | Service worker, manifest, offline support |
| Icons | Lucide Vue Next | latest | Clean, consistent icon set |
| CSS | Vanilla CSS | — | Custom properties, glassmorphism, dark theme |
| PDF Export | html2pdf.js | 0.10+ | AGM report generation (A4 format) |
| Image Compression | browser-image-compression | 2.x | Receipt upload compression (~50KB target) |
| Utilities | date-fns | 3.x | Date formatting and manipulation |

---

## 2. Project Folder Structure

```
ekomuniti-taman-langat-utama-2/
├── public/
│   ├── favicon.svg
│   └── icons/
│       ├── icon-192x192.png
│       ├── icon-512x512.png
│       └── apple-touch-icon.png
│
├── src/
│   ├── main.js                          # App entry point
│   ├── App.vue                          # Root component with layout shell
│   │
│   ├── router/
│   │   └── index.js                     # Route definitions + navigation guards
│   │
│   ├── stores/
│   │   ├── auth.js                      # Auth state (admin login, resident PIN)
│   │   ├── houses.js                    # 64 houses data + payment status
│   │   ├── payments.js                  # Payment CRUD + approval workflow
│   │   ├── expenses.js                  # Expense CRUD + category budgets
│   │   ├── attendance.js                # Meeting attendance records
│   │   ├── penubuhan.js                 # Association setup cost tracking
│   │   ├── reports.js                   # Report generation logic
│   │   └── settings.js                  # App configuration (fee, association info)
│   │
│   ├── views/
│   │   ├── LoginView.vue                # Admin email/password login
│   │   ├── ResidentPortalView.vue       # Resident house+PIN entry
│   │   ├── DashboardView.vue            # Main admin dashboard
│   │   ├── HousesGridView.vue           # 64-house interactive grid
│   │   ├── PaymentsView.vue             # Payment collection + approval queue
│   │   ├── ExpensesView.vue             # Expense management + budget tracker
│   │   ├── PenubuhanView.vue            # Association setup module
│   │   ├── ReportsView.vue              # Financial reports + export
│   │   ├── AttendanceView.vue           # Meeting attendance + registration
│   │   ├── SettingsView.vue             # Admin settings + audit log
│   │   └── ResidentDashboardView.vue    # Simplified resident payment view
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppSidebar.vue           # Main navigation sidebar
│   │   │   ├── AppHeader.vue            # Top bar with user info + language toggle
│   │   │   ├── AppFooter.vue            # Footer with version info
│   │   │   └── MobileNav.vue            # Bottom navigation for mobile
│   │   │
│   │   ├── dashboard/
│   │   │   ├── BalanceCard.vue           # Total fund balance display
│   │   │   ├── ProgressRing.vue          # X/64 houses paid (SVG radial)
│   │   │   ├── CashflowChart.vue         # Monthly income vs expense bar chart
│   │   │   ├── DefaulterList.vue         # Unpaid houses list + WhatsApp button
│   │   │   ├── BudgetVsActual.vue        # Category budget comparison bars
│   │   │   └── ArrearsCard.vue           # Total outstanding arrears
│   │   │
│   │   ├── payments/
│   │   │   ├── PaymentForm.vue           # Resident payment submission form
│   │   │   ├── PaymentApprovalCard.vue   # Admin approval/rejection card
│   │   │   ├── CashPaymentForm.vue       # Admin cash payment recording
│   │   │   ├── ReceiptViewer.vue         # Receipt image modal viewer
│   │   │   └── DigitalReceipt.vue        # Auto-generated receipt (TLU2-XXXX)
│   │   │
│   │   ├── expenses/
│   │   │   ├── ExpenseForm.vue           # Add/edit expense modal
│   │   │   ├── ExpenseList.vue           # Filterable expense table
│   │   │   ├── CategoryManager.vue       # Manage expense categories + budgets
│   │   │   └── BudgetBar.vue             # Single category budget progress bar
│   │   │
│   │   ├── houses/
│   │   │   ├── HouseCard.vue             # Individual house status card
│   │   │   ├── HouseGrid.vue             # 8×8 grid of all houses
│   │   │   ├── HouseDetail.vue           # Slide-out detail panel (12-month history)
│   │   │   └── HouseStatusBadge.vue      # Paid/Pending/Unpaid badge
│   │   │
│   │   ├── penubuhan/
│   │   │   ├── PhaseTracker.vue          # Sebelum → Semasa → Selepas stepper
│   │   │   ├── SetupCostTable.vue        # Line-item cost tracker
│   │   │   ├── SavingsDisplay.vue        # Digitized vs physical cost comparison
│   │   │   └── PenubuhanSummary.vue      # Budget summary dashboard card
│   │   │
│   │   ├── reports/
│   │   │   ├── AnnualReport.vue          # Penyata Kewangan Tahunan generator
│   │   │   ├── MonthlyReport.vue         # Monthly summary view
│   │   │   ├── DefaulterReport.vue       # Arrears listing
│   │   │   └── CategoryPieChart.vue      # Expense breakdown pie chart
│   │   │
│   │   ├── forms/
│   │   │   ├── AttendanceLog.vue         # Digital attendance check-in
│   │   │   ├── AttendanceCounter.vue     # Live counter + quorum indicator
│   │   │   ├── RegistrationForm.vue      # Member registration (ROS format)
│   │   │   └── PerlembagaanViewer.vue    # PDF viewer for constitution
│   │   │
│   │   └── common/
│   │       ├── BaseModal.vue             # Reusable modal dialog
│   │       ├── BaseToast.vue             # Toast notification system
│   │       ├── BaseBadge.vue             # Status badge component
│   │       ├── BaseCard.vue              # Glass-morphism card wrapper
│   │       ├── StatusDot.vue             # Green/yellow/red status indicator
│   │       ├── SearchBar.vue             # Search input with debounce
│   │       ├── LanguageToggle.vue        # BM/EN switch
│   │       ├── DateRangePicker.vue       # Date range selector for reports
│   │       ├── FileUpload.vue            # Drag-and-drop file upload with preview
│   │       └── EmptyState.vue            # Empty state illustration
│   │
│   ├── composables/
│   │   ├── useSupabase.js               # Supabase client wrapper + error handling
│   │   ├── useAuth.js                   # Login/logout, session, role checking
│   │   ├── useImageCompression.js       # Compress images before upload
│   │   ├── useWhatsApp.js               # Generate & copy WhatsApp reminder messages
│   │   ├── useExport.js                 # CSV and PDF export utilities
│   │   ├── useReceipt.js                # Digital receipt generation (TLU2-XXXX)
│   │   └── useToast.js                  # Toast notification trigger
│   │
│   ├── i18n/
│   │   ├── index.js                     # vue-i18n plugin setup
│   │   ├── bm.json                      # Bahasa Melayu translations
│   │   └── en.json                      # English translations
│   │
│   ├── lib/
│   │   ├── supabase.js                  # Supabase client initialization
│   │   ├── constants.js                 # App-wide constants (HOUSES_TOTAL = 64, etc.)
│   │   └── utils.js                     # Formatting helpers (currency, date, etc.)
│   │
│   └── assets/
│       ├── styles/
│       │   ├── main.css                 # Design tokens + global reset + typography
│       │   ├── components.css           # Shared component styles
│       │   └── animations.css           # Keyframe animations + transitions
│       └── images/
│           └── logo.svg                 # Community logo
│
├── index.html                           # HTML entry point
├── vite.config.js                       # Vite + PWA plugin config
├── package.json                         # Dependencies + scripts
├── .env.example                         # Environment variable template
├── .gitignore                           # Git ignore rules
└── README.md                            # Quick start instructions
```

---

## 3. Environment Variables

```env
# .env.example

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_NAME=E-Komuniti Taman Langat Utama 2
VITE_APP_SHORT_NAME=E-Komuniti TLU2
VITE_DEFAULT_LOCALE=bm
VITE_MONTHLY_FEE=20
VITE_TOTAL_HOUSES=64

# Receipt Configuration
VITE_RECEIPT_PREFIX=TLU2
VITE_MAX_IMAGE_SIZE_KB=50
```

> **Security Note**: The `VITE_SUPABASE_ANON_KEY` is a public key safe to expose in the frontend. All data protection is enforced via Supabase Row Level Security (RLS) policies on the database side.

---

## 4. Design System

### 4.1 Color Palette (Dark Theme)

```css
:root {
  /* Background layers */
  --color-bg-primary: #0a0e1a;          /* Deepest background */
  --color-bg-secondary: #111827;        /* Card/panel background */
  --color-bg-tertiary: #1f2937;         /* Input/hover background */
  --color-bg-elevated: #374151;         /* Elevated elements */

  /* Brand accent */
  --color-accent-primary: #6366f1;      /* Indigo — primary actions */
  --color-accent-secondary: #8b5cf6;    /* Violet — secondary accents */
  --color-accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);

  /* Semantic colors */
  --color-success: #22c55e;             /* Paid / Approved (Green) */
  --color-warning: #f59e0b;             /* Pending / Awaiting (Amber) */
  --color-danger: #ef4444;              /* Unpaid / Rejected (Red) */
  --color-info: #3b82f6;                /* Informational (Blue) */

  /* Text */
  --color-text-primary: #f9fafb;        /* Primary text (white-ish) */
  --color-text-secondary: #9ca3af;      /* Secondary/muted text */
  --color-text-tertiary: #6b7280;       /* Disabled/placeholder text */
  --color-text-inverse: #111827;        /* Text on light backgrounds */

  /* Borders */
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(255, 255, 255, 0.16);
  --color-border-focus: var(--color-accent-primary);

  /* Status dot colors (used in house grid) */
  --color-paid: var(--color-success);
  --color-pending: var(--color-warning);
  --color-unpaid: var(--color-danger);
}
```

### 4.2 Typography

```css
/* Google Font: Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Font sizes (fluid scale) */
  --text-xs: 0.75rem;      /* 12px — badges, labels */
  --text-sm: 0.875rem;     /* 14px — secondary text */
  --text-base: 1rem;       /* 16px — body text */
  --text-lg: 1.125rem;     /* 18px — subheadings */
  --text-xl: 1.25rem;      /* 20px — section titles */
  --text-2xl: 1.5rem;      /* 24px — page titles */
  --text-3xl: 1.875rem;    /* 30px — dashboard numbers */
  --text-4xl: 2.25rem;     /* 36px — hero balance */

  /* Font weights */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### 4.3 Spacing Scale

```css
:root {
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
}
```

### 4.4 Border Radius

```css
:root {
  --radius-sm: 0.375rem;   /* 6px — small buttons, badges */
  --radius-md: 0.5rem;     /* 8px — inputs, small cards */
  --radius-lg: 0.75rem;    /* 12px — cards, panels */
  --radius-xl: 1rem;       /* 16px — modal, large cards */
  --radius-2xl: 1.5rem;    /* 24px — hero cards */
  --radius-full: 9999px;   /* Pill shape — avatars, tags */
}
```

### 4.5 Shadows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4),
               0 2px 4px -2px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4),
               0 4px 6px -4px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5),
               0 8px 10px -6px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);  /* Accent glow */
}
```

### 4.6 Glassmorphism Recipe

```css
.glass-card {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.glass-card:hover {
  background: rgba(17, 24, 39, 0.75);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4.7 Responsive Breakpoints (Mobile-First)

```css
/* Base: 0–374px (small phones) */
/* sm: 375px+ (standard phones) */
/* md: 768px+ (tablets) */
/* lg: 1024px+ (laptops) */
/* xl: 1440px+ (desktops) */

@media (min-width: 375px)  { /* sm  */ }
@media (min-width: 768px)  { /* md  */ }
@media (min-width: 1024px) { /* lg  */ }
@media (min-width: 1440px) { /* xl  */ }
```

**Layout strategy:**
- **Mobile (< 768px)**: Single column, bottom navigation bar, stacked cards.
- **Tablet (768px–1023px)**: 2-column grid, collapsible sidebar.
- **Desktop (1024px+)**: Fixed sidebar (240px) + main content area, 3–4 column dashboard grid.

---

## 5. Authentication Flow

### 5.1 Admin Authentication (Supabase Auth)

```
Admin opens /login
    → Enters email + password
    → Supabase Auth verifies credentials
    → Returns JWT session token
    → App reads `admin_users` table to get role (pengerusi/bendahari/setiausaha/ajk)
    → Stores session in Pinia `authStore`
    → Redirects to /dashboard
```

**Session persistence**: Supabase Auth automatically persists the session in `localStorage`. The app checks for an existing session on startup via `supabase.auth.getSession()`.

### 5.2 Resident Authentication (Custom PIN)

```
Resident opens /resident
    → Enters House Number (dropdown) + 4-digit PIN
    → App queries `houses` table: SELECT * WHERE house_number = X
    → Compares bcrypt hash of entered PIN with stored pin_hash
    → If match: stores { house_id, house_number, role: 'resident' } in Pinia
    → Shows resident dashboard (limited to own house data)
    → If no match: shows error "PIN tidak sah"
```

**Security note**: PIN is hashed with bcrypt before storage. The comparison happens client-side for simplicity on the free tier (no server functions needed), but the RLS policies ensure residents can only read/write their own house's data.

### 5.3 Route Guards

| Route | Access Level | Guard Logic |
|:------|:-------------|:------------|
| `/login` | Public | Redirect to `/dashboard` if already logged in |
| `/resident` | Public | Redirect to `/resident/dashboard` if PIN session exists |
| `/dashboard` | Admin only | Require Supabase Auth session with admin role |
| `/houses` | Admin only | Same as dashboard |
| `/payments` | Admin only | Same as dashboard |
| `/expenses` | Admin only | Same as dashboard |
| `/penubuhan` | Admin only | Same as dashboard |
| `/reports` | Admin only | Same as dashboard |
| `/attendance` | Admin only | Same as dashboard |
| `/settings` | Admin only | Require role = pengerusi OR bendahari |
| `/resident/dashboard` | Resident only | Require valid house PIN session |
| `/resident/pay` | Resident only | Same as resident dashboard |

```javascript
// router/index.js — Navigation guard example
router.beforeEach(async (to, from) => {
  const auth = useAuthStore()

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'login' }
  }

  if (to.meta.requiresResident && !auth.isResident) {
    return { name: 'resident' }
  }

  if (to.meta.requiresRole && !to.meta.requiresRole.includes(auth.role)) {
    return { name: 'dashboard' }
  }
})
```

---

## 6. Key Composables

### 6.1 `useSupabase()`
**Purpose**: Wraps Supabase client operations with consistent error handling and loading states.

```javascript
// Returns:
{
  loading: Ref<boolean>,
  error: Ref<string | null>,
  query: (table, filters?) => Promise<data>,
  insert: (table, data) => Promise<data>,
  update: (table, id, data) => Promise<data>,
  remove: (table, id) => Promise<void>,
  upload: (bucket, path, file) => Promise<url>,
  subscribe: (table, callback) => RealtimeChannel
}
```

### 6.2 `useAuth()`
**Purpose**: Manages authentication state for both admin and resident flows.

```javascript
// Returns:
{
  user: Ref<User | null>,
  role: Ref<'pengerusi' | 'bendahari' | 'setiausaha' | 'ajk' | 'resident' | null>,
  isAdmin: ComputedRef<boolean>,
  isResident: ComputedRef<boolean>,
  houseId: Ref<string | null>,
  loginAdmin: (email, password) => Promise<void>,
  loginResident: (houseNumber, pin) => Promise<void>,
  logout: () => Promise<void>,
  checkSession: () => Promise<void>
}
```

### 6.3 `useImageCompression()`
**Purpose**: Compresses receipt images before upload to stay within storage limits.

```javascript
// Parameters:
//   file: File — the original image file
//   options?: { maxSizeKB: number, maxWidth: number }
// Returns:
{
  compress: (file, options?) => Promise<File>,
  preview: Ref<string | null>,        // data URL for preview
  originalSize: Ref<number>,          // in bytes
  compressedSize: Ref<number>,        // in bytes
  compressionRatio: ComputedRef<string>  // e.g., "78% smaller"
}
```

**Default options**: `{ maxSizeKB: 50, maxWidth: 1200 }`

### 6.4 `useWhatsApp()`
**Purpose**: Generates formatted WhatsApp reminder messages for unpaid houses.

```javascript
// Parameters:
//   unpaidHouses: House[] — list of houses that haven't paid
//   month: string — the month in question (e.g., 'Julai 2026')
// Returns:
{
  generateReminder: (unpaidHouses, month) => string,
  copyToClipboard: (message) => Promise<void>,
  openWhatsApp: (message) => void,   // Opens wa.me with pre-filled text
  copied: Ref<boolean>
}
```

**Example output**:
```
🏘️ Peringatan Yuran Bulanan — Julai 2026

Salam sejahtera penduduk Taman Langat Utama 2.

Berikut adalah rumah yang belum menjelaskan yuran RM20 untuk bulan Julai 2026:

🔴 Rumah 5, 12, 23, 31, 45, 52

Sila buat pembayaran melalui app E-Komuniti atau hubungi Bendahari.

Terima kasih atas kerjasama anda. 🙏
```

### 6.5 `useExport()`
**Purpose**: Handles CSV and PDF export for financial data.

```javascript
// Returns:
{
  exportCSV: (data, filename, columns?) => void,
  exportPDF: (elementId, filename, options?) => Promise<void>,
  generating: Ref<boolean>
}
```

### 6.6 `useReceipt()`
**Purpose**: Generates auto-numbered digital receipts.

```javascript
// Returns:
{
  generateReceiptNumber: () => string,   // e.g., "TLU2-0042"
  createReceipt: (payment) => ReceiptData,
  getQRCodeUrl: (receiptNumber) => string
}
```

---

## 7. PWA Configuration

### 7.1 Vite PWA Plugin Config

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'E-Komuniti Taman Langat Utama 2',
        short_name: 'E-Komuniti TLU2',
        description: 'Sistem pengurusan kewangan komuniti',
        theme_color: '#6366f1',
        background_color: '#0a0e1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 }
            }
          }
        ]
      }
    })
  ]
})
```

### 7.2 Offline Capability Scope

| Feature | Offline? | Notes |
|:--------|:---------|:------|
| View cached dashboard | ✅ Yes | Last-loaded data displayed |
| View own payment history | ✅ Yes | Cached from last visit |
| Submit new payment | ❌ No | Requires internet (Supabase write) |
| View house grid | ✅ Yes | Cached snapshot |
| Upload receipt | ❌ No | Requires internet (Storage upload) |
| Export CSV | ✅ Yes | From cached data |
| Language toggle | ✅ Yes | Translations bundled in app |

---

## 8. Performance Targets

| Metric | Target | Measurement Tool |
|:-------|:-------|:-----------------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Time to Interactive (TTI) | < 3.0s | Lighthouse |
| Lighthouse Performance Score | > 90 | Lighthouse |
| Lighthouse PWA Score | > 90 | Lighthouse |
| Lighthouse Accessibility Score | > 85 | Lighthouse |
| Bundle Size (gzipped) | < 150 KB | Vite build output |
| Receipt Image Compression | ≤ 50 KB | browser-image-compression |
| Supabase Cold Start | < 15s | Manual test (after 7-day sleep) |

### Optimization Strategies
- **Code splitting**: Vue Router lazy-loads each view with `() => import('./views/XView.vue')`.
- **Tree shaking**: Import only required Chart.js components (not the entire library).
- **Image compression**: All receipt uploads compressed to ≤ 50KB before upload.
- **Font subsetting**: Load only Latin + Malay character subsets of Inter.
- **Preconnect**: `<link rel="preconnect" href="https://your-project.supabase.co">` in index.html.

---

## 9. Key Technical Decisions & Rationale

| Decision | Rationale |
|:---------|:----------|
| Vue 3 over React | Simpler API, lower learning curve for community handover |
| Pinia over Vuex | Official recommendation, simpler store pattern |
| Vanilla CSS over Tailwind | Full control, no build dependency, smaller bundle |
| Supabase over Firebase | Postgres (relational) better suits financial ledger data |
| Client-side PIN check | Avoids needing Supabase Edge Functions (paid tier) |
| html2pdf.js over jsPDF | Easier layout — render HTML then convert to PDF |
| Chart.js over D3.js | Simpler API for standard chart types (bar, pie, doughnut) |
| date-fns over dayjs | Better tree-shaking, only import needed functions |
