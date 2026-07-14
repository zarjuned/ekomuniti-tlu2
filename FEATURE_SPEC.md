# Feature Specification: E-Komuniti Taman Langat Utama 2
**Detailed Specifications of Core Application Modules**

This document serves as the development blueprint for the feature modules of the **E-Komuniti Taman Langat Utama 2** web application.

---

## Module 1: Dashboard (Papan Pemuka)

### 1.1 User Stories
* **As a Committee Member (AJK)**, I want to see the total fund balance at a glance, so that I can gauge the community's overall financial health.
* **As a Bendahari (Treasurer)**, I want to see this month's collection progress (e.g., 45/64 paid), so that I know who to contact for follow-up collections.
* **As an Admin**, I want to compare budget vs. actual spending for the current phase, so that I can control expenses and prevent overspending.
* **As a Resident**, I want to see the total balance and recent community expenses, so that I have trust in how our money is spent.

### 1.2 UI Layout Description
The dashboard is a desktop-first responsive grid that scales down to a mobile single-column layout:
1. **Hero Cards Row**:
   * **Total Fund Balance Card**: Large bold number (e.g., `RM 5,240.00`) on a dark gradient background with a glow effect.
   * **Arrears Card**: Displays total unpaid funds outstanding (e.g., `RM 340.00`) in red text.
   * **Monthly Budget Card**: Displays current month's income vs. expense progress bar.
2. **Radial Progress Section**:
   * A large, clean SVG radial progress ring showing the percentage of houses that paid for the current month.
   * Center text displays: `45 / 64 Paid` (or `45 / 64 Selesai`).
   * Color transitions from red (under 30%) to yellow (30-70%) to green (above 70%).
3. **Charts & Lists Row**:
   * **Cashflow Bar Chart**: Income vs. Expense monthly comparison.
   * **Defaulter List**: Compact scrolling list displaying unpaid house numbers with a copy-to-clipboard WhatsApp reminder button.
4. **Quick Action Panel**:
   * Admin Buttons: `Record Cash Payment`, `Add Expense`, `Post Announcement`.
   * Resident Buttons: `Pay My Fee`, `Submit Payment Proof`.

### 1.3 Acceptance Criteria
* **Given** that the dashboard is loaded:
  * **When** there are pending payments waiting for approval, **then** a notification banner must flash at the top of the dashboard showing: `Ada 3 bayaran menunggu pengesahan AJK`.
  * **When** a user clicks the `Copy WhatsApp Reminder` button, **then** the clipboard must receive a formatted text listing all unpaid house numbers for the current month.

### 1.4 Data Flow
* **Read**:
  * `payments` (filtered by current month/year to calculate the collection progress).
  * `expenses` (summed to calculate total outflows).
  * `houses` (to check the total houses count, default 64, and identify unpaid ones).

---

## Module 2: Houses Grid (Senarai Rumah)

### 2.1 User Stories
* **As a Bendahari**, I want to see an interactive 64-house grid with color-coded monthly badges, so that I can easily spot which houses have paid for which months.
* **As a Resident**, I want to view my own house's record in the grid, so that I can verify that the committee has logged my past payments correctly.

### 2.2 UI Layout Description
1. **Filter & Search Bar**:
   * Search input to lookup by house number (e.g., `No. 12` or owner name `Chong`).
   * Filter buttons: `Tunjuk Semua`, `Belum Bayar (Bulan Semasa)`, `Ada Tunggakan`.
2. **The 8x8 Grid**:
   * Displays 64 rounded card boxes corresponding to the 64 houses.
   * Each card features:
     * House Number in bold text (e.g., `No. 12`).
     * Current month status dot (Green = Paid, Yellow = Pending, Red = Unpaid).
     * Accumulated arrears text (e.g., `Tunggakan: RM40` if unpaid for 2 months).
3. **Slide-Out Details Panel (Drawer)**:
   * Clicking a house card slides out a panel from the right.
   * Displays Owner's Name, Phone, and a 12-month payment timeline for the current year.
   * Shows a button to edit house parameters or reset the resident PIN (Admin only).

### 2.3 Acceptance Criteria
* **Given** the search input:
  * **When** the user types `No. 5`, **then** the grid must dynamically filter to show only `No. 5`, `No. 50`, `No. 51` etc. within 150ms.
* **Given** the payment matrix:
  * **When** a house is marked "Pending" (`pending`), **then** its status color in the matrix must be amber/yellow, blocking any payment actions until resolved.

### 2.4 Data Flow
* **Read**: `houses`, `payments` (grouped by house_id for the current fiscal year).
* **Write**: `houses` (updates phone, owner_name, pin_hash if AJK edits them).

---

## Module 3: Payment Collection (Kutipan Bayaran)

### 3.1 User Stories
* **As a Resident**, I want to login with my PIN and submit a bank transfer receipt online, so that I don't have to meet the AJK in person to make payments.
* **As a Bendahari**, I want to check a verification queue and view receipt image uploads side-by-side with bank reference numbers, so that I can cross-reference with my bank statement and approve them.

