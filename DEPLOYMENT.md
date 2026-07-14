# 🚀 Deployment Guide — E-Komuniti Taman Langat Utama 2

> Step-by-step instructions to set up, build, and deploy the E-Komuniti web application.
>
> **Tech Stack:** Vite + Vue 3 + Supabase · **Hosting:** Cloudflare Pages

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Development Setup](#2-local-development-setup)
3. [Supabase Setup](#3-supabase-setup)
4. [Build for Production](#4-build-for-production)
5. [Deploy to Cloudflare Pages](#5-deploy-to-cloudflare-pages)
6. [Custom Domain Setup (Optional)](#6-custom-domain-setup-optional)
7. [UptimeRobot Setup (Prevent Supabase Sleep)](#7-uptimerobot-setup-prevent-supabase-sleep)
8. [Post-Deployment Checklist](#8-post-deployment-checklist)
9. [Ongoing Maintenance](#9-ongoing-maintenance)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Before you begin, make sure the following are installed and available on your machine:

| Requirement              | Minimum Version | Download Link                              |
| ------------------------ | --------------- | ------------------------------------------ |
| **Node.js**              | 18.x or higher  | https://nodejs.org/                        |
| **npm** (or **pnpm**)    | 9.x+ / 8.x+    | Included with Node.js / https://pnpm.io/  |
| **Git**                  | 2.x             | https://git-scm.com/                       |

You will also need accounts on the following services (all offer free tiers):

| Service        | Purpose                        | Sign Up                          |
| -------------- | ------------------------------ | -------------------------------- |
| **Supabase**   | Database, Auth, Storage        | https://supabase.com/            |
| **Cloudflare** | Hosting (Cloudflare Pages)     | https://dash.cloudflare.com/     |
| **GitHub**     | Source code + CI/CD deployment | https://github.com/              |

> [!TIP]
> Verify your Node.js version by running `node -v` in your terminal. If you see `v18.x.x` or higher, you're good to go.

---

## 2. Local Development Setup

### 2.1 Clone the Repository

```bash
git clone <repo-url>
cd ekomuniti-taman-langat-utama-2
```

### 2.2 Install Dependencies

```bash
# Using npm
npm install

# — OR using pnpm —
pnpm install
```

### 2.3 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Open `.env` in your editor and fill in your Supabase credentials (see [Section 3.5](#35-get-api-keys) for how to obtain these):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
```

> [!CAUTION]
> Never commit your `.env` file to Git. Make sure `.env` is listed in `.gitignore`.

### 2.4 Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

---

## 3. Supabase Setup

This section walks you through setting up Supabase as the backend for the E-Komuniti app. Follow each sub-step in order.

### 3.1 Create a New Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project**.
3. Fill in the project details:

   | Field                 | Value                                        |
   | --------------------- | -------------------------------------------- |
   | **Organization**      | Select your org (or create one)              |
   | **Project Name**      | `ekomuniti-tlu2`                             |
   | **Database Password** | Generate a strong password — **save this!**  |
   | **Region**            | Southeast Asia (Singapore) `ap-southeast-1`  |

4. Click **Create new project** and wait for provisioning (~2 minutes).

> [!IMPORTANT]
> Store the database password somewhere safe (e.g., a password manager). You will need it if you ever connect directly via PostgreSQL.

### 3.2 Run Database Migrations

1. In the Supabase Dashboard, go to **SQL Editor**.
2. Open the project file `DATABASE_SCHEMA.md` from this repository.
3. Copy and run each SQL block **in this order**:

   | Step | What to Run                | Purpose                                   |
   | ---- | -------------------------- | ----------------------------------------- |
   | 1    | **Tables**                 | Create all tables (penduduk, payments, etc.) |
   | 2    | **Indexes**                | Add indexes for query performance         |
   | 3    | **RLS Policies**           | Set up Row Level Security for data access |
   | 4    | **Seed Data** (optional)   | Insert initial test data (rumah, yuran, etc.) |

4. After each script, verify there are no errors in the output panel.

> [!NOTE]
> Run each migration block separately and confirm success before proceeding to the next. Do not run all at once — if one fails, it's easier to debug when run individually.

### 3.3 Configure Authentication

1. In the Supabase Dashboard, go to **Authentication → Providers**.
2. Ensure the **Email** provider is enabled.
3. Configure email confirmation:

   - **For simplicity (development/small community):** Disable email confirmation.
     - Go to **Authentication → Settings → Email Auth** and toggle off *"Enable email confirmations"*.
   - **For better security (recommended for production):** Leave email confirmation enabled.

4. **Create initial admin accounts:**

   **Option A — Via SQL Editor:**

   ```sql
   -- Example: Create admin user (replace with actual email & details)
   -- After running this, set the password via Supabase Auth dashboard
   INSERT INTO auth.users (email, email_confirmed_at, role)
   VALUES ('admin@langatutama2.com', now(), 'authenticated');
   ```

   **Option B — Via Supabase Dashboard:**

   - Go to **Authentication → Users → Add User**
   - Enter the admin email and password
   - Then update the admin role in your custom `profiles` or `users` table accordingly

### 3.4 Configure Storage Buckets

1. In the Supabase Dashboard, go to **Storage**.
2. Create the following buckets:

   | Bucket Name   | Public | Purpose                              |
   | ------------- | ------ | ------------------------------------ |
   | `receipts`    | ❌ No  | Store payment receipt images (resit) |
   | `documents`   | ❌ No  | Store community documents            |

3. **Set up access policies** for each bucket:

   - Click on the bucket → **Policies** → **New Policy**
   - Configure policies as defined in `DATABASE_SCHEMA.md`
   - Typical policies:
     - **Upload:** Authenticated users can upload to their own folder
     - **Read:** Admins can read all; residents can read their own
     - **Delete:** Admins only

> [!WARNING]
> Both buckets must be **private** (public: false). Public buckets would expose residents' payment receipts and personal documents to anyone with the URL.

### 3.5 Get API Keys

1. In the Supabase Dashboard, go to **Settings → API**.
2. Copy the following values:

   | Dashboard Label            | Environment Variable         | Example Value                       |
   | -------------------------- | ---------------------------- | ----------------------------------- |
   | **Project URL**            | `VITE_SUPABASE_URL`          | `https://abcdefg.supabase.co`      |
   | **anon public** key        | `VITE_SUPABASE_ANON_KEY`     | `eyJhbGciOiJIUzI1NiIsInR5cCI6...`  |

3. Paste these values into your `.env` file (see [Section 2.3](#23-configure-environment-variables)).

> [!CAUTION]
> The **anon public** key is safe to use in client-side code — it is restricted by RLS policies. However, **never** expose the **service_role** key in your frontend code. The service_role key bypasses all RLS and should only be used in server-side environments.

---

## 4. Build for Production

When you're ready to deploy, build the production bundle:

```bash
npm run build
```

This will generate optimized static files in the `dist/` directory:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

To preview the production build locally before deploying:

```bash
npm run preview
```

> [!TIP]
> The production build minifies JavaScript, CSS, and tree-shakes unused code. The resulting bundle should be well under 1 MB for fast loading on Malaysian mobile networks.

---

## 5. Deploy to Cloudflare Pages

Choose one of the two options below. **Option A is recommended** for automated deployments on every `git push`.

### Option A: GitHub Integration (Recommended — Auto Deploy)

This method connects your GitHub repository to Cloudflare Pages for continuous deployment.

**Step 1 — Push your code to GitHub**

```bash
git remote add origin https://github.com/<your-username>/ekomuniti-tlu2.git
git push -u origin main
```

**Step 2 — Create a Cloudflare Pages project**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**.
2. Select **Pages** → **Connect to Git**.
3. Authorize Cloudflare to access your GitHub account.
4. Select the repository: `ekomuniti-tlu2`.

**Step 3 — Configure build settings**

| Setting                    | Value              |
| -------------------------- | ------------------ |
| **Production branch**      | `main`             |
| **Framework preset**       | Vue                |
| **Build command**          | `npm run build`    |
| **Build output directory** | `dist`             |

**Step 4 — Add environment variables**

Click **Environment variables** → **Add variable**:

| Variable Name            | Value                            |
| ------------------------ | -------------------------------- |
| `VITE_SUPABASE_URL`      | `https://abcdefg.supabase.co`   |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...`                 |
| `NODE_VERSION`           | `18`                             |

> [!IMPORTANT]
> Environment variables prefixed with `VITE_` are embedded into the build at compile time. They are not secret — they will be visible in the built JavaScript. This is fine for the anon key (protected by RLS), but never put sensitive secrets here.

**Step 5 — Deploy**

1. Click **Save and Deploy**.
2. Wait for the build to complete (~1–2 minutes).
3. Your app is now live at: **`https://ekomuniti-tlu2.pages.dev`**

**Automatic Deployments:**

From now on, every push to the `main` branch will trigger an automatic deployment. Pull requests will generate preview deployments with unique URLs for testing.

---

### Option B: Direct Upload (Manual)

Use this if you prefer not to connect GitHub, or for quick one-off deployments.

**Step 1 — Build locally**

```bash
npm run build
```

**Step 2 — Upload to Cloudflare**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**.
2. Select **Pages** → **Upload Assets**.
3. Name your project (e.g., `ekomuniti-tlu2`).
4. Drag and drop the entire `dist/` folder into the upload area.
5. Click **Deploy**.

> [!NOTE]
> With direct upload, you must manually rebuild and re-upload every time you make changes. For a community project with ongoing updates, **Option A (GitHub integration) is strongly recommended**.

---

## 6. Custom Domain Setup (Optional)

By default, your app is available at `ekomuniti-tlu2.pages.dev`. To use a custom domain (e.g., `langatutama2.com`):

### 6.1 Purchase a Domain

- **Cloudflare Registrar:** https://dash.cloudflare.com/ → Domain Registration (~RM50/year for `.com`)
- **Namecheap:** https://namecheap.com
- **Exabytes (Malaysian registrar):** https://exabytes.com.my

### 6.2 Add Custom Domain to Cloudflare Pages

1. Go to **Cloudflare Dashboard → Workers & Pages → your project**.
2. Click **Custom Domains** → **Set up a custom domain**.
3. Enter your domain: `langatutama2.com`.
4. Cloudflare will show the required DNS records.

### 6.3 Update DNS Records

If your domain is on Cloudflare:
- DNS records are configured automatically. ✅

If your domain is on another registrar:
- Add the CNAME record as instructed by Cloudflare.

### 6.4 SSL Certificate

- SSL/TLS is **automatically provisioned** by Cloudflare. No action needed.
- Your site will be available via HTTPS within minutes.

---

## 7. UptimeRobot Setup (Prevent Supabase Sleep)

Supabase free-tier projects may **pause after 1 week of inactivity**. To prevent this, set up a free uptime monitor that pings your project regularly.

### 7.1 Create an UptimeRobot Account

1. Go to [https://uptimerobot.com](https://uptimerobot.com).
2. Sign up for a free account.

### 7.2 Add a New Monitor

1. Click **Add New Monitor**.
2. Configure:

   | Setting              | Value                                                |
   | -------------------- | ---------------------------------------------------- |
   | **Monitor Type**     | HTTP(s)                                              |
   | **Friendly Name**    | E-Komuniti TLU2                                      |
   | **URL**              | `https://abcdefg.supabase.co/rest/v1/`               |
   | **Monitoring Interval** | 5 minutes                                         |

3. Click **Create Monitor**.

> [!TIP]
> You can also monitor your app's frontend URL (`https://ekomuniti-tlu2.pages.dev`) as a second monitor. This helps you know immediately if the site goes down.

### 7.3 Alert Contacts (Optional)

- Add your email or Telegram to receive downtime alerts.
- UptimeRobot free tier supports email notifications.

---

## 8. Post-Deployment Checklist

After deploying, verify everything works by going through this checklist:

### Core Functionality

- [ ] App loads at production URL without errors
- [ ] Admin can log in with email and password
- [ ] Resident (penduduk) can log in with house number + PIN
- [ ] Dashboard displays correctly for both admin and resident roles

### Payment Features (Yuran Bulanan)

- [ ] Resident can submit a payment record
- [ ] Receipt image (resit) upload works correctly
- [ ] Admin can view and approve/reject payments
- [ ] Payment history displays correctly

### Data & Export

- [ ] CSV export (muat turun) works for admin/treasurer
- [ ] Data filters (by month, status, house number) work

### PWA & Mobile

- [ ] PWA installs on mobile (Android / iOS)
- [ ] App icon appears on home screen after installation
- [ ] App works in offline-capable mode (if implemented)

### Localization

- [ ] Language toggle works (BM ↔ EN)
- [ ] All text renders correctly in both Bahasa Melayu and English

### Security

- [ ] Non-authenticated users cannot access protected pages
- [ ] Residents cannot see other residents' data
- [ ] Admin-only features are hidden from resident accounts

---

## 9. Ongoing Maintenance

### Monthly Tasks

| Task                         | Who           | Details                                              |
| ---------------------------- | ------------- | ---------------------------------------------------- |
| Download CSV backup          | Bendahari     | Export payment data via admin panel → CSV             |
| Review payment submissions   | Bendahari     | Approve/reject pending yuran submissions              |

### Quarterly Tasks

| Task                         | Who           | Details                                              |
| ---------------------------- | ------------- | ---------------------------------------------------- |
| Review Supabase storage      | Admin IT      | Check storage usage in Supabase Dashboard → Storage  |
| Review database size         | Admin IT      | Check database usage in Supabase Dashboard → Settings |
| Test backup restore          | Admin IT      | Verify CSV backups can be re-imported if needed      |

### Annual Tasks

| Task                         | Who           | Details                                              |
| ---------------------------- | ------------- | ---------------------------------------------------- |
| Review Supabase free tier    | Admin IT      | Check if usage is within limits (500 MB DB, 1 GB storage) |
| Renew domain (if applicable) | Admin IT      | Renew custom domain before expiry                    |
| Update committee members     | Pengerusi     | Add/remove AJK accounts as committee changes         |
| Review & update passwords    | All admins    | Change admin passwords periodically                  |

### As-Needed Tasks

- **Add new residents:** Create accounts when new families move in
- **Remove residents:** Deactivate accounts when families move out
- **Update yuran rates:** Modify monthly fee amounts if the AGM approves changes
- **Dependency updates:** Run `npm update` periodically to patch security vulnerabilities

---

## 10. Troubleshooting

### Common Issues & Solutions

#### App loads slowly after long inactivity

**Cause:** Supabase free-tier project is waking up from sleep.
**Solution:** Wait 10–15 seconds for the first load. Subsequent requests will be fast. Set up UptimeRobot (see [Section 7](#7-uptimerobot-setup-prevent-supabase-sleep)) to prevent this.

#### "Permission denied" or "Row level security" errors

**Cause:** RLS policies are not configured correctly, or the user's role doesn't match the expected policy.
**Solution:**
1. Go to Supabase Dashboard → **Table Editor** → select the table.
2. Click **RLS Policies** and verify policies exist.
3. Cross-reference with the policies defined in `DATABASE_SCHEMA.md`.
4. Test with the **SQL Editor** using `SET ROLE authenticated;` to simulate user access.

#### Images not uploading (receipt / resit)

**Cause:** Storage bucket policies are missing or misconfigured.
**Solution:**
1. Go to Supabase Dashboard → **Storage** → select the bucket.
2. Check that policies exist for `INSERT` (upload) and `SELECT` (read).
3. Verify the bucket name in your code matches the bucket name in Supabase (case-sensitive).

#### Build fails on Cloudflare Pages

**Cause:** Node.js version mismatch or missing dependencies.
**Solution:**
1. Add `NODE_VERSION=18` as an environment variable in Cloudflare Pages settings.
2. If using `pnpm`, ensure `packageManager` is set in `package.json` or add a `.npmrc` file.
3. Check the build logs in Cloudflare Dashboard for specific error messages.

#### Login not working

**Cause:** Supabase URL or anon key is incorrect, or environment variables are not set.
**Solution:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Cloudflare Pages environment variables.
2. Ensure the values match exactly what's shown in Supabase Dashboard → Settings → API.
3. Redeploy after updating environment variables (Cloudflare does not auto-redeploy on env var changes for direct uploads).

#### PWA not installing on mobile

**Cause:** Missing or misconfigured `manifest.json`, or site not served over HTTPS.
**Solution:**
1. Verify `manifest.json` exists in the `public/` folder and is referenced in `index.html`.
2. Ensure the site is served over HTTPS (automatic with Cloudflare Pages).
3. Open DevTools → Application → Manifest to check for errors.

#### CSV export produces empty file

**Cause:** No data matches the current filters, or the export function has a query error.
**Solution:**
1. Remove all filters and try exporting again.
2. Check the browser console for errors.
3. Verify the database has data by querying directly in Supabase SQL Editor.

---

## Quick Reference — Environment Variables

| Variable                 | Where to Set              | Value Source                    |
| ------------------------ | ------------------------- | ------------------------------ |
| `VITE_SUPABASE_URL`      | `.env` (local), Cloudflare | Supabase → Settings → API     |
| `VITE_SUPABASE_ANON_KEY` | `.env` (local), Cloudflare | Supabase → Settings → API     |
| `NODE_VERSION`           | Cloudflare only            | `18` (or `20`)                |

---

## Quick Reference — Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check for linting errors
npm run lint

# Update dependencies
npm update
```

---

## Architecture Overview

```
┌──────────────┐     HTTPS      ┌──────────────────┐
│   Browser /  │ ◄────────────► │  Cloudflare Pages │
│   Mobile PWA │                │  (Static Hosting) │
└──────┬───────┘                └──────────────────┘
       │                                 │
       │  Supabase JS Client             │  Built from
       │  (REST API + Realtime)          │  dist/ folder
       ▼                                 │
┌──────────────────┐                     │
│    Supabase      │     ◄───────────────┘
│  ┌────────────┐  │
│  │ PostgreSQL │  │  Database (penduduk, yuran, etc.)
│  ├────────────┤  │
│  │    Auth    │  │  Authentication (email + PIN)
│  ├────────────┤  │
│  │  Storage   │  │  File storage (receipts, documents)
│  └────────────┘  │
└──────────────────┘
```

---

> **Maintained by:** AJK ICT, Persatuan Penduduk Taman Langat Utama 2
>
> **Last Updated:** July 2026
