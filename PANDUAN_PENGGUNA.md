# Panduan Pengguna: E-Komuniti Taman Langat Utama 2
**Sistem Pengurusan Yuran & Kewangan Penduduk Digital**

Selamat datang ke aplikasi **E-Komuniti Taman Langat Utama 2**! Aplikasi ini dibina khas untuk memudahkan urusan kutipan yuran bulanan RM20, memantau aliran wang masuk dan keluar secara telus, serta membantu proses penubuhan Persatuan Penduduk kita.

Panduan ini ditulis dalam bahasa yang mudah difahami oleh semua golongan penduduk, termasuk makcik, pakcik, AJK, dan Bendahari.

---

## 1. 📋 Pengenalan

Aplikasi E-Komuniti ini dibina untuk menggantikan sistem buku resit kertas dan papan tulis manual. Dengan adanya sistem ini:
* **Penduduk** boleh membayar yuran secara dalam talian (online) dan menyemak status bayaran dari telefon pintar masing-masing.
* **Bendahari** tidak perlu lagi menulis resit manual satu-persatu dan boleh memantau baki tabung persatuan secara masa nyata (real-time).
* **Komuniti** mendapat ketelusan 100% kerana setiap sen wang masuk dan keluar direkodkan dan boleh dipantau oleh semua penduduk.

---

## 2. 📱 Cara Akses Aplikasi

Aplikasi ini adalah **Aplikasi Web Progresif (PWA)**. Anda tidak perlu memuat turunnya dari Google Play Store atau Apple App Store. Cukup sekadar membukanya melalui pelayar web (browser).

### 2.1 Membuka Aplikasi
1. Buka pelayar web (contohnya **Google Chrome** pada Android, atau **Safari** pada iPhone).
2. Masukkan URL aplikasi: `https://ekomuniti-tlu2.pages.dev` *(atau URL rasmi persatuan jika ada)*.

### 2.2 Cara Simpan di Telefon (Add to Home Screen)
Untuk memudahkan anda membuka aplikasi ini seperti aplikasi biasa pada bila-bila masa:

* **Bagi Pengguna Android (Google Chrome)**:
  1. Klik butang tiga titik bertindih (menu) di penjuru kanan atas Chrome.
  2. Pilih **"Add to Home Screen"** (atau **"Pasang Aplikasi / Install App"**).
  3. Klik **"Add"**. Ikon E-Komuniti akan muncul di skrin utama telefon anda.

* **Bagi Pengguna iPhone / iPad (Safari)**:
  1. Klik butang **"Share"** (ikon kotak dengan anak panah ke atas) di bahagian bawah skrin Safari.
  2. Leret ke bawah dan pilih **"Add to Home Screen"**.
  3. Klik **"Add"** di penjuru kanan atas. Ikon E-Komuniti kini sedia digunakan di skrin utama iPhone anda.

---

## 3. 🏡 Panduan untuk Penduduk (Resident)

Sebagai penduduk, anda boleh melihat rekod bayaran anda, menghantar bukti bayaran baru, dan mendaftar maklumat ahli keluarga.

### 3.1 Log Masuk Portal Penduduk
1. Pada skrin utama aplikasi, pilih tab **"Portal Penduduk"**.
2. Pilih **Nombor Rumah** anda daripada senarai dropdown (Contoh: `No. 12`).
3. Masukkan **4-Digit PIN** rumah anda (PIN lalai pertama kali adalah `1234` — sila tukar di bahagian tetapan demi keselamatan).
4. Klik **"Log Masuk"**.

### 3.2 Cara Menyemak Status Bayaran
Selepas log masuk, anda akan melihat kad berwarna-warni yang mewakili 12 bulan untuk tahun semasa:
* 🟢 **Hijau (Sudah Bayar)**: Yuran RM20 anda telah selamat diterima dan disahkan oleh Bendahari.
* 🟡 **Kuning (Menunggu Pengesahan)**: Anda telah menghantar bukti bayaran, dan Bendahari sedang menyemaknya.
* 🔴 **Merah (Belum Bayar)**: Tiada rekod bayaran dikesan untuk bulan tersebut. Sila buat pembayaran secepat mungkin.

---

### 3.3 Cara Menghantar Bukti Bayaran (Bank Transfer)
Jika anda membuat bayaran secara pindahan bank (online transfer) ke akaun persatuan, hantarkan bukti bayaran melalui aplikasi:

1. Log masuk ke Portal Penduduk.
2. Klik butang **"Hantar Slip Bayaran"**.
3. **Pilih Bulan**: Tanda (tick) pada bulan yang ingin dibayar. Anda boleh memilih lebih dari satu bulan (contoh: bayar RM60 sekaligus untuk Julai, Ogos, dan September).
4. **Masukkan Amaun**: Sistem akan mengira automatik (Contoh: 3 bulan = RM60). Pastikan amaun dipindahkan di bank adalah sama.
5. **Masukkan No. Rujukan Bank**: Salin dan tampal (paste) nombor rujukan daripada resit bank (contoh: `Ref: 123456789`). Ini penting untuk Bendahari membuat semakan silang dengan penyata bank.
6. **Muat Naik Slip**: Klik pada kotak kamera, ambil gambar resit fizikal, atau pilih tangkapan skrin (screenshot) slip bank daripada galeri telefon anda.
7. Klik **"Hantar Bukti Pembayaran"**. Status bulan tersebut akan bertukar menjadi **Kuning (Awaiting Verification)**.