### 3.2 UI Layout Description
1. **Resident Submission Form**:
   * House select dropdown (pre-filled if logged in) + PIN validation.
   * Multi-select month list (allows paying advance months, e.g., July, Aug, Sept).
   * Input fields: `Amount` (auto-calculates based on months selected × RM20), `Bank Reference Number`.
   * Drag-and-drop file upload zone for receipt image.
2. **Admin Verification Dashboard**:
   * Table displaying list of pending payments: Date, House Number, Months, Amount, Ref Number.
   * Action buttons: `Terima (Approve)` (Green check) and `Tolak (Reject)` (Red X).
   * Modal dialog showing the enlarged bank slip image with zoom and rotate controls.

### 3.3 Acceptance Criteria
* **Given** a duplicate submission attempt:
  * **When** House 12 tries to submit a payment for `2026-07` when that month is already marked `approved` or `pending`, **then** the system must block the submit button and show a message: `Bayaran bagi bulan Julai 2026 sedang diproses atau telah diluluskan`.
* **Given** image upload:
  * **When** a resident drops a 5MB image, **then** the app must compress it to below 50KB before uploading to Supabase Storage.

### 3.4 Data Flow
* **Write (Resident)**:
  * `payments` table (inserts row with status `pending`).
  * Supabase Storage `receipts` bucket (uploads compressed image file).
* **Write (Admin)**:
  * `payments` table (updates status to `approved` or `rejected`, records `reviewed_by`, `reviewed_at`).
  * `audit_log` table (logs the approval action).

---

## Module 4: Expense Management (Pengurusan Perbelanjaan)

### 4.1 User Stories
* **As a Bendahari**, I want to log community expenses (e.g. grass cutting) with their cost, date, category, and receipts, so that the ledger is kept up to date.
* **As a Resident**, I want to view a transparent list of expenses, so that I can see how community funds are utilized.

### 4.2 UI Layout Description
1. **Expense Form Modal**:
   * Input fields: `Amaun (RM)`, `Tarikh`, `Penerangan (Description)`, `Kategori` (dropdown).
   * File upload for receipt/invoice scan.
2. **Category Budget Tracker**:
   * Grid of progress cards showing budget allocation vs. actual spending per category.
   * Example: `Keselamatan: RM450 / RM500 Spent` with a progress bar that turns red if over budget.
3. **Expense Ledger Table**:
   * List view with column headings: Tarikh, Amaun, Penerangan, Kategori, Resit, Tindakan (Edit/Hapus).
   * Date range selector and category filter dropdown.

### 4.3 Acceptance Criteria
* **Given** a new expense entry:
  * **When** the Bendahari submits the form without a description or amount, **then** the form must validate and show red inline error warnings.
* **Given** an expense deletion:
  * **When** an admin deletes an expense, **then** the system must prompt for confirmation, delete the record, recalculate the total balance, and log the action to `audit_log`.

### 4.4 Data Flow
* **Write**: `expenses` (INSERT/UPDATE/DELETE).
* **Read**: `expenses`, `expense_categories`.
* **Log**: `audit_log` (tracks who deleted or edited any expense).

---

## Module 5: Penubuhan Module (Modul Penubuhan)

### 5.1 User Stories
* **As a Committee Member**, I want to log the costs of setting up the association before/during/after the inauguration, so that we can keep track of all start-up costs.
* **As a Resident**, I want to register my attendance digitally at the inaugural meeting, so that we can prove we met the quorum requirement for ROS registration.

### 5.2 UI Layout Description
1. **Timeline Stepper**:
   * Stepper showing phases: `1. Sebelum & Semasa` → `2. Hari Pelantikan` → `3. Selepas Penubuhan`.
2. **Buku Log Kehadiran Digital (Attendance Desk)**:
   * Tablet-friendly interface showing all 64 houses.
   * Residents click their house → enters name → taps `Hadir`.
   * Live counter display: `44 / 64 hadir (68% - Kuorum Tercapai!)`.
3. **Penubuhan Cost Table**:
   * Lists setup items (F&B, stamps, e-ROSES, printing costs) with columns: `Item`, `Status`, `Kos Anggaran`, `Kos Sebenar`, `Tindakan`.
   * Shows a highlight panel: **"Penjimatan Digital"** indicating money saved by using the app instead of physical printing.

### 5.3 Acceptance Criteria
* **Given** the digital attendance log:
  * **When** a resident is marked present, **then** the house status in the grid turns green, and they cannot check in again.
* **Given** the setup budget:
  * **When** the total actual cost exceeds the allocated budget, **then** the budget banner turns red and highlights the difference.

### 5.4 Data Flow
* **Read**: `expense_categories`, `expenses` (filtered by phase `sebelum`, `semasa`, `selepas`).
* **Write**: `attendance` (adds attendance logs), `expenses` (adds penubuhan expenses).

---

## Module 6: Reports & AGM (Laporan)

### 6.1 User Stories
* **As a Setiausaha (Secretary) / Bendahari**, I want to generate a printable PDF Penyata Kewangan (Financial Statement) for the AGM, so that I don't have to format the reports manually in Word.
* **As a Resident**, I want to download the financial report, so that I can inspect it before attending the AGM.

