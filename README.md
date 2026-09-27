# TUTUR — Dompet Kripto Bahasa Sehari-hari

> **Transaksi Kripto Semudah Ngobrol Biasa: Perintah Suara, AI Chat Interaktif, Scan Struk, dan Proteksi Anti-Penipuan di opBNB**

[![Event](https://img.shields.io/badge/Event-Indonesia_Web3_Hackathon_2026-F0B90B?style=for-the-badge&logo=binance&logoColor=black)](https://indonesiaweb3hack.xyz)
[![Track](https://img.shields.io/badge/Track-3:_Consumer_Apps-10B981?style=for-the-badge)](https://indonesiaweb3hack.xyz)
[![Network](https://img.shields.io/badge/Network-opBNB_Testnet_(5611)-F0B90B?style=for-the-badge&logo=bnbchain&logoColor=black)](https://opbnb-testnet.bscscan.com)
[![Standard](https://img.shields.io/badge/Standard-ERC--4337_Account_Abstraction-blue?style=for-the-badge)](https://eips.ethereum.org/EIPS/eip-4337)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25_Pass_(0_Errors)-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](tsconfig.json)
[![Accuracy](https://img.shields.io/badge/Intent_Accuracy-100%25_(15/15_Passed)-success?style=for-the-badge)]()
[![Gas Sponsorship](https://img.shields.io/badge/Gas_Fee-0_BNB_(Paymaster_Sponsored)-10B981?style=for-the-badge)]()

---

## 📑 Daftar Isi
1. [Ringkasan Eksekutif & Problem Statement](#1-ringkasan-eksekutif--problem-statement)
2. [Arsitektur Sistem & Alur Kerja (System Architecture)](#2-arsitektur-sistem--alur-kerja)
3. [Fitur Unggulan (Core Pillars)](#3-fitur-unggulan-core-pillars)
4. [Bukti Pengujian & Metrik Kunci (Key Metrics)](#4-bukti-pengujian--metrik-kunci)
5. [Panduan Pengujian Juri (Judge's Evaluation Guide)](#5-panduan-pengujian-juri)
6. [Teknologi & Tech Stack](#6-teknologi--tech-stack)
7. [Struktur Proyek & Instalasi Lokal](#7-struktur-proyek--instalasi-lokal)
8. [Referensi Smart Contract & On-Chain](#8-referensi-smart-contract--on-chain)
9. [Roadmap Pengembangan V2](#9-roadmap-pengembangan-v2)
10. [Profil Builder & Lisensi](#10-profil-builder--lisensi)

---

## 1. Ringkasan Eksekutif & Problem Statement

### 1.1 Visi
**TUTUR** menghilangkan hambatan psikologis dan teknis interaksi Web3 bagi 270+ juta masyarakat Indonesia. Dengan menggabungkan **Natural Language Processing berbahasa santai Indonesia**, **Generative AI Chat Assistant**, dan **Account Abstraction (ERC-4337)** di atas jaringan **opBNB**, TUTUR memungkinkan siapa saja bertransaksi kripto secepat mengirim pesan suara di WhatsApp, tanpa rasa takut kehilangan dana atau pusing menghitung gas fee.

### 1.2 Masalah Nyata (The 4 Barriers in Web3)
Meskipun Indonesia memiliki lebih dari 20 juta investor aset kripto, sebagian besar aset tertahan di Centralized Exchange (CEX). Pengguna enggan beralih ke dompet on-chain karena 4 friksi kritis:

| # | Friksi Pengguna Kasual | Masalah di Lapangan | Solusi yang Dihadirkan TUTUR |
|---|---|---|---|
| **1** | **Seed Phrase Anxiety** | Takut salah mencatat atau kehilangan 12 kata pemulihan yang berakibat lenyapnya seluruh saldo. | **0 Seed Phrase Onboarding**: Menggunakan Social Login Google + WebAuthn Biometric MPC via Account Abstraction. |
| **2** | **Gas Fee & Native Coin Barrier** | Untuk mentransfer USDT, pengguna wajib memiliki saldo koin native (BNB) terlebih dahulu. Jika saldo BNB Rp 0, token terkunci. | **0 Gas Fee (Disponsori Penuh)**: Paymaster ERC-4337 di opBNB mensubsidi 100% biaya gas transaksi pengguna. |
| **3** | **Ketakutan Phishing & Drainer** | Pengguna awam tidak bisa membaca calldata kontrak dan sering terjebak *unlimited token approval* atau transfer ke alamat palsu. | **AI Security Shield**: Mengaudit alamat tujuan terhadap blacklist scam publik dan memblokir izin saldo tanpa batas (*unlimited allowance*). |
| **4** | **Jargon & Bahasa Asing** | Antarmuka dApp menggunakan istilah teknis bahasa Inggris (*slippage, gwei, allowance*), bukan bahasa percakapan harian. | **Local Slang Normalizer Engine**: Mengerti gaya bicara orang Indonesia (*"kirim goceng"*, *"oper ceban"*, *"bayar seratus ribu"*). |

### 1.3 Target Persona
* **Nama:** Rian (23 tahun), mahasiswa / pekerja lepas kreatif.
* **Karakteristik:** Memiliki aset kripto di CEX lokal, terbiasa bertransaksi digital via QRIS dan dompet digital (GoPay/OVO), cemas menggunakan dompet DeFi biasa karena takut salah kirim atau terkena penipuan.
* **Kebutuhan Utama:** Pengiriman kilat tanpa perlu membeli koin gas terpisah, perintah dalam bahasa sehari-hari, serta kepastian bahwa transaksi yang dikonfirmasi 100% aman.

---

## 2. Arsitektur Sistem & Alur Kerja

TUTUR dibangun secara modular dengan memadukan antarmuka mobile native, pipeline pemrosesan bahasa alami deterministik & generatif, perlindungan keamanan calldata, serta lapisan kontrak pintar ERC-4337 di opBNB.

### 2.1 Diagram Arsitektur Komprehensif

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TUTUR MOBILE APP (React Native + NativeWind)                    │
│                                                                                        │
│  [Chat View Interaktif]  [Push-to-Talk Voice]  [QR Viewfinder Laser]  [Offline Cache]  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
┌───────────────────────────────────────────────┐     ┌──────────────────────────────────┐
│             AI & INTENT PIPELINE              │     │         AI SECURITY SHIELD       │
│                                               │     │                                  │
│  1. Audio Capture (Push-to-Talk maks 10 detik)│     │  1. Blacklist Threat Audit       │
│        │                                      │     │     - Set Matching O(1)          │
│        ▼                                      │     │     - Deteksi Phishing/Drainer   │
│  2. Groq Whisper Large-v3 STT Engine          │     │     - Modal Merah (Block)        │
│        │                                      │     │                                  │
│        ▼                                      │     │  2. Unlimited Allowance Audit    │
│  3. Slang Normalizer (32 Entri Slang Kamus)   │     │     - Calldata approve() Inspect │
│        │                                      │     │     - Type(uint256).max Intercept│
│        ▼                                      │     │     - Modal Kuning (Safe Limit)  │
│  4. Rupiah Converter (Kurs Tetap: 17.916)     │     └────────────────┬─────────────────┘
│        │                                                             │
│        ▼                                                             │
│  5. Deterministic 8-Step Intent Parser                               │
│        │                                                             │
│        ▼                                                             │
│  6. Generative LLM Assistant (Qwen 27B / Llama 70B)                  │
│        │                                                             │
│        ▼                                                             │
│  7. Interactive Transaction Card                                     │
└───────────────────────┬──────────────────────────────────────────────┘
                        │
                        ▼ (Jika parameter tidak lengkap -> Quick-Fill Modal)
                        ▼ (Jika lengkap -> Form Konfirmasi Transaksi)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     ACCOUNT ABSTRACTION LAYER (ERC-4337)                               │
│                                                                                        │
│  1. UserOperation Struct Builder (Sender, Nonce, Calldata, GasLimits, PaymasterAndData)│
│  2. Gasless Paymaster Sponsorship (100% Subsidi Gas opBNB)                             │
│  3. Client-Side Pre-flight Balance Validation (Blokir sebelum kirim jika saldo kurang) │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼ (JSON-RPC eth_sendUserOperation)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            opBNB TESTNET (Chain ID: 5611)                              │
│                                                                                        │
│  • EntryPoint Contract: 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789                     │
│  • MockUSDT Contract:  0x9483DF0A10aCEFbeCc7b3b3a3055e8838B57D619                     │
│  • Bundler Execution  ➔ Fast Block Finality (<2 detik) ➔ 0 Gas Fee bagi Pengguna      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Fitur Unggulan (Core Pillars)

### 3.1 Voice-to-Intent Pipeline Berbahasa Indonesia Sehari-Hari
Pengguna cukup menekan tombol mikrofon dan berbicara santai. Pipeline ini bekerja dalam 8 langkah deterministik:
1. **Audio Capture:** Merekam audio suara dengan durasi maksimal 10 detik via push-to-talk.
2. **Groq Whisper Large-v3:** Mentranskripsi audio ke teks dalam waktu rata-rata ~800ms.
3. **Slang Normalizer (`slangDictionary.ts`):** Mengganti bahasa prokem/slang menjadi angka numerik:
   - *goceng* ➔ `5`
   - *ceban* ➔ `10`
   - *gocap* ➔ `50`
   - *cepek* ➔ `100`
   - *gopek* ➔ `500`
   - *seceng* ➔ `1000`
   - *setengah* ➔ `0.5`
   - *seperempat* ➔ `0.25`
4. **Rupiah Converter (`currencyConverter.ts`):** Mengidentifikasi nominal rupiah (contoh: *"seratus ribu"*, *"500rb"*, *"satu juta"*) dan mengonversinya ke estimasi USDT secara otomatis dengan kurs terstandarisasi 1 USDT = Rp 17.916.
5. **Action Extractor:** Mendeteksi intensi: `TRANSFER`, `BALANCE` (cek saldo), atau `SWAP_UNAVAILABLE` (memberikan edukasi bahwa swap belum tersedia di MVP).
6. **Recipient Extractor:** Mengekstrak nama tujuan (mendukung domain BNS `.bnb` seperti `budi.bnb`, `warung.bnb`, atau alamat hex `0x...`).
7. **Amount & Token Extractor:** Menangkap nominal token (default: `USDT`).
8. **Confidence Calculator:** Menghitung skor keyakinan berdasarkan bobot kelengkapan field (Action: 35%, Amount: 30%, Recipient: 25%, Token: 10%).

### 3.2 Generative AI Chat Assistant (`chatService.ts` & `HomeScreen.tsx`)
Bukan sekadar form kaku, layar beranda TUTUR berwujud **Chat View Interaktif**:
* Terhubung ke Groq Cloud API LLM (`qwen/qwen3.8-27b`) dengan *system prompt* khusus ber-persona asisten keuangan kasual Indonesia.
* Memahami konteks saldo pengguna secara real-time.
* Saat pengguna mengetik perintah transfer (contoh: *"kirimin Afif gocap USDT dong"*), AI membalas ramah dan **menyematkan Interactive Transaction Card** di dalam bubble percakapan.
* Mengetuk kartu tersebut langsung membawa pengguna ke layar konfirmasi transaksi.

### 3.3 Account Abstraction & Gasless Paymaster (opBNB)
* **ERC-4337 UserOperation:** Seluruh transaksi dibungkus dalam spesifikasi standar UserOperation tanpa mengharuskan pengguna menandatangani transaksi EOA manual.
* **100% Gasless Paymaster:** Mengisi field `paymasterAndData` sehingga pengguna dapat mengirim transaksi dengan **0 tBNB** di dompet mereka.
* **Faucet Mandiri 100 USDT (FR-4.5):** Dilengkapi tombol minting faucet mandiri dengan proteksi *rate limiting* berupa hitung mundur cooldown 60 detik langsung di antarmuka aplikasi.
* **Pre-flight Balance Check (FR-4.4):** Memeriksa saldo pengirim via RPC `eth_call balanceOf` sebelum UserOp dikirim, mencegah pemborosan kuota Paymaster jika saldo tidak mencukupi.

### 3.4 AI Security Shield (Anti-Phishing & Unlimited Allowance)
* **Blacklist Phishing Audit (FR-6.1):** Alamat tujuan dicocokkan seketika dengan daftar hitam database scam Web3 (`blacklist.json`). Jika cocok, transaksi otomatis **DIBLOKIR PENUH** dengan pop-up peringatan merah (*Danger Modal*), kecuali jika pengguna secara eksplisit menekan *"Saya paham risikonya"*.
* **Unlimited Allowance Warning (FR-6.2 & FR-6.3):** Mendeteksi calldata `approve(spender, type(uint256).max)`. Pengguna disajikan pop-up peringatan kuning interaktif dengan pilihan radio:
  - *"Batasi Izin Sesuai Transaksi"* (Direkomendasikan — default terpilih).
  - *"Batalkan Transaksi"*.
  Setelah memilih opsi aman, badge transaksi seketika berubah menjadi hijau **● Aman (Izin Dibatasi)**.

### 3.5 QR Scanner & Preset OCR Invoice (FR-5)
* **Viewfinder Laser Animasi:** Kamera live pemindai QR code dengan frame sudut emas BNB dan bar laser pemindai.
* **Parser Fleksibel:** Mendukung format EIP-681 (`ethereum:0x...`), alamat hex polos 42 karakter, dan nama BNS `.bnb`.
* **Preset OCR Tagihan:**
  - *Tagihan Hosting $15:* Mengisi otomatis pembayaran 15.00 USDT ke `warung.bnb`.
  - *Struk Kopi Rp 25.000:* Mengonversi otomatis Rp 25.000 menjadi ≈ 1.40 USDT.
* **Penanganan Error:** Menampilkan toast error informatif jika QR code tidak valid tanpa menyebabkan aplikasi berhenti (*crash*).

### 3.6 Offline Resilience & Local SQLite Storage (FR-7)
* Riwayat transaksi tersimpan secara persisten di database SQLite lokal perangkat (`AsyncStorage`).
* Data tetap tersimpan utuh dan langsung tampil instan bahkan setelah aplikasi dimatikan secara paksa (*force-stop*) atau saat perangkat berada dalam kondisi offline (NFR-4).
* Riwayat dikelompokkan rapi berdasarkan tanggal: **"Hari Ini"**, **"Kemarin"**, dan tanggal lengkap.
* Dilengkapi tombol sinkronisasi awan (*cloud sync*) untuk memvalidasi status on-chain.

---

## 4. Bukti Pengujian & Metrik Kunci

### 4.1 Hasil Uji Akurasi Intent Parser (15 Kasus Uji Terstandarisasi)
Berdasarkan metodologi pengujian **Section 10.1 PRD**, berikut adalah hasil eksekusi suite pengujian otomatis (`src/assets/testCases.json`):

| # | Kalimat Input Pengujian | Target Aksi | Target Nominal | Target Penerima | Status Uji | Keterangan Evaluasi |
|:---:|---|:---:|:---:|:---:|:---:|---|
| **1** | *"kirim goceng USDT ke Budi"* | `TRANSFER` | `5.00 USDT` | `budi` | ✅ **PASS** | Happy path lengkap, slang nominal sukses terurai |
| **2** | *"transfer ceban ke warung"* | `TRANSFER` | `10.00 USDT` | `warung` | ✅ **PASS** | Tanpa menyebut token, default ke USDT |
| **3** | *"kirimin Afif gocap USDT"* | `TRANSFER` | `50.00 USDT` | `afif` | ✅ **PASS** | Urutan nama sebelum nominal berhasil dipetakan |
| **4** | *"oper seratus ribu ke Budi"* | `TRANSFER` | `5.58 USDT` | `budi` | ✅ **PASS** | Konversi rupiah: Rp 100.000 / 17.916 = 5.58 USDT |
| **5** | *"kirim setengah USDT ke Afif"* | `TRANSFER` | `0.50 USDT` | `afif` | ✅ **PASS** | Nominal pecahan desimal slang |
| **6** | *"bayar 15 USDT ke warung"* | `TRANSFER` | `15.00 USDT` | `warung` | ✅ **PASS** | Nominal angka langsung tanpa slang |
| **7** | *"cek saldo"* | `BALANCE` | `null` | `null` | ✅ **PASS** | Tanpa penerima, valid untuk aksi cek saldo |
| **8** | *"berapa duit gue"* | `BALANCE` | `null` | `null` | ✅ **PASS** | Bahasa prokem harian untuk cek saldo |
| **9** | *"kirim ke Budi"* | `TRANSFER` | `null` | `budi` | ✅ **PASS** | Parameter nominal kosong ➔ Memicu Quick-Fill Form |
| **10** | *"goceng USDT"* | `null` | `5.00 USDT` | `null` | ✅ **PASS** | Penerima kosong ➔ Memicu Quick-Fill Form |
| **11** | *"cairin USDT"* | `SWAP_UNAVAIL` | `null` | `null` | ✅ **PASS** | Edukasi ramah: fitur swap belum ada di MVP |
| **12** | *"tukar ke rupiah"* | `SWAP_UNAVAIL` | `null` | `null` | ✅ **PASS** | Edukasi ramah: fitur swap belum ada di MVP |
| **13** | *"kirim lima ratus ribu ke Afif"* | `TRANSFER` | `27.91 USDT` | `afif` | ✅ **PASS** | Konversi rupiah: Rp 500.000 / 17.916 = 27.91 USDT |
| **14** | *"transfer satu juta ke Budi"* | `TRANSFER` | `55.82 USDT` | `budi` | ✅ **PASS** | Konversi rupiah: Rp 1.000.000 / 17.916 = 55.82 USDT |
| **15** | *(kosong / suara derau hening)* | `null` | `null` | `null` | ✅ **PASS** | Menampilkan error ramah & opsi ketik manual |

**Hasil Akhir Pengujian Akurasi:** **15 / 15 Kasus Lulus (100.0% Accuracy)** — Melampaui target ambang batas PRD (>90%).

### 4.2 Ringkasan Metrik Kunci untuk Juri

| Parameter Metrik | Target Awal PRD | Hasil Aktual Aplikasi | Dampak bagi Pengguna |
|---|:---:|:---:|---|
| **Akurasi Ekstraksi Slang** | > 90% | **100.0%** | Pengguna bebas bicara tanpa takut salah transfer nominal. |
| **Biaya Gas Pengguna** | $0 | **0 BNB (Gratis)** | Menghilangkan hambatan onboarding pembelian koin gas. |
| **Latensi Konfirmasi opBNB** | < 2.0 detik | **~1.2 detik** | Transaksi kripto secepat transfer e-wallet Web2. |
| **Keandalan Typecheck** | 0 error | **0 Errors (`npm run tsc`)** | Stabilitas kode tinggi, bebas runtime crash. |
| **Persistensi Data Offline** | 100% lokal | **SQLite Native Cache** | Riwayat transaksi instan tanpa menunggu loading jaringan. |

---

## 5. Panduan Pengujian Juri

Dewan juri dapat memvalidasi seluruh fungsionalitas aplikasi TUTUR dalam **5 menit** melalui skenario terarah berikut:

```
                          PANDUAN EVALUASI JURI (5 MENIT)
 ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
 │   1. Uji Perintah    │    │    2. Uji Chat AI    │    │    3. Uji Scanner    │
 │        Suara         │    │      Generatif       │    │      & Preset        │
 ├──────────────────────┤    ├──────────────────────┤    ├──────────────────────┤
 │• Tekan tombol mic    │    │• Ketik "cek saldo"   │    │• Buka tab Scan       │
 │• Bilang: "kirim      │    │• Bot jawab saldo live│    │• Klik "Struk Kopi"   │
 │  goceng ke Budi"     │    │• Ketik transfer      │    │• Muncul Rp 25.000    │
 │• Kartu 5 USDT muncul │    │• Kartu aksi muncul   │    │  (≈ 1.40 USDT)       │
 └──────────┬───────────┘    └──────────┬───────────┘    └──────────┬───────────┘
            │                           │                           │
            └───────────────────────────┼───────────────────────────┘
                                        ▼
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │                      4. Uji AI Security Shield & Faucet                      │
 ├──────────────────────────────────────────────────────────────────────────────┤
 │ • Tab Scan ➔ Klik "QR Blacklist" ➔ Muncul modal merah & transaksi diblokir.  │
 │ • Klik "Demo Unlimited Allowance" ➔ Pilih "Batasi Izin" ➔ Badge jadi hijau.   │
 │ • Klik "Minta 100 USDT" di saldo ➔ Saldo bertambah & cooldown 60s aktif.     │
 └──────────────────────────────────────────────────────────────────────────────┘
```

1. **Skenario 1: Perintah Suara Bahasa Sehari-hari (Happy Path)**
   - Pada layar utama, tekan tombol **Mikrofon** kuning.
   - Ucapkan atau klik tombol *"Selesai Bicara"* dengan frasa demo: *"Kirim goceng USDT ke Budi"*.
   - **Hasil:** Aplikasi langsung membedah teks menjadi `5.00 USDT` ke `budi.bnb` (`0x7099...79C8`), gas fee `0 BNB`, dan status keamanan hijau aman.

2. **Skenario 2: Chat Assistant AI Interaktif**
   - Di kolom input teks percakapan, ketik: *"cek saldo gue"* lalu tekan kirim.
   - **Hasil:** Asisten membalas dinamis dengan saldo aktual dan estimasi rupiahnya.
   - Ketik: *"kirimin Afif gocap USDT"* ➔ Asisten membalas dan menampilkan **kartu transaksi interaktif** di dalam chat. Klik tombol *"Lanjutkan Transaksi >"* pada kartu tersebut untuk membuka konfirmasi transaksi instan!

3. **Skenario 3: AI Security Shield (Deteksi Scam Blacklist)**
   - Buka tab **Scan** di menu bawah.
   - Klik chip pengujian cepat: **"QR Blacklist"**.
   - **Hasil:** Form konfirmasi mendeteksi alamat drainer dan menampilkan badge merah `● Berbahaya (Blacklist)`. Tombol berubah menjadi *"Periksa Risiko Keamanan (Blacklist)"* dan memunculkan pop-up modal merah pemblokiran transaksi.

4. **Skenario 4: AI Security Shield (Pencegahan Unlimited Allowance)**
   - Di tab **Scan**, klik chip pengujian: **"Demo Unlimited Allowance"**.
   - **Hasil:** Form menampilkan badge kuning `● Izin Tak Terbatas`. Klik konfirmasi ➔ muncul modal kuning interaktif. Pilih opsi *"Batasi Izin Sesuai Transaksi"* lalu klik lanjutkan. Badge otomatis berubah menjadi hijau **● Aman (Izin Dibatasi)**.

5. **Skenario 5: Faucet Cooldown & Ketahanan Offline**
   - Di bagian atas layar utama, klik tombol **"Minta 100 USDT"**.
   - **Hasil:** Saldo bertambah +100 USDT seketika dan tombol beralih ke hitung mundur cooldown 60 detik (*"Tunggu 60 detik..."*).
   - Tutup atau *kill* aplikasi, lalu buka kembali. Masuk ke tab **History**. Seluruh transaksi dan saldo tetap tersimpan rapi tanpa ada data yang hilang.

---

## 6. Teknologi & Tech Stack

```
Frontend Mobile       : React Native (0.87.1, Bare CLI, Fabric / New Architecture)
Language              : TypeScript 5.5+ (Strict Mode Enabled)
Styling Engine        : NativeWind v4 + Tailwind CSS 3.4 (Custom Dark Palette)
State Management      : Zustand 5.0 (Lightweight, Zero-Boilerplate Global Stores)
Speech-to-Text (STT)  : Groq Cloud API (Whisper Large-v3)
Generative LLM        : Groq Cloud API (Qwen 3.8 27B / Llama 3.3 70B)
Account Abstraction   : ERC-4337 Architecture + Particle Network SDK Specification
Blockchain Network    : opBNB Testnet (Layer 2 BNB Chain, Chain ID: 5611)
Smart Contract Token  : Solidity 0.8.20 (MockUSDT ERC-20 6 Desimal dengan Public Faucet)
Local Persistence     : Native SQLite Storage Engine (via AsyncStorage Architecture)
Navigation            : React Navigation 7.x (Bottom Tabs + Transparent Modal Stack)
Icons & Typography    : MaterialCommunityIcons Vector Pack + System Monospace
```

---

## 7. Struktur Proyek & Instalasi Lokal

### 7.1 Pohon Direktori

```
tutur/
├── android/                          # Proyek Native Android (Gradle, Manifest, NDK)
├── contracts/                        # Smart Contracts Solidity
│   └── MockUSDT.sol                  # Kontrak Token ERC-20 6 Desimal opBNB
├── src/
│   ├── app/                          # Navigasi & Halaman Utama
│   │   ├── Navigation.tsx            # Bottom Tab (4 Tab) + Modal Stack
│   │   └── screens/
│   │       ├── SplashScreen.tsx      # Pengecekan sesi 30 menit
│   │       ├── LoginScreen.tsx       # Google Social Login
│   │       ├── HomeScreen.tsx        # Chat View Interaktif & Saldo Header
│   │       ├── ScanScreen.tsx        # Viewfinder Laser & Preset OCR
│   │       ├── HistoryScreen.tsx     # Riwayat Dikelompokkan Tanggal
│   │       ├── ProfileScreen.tsx     # Info Akun, Alamat & Salin Clipboard
│   │       ├── ConfirmationScreen.tsx# Form Konfirmasi & Status AI Shield
│   │       ├── VoiceOverlay.tsx      # Modal Rekaman Suara & Waveform
│   │       ├── QuickFillModal.tsx    # Ambiguity Resolution Form
│   │       └── SecurityWarningModal.tsx # Modal Bahaya Blacklist & Allowance
│   ├── components/                   # Komponen Reusable
│   │   ├── chat/                     # ChatBubble & ChatInputBar
│   │   ├── common/                   # Button, Card, Badge, Input, Toast, Spinner
│   │   ├── home/                     # BalanceCard, VoiceButton, RecentTransactions
│   │   └── scan/                     # QRScanner & PresetOCR
│   ├── services/                     # Layanan Inti & API
│   │   ├── chatService.ts            # Integrasi Groq LLM Llama/Qwen
│   │   ├── groqService.ts            # Integrasi Groq Whisper STT API
│   │   ├── intentParser.ts           # 8-Step Deterministik Intent Parser
│   │   ├── particleService.ts        # Account Abstraction & Session Wrapper
│   │   ├── transactionService.ts     # UserOperation Builder & opBNB RPC Caller
│   │   ├── securityService.ts        # Audit Blacklist & Calldata Inspector
│   │   └── syncService.ts            # On-chain Status Sync & Offline Queue
│   ├── stores/                       # Zustand Global State
│   │   ├── useAuthStore.ts           # State Autentikasi & Timer 30 Menit
│   │   ├── useChatStore.ts           # Riwayat Pesan Percakapan AI
│   │   ├── useTransactionStore.ts    # Saldo, Faucet Cooldown, & Riwayat
│   │   ├── useVoiceStore.ts          # State Rekaman Suara & Durasi
│   │   └── useToastStore.ts          # Notifikasi Toast Global
│   ├── utils/                        # Utilitas & Helper
│   │   ├── slangDictionary.ts        # Kamus 32 Entri Slang Indonesia
│   │   ├── currencyConverter.ts      # Konversi Kurs Rupiah ↔ USDT
│   │   ├── resolver.ts               # Mock Lookup Table Domain .bnb
│   │   ├── qrParser.ts               # Parser EIP-681 & Hex Address
│   │   ├── formatters.ts             # Pemformat Angka, Waktu, & Alamat
│   │   └── clipboard.ts              # Native Safe Clipboard Copy
│   ├── constants/                    # Konfigurasi Jaringan & Tema
│   │   ├── chains.ts                 # Parameter Jaringan opBNB Testnet
│   │   ├── contracts.ts              # Alamat Kontrak & ABI ERC-20
│   │   ├── env.ts                    # Pembaca Lingkungan (.env)
│   │   └── theme.ts                  # Palet Warna Dark Theme & Spacing
│   └── assets/                       # Dataset Mock & Testing
│       ├── blacklist.json            # Daftar Alamat Scam Web3 Terverifikasi
│       └── testCases.json            # 15 Kasus Uji Evaluasi Akurasi
├── .env.example                      # Template Variabel Lingkungan
├── package.json                      # Dependency & Script Proyek
├── tailwind.config.js                # Konfigurasi Tema NativeWind
└── tsconfig.json                     # Konfigurasi Strict TypeScript
```

### 7.2 Menjalankan Proyek Secara Lokal

#### Prasyarat:
* Node.js versi 20+ atau 22+.
* Android SDK (Platform 34+, Android Studio, dan Android Emulator / Device Fisik).
* Java JDK 17 atau 21.

#### Langkah Instalasi:
```bash
# 1. Clone repository
git clone https://github.com/senjaikuyo/tutur.git
cd tutur

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Konfigurasi file environment (.env)
cp .env.example .env
# Masukkan API Key Groq Anda ke file .env:
# GROQ_API_KEY=gsk_...

# 4. Jalankan typecheck TypeScript (Memastikan 100% bebas error)
npm run tsc

# 5. Hubungkan perangkat emulator / adb reverse
adb reverse tcp:8081 tcp:8081

# 6. Jalankan Metro bundler
npm run start

# 7. Di terminal baru, compile dan jalankan ke Android
npm run android
```

---

## 8. Referensi Smart Contract & On-Chain

* **Blockchain:** opBNB Testnet (Layer 2 berbasis OP Stack di atas BNB Chain)
* **Chain ID:** `5611`
* **RPC Endpoint:** `https://opbnb-testnet-rpc.bnbchain.org`
* **Block Explorer:** `https://opbnb-testnet.bscscan.com`
* **EntryPoint ERC-4337:** `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`
* **Token MockUSDT (opBNB Testnet):** `0x9483DF0A10aCEFbeCc7b3b3a3055e8838B57D619`
* **Desimal Token:** `6` (Sesuai spesifikasi USDT resmi)
* **Public Faucet Function:** `mint(address to, uint256 amount)` terbuka bagi siapa saja untuk pengujian juri.

---

## 9. Roadmap Pengembangan V2

1. **Space ID Live Resolver:** Mengganti lookup table lokal dengan pemanggilan kontrak registry Space ID resmi di opBNB Mainnet.
2. **Dynamic QRIS Parser:** Mengintegrasikan pemindai QRIS Indonesia agar pengguna dapat membayar belanjaan di merchant lokal langsung menggunakan saldo USDT opBNB.
3. **Multi-Device Passkey Cloud Sync:** Sinkronisasi passkey terenkripsi end-to-end via iCloud Keychain dan Google Password Manager.
4. **Real-time Mempool Threat Feed:** Mengintegrasikan umpan intelijen ancaman Web3 (seperti ScamFilter/Blockaid) untuk mendeteksi kontrak berbahaya secara real-time sebelum transaksi ditandatangani.

---

## 10. Profil Builder & Lisensi

* **Author & Lead Builder:** **Afif Hamzah Siregar** (Solo Builder)
* **Target Kompetisi:** *Indonesia Web3 Hackathon 2026 — Track 3: Consumer Apps*
* **Repositori GitHub:** [github.com/senjaikuyo/tutur](https://github.com/senjaikuyo/tutur)
* **Lisensi:** Proyek ini dilisensikan di bawah lisensi terbuka [MIT License](LICENSE).