---

### 3.4 Menerima Resit Digital
Selepas Bendahari meluluskan bayaran anda:
1. Status bulan berkenaan di portal anda akan bertukar menjadi **Hijau (Sudah Bayar)**.
2. Klik pada bulan tersebut untuk melihat **Resit Digital Rasmi TLU2**.
3. Resit akan memaparkan nombor resit unik (Contoh: `TLU2-0024`), tarikh, kaedah bayaran, dan kod QR pengesahan.
4. Anda boleh klik **"Muat Turun Resit"** atau simpan tangkapan skrin (screenshot) untuk rujukan peribadi.

---

## 4. 💼 Panduan untuk AJK & Bendahari (Admin)

Modul ini dihadkan kepada AJK yang dilantik sahaja untuk merekod kewangan dan menyemak transaksi.

### 4.1 Log Masuk Pentadbir
1. Klik butang **"Log Masuk AJK"** di penjuru kanan atas skrin.
2. Masukkan alamat email rasmi AJK anda dan kata laluan.
3. Klik **"Log Masuk"**. Anda kini berada di Dashboard Pentadbiran.

---

### 4.2 Cara Sahkan Pembayaran Penduduk
Apabila penduduk menghantar slip bayaran secara online, Bendahari perlu mengesahkannya:

1. Buka menu **"Kutipan Bayaran"** → pilih tab **"Menunggu Pengesahan"**.
2. Klik pada baris rekod bayaran untuk membuka panel semakan.
3. Semak **Amaun**, **Bulan**, dan **No. Rujukan** yang diisi oleh penduduk berbanding dengan gambar slip bank yang dipaparkan.
4. Buat semakan silang dengan aplikasi bank persatuan anda.
5. Jika semua maklumat betul, klik **"Sahkan Bayaran"** (Butang Hijau). Status bayaran penduduk akan bertukar menjadi Hijau secara automatik dan resit digital dijana.
6. Jika bayaran salah atau slip tidak jelas, masukkan sebab pada ruangan nota (contoh: *"Slip bank kabur, sila hantar semula"*) dan klik **"Tolak Bayaran"** (Butang Merah). Penduduk akan melihat nota penolakan ini di portal mereka.

---

### 4.3 Cara Merekod Bayaran Tunai (Cash)
Bagi penduduk (terutama warga emas) yang gemar membayar secara tunai ketika mesyuarat atau berjumpa AJK:

1. Di Dashboard AJK, klik butang **"Rekod Bayaran Tunai"**.
2. Pilih **Nombor Rumah** yang membuat bayaran.
3. Pilih **Bulan** yang ingin dibayar.
4. Masukkan amaun (Sistem akan set RM20 secara lalai).
5. Klik **"Simpan & Jana Resit"**.
6. Resit digital akan dijana serta-merta. Anda boleh kongsikan pautan resit tersebut terus kepada nombor WhatsApp penduduk berkenaan.

---

### 4.4 Cara Merekod Perbelanjaan (Wang Keluar)
Setiap perbelanjaan taman (seperti gaji pengawal keselamatan, bil elektrik kabin, minyak mesin rumput, kos mesyuarat) wajib direkodkan:

1. Pergi ke menu **"Pengurusan Perbelanjaan"**.
2. Klik butang **"Tambah Perbelanjaan"**.
3. Isi borang:
   * **Amaun (RM)**: Jumlah wang keluar (contoh: `800.00`).
   * **Kategori**: Pilih kategori yang sesuai (contoh: `Yuran Kawalan Keselamatan` atau `Kos Penubuhan`).
   * **Tarikh**: Tarikh pembayaran dibuat.
   * **Penerangan**: Nyatakan butiran terperinci (contoh: *"Gaji pengawal keselamatan Julai 2026 - 2 orang"*).
   * **Resit / Invois**: Ambil gambar resit pembelian atau invois daripada kedai.
4. Klik **"Simpan Perbelanjaan"**. Aliran tunai persatuan akan ditolak secara automatik.

---

### 4.5 Mengurus Kategori & Bajet Bulanan
Aplikasi membolehkan Bendahari menetapkan had bajet bulanan untuk mengelakkan perbelanjaan berlebihan:
1. Di menu **"Pengurusan Perbelanjaan"** → pilih tab **"Urus Kategori"**.
2. Anda boleh menambah kategori baru atau menukar **Had Bajet Bulanan** (contoh: Had bajet potong rumput ditetapkan RM300/bulan).
3. Jika perbelanjaan sebenar bulanan melebihi bajet, bar indikator di Dashboard akan bertukar menjadi merah sebagai amaran awal kepada jawatankuasa.

---

