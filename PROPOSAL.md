# Web Application Proposal: E-Komuniti Taman Langat Utama 2
**A Digital Finance & Collection Manager for 64 Houses**

This proposal outlines the features, architecture, hosting costs, and constraints for a custom web application designed to manage the monthly RM20 collection, the association setup (*penubuhan*) process, and ongoing financial governance for the **Taman Langat Utama 2** community.

---

## 1. Executive Summary
The community consists of **64 houses** with a monthly contribution of **RM20 per house**, generating a monthly operational pool of **RM1,280** (RM15,360 annually). The community is in the process of officially establishing a *Persatuan Penduduk* and requires tools to manage the financial implications **before, during, and after** the setup (*penubuhan*). This proposal covers the full lifecycle — from the inaugural meeting through to ongoing monthly operations.

---

## 2. Core App Features

### 2.1 👤 Role-Based Interface (Enhanced with Security)
* **Resident Portal (Secured with House Number + PIN)**:
  * Each house is assigned a unique 4-digit PIN during registration.
  * View current payment status for the year (Paid / Unpaid / Pending verification).
  * Submit new monthly payments by entering bank reference number and uploading bank-in slip.
  * Select which month(s) the payment covers (supports advance & arrears payments).
* **Admin / Committee Portal (Individual Login per AJK)**:
  * Separate accounts for Pengerusi, Bendahari, Setiausaha, and AJK members.
  * Full **audit trail** — every action (approve, reject, add expense) logs WHO did it and WHEN.
  * Approve or reject pending payment submissions with a single click.
  * Log community expenses with category and budget tracking.
  * **Duplicate prevention** — system blocks approving the same house for the same month twice.

---

### 2.2 📊 Interactive Financial Dashboard
* **Total Balance**: Real-time display of cash on hand (Income minus Expenses).
* **Collection Progress Tracker**: A radial progress bar displaying how many houses have paid for the current month (e.g., `45 / 64 Paid`).
* **Cashflow Graph**: Visual monthly summary of Money In vs. Money Out.
* **Total Outstanding Arrears**: Shows total RM owed across all houses.
* **Budget vs. Actual**: Per-category spending comparison (e.g., Security budget RM500 — spent RM450).
* **Defaulter List**: Quick list of houses that are behind on their payments.
  * **Auto-Generated WhatsApp Reminder**: Pre-formatted message listing all unpaid houses, ready to paste into the community WhatsApp group.

---

### 2.3 📑 Ledger & Financial Reports
* **Interactive 64-House Grid**: Color-coded dashboard where each house shows its payment status across the 12 months of the year (Green = Paid, Yellow = Pending Admin Approval, Red = Unpaid).
* **Per-House Balance**: Each house card shows total paid, total owing, and arrears months.
* **Transaction History**: Searchable list of all income and expenses with bank reference numbers and downloadable receipts.
* **Expense Categories**: Managed list (Security, Maintenance, Landscaping, Events, Penubuhan, etc.) with custom category support.
* **One-Click Backup**: An "Export to Excel/CSV" button allowing the treasurer to download the entire financial ledger.

---

### 2.4 📄 Laporan Kewangan Tahunan (Annual Financial Report / AGM)
A dedicated report generator for the *Mesyuarat Agung Tahunan (AGM)*:
* **Penyata Kewangan** — printable/downloadable summary containing:
  * Opening balance, total collection, total expenses, closing balance.
  * Category-wise expense breakdown (pie chart).
  * List of houses with outstanding arrears.
  * Month-by-month income vs. expense bar chart.
* **Export as PDF or Print** — formatted for A4 paper, ready to present at AGM.

---

### 2.5 🏛️ Modul Penubuhan Persatuan (Association Setup Module)

This is a **new dedicated module** that digitizes the entire *penubuhan* process and its financial implications across three phases:

#### Phase A: SEBELUM & SEMASA Penubuhan (Before & During Setup)

##### 📋 Digital Attendance Log (Buku Log Kehadiran)
Replaces the physical attendance book. During the *mesyuarat perlantikan*:
* Committee member opens the app on a tablet/phone at the registration desk.
* Each attendee selects their house number and taps "Hadir" — timestamp is recorded automatically.
* **Live attendance counter** displayed on screen (e.g., `42 / 64 hadir — Kuorum tercapai ✓`).
* Exportable attendance list with full names, house numbers, and timestamps — can be printed for ROS records.

##### 📝 Digital Member Registration Form (Borang Pendaftaran Ahli)
Replaces the printed registration form:
* Residents fill in a digital form: Name, IC No., House No., Phone No., Email (optional).
* Data is stored securely and can be exported as a formatted PDF matching ROS requirements.
* **Eliminates printing cost** for registration forms entirely.

