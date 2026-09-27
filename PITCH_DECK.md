# PITCH DECK — TUTUR

> **Dompet Kripto Bahasa Sehari-hari di opBNB**
> **Event:** Indonesia Web3 Hackathon 2026 — Track 3: Consumer Apps
> **Solo Builder:** Afif Hamzah Siregar

---

## 📊 Ringkasan Slide Presentation (10 Slides)

---

### SLIDE 1: COVER
* **Judul Utama:** TUTUR
* **Tagline:** Transaksi Kripto Bahasa Sehari-hari di opBNB
* **Subjudul:** Dompet Smart Account ERC-4337 Berbasis Perintah Suara, AI Chat Interaktif, dan Proteksi Anti-Penipuan untuk Pasar Indonesia
* **Presenter:** Afif Hamzah Siregar (Solo Builder)
* **Kategori:** Track 3 — Consumer Apps (Indonesia Web3 Hackathon 2026)
* **Visual Key:** Mockup antarmuka dark-mode ponsel cerdas menampilkan percakapan chat ramah beraksen Emas BNB (`#F0B90B`) dan lencana *0 Gas Fee*.

---

### SLIDE 2: THE PROBLEM (4 Tembok Penghalang Web3 Indonesia)
* **Konteks:** Indonesia memiliki 20+ juta pemilik aset kripto, tetapi 95% dari mereka tidak pernah bertransaksi on-chain.
* **4 Friksi Kritis di Lapangan:**
  1. **Seed Phrase Phobia:** Ketakutan kehilangan 12 kata pemulihan yang berujung pada hilangnya saldo selamanya.
  2. **Gas Fee Paradox:** Mau kirim USDT tapi tidak bisa karena saldo native BNB kosong. Pengguna enggan membeli koin gas terpisah.
  3. **Scam & Drainer Epidemic:** Maraknya tautan phishing dan *unlimited token approval* yang menguras seluruh saldo dompet.
  4. **Jargon & Language Barrier:** Antarmuka dApp menggunakan bahasa Inggris teknis (*slippage, gwei, allowance*), sangat jauh dari kebiasaan orang Indonesia bertransaksi sehari-hari.

---

### SLIDE 3: THE SOLUTION (TUTUR)
* **Nilai Jual Utama:** Menjadikan interaksi Web3 semudah mengirim *voice note* atau *chatting* di WhatsApp.
* **3 Pilar Solusi Inti:**
  * **Voice-First & Chat-First:** Mengerti gaya bicara santai Indonesia (*"kirim goceng"*, *"oper ceban"*, *"bayar seratus ribu"*).
  * **0 Gas Fee Onboarding:** Didukung Account Abstraction (ERC-4337) dan Paymaster di jaringan Layer 2 opBNB.
  * **AI Security Shield:** Mendeteksi alamat penipu (*blacklist*) dan mencegah izin saldo tanpa batas (*unlimited approval*) sebelum transaksi dieksekusi.

---

### SLIDE 4: PRODUCT SHOWCASE & USER JOURNEY
* **Alur Pengguna Tanpa Friksi (Seamless 1-Tap Experience):**
  ```
  [Login Google 1-Tap] ➔ [Tekan Mic & Bicara: "Kirim goceng USDT ke Budi"]
        │
        ▼
  [AI Parsing < 1 Detik] ➔ [Form Konfirmasi: 5 USDT ke budi.bnb | Gas: 0 BNB | Aman]
        │
        ▼
  [Konfirmasi Biometrik] ➔ [UserOp opBNB Terkonfirmasi dalam 1.2 Detik]
  ```
* **Fitur Tambahan:**
  * **Interactive Chat Cards:** Kartu transfer langsung muncul di dalam gelembung obrolan chat.
  * **Preset OCR Invoice:** Bayar tagihan hosting dan struk kopi otomatis terkonversi dari Rupiah ke USDT.
  * **Faucet Mandiri 100 USDT:** Pengguna dapat mengisi saldo uji coba dengan proteksi cooldown 60 detik.

---

### SLIDE 5: TEKNOLOGI & INOVASI SISTEM
* **Arsitektur End-to-End Tanpa Server Backend (Client-to-Chain):**
  * **AI Speech Engine:** Groq Whisper Large-v3 API untuk transkripsi suara instan (<800ms).
  * **Slang Normalizer & Heuristic Parser:** 32 entri kamus slang nominal dan kata kerja Indonesia yang diproses secara deterministik tanpa biaya API tambahan.
  * **Generative LLM Assistant:** Groq Cloud AI (`qwen/qwen3.8-27b`) dengan *system prompt persona* bahasa Indonesia kasual yang memahami saldo on-chain dan kurs kurs real-time.
  * **Account Abstraction Layer:** Kontrak EntryPoint ERC-4337 (`0x5FF137D4...`) di opBNB Testnet dengan sponsor policy Paymaster.
  * **Local Persistence:** Penyimpanan lokal native SQLite untuk memastikan riwayat transaksi dapat diakses instan secara offline.