### 4.6 Cara Menghantar Peringatan WhatsApp (WhatsApp Nudge)
Untuk mengingatkan penduduk yang belum membayar yuran bulanan:
1. Pergi ke **Dashboard AJK**.
2. Cari ruangan **"Senarai Tunggakan"** (Defaulter List).
3. Klik butang **"Salin Peringatan WhatsApp"**.
4. Mesej peringatan yang lengkap dalam Bahasa Melayu bersama senarai semua nombor rumah yang belum membayar yuran bulan tersebut akan disalin secara automatik ke dalam clipboard anda.
5. Buka WhatsApp, pergi ke group taman, dan klik **"Paste" (Tampal)** lalu hantar.

---

### 4.7 Cara Mengambil Backup & Laporan Kewangan
Bendahari wajib melakukan backup bulanan untuk keselamatan data:
1. Pergi ke menu **"Laporan"**.
2. Pilih tahun dan bulan yang dikehendaki.
3. Klik **"Eksport CSV"** untuk memuat turun data dalam format Microsoft Excel. Simpan fail ini di komputer atau Google Drive persatuan.
4. Untuk mesyuarat agung, klik **"Penyata Tahunan (PDF)"** untuk mencetak laporan A4 yang lengkap dengan carta pai perbelanjaan.

---

## 5. 🏛️ Panduan Semasa Proses Penubuhan (Modul Penubuhan)

Gunakan modul ini secara aktif dari hari pertama perbincangan sehingga pendaftaran persatuan kita diluluskan oleh Jabatan Pendaftaran Pertubuhan Malaysia (ROS).

### 5.1 Urus Log Kehadiran Mesyuarat Pelantikan
Pada hari mesyuarat agung pelantikan persatuan:
1. Letakkan sebuah tablet atau telefon di meja pendaftaran hadapan.
2. Buka aplikasi, log masuk sebagai AJK, dan pergi ke menu **"Kehadiran"**.
3. Klik **"Buka Kaunter Kehadiran"** dan pilih **"Mesyuarat Agung Pelantikan"**.
4. Penduduk yang datang hanya perlu klik pada nombor rumah mereka dan klik **"Hadir"**.
5. Live display di skrin akan menunjukkan peratusan kehadiran secara automatik. Ini membantu AJK memastikan mesyuarat sah mengikut undang-undang kuorum ROS (melebihi 50% kehadiran rumah).

### 5.2 Borang Pendaftaran Ahli Digital
Bagi mengelakkan AJK menaip semula borang kertas ke dalam komputer untuk dihantar ke portal e-ROSES:
1. Minta penduduk mengisi maklumat melalui **"Borang Pendaftaran Ahli"** di portal penduduk masing-masing.
2. Penduduk mengisi nama, nombor IC, nombor telefon, dan menandakan persetujuan perlembagaan.
3. Setiausaha boleh memuat turun senarai lengkap ahli yang telah berdaftar terus ke dalam format Excel yang mesra e-ROSES.

---

## 6. ❓ Soalan Lazim (FAQ)

* **S: Saya terlupa PIN rumah saya. Bagaimana saya mahu dapatkan semula?**
  * *J: Atas faktor keselamatan, PIN rumah tidak dipaparkan secara terbuka. Sila hubungi Bendahari atau Setiausaha persatuan. Mereka boleh menetapkan semula (reset) PIN rumah anda kepada PIN baru melalui menu Tetapan AJK.*

* **S: Saya sudah membuat bayaran online dan memuat naik slip, tetapi mengapa status rumah saya masih berwarna Merah?**
  * *J: Status akan bertukar Kuning (Menunggu Pengesahan) sebaik sahaja anda menghantar bukti. Jika masih Merah, mungkin proses penghantaran terganggu (contoh: masalah liputan internet). Sila cuba hantar semula slip di portal.*

* **S: Bolehkah saya membuat bayaran untuk 6 bulan terus secara online?**
  * *J: Ya, boleh. Apabila anda klik butang bayar yuran, tandakan sahaja 6 kotak bulan berturut-turut (contoh: Januari hingga Jun). Amaun yuran akan dikira menjadi RM120. Hantarkan slip RM120 tersebut dan Bendahari akan meluluskannya sekali gus.*

* **S: Adakah aplikasi ini boleh berfungsi jika tiada talian internet (offline)?**
  * *J: Ya, sebagai PWA, aplikasi masih boleh dibuka walaupun tiada internet. Anda boleh menyemak baki dana lepas dan status pembayaran yang telah disimpan dalam cache. Walau bagaimanapun, untuk menghantar slip bayaran baru atau mengesahkan transaksi, sambungan internet diperlukan.*

---

## 7. 📞 Hubungi Jawatankuasa Persatuan

Sekiranya anda mempunyai sebarang soalan, masalah berkaitan PIN, atau memerlukan bantuan teknikal, sila hubungi wakil persatuan di bawah:

* **Pengerusi**: [Nama Pengerusi] — [No. Telefon]
* **Bendahari**: [Nama Bendahari] — [No. Telefon]
* **Setiausaha**: [Nama Setiausaha] — [No. Telefon]
* **Biro IT**: [Nama Biro IT] — [No. Telefon]