##### 🧾 Digital Receipt Book (Buku Resit Pembayaran Dana)
Replaces the physical receipt book for the first month's *yuran/dana* collection:
* When a resident pays RM20 at the meeting, admin taps "Terima Bayaran Tunai" → system generates a digital receipt with:
  * Auto-incrementing receipt number (e.g., `TLU2-0001`).
  * House number, resident name, amount (RM20), date, and category ("Yuran Bulan Pertama").
  * QR code linking to the digital receipt for verification.
* Resident receives the receipt via WhatsApp or can screenshot it on the spot.
* **Eliminates printing cost** for receipt books entirely.

##### 🍽️ Setup Cost Tracker (Kos Persiapan Mesyuarat)
A dedicated expense category for tracking all meeting preparation costs:

| Item | Estimated Cost | Status | Digitized? |
|:-----|:---------------|:-------|:-----------|
| Pinggan plastik, cawan, sudu | ~RM 30–50 | To purchase | ❌ Physical (tracked as expense) |
| Susu pekat / kopi / teh | ~RM 20–30 | To purchase | ❌ Physical (tracked as expense) |
| Plastik sampah & tisu | ~RM 10–15 | To purchase | ❌ Physical (tracked as expense) |
| Air mineral / minuman | ~RM 30–50 | To purchase | ❌ Physical (tracked as expense) |
| Buku log kehadiran (printing) | ~RM 5–10 | **SAVED** | ✅ Replaced by Digital Attendance Log |
| Borang pendaftaran ahli (printing) | ~RM 15–20 | **SAVED** | ✅ Replaced by Digital Registration Form |
| Buku resit pembayaran (printing) | ~RM 10–15 | **SAVED** | ✅ Replaced by Digital Receipt Book |
| White board | ~RM 40–80 | Dalam pertimbangan | ✅ Replaced by app's live dashboard on TV/projector |
| **Anggaran Jumlah** | **~RM 160–270** | | |
| **Penjimatan Digital** | **~RM 70–125 saved** | | |

> All physical items (food & drinks) that cannot be digitized are logged as expenses under the **"Kos Penubuhan"** category. The app tracks every sen spent so the committee can present full transparency at the first AGM.

---

#### Phase B: SELEPAS Penubuhan (After Setup)

##### 🏛️ Post-Registration Expense Tracker
After the association is officially registered, the following costs are tracked under the **"Kos Penubuhan (Selepas)"** category:

| Item | Cost | Notes | Digitized? |
|:-----|:-----|:------|:-----------|
| Cop rasmi Pengerusi | ~RM 25–40 | Rubber stamp with chairman's name & title | ❌ Physical (tracked as expense) |
| Cop rasmi Persatuan | ~RM 30–50 | Official association stamp with ROS number | ❌ Physical (tracked as expense) |
| Banner pemakluman penubuhan | ~RM 80–150 | Vinyl banner for community notice board | ❌ Physical (tracked as expense) |
| Pendaftaran e-ROSES (ROS) | **RM 30.00** | Official ROS online registration fee | ❌ Physical (tracked as expense) |
| Cop mohor Perlembagaan | **RM 2.00 × pages** | RM2 per page stamping fee | ❌ Physical (tracked as expense) |
| **Anggaran Jumlah** | **~RM 200–320** | Depending on perlembagaan page count | |

##### 📊 Penubuhan Budget Summary Dashboard
A dedicated dashboard card showing:
* **Total Kos Penubuhan**: Combined before + during + after costs.
* **Breakdown**: Pie chart splitting Sebelum/Semasa vs. Selepas costs.
* **Source of Funds**: Shows how much came from the first month's RM20 collection vs. committee's own contribution.
* **Balance After Setup**: How much of the collected dana remains after all penubuhan expenses.

---

### 2.6 📱 Digital Forms Hub (Replacing Physical Paperwork)

The app consolidates all physical forms into a digital hub accessible from the sidebar:

| Physical Item | Digital Replacement | Benefit |
|:-------------|:-------------------|:--------|
| Buku Log Kehadiran | ✅ Digital Attendance with timestamp | No printing cost, auto-counted, exportable |
| Borang Pendaftaran Ahli | ✅ Online Registration Form | Pre-filled for returning residents, exportable for ROS |
| Buku Resit (3-ply carbon copy) | ✅ Auto-numbered Digital Receipts | Searchable, shareable via WhatsApp, never lost |
| White Board (agenda display) | ✅ Live Dashboard on TV/Projector | Display live payment counter during meetings |
| Perlembagaan document | ✅ Uploaded PDF viewable by all members | Every member can access anytime from phone |

---

