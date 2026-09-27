# SKRIP VIDEO DEMO HACKATHON — TUTUR

> **Panduan Rekaman Layar 2–3 Menit untuk Penilaian Juri Indonesia Web3 Hackathon 2026**
> **Track:** Track 3 (Consumer Apps)
> **Presenter / Builder:** Afif Hamzah Siregar (Solo Builder)
> **Target Durasi:** 2 menit 30 detik – 3 menit (Ideal: ~2 menit 45 detik)

---

## 🎬 Tips Rekaman Sebelum Mulai
1. **Resolusi Rekaman:** Rekam layar dalam orientasi portrait (layar HP/emulator Android) dengan audio suara mic yang jernih tanpa noise.
2. **Kondisi Aplikasi:** Pastikan aplikasi sudah login (terlihat nama "Rian Senja" dan saldo 100 USDT atau lebih).
3. **Tempo Bicara:** Santai, percaya diri, dan bersemangat.

---

## ⏱️ Alur Runut Detik-demi-Detik

---

### SEGMENT 1: The Hook & Problem (00:00 – 00:25)
* **Visual Layar:**
  - Buka aplikasi TUTUR dari awal. Tampilkan layar splash screen gelap beraksen emas BNB bertuliskan *"TUTUR — Dompet Kripto Bahasa Sehari-hari"*, lalu masuk ke layar login.
* **Aksi Layar:**
  - Tap tombol *"Masuk dengan Google"*. Masuk seketika ke layar beranda chat view tanpa ada prompt 12 kata pemulihan (*seed phrase*).
* **Narasi Suara:**
  > *"Halo dewan juri Indonesia Web3 Hackathon 2026! Saya Afif Hamzah Siregar, solo builder di balik TUTUR.*
  > *Tahukah Anda, ada lebih dari 20 juta orang Indonesia yang punya kripto, tapi 95% dari mereka takut pakai dompet on-chain. Kenapa? Karena takut kehilangan 12 kata seed phrase, pusing harus beli koin gas BNB dulu cuma buat transfer USDT, dan bingung dengan istilah bahasa Inggris yang kaku.*
  > *Hari ini, perkenalkan **TUTUR** — dompet Web3 cerdas berbasis suara dan chat bahasa sehari-hari di atas jaringan opBNB."*

---

### SEGMENT 2: Voice-to-Intent Slang Indonesia (00:25 – 01:10)
* **Visual Layar:**
  - Di layar utama (Chat View), tunjukkan tombol mikrofon bulat kuning di pojok kanan bawah.
* **Aksi Layar:**
  - Tekan tombol mikrofon kuning. Modal `VoiceOverlay` muncul dengan animasi gelombang suara (*waveform*) emas yang bergerak dan timer detik rekaman.
  - Ucapkan kalimat perintah suara:
    👉 **"Kirim goceng USDT ke Budi"**
  - Klik *"Selesai Bicara"*.
  - Teks terurai seketika di bubble chat dan langsung membuka layar **Konfirmasi Transaksi**.
* **Narasi Suara:**
  > *"Di TUTUR, pengguna tidak perlu mengetik alamat heksadesimal 42 karakter yang membingungkan. Cukup tekan mic dan bicara seperti ngobrol santai dengan teman:*
  > *'Kirim goceng USDT ke Budi'.*
  > *Dalam waktu kurang dari 1 detik, sistem Natural Language Processing TUTUR memahami istilah prokem 'goceng' sebagai 5 USDT, memetakan nama kontak Budi ke domain budi.bnb di opBNB, dan langsung menyiapkan form konfirmasi dengan biaya gas 0 BNB!"*

---

### SEGMENT 3: Gasless Account Abstraction di opBNB (01:10 – 01:45)
* **Visual Layar:**
  - Layar `ConfirmationScreen` menampilkan:
    - Nominal: `5.00 USDT (≈ Rp 89.580)`
    - Kepada: `budi.bnb (0x7099...79C8)`
    - Biaya Gas: `0 BNB (Disponsori Paymaster)`
    - Status Keamanan: `● Aman`
* **Aksi Layar:**
  - Klik tombol kuning **"Konfirmasi & Kirim"**.
  - Tombol menampilkan loading *"Memproses UserOp..."*, lalu muncul toast hijau *"Transfer 5 USDT berhasil dikirim via opBNB!"*.
  - Layar otomatis kembali ke Home Chat View dan saldo terpotong secara akurat.
* **Narasi Suara:**
  > *"Perhatikan bagian biaya gas: 0 BNB!*
  > *Berkat arsitektur Account Abstraction ERC-4337 dan Paymaster sponsorship di opBNB, pengguna tidak perlu memiliki saldo native BNB sama sekali. Transaksi dibungkus dalam objek UserOperation dan dieksekusi secara instan dengan finalitas blok opBNB di bawah 2 detik. Bebas gas, bebas ribet!"*