---

### SLIDE 6: AI SECURITY SHIELD
* **Solusi Nyata Melawan Penipuan Web3:**
  * **Audit Blacklist Statis (Varian Merah):** Alamat kontrak tujuan dicocokkan seketika dengan database daftar hitam penipuan Web3 publik. Transaksi diblokir penuh untuk mencegah terkurasnya dana pengguna.
  * **Inspeksi Unlimited Allowance (Varian Kuning):** Memindai calldata untuk mendeteksi `approve(spender, type(uint256).max)`. Pengguna disajikan pilihan aman: *"Batasi Izin Sesuai Transaksi"* (default terpilih) atau *"Batalkan Transaksi"*.
* **Hasil:** Perlindungan proaktif tanpa membuat pengguna awam bingung membaca baris kode smart contract.

---

### SLIDE 7: TRACTION & PROOF OF EXECUTION
* **Metrik Pengujian Nyata (Section 10 PRD):**
  * **Akurasi Intent Parser:** **100.0%** (15 dari 15 kasus uji resmi lolos validasi).
  * **Biaya Onboarding Pengguna:** **$0 / 0 Gas Fee** (100% disponsori Paymaster).
  * **Latensi Konfirmasi Blok:** **~1.2 detik** di jaringan opBNB Testnet.
  * **Kualitas Kode:** **100% Pass** pada kompilasi strict TypeScript (`npm run tsc` dengan 0 error).
  * **Kesiapan Build:** Berjalan mulus di arsitektur Android New Architecture (Fabric).

---

### SLIDE 8: MARKET OPPORTUNITY & BUSINESS MODEL
* **Target Pasar:**
  * 20+ juta pengguna aset kripto di Indonesia (Bappebti 2024).
  * 130+ juta pengguna dompet digital aktif (GoPay, OVO, Dana) yang belum pernah menyentuh Web3.
* **Model Monetisasi Berkelanjutan (V2):**
  * **Mikro-Spread Konversi Rupiah-ke-Token:** Selisih tipis pada transaksi on-ramp/off-ramp.
  * **Sponsorship Merchant & B2B Paymaster:** Merchant Web3 lokal mensponsori gas fee untuk pelanggan mereka melalui API TUTUR.
  * **Biaya Integrasi API Asisten:** Menyediakan widget percakapan transaksi suara TUTUR untuk dApp lain di ekosistem BNB Chain.

---

### SLIDE 9: ROADMAP PENGEMBANGAN
* **Q4 2026 (Post-Hackathon):**
  * Integrasi resmi registrasi domain Space ID (.bnb) on-chain di opBNB Mainnet.
  * Rilis APK publik di Google Play Store & iOS TestFlight.
* **Q1 2027 (Consumer Expansion):**
  * Integrasi **Dynamic QRIS Parser** untuk pembayaran belanjaan offline langsung dari saldo USDT opBNB.
  * Dukungan Passkey sinkronisasi multi-perangkat via iCloud Keychain & Google Password Manager.
* **Q2 2027 (Ecosystem Scale):**
  * Umpan intelijen ancaman real-time (*mempool threat feed*) untuk mendeteksi kontrak scam baru dalam hitungan detik.
  * Fitur batch transaction (multi-call transfer & swap sekaligus).

---

### SLIDE 10: TEAM & CONCLUSION
* **Lead Builder:** **Afif Hamzah Siregar**
  * Peran: Solo Full-Stack Web3 Builder (Frontend React Native, Smart Contracts, AI Pipeline Integration).
* **Pesan Penutup untuk Dewan Juri:**
  > *"Web3 tidak boleh eksklusif hanya untuk orang yang paham teknis bahasa Inggris. Masa depan adopsi massal dimulai ketika seorang pedagang kopi di Jakarta bisa menerima USDT semudah mendengarkan voice note. Bersama opBNB dan TUTUR, kita wujudkan adopsi kripto sehari-hari di Indonesia!"*
* **Tautan Repositori:** [github.com/senjaikuyo/tutur](https://github.com/senjaikuyo/tutur)
* **Dokumentasi Lengkap:** [PRD.md](PRD.md) & [README.md](README.md)