### 2.7 🌐 Bahasa Melayu First
* Default language: **Bahasa Melayu** with English toggle.
* All buttons, labels, and notifications use familiar terms:
  * "Sudah Bayar" / "Belum Bayar" / "Menunggu Pengesahan"
  * "Hantar Resit" / "Tambah Perbelanjaan" / "Muat Turun Laporan"

---

## 3. Technology Stack
We propose a **Serverless Modern Web Stack** to eliminate ongoing server maintenance and achieve **RM0 monthly hosting costs**:

* **Frontend**: HTML5, CSS3 (Vanilla design system with glassmorphism), and Vanilla Javascript (ES6).
* **Database**: **Supabase** (Postgres DB) for storing transactions, member data, and payment states.
* **Storage**: **Supabase Bucket** for hosting uploaded bank receipts and perlembagaan PDF.
* **Hosting**: **Cloudflare Pages** for serving the app files globally with high speed.
* **PWA Support**: `manifest.json` + service worker so residents can "Add to Home Screen" on their phones.

---

## 4. Hosting Plan Comparison

| Feature / Metric | Option 1: Developer Cloud (Recommended) | Option 2: Shared Web Hosting |
| :--- | :--- | :--- |
| **Hosting Platform** | Cloudflare Pages + Supabase | Hostinger Malaysia / Exabytes |
| **Database Platform** | Supabase (Postgres) | Shared MySQL Database |
| **Monthly Cost** | **RM 0.00** | ~RM 10.00 to RM 15.00 |
| **Annual Cost** | **RM 0.00** *(or ~RM 50/yr for custom domain)* | **~RM 120.00 to RM 180.00 / year** |
| **Custom Domain** | Supported (e.g., `langatutama2.com`) | Included free for the 1st year |
| **Official Emails** | Not included (Use Gmail/WhatsApp) | Included (e.g., `admin@langatutama2.com`) |
| **SSL Security** | Included Free (HTTPS) | Included Free (HTTPS) |
| **Maintenance** | None required | Server renewal updates required yearly |

---

## 5. Free Tier Limitations & Solutions

### 1. File Storage Limit (1 GB)
* 64 houses × 12 months = **768 receipts/year** (~200 KB each).
* 1 GB lasts **~6.5 years** (or **25+ years** with image compression enabled).
* **Mitigation**: Auto-compress uploaded images; purge receipts older than 2 years after audit.

### 2. Inactivity Pause (1 Week)
* Database sleeps after 7 days of zero traffic; wakes in 10–15 seconds.
* **Mitigation**: Free UptimeRobot ping every 24 hours prevents sleep.

### 3. No Automatic Backups
* **Mitigation**: Built-in "Export to CSV" button; treasurer downloads monthly.

---

## 6. Estimated Total Penubuhan Cost Summary

| Phase | Category | Est. Cost (RM) | Savings from App |
|:------|:---------|:----------------|:-----------------|
| Sebelum & Semasa | Food & drinks (F&B) | 90 – 145 | — |
| Sebelum & Semasa | Printing (log, forms, receipts) | 30 – 45 | **✅ RM 30–45 saved** (digitized) |
| Sebelum & Semasa | White board | 40 – 80 | **✅ RM 40–80 saved** (use app on TV) |
| Selepas | Cop rasmi (×2) | 55 – 90 | — |
| Selepas | Banner penubuhan | 80 – 150 | — |
| Selepas | e-ROSES registration | 30 | — |
| Selepas | Cop Perlembagaan | 20 – 60 | — |
| | **TOTAL** | **~RM 345 – 570** | |
| | **Total Savings** | | **~RM 70 – 125** |
| | **Net Cost After Savings** | **~RM 275 – 445** | |

> With 64 houses paying RM20 in the first collection = **RM1,280 collected**. After all penubuhan costs (~RM 345–570), the community will have an estimated **RM 710 – RM 935 remaining** as the opening operational fund.

---

## 7. Next Steps & Timeline
1. **Phase 1: Interactive Local Prototype (2-3 days)**:
   * Build the complete UI with all modules (Dashboard, Penubuhan, Ledger, Reports).
   * Pre-loaded with mock data for 64 houses and sample penubuhan expenses.
   * Default language: Bahasa Melayu.
2. **Phase 2: Database Integration & PWA (2-3 days)**:
   * Supabase backend with authentication (admin accounts + resident PIN system).
   * PWA manifest for "Add to Home Screen" support.
   * Receipt image compression pipeline.
3. **Phase 3: Deployment & Handover (1 day)**:
   * Deploy to Cloudflare Pages.
   * Create Quick Start Guide (Panduan Ringkas) with screenshots.
   * Record 3-minute video walkthrough for community WhatsApp group.