---

### SEGMENT 4: Generative AI Chat Assistant (01:45 – 02:15)
* **Visual Layar:**
  - Layar beranda bergaya chat percakapan.
* **Aksi Layar:**
  - Di kolom ketik teks bawah, ketik pertanyaan santai:
    👉 **"cek saldo gue"** ➔ tekan kirim.
  - Asisten TUTUR AI langsung membalas dalam waktu nyata:
    *"Saldo dompet kamu saat ini adalah 185.00 USDT (≈ Rp 3.314.460) di jaringan opBNB Testnet 💰"*
  - Ketik perintah kedua:
    👉 **"oper seratus ribu ke warung"** ➔ tekan kirim.
  - Asisten AI membalas dan **menyematkan Interactive Transaction Card** di dalam bubble percakapan (terlihat nominal terkonversi otomatis Rp 100.000 / 17.916 = 5.58 USDT ke warung.bnb).
  - Tap tombol *"Lanjutkan Transaksi >"* di dalam kartu chat. Form konfirmasi langsung terbuka!
* **Narasi Suara:**
  > *"Selain suara, TUTUR juga dilengkapi Generative AI Chat Assistant yang ditenagai oleh model Groq Cloud AI. Pengguna bisa bertanya apa saja dengan bahasa santai, seperti 'cek saldo gue'.*
  > *Bahkan saat kita bilang 'oper seratus ribu ke warung', AI langsung mengonversi nilai rupiah ke 5.58 USDT dan memunculkan kartu transaksi interaktif tepat di dalam obrolan chat. Pengguna cukup tap 'Lanjutkan Transaksi' untuk menyelesaikan pembayaran!"*

---

### SEGMENT 5: AI Security Shield — Anti-Phishing & Drainer (02:15 – 02:40)
* **Visual Layar:**
  - Buka tab **Scan** di menu navigasi bawah.
  - Tunjukkan viewfinder kamera live dengan animasi laser bar emas pemindai.
* **Aksi Layar:**
  - Klik chip pengujian demo: **"QR Blacklist"** (simulasi memindai alamat penipuan drainer).
  - Form konfirmasi terbuka dengan badge merah mencolok: **● Berbahaya (Blacklist)**.
  - Klik tombol merah *"Periksa Risiko Keamanan (Blacklist)"*.
  - Muncul pop-up **SecurityWarningModal Merah**:
    *"PERINGATAN KEAMANAN: Alamat tujuan terdata sebagai alamat yang dilaporkan terlibat penipuan. Transaksi DIBLOKIR demi keamanan dana kamu."*
  - Klik tombol *"Batalkan (Sangat Direkomendasikan)"*. Transaksi otomatis digagalkan demi keselamatan pengguna.
* **Narasi Suara:**
  > *"Salah satu ketakutan terbesar pengguna Web3 adalah wallet drainer dan scam link. TUTUR menjawab ini dengan **AI Security Shield**.*
  > *Saat pengguna memindai atau mengirim ke alamat yang terdata di blacklist scam publik, TUTUR langsung memblokir transaksi secara tegas dengan pop-up peringatan merah. Sistem kami juga mendeteksi calldata berbahaya seperti unlimited token approval untuk memastikan saldo pengguna tidak pernah terkuras tanpa izin!"*

---

### SEGMENT 6: Preset Invoice & Penutup (02:40 – 03:00)
* **Visual Layar:**
  - Di tab Scan, tunjukkan 2 tombol preset OCR (*"Tagihan Hosting $15"* dan *"Struk Kopi Rp 25.000"*).
  - Buka tab **History**, tunjukkan seluruh riwayat transaksi yang tersimpan persisten di database SQLite lokal.
  - Kembali ke Home Screen.
* **Narasi Suara:**
  > *"TUTUR juga mendukung pembayaran tagihan instan seperti struk kopi dan tagihan hosting, serta penyimpanan riwayat transaksi persisten secara lokal.*
  > *Dengan TUTUR, batas antara aplikasi fintech Web2 dan ekosistem Web3 opBNB telah runtuh. Kini, bertransaksi kripto semudah mengirim voice note.*
  > *Terima kasih dewan juri, mari bawa jutaan pengguna Indonesia masuk ke Web3 bersama TUTUR!"*

---

## 📋 Checklist Validasi Video Sebelum Submit
- [ ] Durasi video antara 2:15 hingga 2:50 menit (tidak melebihi 3 menit).
- [ ] Suara rekaman jelas dan tidak tertutup musik latar.
- [ ] Fitur utama terdokumentasi lengkap: Voice Command Slang, Gasless Paymaster opBNB, Chat AI Generatif, dan Security Shield Merah.
- [ ] Tautan video diunggah ke YouTube (Unlisted) atau Google Drive publik sesuai ketentuan portal `indonesiaweb3hack.xyz`.