### 6.2 UI Layout Description
1. **Report Configuration Panel**:
   * Select Report Type: `Penyata Tahunan (AGM)`, `Laporan Bulanan`, `Senarai Tunggakan`.
   * Select Year/Month dropdowns.
2. **Live Document Preview**:
   * A print-preview container representing an A4 document.
   * Displays association name, bank accounts, logo, statement of accounts table, and pie charts.
3. **Action Bar**:
   * `Muat Turun PDF (Download PDF)`, `Cetak Laporan (Print)`, `Eksport CSV (Excel)`.

### 6.3 Acceptance Criteria
* **Given** the PDF generator:
  * **When** the user clicks `Muat Turun PDF`, **then** the app must trigger `html2pdf.js` to compile the preview pane into a clean, multipage A4-formatted PDF and trigger a browser download.
* **Given** the CSV export:
  * **When** exported, **then** the CSV file must contain columns: `Tarikh`, `No Rumah`, `Nama`, `Kategori`, `Kutipan (RM)`, `Perbelanjaan (RM)`, `Status`.

### 6.4 Data Flow
* **Read**: `payments`, `expenses`, `houses`, `settings`.

---

## Module 7: Attendance & Forms Hub (Kehadiran & Borang)

### 7.1 User Stories
* **As a Resident**, I want to fill in a digital membership registration form online, so that the secretary doesn't have to transcribe my handwriting.
* **As a Setiausaha**, I want to view the list of registered members and download it as an Excel sheet, so that I can upload it directly to the e-ROSES portal.

### 7.2 UI Layout Description
1. **Forms Hub Landing Page**:
   * Grid layout showing available forms: `Borang Kehadiran Mesyuarat`, `Borang Pendaftaran Ahli`, `Perlembagaan Persatuan (PDF)`.
2. **Borang Pendaftaran Ahli**:
   * Step-by-step form:
     * Step 1: Maklumat Pemilik (Nama, No IC, No Telefon, Emel).
     * Step 2: Maklumat Rumah (No Rumah, Alamat).
     * Step 3: Pengakuan Ahli (Checkbox to agree to the constitution).
3. **Perlembagaan Viewer**:
   * Fullscreen PDF viewer showing the official constitution rules, with page-by-page navigation.

### 7.3 Acceptance Criteria
* **Given** the registration form:
  * **When** submitted, **then** the system must check that the IC number matches the standard Malaysian IC format (12 digits) and block submission if incorrect.

### 7.4 Data Flow
* **Write**: `members` (inserts row with fields).
* **Read**: `members`, `houses`.

---

## Module 8: Settings & Admin (Tetapan)

### 8.1 User Stories
* **As the Pengerusi (Chairman)**, I want to manage admin accounts for committee members, so that only active committee members have access to make changes.
* **As a Bendahari**, I want to change the bank account details displayed on the resident payment portal, so that payments are routed to our new official association account once approved by ROS.

### 8.2 UI Layout Description
1. **Tabs Navigation**:
   * `Maklumat Persatuan (Profile)`, `Pengurusan AJK (Admin Users)`, `Konfigurasi Yuran`, `Log Audit`.
2. **Pengurusan AJK Panel**:
   * List of active admin accounts with their roles (Pengerusi, Bendahari, Setiausaha, AJK).
   * Button to `Tambah AJK Baru` (adds email/password) or `Nyahaktif AJK` (revokes access).
3. **Log Audit Tab**:
   * Searchable table showing: Tarikh, Pengguna, Tindakan, Details (JSON raw parameters).

### 8.3 Acceptance Criteria
* **Given** audit log:
  * **When** any admin performs an action (approves a payment or adds an expense), **then** a database trigger must automatically insert a log entry detailing the action.

### 8.4 Data Flow
* **Read**: `settings`, `admin_users`, `audit_log`.
* **Write**: `settings` (updates site variables), `admin_users` (adds/removes accounts).

---

## Module 9: Resident Portal (Portal Penduduk)

### 9.1 User Stories
* **As a Resident**, I want to access a simplified layout on my phone, so that I can easily check my balance and submit payment slips.

### 9.2 UI Layout Description
1. **Simplified Mobile Home Screen**:
   * Greeting: `Selamat Datang, Rumah [No]`
   * **Quick Status Badge**: Large alert showing payment status (e.g. `RM20 Belum Dibayar` or `RM0 Tunggakan`).
   * **12-Month Payment Status Cards**: Row of monthly blocks indicating Paid/Pending/Unpaid.
2. **Action Buttons Grid**:
   * Large tap targets: `Hantar Slip Bayaran`, `Lihat Pengumuman`, `Borang Pendaftaran`, `Hubungi AJK`.

### 9.3 Acceptance Criteria
* **Given** a resident session:
  * **When** a resident is logged in via PIN, **then** they must only be able to view payments and details related to their `house_id` and have no access to other houses.

### 9.4 Data Flow
* **Read**: `houses` (current house info), `payments` (filtered by house_id), `announcements`.
