# Product Requirements Document (PRD)
## Project: TUTUR — Dompet Kripto Bahasa Sehari-hari
**Subtitle:** Transaksi Lewat Perintah Suara & Foto, Aman dari Penipuan di opBNB
**Document Version:** 4.0 (MVP Hackathon Edition, Implementation-Ready)
**Target Event:** Indonesia Web3 Hackathon 2026 (Track 3: Consumer Apps)
**Author / Lead Builder:** Afif Hamzah Siregar (Solo Builder)
**Date:** September 2026
**Status:** Final, siap dieksekusi

---

## 0. Keputusan Teknis Final

Semua keputusan yang sebelumnya terbuka sudah diputuskan. Tabel ini jadi rujukan tunggal, semua bagian dokumen di bawah mengikuti nilai ini, tidak ada lagi placeholder.

| # | Keputusan | Nilai Final | Catatan |
| :-- | :-- | :-- | :-- |
| D1 | AA Provider | **Particle Network** (`@particle-network/rn-auth-core`, `@particle-network/rn-aa`) | Satu SDK untuk Social Login + Passkey + Smart Account + Paymaster, hindari masalah polyfill kripto di React Native |
| D2 | Naming resolution | **Mock lookup table lokal** (`resolver.ts`) | Space ID belum stabil di opBNB Testnet, resolver lokal anti-gagal untuk demo |
| D3 | Token demo | **Deploy MockUSDT sendiri** (ERC-20, 6 desimal) | Hindari ketergantungan bridge BSC Testnet → opBNB yang lambat dan sering rate limit |
| D4 | Paymaster funding | **Particle Dashboard sponsor policy** (default) atau deposit manual ke EntryPoint `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` (fallback) | Siapkan 0.05–0.1 tBNB dari faucet BNB Chain sebagai cadangan |
| D5 | Ukuran tim | **Solo builder** | Rencana 4 hari di Section 11 disusun ulang dengan asumsi ini, scope dipangkas ke yang paling kritis |
| D6 | Platform target | **Android only** | Fokus satu platform untuk solo builder 4 hari. APK langsung bisa di-share ke juri. |
| D7 | RN bootstrap | **Bare React Native CLI** | Particle SDK butuh native modules, Expo managed tidak kompatibel |
| D8 | Intent parser | **Rule-based murni** (regex + keyword matching) | Deterministik, gratis, tanpa dependency API tambahan. Confidence dihitung dari field yang berhasil di-extract |
| D9 | Konversi rupiah | **Hardcoded rate 1 USDT = Rp 17.916** | Untuk demo. Versi produksi pakai oracle/API CoinGecko |
| D10 | Navigation | **Bottom Tab (4 tab) + Stack per tab** | Tab: Home, Scan, History, Profile. Familiar buat user |
| D11 | State management | **Zustand** | Ringan, tanpa boilerplate, cocok untuk proyek kecil |
| D12 | UI framework | **NativeWind only** (custom components) | Tanpa UI kit tambahan, kontrol penuh, bundle lebih kecil |

### 0.1 Pembagian Kerja: Agen AI Coding vs Senja (Human)

Dokumen ini dieksekusi oleh agen AI coding, bukan ditulis manual oleh Senja. Karena itu, setiap tugas di Section 11 diberi tag `[AI]` atau `[HUMAN]` supaya agen tidak mengambil alih langkah yang butuh akun asli, dana asli, atau kehadiran fisik.

**Yang dikerjakan agen AI (`[AI]`):**
- Menulis seluruh kode: setup proyek, integrasi SDK, komponen UI, `slangDictionary.ts`, `resolver.ts`, Intent Parser, skema database, kontrak Solidity `MockUSDT`, logika retry, Security Shield.
- Menjalankan build, testing lokal, dan menjalankan checklist Section 9 sejauh bisa diverifikasi lewat kode/emulator.
- Menyusun draf teks pitch deck dan draf skrip video demo (kontennya, bukan rekamannya).

**Yang wajib dikerjakan Senja sendiri (`[HUMAN]`), tidak bisa didelegasikan ke agen AI:**
- Membuat akun dan project di Particle Dashboard (butuh login Google/email pribadi Senja), lalu menyerahkan Project ID/Client Key/App ID ke agen lewat `.env`.
- Meminta tBNB dari faucet resmi BNB Chain (biasanya butuh wallet address atau captcha/verifikasi manusia).
- Menyetujui dan membayar gas untuk transaksi deploy `MockUSDT` dan Smart Account pertama, karena ini transaksi on-chain nyata yang butuh private key/signing asli, meski nilainya testnet.
- Mengecek dokumentasi Particle soal model custody, kebijakan retensi data Groq, dan ketentuan portal hackathon soal metode pengujian juri (agen bisa bantu ringkas dokumennya kalau Senja tempel isinya, tapi keputusan akhir dan verifikasi tetap di tangan Senja karena menyangkut klaim resmi ke juri).
- Merekam video demo (butuh suara/tampilan asli Senja atau device asli), termasuk video fallback di Section 12.
- Build APK final dan instalasi ke device fisik untuk uji coba nyata (agen bisa siapkan build script, tapi eksekusi build dan instal ke HP tetap manual).
- Submit ke portal `indonesiaweb3hack.xyz`, karena ini aksi akun pribadi Senja di platform eksternal.

Kalau agen AI menemukan langkah bertag `[HUMAN]` yang belum selesai, agen berhenti di titik itu dan minta Senja menyelesaikannya dulu, bukan mencoba workaround (misal: jangan mengarang API key palsu atau melewati langkah deploy on-chain dengan data simulasi tanpa bilang eksplisit ke Senja).

---

## 1. Executive Summary & Visi Produk

### 1.1 Visi
Menghilangkan hambatan psikologis dan teknis interaksi Web3 bagi pengguna kasual lewat asisten transaksi berbasis suara bahasa Indonesia dan Account Abstraction di ekosistem BNB Chain.

### 1.2 Problem Statement
1. **Friction Seed Phrase.** 12 kata pemulihan membuat pengguna takut salah simpan dan kehilangan akses dana.
2. **Multi-Step Transaction Fatigue.** Menyetujui allowance, menghitung gas limit/price, dan menandatangani transaksi berulang kali membingungkan pengguna.
3. **Ketakutan Terhadap Phishing & Wallet Drainer.** Pengguna awam hingga kasual sulit membedakan kontrak dApp resmi dengan skema penipuan tersembunyi (unlimited token approval).
4. **Bahasa Antarmuka Asing.** Sebagian besar dApp hanya mendukung bahasa Inggris dengan istilah teknis, bukan cara orang Indonesia bicara saat bertransaksi harian ("kirim goceng", "cairin ke USDT").

### 1.3 Solusi: TUTUR
Aplikasi dompet Smart Account (ERC-4337) di opBNB Testnet dengan:
- Login instan pakai Google + Biometric Passkey, tanpa seed phrase.
- Instruksi transaksi dalam bahasa percakapan Indonesia (suara), parsing intent di bawah 3 detik.
- 0 biaya gas untuk transaksi awal, disponsori Paymaster.
- AI Security Shield yang memperingatkan transaksi berbahaya dan izin saldo tanpa batas.

---

## 2. Target Persona & User Journey

### 2.1 Target Persona
**Rian, 23 tahun, mahasiswa/freelancer kreatif, pengguna Web3 kasual.** Pernah beli kripto di CEX lokal, punya aset kecil di dompet DeFi, sering lupa seed phrase dan cemas saat menyetujui transaksi dApp. Butuh transfer kilat, tidak mau beli koin gas terpisah, butuh kepastian bahwa link yang diklik aman.

### 2.2 Core User Journey (Happy Path)
```
[Buka Aplikasi]
   → [Login Google + Scan Sidik Jari (WebAuthn Passkey)]
   → [Tekan Tombol Mic & Bicara: "Kirim goceng USDT ke Budi"]
   → [Groq Whisper STT + Intent Parser Engine]
   → [Form Konfirmasi Otomatis]
        - Penerima: budi.bnb (0x89...2A)
        - Jumlah: 5 USDT (≈ Rp 75.000)
        - Biaya Gas: 0 USDT (Disponsori Paymaster)
        - Status Keamanan: Hijau / Aman
   → [Konfirmasi 1-Tap Biometrik]
   → [Smart Contract opBNB Dieksekusi → Tanda Terima Instan]
```

### 2.3 Jalur Kegagalan (Wajib Ditangani, Bukan Opsional)
Setiap titik di happy path punya jalur gagal. Developer wajib menangani semua ini sebelum demo, karena juri sering menguji edge case secara langsung.

| Titik Gagal | Penyebab | Perilaku Aplikasi |
| :-- | :-- | :-- |
| Login Google gagal | Jaringan putus, akun ditolak Particle/Pimlico | Tampilkan pesan error jelas, tombol coba lagi, tidak crash |
| Passkey tidak terdaftar di device | Device tidak punya sensor biometrik/WebAuthn | Fallback ke PIN 6 digit sebagai metode konfirmasi kedua |
| STT gagal transkripsi | Noise lingkungan, koneksi ke Groq API putus | Tampilkan teks "Tidak terdengar jelas, coba lagi atau ketik manual" plus opsi input teks |
| Intent tidak lengkap | User sebut nominal tanpa penerima, atau sebaliknya | Trigger FR-3 Quick-Fill Form, bukan re-record suara |
| Alamat penerima tidak ditemukan | Nama BNS/kontak tidak dikenal sistem | Minta user ketik/scan alamat wallet manual |
| Saldo token tidak cukup | User minta kirim lebih dari saldo | Blok transaksi sebelum ke Paymaster, tampilkan saldo aktual |
| Transaksi ditolak jaringan | RPC opBNB timeout atau bundler down | Retry otomatis 1x, jika gagal lagi tampilkan status "Tertunda" dan simpan di antrian lokal |
| Paymaster saldo habis | Deposit Paymaster contract kosong | Transaksi tetap bisa jalan tapi user diminta bayar gas dari saldo sendiri, dengan pesan jelas |
| Security Shield mendeteksi ancaman | Alamat cocok blacklist atau approve unlimited | Warning pop-up kuning/oranye, transaksi tidak lanjut otomatis (lihat FR-6) |

---

## 3. Scope Matrix (MVP 30 September vs Roadmap V2)

| Fitur | Status MVP | Spesifikasi Implementasi | Roadmap V2 |
| :-- | :-- | :-- | :-- |
| Autentikasi | 100% Fungsional | Social Login (Google) + Passkey Biometrik via Particle Network SDK | Multi-device passkey sync, backup ke iCloud/Google Drive |
| Voice-to-Intent | 100% Fungsional | Groq Whisper STT + Kamus Slang Lokal + Parsing JSON | Offline on-device whisper, TTS konfirmasi suara |
| Eksekusi On-Chain | 100% Fungsional | UserOperation ERC-4337 nyata di opBNB Testnet (transfer MockUSDT & cek saldo) | Batch transaction (swap + stake multicall) |
| Sponsor Gas | 100% Fungsional | Paymaster sponsori 100% gas lewat Particle Dashboard sponsor policy | Bayar gas pakai ERC-20 (USDT/FDUSD) |
| Kamera & Scan | Fungsional Bertingkat | Scanner QR wallet address fungsional penuh (Google ML Kit); OCR struk/invoice pakai skenario preset | Real-time multi-layout OCR + QRIS dynamic parser |
| Security Shield | Simulasi Terarah | Static blacklist (domain/address) + deteksi unlimited allowance | Real-time mempool simulation & threat intelligence feed |

Fitur yang secara eksplisit TIDAK masuk MVP, supaya tidak ada scope creep saat coding:
- Swap token di dalam aplikasi.
- Staking atau lending.
- Multi-chain selain opBNB Testnet.
- Dukungan bahasa selain Indonesia.
- Riwayat transaksi lintas device.

---

## 4. Spesifikasi Fungsional (Functional Requirements)

### FR-1: Account Creation & Biometric Passkey
- **FR-1.1** Pengguna daftar/login pakai akun Google tanpa mencatat atau mengekspor seed phrase, lewat `@particle-network/rn-auth-core`.
- **FR-1.2** Smart Contract wallet (ERC-4337) dideploy otomatis saat transaksi pertama (lazy deployment / counterfactual address), lewat `@particle-network/rn-aa` dengan konfigurasi:
```typescript
import { OpBNBTestnet } from '@particle-network/chains';
import { initAAModule } from '@particle-network/rn-aa';

initAAModule({
  name: 'BICONOMY', // atau SIMPLE
  version: '2.0.0',
});
```
- **FR-1.3** Setiap transaksi diotentikasi lewat prompt biometrik perangkat (Touch ID/Face ID/Fingerprint) via WebAuthn passkey.
- **FR-1.4** Fallback jika device tidak mendukung biometrik/passkey: **status belum pasti, wajib dicek dulu di Hari 1**. Particle Network SDK punya alur signing sendiri lewat passkey/WebAuthn, dan belum jelas apakah PIN custom bisa dipasang sebagai metode konfirmasi kedua di dalam alur signing tersebut. Rencana realistis: pasang PIN 6 digit sebagai app-level lock screen (gerbang masuk aplikasi, disimpan terenkripsi lokal), terpisah dari mekanisme signing Particle. Ini tidak menggantikan signing biometrik SDK, hanya mengunci akses ke aplikasi di device tanpa sensor biometrik. Cek dokumentasi Particle Network soal opsi signing alternatif sebelum menjanjikan lebih dari ini di pitch deck.
- **FR-1.5** Sesi login kedaluwarsa setelah 30 menit tanpa aktivitas, wajib re-autentikasi. Detail implementasi:
  - Timer inactivity dikelola lewat `AppState` listener React Native: setiap kali app masuk background (`inactive`/`background`), catat timestamp ke `AsyncStorage`. Saat app kembali ke foreground (`active`), hitung selisih waktu. Jika lebih dari 30 menit, paksa re-autentikasi.
  - Selama app di foreground, setiap interaksi user (tap, scroll, voice) me-reset timer. Timer dikelola di Zustand store `useAuthStore`.
  - Saat sesi habis di tengah flow voice-to-transaction: draft intent yang sudah di-parse disimpan di Zustand (in-memory, hilang jika app di-kill), lalu user diarahkan ke layar login. Setelah re-login, user kembali ke Home (draft tidak di-restore untuk MVP, demi kesederhanaan).
  - Re-autentikasi memakai biometrik/passkey saja (tidak perlu login Google ulang), karena sesi Particle SDK bisa masih aktif meski app-level session expired.

### FR-2: Voice-to-Intent & Local Slang Normalizer
- **FR-2.1 Audio Capture.** Aplikasi merekam audio saat tombol mikrofon ditekan-tahan (push-to-talk), maksimal durasi 10 detik per rekaman, lalu mengirim byte audio ke Groq Whisper API (`whisper-large-v3`).
- **FR-2.2 Slang Normalization Engine.** Sebelum masuk Intent Parser, teks dinormalisasi lewat kamus pemetaan manual di `slangDictionary.ts`. Kamus dibagi tiga kategori:

  **Kategori A: Nominal Slang → Angka**
  | Frasa | Mapping | Catatan |
  | :-- | :-- | :-- |
  | goceng | 5 | Lima (ribu rupiah, tapi di konteks token = 5 token) |
  | ceban | 10 | Sepuluh |
  | cepek | 100 | Seratus |
  | gocap | 50 | Lima puluh |
  | gopek | 500 | Lima ratus |
  | sejuta | 1000000 | Satu juta (rupiah) |
  | dua juta | 2000000 | Dua juta (rupiah) |
  | setengah | 0.5 | Setengah token |
  | seperempat | 0.25 | Seperempat token |
  | seceng | 1000 | Seribu |

  **Kategori B: Kata Kerja → Action**
  | Frasa | Mapping | Catatan |
  | :-- | :-- | :-- |
  | kirim / kirimin / oper / transfer / kasih / beri / send | ACTION_TRANSFER | Semua sinonim transfer |
  | cek saldo / berapa duit / berapa sisa / saldo gue / saldo saya / balance | ACTION_BALANCE | Semua sinonim cek saldo |
  | cairin / tukar / swap / convert | ACTION_SWAP_UNAVAILABLE | Fitur tidak tersedia di MVP |

  **Kategori C: Nominal Rupiah → Konversi Token**
  | Frasa | Deteksi | Mapping |
  | :-- | :-- | :-- |
  | seratus ribu / 100rb / 100k | Regex: `/(\d+)\s*(ribu|rb|k)/i` | Angka rupiah, dikonversi ke USDT lewat hardcoded rate |
  | lima ratus ribu / 500rb | Regex: `/(\d+)\s*(ribu|rb|k)/i` | idem |
  | satu juta / 1jt / 1juta | Regex: `/(\d+)\s*(juta|jt)/i` | idem |

  **Konversi Rupiah ke Token:**
  Hardcoded rate: **1 USDT = Rp 17.916** (keputusan D9). Jika intent parser mendeteksi nominal dalam rupiah (ada kata "ribu", "rb", "k", "juta", "jt", "rupiah", atau "rp"), nominal dikonversi dengan formula: `amount_usdt = amount_rupiah / 17916`, dibulatkan ke 2 desimal. Contoh: "seratus ribu" → 100000 / 17916 = 5.58 USDT. Di form konfirmasi, tampilkan kedua nilai: "5.58 USDT (~ Rp 100.000)" supaya user bisa verifikasi. Jelaskan ke juri bahwa versi produksi memakai oracle harga real-time.

  **Handling ACTION_SWAP_UNAVAILABLE:**
  Jika user mengucapkan kata yang di-map ke `ACTION_SWAP_UNAVAILABLE` (misal "cairin USDT", "tukar ke rupiah"), sistem menampilkan pesan: "Fitur penukaran token belum tersedia di versi ini. Kamu bisa melakukan transfer atau cek saldo." Sistem tidak membuka form, tidak melanjutkan ke Quick-Fill, langsung menampilkan toast/snackbar info dan kembali ke Home.

  Total entri kamus: **24 entri** (10 nominal + 7 kata kerja + 7 pola rupiah).
  Kamus ini bersifat case-insensitive dan di-match sebelum masuk Intent Parser (FR-2A).

- **FR-2.3 JSON Output Schema.**
```json
{
  "action": "TRANSFER",
  "recipient": "budi.bnb",
  "token": "USDT",
  "amount": 5.0,
  "confidence": 0.96
}
```
- **FR-2.4 Confidence Threshold.** Jika `confidence` di bawah 0.75, sistem tidak mengeksekusi otomatis. Sistem selalu tampilkan form konfirmasi terlebih dahulu (lihat FR-3), tidak pernah langsung eksekusi tanpa review pengguna, berapa pun nilai confidence-nya. Field `confidence` hanya dipakai untuk highlight visual (misal warna kuning jika di bawah 0.75) agar pengguna tahu bagian mana yang perlu dicek ulang.
- **FR-2.5 Batas Waktu Respons.** Jika STT tidak merespons dalam 5 detik, tampilkan pesan timeout dan opsi input teks manual sebagai pengganti.

### FR-2A: Intent Parser Rule-Based (Spesifikasi Implementasi)

Intent parser menggunakan pendekatan **rule-based murni** (keputusan D8). Tidak ada LLM call tambahan. Parser menerima teks hasil STT yang sudah dinormalisasi oleh Slang Normalizer dan menghasilkan JSON intent (FR-2.3).

#### FR-2A.1 Pipeline

```
[Teks mentah dari Groq STT]
       │
       ▼
[1. Lowercase + trim whitespace]
       │
       ▼
[2. Slang Normalizer: replace frasa → nilai via slangDictionary.ts]
       │
       ▼
[3. Rupiah Detector: cari pola nominal rupiah, konversi ke USDT]
       │
       ▼
[4. Action Extractor: regex match kata kerja → action type]
       │
       ▼
[5. Recipient Extractor: regex match "ke <nama>" atau "buat <nama>"]
       │
       ▼
[6. Amount Extractor: regex match angka/nominal yang tersisa]
       │
       ▼
[7. Token Extractor: cari kata "USDT"/"usdt", default USDT jika kosong]
       │
       ▼
[8. Confidence Calculator: hitung skor berdasarkan field ter-extract]
       │
       ▼
[Output: IntentResult JSON]
```

#### FR-2A.2 Regex Patterns

```typescript
// File: src/services/intentParser.ts

// Step 4: Action extraction
const ACTION_PATTERNS: Record<string, RegExp> = {
  TRANSFER: /\b(kirim|kirimin|oper|transfer|kasih|beri|send|bayar|bayarin)\b/i,
  BALANCE:  /\b(cek saldo|berapa duit|berapa sisa|saldo gue|saldo saya|saldo ku|balance|saldo)\b/i,
  SWAP_UNAVAILABLE: /\b(cairin|tukar|swap|convert|jual|beli)\b/i,
};

// Step 5: Recipient extraction
// Menangkap nama setelah kata "ke", "buat", "untuk", "sama"
const RECIPIENT_PATTERN = /\b(?:ke|buat|untuk|sama|to)\s+([a-zA-Z][a-zA-Z0-9_.]*(?:\.bnb)?)\b/i;

// Step 6: Amount extraction (setelah slang sudah di-replace jadi angka)
const AMOUNT_PATTERN = /\b(\d+(?:\.\d+)?)\b/;

// Step 3: Rupiah detection
const RUPIAH_RIBU_PATTERN = /(\d+(?:\.\d+)?)\s*(?:ribu|rb|k)\b/i;  // "100 ribu" → 100000
const RUPIAH_JUTA_PATTERN = /(\d+(?:\.\d+)?)\s*(?:juta|jt)\b/i;    // "1 juta" → 1000000
const RUPIAH_PREFIX_PATTERN = /(?:rp\.?\s*|rupiah\s*)(\d+(?:[.,]\d+)*)/i; // "Rp 100.000"
```

#### FR-2A.3 Confidence Calculation

Confidence dihitung berdasarkan berapa field kunci yang berhasil di-extract, **bukan** dari probabilitas model:

```typescript
function calculateConfidence(result: Partial<IntentResult>): number {
  let score = 0;
  const weights = {
    action: 0.35,    // Paling kritis: apa yang mau dilakukan
    amount: 0.30,    // Kedua: berapa jumlahnya
    recipient: 0.25, // Ketiga: ke siapa (tidak wajib untuk BALANCE)
    token: 0.10,     // Keempat: token apa (default USDT)
  };

  if (result.action) score += weights.action;
  if (result.amount && result.amount > 0) score += weights.amount;
  if (result.recipient) score += weights.recipient;
  if (result.token) score += weights.token;

  // Bonus: jika action = BALANCE, recipient tidak wajib
  // Redistribute bobot recipient ke field lain
  if (result.action === 'BALANCE' && !result.recipient) {
    score += weights.recipient; // BALANCE tanpa recipient tetap valid
  }

  return Math.round(score * 100) / 100;
}
```

| Skenario | Fields Ter-extract | Confidence | Perilaku UI |
| :-- | :-- | :-- | :-- |
| "kirim goceng USDT ke Budi" | action + amount + token + recipient | 1.00 | Hijau, langsung ke Confirmation Form |
| "kirim ke Budi" | action + recipient | 0.60 | Kuning, buka Quick-Fill (amount kosong) |
| "goceng USDT" | amount + token | 0.40 | Kuning, buka Quick-Fill (action + recipient kosong) |
| "cek saldo" | action | 0.45 | Hijau (khusus BALANCE, recipient tidak wajib → score jadi 0.70) |
| "kirim goceng ke Budi" | action + amount + recipient | 0.90 | Hijau, token default USDT |
| (kosong/noise) | - | 0.00 | Merah, tampilkan error + opsi ketik manual |

#### FR-2A.4 Output Schema (Extended)

```typescript
interface IntentResult {
  action: 'TRANSFER' | 'BALANCE' | 'SWAP_UNAVAILABLE' | null;
  recipient: string | null;     // nama mentah, belum di-resolve
  token: string;                // default 'USDT'
  amount: number | null;        // dalam satuan token (sudah dikonversi jika dari rupiah)
  amountInRupiah: number | null; // nilai rupiah asli jika input dalam rupiah, null jika input langsung token
  confidence: number;           // 0.00 - 1.00
  rawText: string;              // teks mentah dari STT sebelum normalisasi
  normalizedText: string;       // teks setelah slang normalization
  missingFields: string[];      // ['recipient', 'amount'] — untuk highlight di Quick-Fill
}
```

#### FR-2A.5 Test Cases (Basis Pengukuran Section 10.1)

Daftar kalimat uji yang disiapkan di H-1. Setiap kalimat diuji minimal 3 kali:

| # | Input Suara | Expected Action | Expected Amount | Expected Recipient | Expected Confidence | Catatan |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | "kirim goceng USDT ke Budi" | TRANSFER | 5.0 | budi | 1.00 | Happy path lengkap |
| 2 | "transfer ceban ke warung" | TRANSFER | 10.0 | warung | 0.90 | Tanpa sebut token |
| 3 | "kirimin Afif gocap USDT" | TRANSFER | 50.0 | afif | 1.00 | Urutan nama sebelum nominal |
| 4 | "oper seratus ribu ke Budi" | TRANSFER | 5.58 | budi | 1.00 | Konversi rupiah |
| 5 | "kirim setengah USDT ke Afif" | TRANSFER | 0.5 | afif | 1.00 | Nominal pecahan |
| 6 | "bayar 15 USDT ke warung" | TRANSFER | 15.0 | warung | 1.00 | Nominal langsung tanpa slang |
| 7 | "cek saldo" | BALANCE | null | null | 0.70 | Tanpa recipient, valid untuk BALANCE |
| 8 | "berapa duit gue" | BALANCE | null | null | 0.70 | Slang cek saldo |
| 9 | "kirim ke Budi" | TRANSFER | null | budi | 0.60 | Amount kosong → Quick-Fill |
| 10 | "goceng USDT" | null | 5.0 | null | 0.40 | Action + recipient kosong → Quick-Fill |
| 11 | "cairin USDT" | SWAP_UNAVAILABLE | null | null | - | Tampilkan "fitur belum tersedia" |
| 12 | "tukar ke rupiah" | SWAP_UNAVAILABLE | null | null | - | Tampilkan "fitur belum tersedia" |
| 13 | "kirim lima ratus ribu ke Afif" | TRANSFER | 27.91 | afif | 1.00 | 500000/17916 = 27.91 USDT |
| 14 | "transfer satu juta ke Budi" | TRANSFER | 55.81 | budi | 1.00 | 1000000/17916 = 55.81 USDT |
| 15 | "" (noise/kosong) | null | null | null | 0.00 | Error state |

### FR-3: Ambiguity Resolution (Quick-Fill Form)
- **FR-3.1** Jika salah satu parameter kunci (`action`, `recipient`, `amount`) tidak terdeteksi dari suara, aplikasi tidak mengulang rekaman. Aplikasi menampilkan dialog form interaktif.
- **FR-3.2** Field yang berhasil dikenali terisi otomatis dan bisa diedit. Field kosong disorot dengan border merah dan wajib diisi sebelum tombol "Lanjutkan" aktif.
- **FR-3.3** Field `token` default ke USDT jika tidak disebutkan user secara eksplisit.
- **FR-3.4** Jika `recipient` berupa nama yang tidak dikenal sistem (bukan kontak tersimpan dan bukan entri di `resolver.ts`), form menampilkan input alternatif: scan QR atau tempel alamat manual.
- **FR-3.5 Resolver Nama .bnb.** Resolusi nama memakai lookup table lokal di `src/utils/resolver.ts`:
```typescript
const BNS_DIRECTORY: Record<string, string> = {
  'budi.bnb': '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  'warung.bnb': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  'afif.bnb': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
};

export function resolveRecipient(input: string): string {
  const cleanInput = input.trim().toLowerCase();
  if (cleanInput.endsWith('.bnb')) {
    return BNS_DIRECTORY[cleanInput] || cleanInput;
  }
  return cleanInput; // fallback ke 0x... jika input alamat langsung
}
```
  Untuk narasi pitch ke juri: jelaskan bahwa versi produksi memanggil Space ID RPC, dan resolver lokal ini dipakai demi stabilitas demo offline/online. **Batasan yang wajib disampaikan ke juri:** hanya 3 nama di atas yang bisa di-resolve. Kalau juri mengetik nama `.bnb` lain saat mencoba sendiri, sistem fallback ke perlakuan sebagai alamat mentah (tidak resolve, kemungkinan besar transaksi diblokir di FR-4.4 karena alamat tidak valid). Siapkan kartu instruksi kecil di sesi demo yang mencantumkan tiga nama contoh ini, supaya juri yang mencoba sendiri tidak salah kira ini bug.

### FR-4: On-Chain Execution & Gasless Paymaster (opBNB)
- **FR-4.1** Seluruh transaksi dibungkus dalam objek `UserOperation` standar ERC-4337.
- **FR-4.2** Paymaster contract menandatangani field `paymasterAndData`, membebaskan pengguna dari kebutuhan saldo gas native BNB. Metode utama: buat sponsor policy di Particle Dashboard (menu Paymaster, opBNB Testnet, "Sponsor 100% User Gas"), tanpa perlu deposit manual. Metode cadangan jika sponsor policy bermasalah: deposit tBNB manual ke fungsi `deposit()` di kontrak EntryPoint `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`. Siapkan 0.05–0.1 tBNB dari faucet resmi BNB Chain sebagai cadangan, cukup untuk ratusan transaksi karena gas opBNB per transfer sekitar 0.000005–0.000015 tBNB.
- **FR-4.3** Transaksi dikirim ke Bundler RPC opBNB Testnet:
  - Chain ID: `5611`
  - RPC endpoint: `https://opbnb-testnet-rpc.bnbchain.org`
  - Target waktu konfirmasi: di bawah 2 detik.
- **FR-4.4** Sebelum mengirim UserOperation, sistem mengecek saldo token pengirim lewat RPC call `eth_call` ke fungsi `balanceOf`. Jika saldo kurang dari `amount`, transaksi diblokir di sisi klien dengan pesan saldo aktual.
- **FR-4.5** Token contract: deploy `MockUSDT` sendiri di opBNB Testnet lewat Remix atau Foundry, catat alamatnya di `constants.ts` setelah deploy.
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Tether USD Testnet", "USDT") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Cetak 1 juta USDT awal
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount); // Siapapun bisa minta saldo testnet untuk demo
    }

    function decimals() public pure override returns (uint8) {
        return 6; // Sesuai desimal USDT asli
    }
}
```
  Karena fungsi `mint` terbuka untuk siapa saja, tambahkan tombol "Minta 100 USDT Faucet" di aplikasi supaya akun juri bisa langsung isi saldo sendiri saat demo. **Rate limiting faucet:**
  - Cooldown 60 detik per mint (simpan timestamp mint terakhir di `AsyncStorage`).
  - Setelah mint, tombol disabled selama countdown 60 detik dengan teks "Tunggu 45 detik...".
  - Mint dilakukan lewat Smart Account (UserOperation), sehingga gas-nya juga disponsori Paymaster. Jika Paymaster habis, mint tetap bisa jalan tapi user diminta bayar gas sendiri.
  - Feedback UI: loading spinner saat mint → toast "100 USDT berhasil ditambahkan!" saat sukses → toast error jika gagal.
- **FR-4.6** Setelah UserOperation dikirim, sistem polling status tiap 500ms selama maksimal 10 detik. Jika status masih pending setelah 10 detik, tampilkan status "Tertunda, sedang diproses" dan simpan `userOpHash` di local queue untuk dicek ulang saat aplikasi dibuka lagi. **Manajemen nonce saat retry:** sebelum mengirim ulang, sistem wajib query status UserOp yang lama lewat `eth_getUserOperationByHash` (atau endpoint setara di bundler Particle). Jika UserOp lama masih terdaftar di mempool atau sudah masuk block, sistem tidak boleh mengirim UserOp baru dengan nonce yang sama, karena berisiko gagal atau memicu transaksi dobel. Retry hanya dilakukan dengan nonce baru yang diambil ulang dari akun, dan hanya jika UserOp lama dipastikan drop dari mempool.
- **FR-4.7 Offline Queue \u0026 Retry Mechanism.** Detail implementasi antrian lokal untuk transaksi gagal:
  - **Deteksi koneksi:** gunakan `@react-native-community/netinfo`. Listener `addEventListener` memantau perubahan state koneksi secara real-time.
  - **Penyimpanan antrian:** transaksi yang gagal terkirim disimpan di tabel `transactions` (Section 5) dengan status `draft`. Tidak ada tabel terpisah untuk queue.
  - **Auto-retry saat koneksi kembali:** ketika NetInfo mendeteksi `isConnected === true` setelah sebelumnya `false`, sistem mengambil semua record dengan status `draft`, lalu mencoba mengirim ulang satu per satu (sequential, bukan parallel, untuk menghindari masalah nonce).
  - **Expiry:** transaksi `draft` yang berusia lebih dari 24 jam otomatis diubah ke status `failed` dengan catatan "Kadaluarsa: transaksi tidak terkirim dalam 24 jam". User bisa membuat transaksi baru secara manual.
  - **Batas antrian:** maksimal 5 transaksi `draft` secara bersamaan. Jika sudah ada 5 draft, transaksi baru yang gagal ditolak dengan pesan "Antrian penuh, selesaikan transaksi tertunda dulu".

### FR-5: Camera Scanner (QR & Preset OCR)
- **FR-5.1** Pemindai kamera memakai Google ML Kit Barcode Scanning untuk membaca alamat publik BNB Chain, format `ethereum:0x...` atau alamat hex polos 42 karakter.
- **FR-5.2** Jika QR yang di-scan bukan format alamat yang valid, tampilkan pesan "QR tidak dikenali sebagai alamat wallet" tanpa crash aplikasi.
- **FR-5.3** Modul struk/invoice menyediakan dua tombol preset demo: "Tagihan Hosting $15" dan "Struk Kopi Rp 25.000". Menekan tombol langsung mengisi form pembayaran dengan nilai preset, tidak melalui OCR sungguhan untuk MVP.

### FR-6: AI Security Shield (Anti-Phishing & Allowance Audit)
- **FR-6.1 Blacklist Audit.** Sebelum eksekusi, alamat kontrak tujuan dicocokkan ke daftar hitam statis yang disimpan sebagai file JSON lokal (`blacklist.json`), berisi 5–10 alamat yang dikumpulkan dari laporan publik scam Web3. Daftar ini disiapkan di H-1 (sebelum Hari 1 mulai), bukan dicari saat Hari 3, supaya waktu Hari 3 terpakai penuh untuk implementasi UI warning, bukan riset. **Batasan yang wajib disampaikan ke juri:** ini bukan real-time threat detection. Alamat scam baru yang tidak ada di daftar tidak akan terdeteksi. Siapkan satu alamat contoh dari `blacklist.json` sendiri sebagai skenario demo yang terjamin terdeteksi, dan jelaskan di pitch deck bahwa versi produksi memakai threat intelligence feed real-time (lihat roadmap V2 di Section 3), sementara MVP membuktikan konsep deteksi dan alur warning UI-nya.
- **FR-6.2 Unlimited Allowance Warning.** Jika calldata memicu `approve(spender, type(uint256).max)`, tampilkan warning pop-up kuning/oranye:
  > "Perhatian: Kontrak ini meminta izin mengakses seluruh saldo USDT kamu tanpa batas. Tetap lanjutkan dengan nominal terbatas?"
- **FR-6.3** Pengguna diberi dua opsi: "Batasi Izin Sesuai Transaksi" (direkomendasikan, jadi default terpilih) atau "Batalkan Transaksi".
- **FR-6.4** Status keamanan ditampilkan sebagai badge warna di form konfirmasi: Hijau (aman, tidak ada temuan), Kuning (unlimited allowance terdeteksi), Merah (alamat cocok blacklist, transaksi diblokir penuh sampai user menekan "Saya paham risikonya" secara eksplisit).

### FR-7: Local Activity History & Data Privacy
- **FR-7.1 Local Cache.** Riwayat transaksi disimpan di SQLite lokal (lewat WatermelonDB) untuk pemuatan instan saat aplikasi dibuka. Skema tabel di Section 5.
- **FR-7.2 Ephemeral Data Policy.** File audio rekaman dan foto invoice dihapus dari memori RAM/perangkat begitu intent berhasil diekstraksi, target di bawah 1 detik setelah proses selesai. Audio tidak pernah disimpan permanen di disk atau backend.
- **FR-7.3** Riwayat transaksi lokal disinkronkan ulang statusnya (pending → sukses/gagal) dengan query on-chain setiap kali aplikasi dibuka, memakai `userOpHash` yang tersimpan.

---

## 5. Skema Data Lokal (SQLite via WatermelonDB)

### Tabel `transactions`
| Kolom | Tipe | Keterangan |
| :-- | :-- | :-- |
| id | string (uuid) | primary key |
| user_op_hash | string | hash UserOperation, null sebelum terkirim |
| action | string | TRANSFER / SWAP / BALANCE_CHECK |
| recipient_address | string | alamat hex tujuan |
| recipient_label | string | nama BNS atau label kontak, boleh null |
| token_symbol | string | contoh: USDT |
| amount | float | jumlah token |
| status | string | draft / pending / success / failed |
| security_flag | string | green / yellow / red |
| gas_sponsored | boolean | true jika disponsori Paymaster |
| created_at | timestamp | waktu dibuat di klien |
| confirmed_at | timestamp | waktu konfirmasi on-chain, boleh null |

### Tabel `contacts`
| Kolom | Tipe | Keterangan |
| :-- | :-- | :-- |
| id | string (uuid) | primary key |
| label | string | nama panggilan, contoh: Budi |
| address | string | alamat hex |
| bns_name | string | nama BNS jika ada, boleh null |

Tabel `contacts` diisi manual oleh pengguna di MVP ini. Tidak ada auto-import dari kontak HP.

---

## 6. Spesifikasi API & Integrasi

### 6.1 Groq Whisper API
- Endpoint: `https://api.groq.com/openai/v1/audio/transcriptions`
- Model: `whisper-large-v3`
- Format kirim: `multipart/form-data`, file audio format `.m4a` atau `.wav`
- Timeout klien: 5 detik, sesuai FR-2.5

### 6.2 opBNB Testnet
- Chain ID: `5611`
- RPC: `https://opbnb-testnet-rpc.bnbchain.org`
- Explorer: `https://opbnb-testnet.bscscan.com`
- Faucet testnet BNB: dicari manual saat setup, dicatat di README proyek

### 6.3 Account Abstraction Provider
- Provider final: **Particle Network** (`@particle-network/rn-auth-core`, `@particle-network/rn-aa`).
- Setup dashboard: buat project di Particle Dashboard, ambil `Project ID`, `Client Key`, `App ID`, aktifkan opBNB Testnet, buat sponsor policy Paymaster.
- Cara generate Smart Account address baru: otomatis lewat `initAAModule` saat user pertama kali login, address bersifat counterfactual sampai transaksi pertama dieksekusi.

### 6.4 Environment Variables (`.env`, tidak masuk repo git)
```
GROQ_API_KEY=
PARTICLE_PROJECT_ID=
PARTICLE_CLIENT_KEY=
PARTICLE_APP_ID=
OPBNB_RPC_URL=https://opbnb-testnet-rpc.bnbchain.org
ENTRYPOINT_CONTRACT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
MOCK_USDT_CONTRACT_ADDRESS=       # isi setelah deploy MockUSDT
```

---

## 7. Arsitektur Teknis & Tech Stack

```
+-------------------------------------------------------+
|              TUTUR Mobile App (React Native)          |
|  - UI/UX: NativeWind (Tailwind CSS mobile), Dark Theme |
|  - Biometrics: react-native-passkey / WebAuthn         |
|  - Scanner: Google ML Kit Vision Barcode                |
+-------------------------------------------------------+
                           |
             +-------------+-------------+
             v                           v
+-------------------------+ +-------------------------+
|    AI Intent Pipeline   | |   Account Abstraction   |
| - Groq Whisper STT      | | - Particle Network      |
| - Local Slang Normalizer| | - opBNB Testnet (5611)  |
| - Blacklist/Allowance   | | - Gasless Paymaster     |
|   Checker                | | - MockUSDT contract     |
+-------------------------+ +-------------------------+
             |                           |
             +-------------+-------------+
                           v
          +----------------------------------+
          |         opBNB Blockchain         |
          |  - Smart Account (ERC-4337)      |
          |  - Bundler & Paymaster Contract  |
          +----------------------------------+
```

- **Frontend:** React Native (Bare CLI) + TypeScript, Android only
- **Styling:** NativeWind (custom components, tanpa UI kit), Dark Mode dengan aksen Emas BNB (`#F0B90B`) dan Emerald (`#10B981`)
- **AA Provider & Auth:** Particle Network
- **STT API:** Groq Cloud API (`whisper-large-v3`)
- **Jaringan:** opBNB Testnet
- **Penyimpanan Lokal:** WatermelonDB (SQLite)
- **State Management:** Zustand
- **Navigation:** React Navigation (Bottom Tab + Stack)

### 7.1 Project Structure

```
tutur/
├── android/                          # Native Android project
├── contracts/                        # Solidity contracts
│   └── MockUSDT.sol
├── src/
│   ├── app/                          # Navigation & entry
│   │   ├── App.tsx                   # Root component, provider wrapping
│   │   ├── Navigation.tsx            # Tab + Stack config
│   │   └── screens/
│   │       ├── SplashScreen.tsx
│   │       ├── LoginScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── ScanScreen.tsx
│   │       ├── HistoryScreen.tsx
│   │       └── ProfileScreen.tsx
│   ├── components/                   # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx            # Primary, Secondary, Danger variants
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx             # Security badge (green/yellow/red)
│   │   │   ├── Toast.tsx             # Snackbar notifications
│   │   │   ├── Input.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── home/
│   │   │   ├── BalanceCard.tsx        # Saldo utama + estimasi rupiah
│   │   │   ├── VoiceButton.tsx        # Tombol mic push-to-talk
│   │   │   ├── RecentTransactions.tsx # 3 transaksi terakhir
│   │   │   └── FaucetButton.tsx       # Tombol mint 100 USDT
│   │   ├── transaction/
│   │   │   ├── ConfirmationForm.tsx   # Form konfirmasi transaksi
│   │   │   ├── QuickFillForm.tsx      # Form ambiguity resolution
│   │   │   ├── SecurityWarning.tsx    # Modal warning blacklist/allowance
│   │   │   └── TransactionStatus.tsx  # Status sukses/gagal/pending
│   │   ├── voice/
│   │   │   └── VoiceOverlay.tsx       # Overlay recording + waveform
│   │   └── scan/
│   │       ├── QRScanner.tsx          # Camera QR scanner
│   │       └── PresetOCR.tsx          # Dua tombol preset invoice
│   ├── services/                     # Business logic & API calls
│   │   ├── groqService.ts            # Groq Whisper STT API call
│   │   ├── intentParser.ts           # Rule-based intent parser (FR-2A)
│   │   ├── particleService.ts        # Particle Auth + AA wrapper
│   │   ├── transactionService.ts     # UserOp building + sending
│   │   ├── securityService.ts        # Blacklist check + allowance audit
│   │   └── syncService.ts            # On-chain status sync (FR-7.3)
│   ├── utils/
│   │   ├── slangDictionary.ts        # Kamus slang → nilai (FR-2.2)
│   │   ├── resolver.ts              # BNS lookup table (FR-3.5)
│   │   ├── currencyConverter.ts     # Rupiah ↔ USDT conversion
│   │   └── formatters.ts            # Format angka, alamat, waktu
│   ├── stores/                       # Zustand state management
│   │   ├── useAuthStore.ts           # Auth state + session timer
│   │   ├── useTransactionStore.ts    # Draft intent + pending tx
│   │   ├── useVoiceStore.ts          # Recording state + STT result
│   │   └── useNetworkStore.ts        # Connection state + offline queue
│   ├── db/                           # WatermelonDB
│   │   ├── schema.ts                 # Database schema definition
│   │   ├── models/
│   │   │   ├── Transaction.ts
│   │   │   └── Contact.ts
│   │   └── index.ts                  # Database initialization
│   ├── constants/
│   │   ├── contracts.ts              # Contract addresses, ABIs
│   │   ├── chains.ts                 # Chain config (opBNB Testnet)
│   │   └── theme.ts                  # Warna, spacing, typography tokens
│   ├── hooks/
│   │   ├── useVoiceRecorder.ts       # Audio recording logic
│   │   ├── useInactivityTimer.ts     # Session timeout (FR-1.5)
│   │   └── useNetworkStatus.ts       # NetInfo wrapper
│   ├── types/
│   │   ├── intent.ts                 # IntentResult interface
│   │   ├── transaction.ts            # Transaction types
│   │   └── navigation.ts            # Navigation param types
│   └── assets/
│       ├── blacklist.json            # Static blacklist (FR-6.1)
│       └── testCases.json            # 15 test cases (FR-2A.5)
├── .env.example                      # Template env variables
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js                # NativeWind config
├── babel.config.js
└── metro.config.js
```

### 7.2 Dependencies

| Package | Versi | Fungsi | Catatan |
| :-- | :-- | :-- | :-- |
| `react-native` | 0.76.x | Framework utama | Bare CLI, Android only |
| `typescript` | ~5.5 | Type safety | Strict mode |
| `nativewind` | ~4.1 | Tailwind CSS untuk RN | Styling utama |
| `tailwindcss` | ~3.4 | Dependency NativeWind | Config di `tailwind.config.js` |
| `@react-navigation/native` | ^7.x | Navigation core | - |
| `@react-navigation/bottom-tabs` | ^7.x | Bottom tab navigation | 4 tab: Home, Scan, History, Profile |
| `@react-navigation/native-stack` | ^7.x | Stack navigation per tab | Push/pop screens |
| `react-native-screens` | - | Dependency React Navigation | Native screen containers |
| `react-native-safe-area-context` | - | Dependency React Navigation | Safe area insets |
| `@particle-network/rn-auth-core` | latest | Social Login (Google) | Keputusan D1 |
| `@particle-network/rn-aa` | latest | Smart Account + Paymaster | ERC-4337 |
| `@particle-network/chains` | latest | Chain definitions | opBNB Testnet |
| `zustand` | ^5.x | State management | Ringan, tanpa boilerplate |
| `@nozbe/watermelondb` | ^0.27 | SQLite ORM | Local cache riwayat |
| `react-native-audio-recorder-player` | ^3.x | Audio recording | Push-to-talk mic |
| `react-native-vision-camera` | ^4.x | Camera access | QR scanning |
| `react-native-ml-kit` | latest | Barcode detection | Google ML Kit integration |
| `@react-native-community/netinfo` | ^11.x | Network status detection | Offline queue trigger |
| `@react-native-async-storage/async-storage` | ^2.x | Key-value storage | Session timer, faucet cooldown |
| `ethers` | ^6.x | Ethereum utilities | ABI encoding, address validation |
| `react-native-svg` | - | SVG rendering | Icons, waveform visual |
| `react-native-reanimated` | ^3.x | Animations | Voice waveform, transitions |
| `react-native-gesture-handler` | ^2.x | Gesture handling | Dependency navigation + swipe |

**Tidak dipakai (keputusan sadar):**
- `expo` — Tidak kompatibel dengan Particle SDK native modules
- `react-native-paper` / `tamagui` — Custom NativeWind only (keputusan D12)
- `redux` / `@reduxjs/toolkit` — Overkill untuk proyek ini, Zustand cukup
- `axios` — `fetch` bawaan cukup, kurangi dependency

### 7.3 Navigation Architecture

**Bottom Tab Navigator (4 tab):**

```
BottomTabNavigator
├── HomeStack
│   ├── HomeScreen              (initial)
│   ├── ConfirmationScreen      (push dari voice/scan result)
│   └── TransactionDetailScreen (push dari riwayat di home)
├── ScanStack
│   ├── ScanScreen              (initial, kamera QR)
│   └── ConfirmationScreen      (push setelah scan berhasil)
├── HistoryStack
│   ├── HistoryScreen           (initial, list transaksi)
│   └── TransactionDetailScreen (push dari item list)
└── ProfileStack
    └── ProfileScreen           (initial, info akun)
```

**Modal/Overlay (di luar tab, di root stack):**

```
RootStack (mode: 'modal')
├── SplashScreen        (initial, cek auth status)
├── LoginScreen         (jika belum login)
├── MainTabs            (BottomTabNavigator di atas)
├── VoiceOverlay        (modal transparan, push-to-talk)
├── QuickFillModal      (modal, form ambiguity)
└── SecurityWarningModal (modal, warning blacklist/allowance)
```

**Screen List Lengkap (10 layar):**

| # | Screen | Tipe | Stack | Deskripsi |
| :-- | :-- | :-- | :-- | :-- |
| 1 | SplashScreen | Screen | Root | Logo + cek auth, auto-redirect |
| 2 | LoginScreen | Screen | Root | Google login + passkey setup |
| 3 | HomeScreen | Tab Screen | HomeStack | Dashboard: saldo, mic, riwayat singkat |
| 4 | ScanScreen | Tab Screen | ScanStack | Kamera QR + 2 tombol preset |
| 5 | HistoryScreen | Tab Screen | HistoryStack | Daftar riwayat transaksi |
| 6 | ProfileScreen | Tab Screen | ProfileStack | Info akun, alamat, faucet, logout |
| 7 | VoiceOverlay | Modal | Root | Overlay recording + waveform |
| 8 | ConfirmationScreen | Screen | HomeStack/ScanStack | Detail transaksi + security badge |
| 9 | QuickFillModal | Modal | Root | Form isi field yang kosong |
| 10 | SecurityWarningModal | Modal | Root | Warning blacklist / unlimited approve |

### 7.4 State Management (Zustand)

**Store 1: `useAuthStore`**
```typescript
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    email: string;
    smartAccountAddress: string;
    eoaAddress: string;
  } | null;
  lastActivityTimestamp: number;
  sessionExpired: boolean;

  // Actions
  login: (provider: 'google') => Promise<void>;
  logout: () => Promise<void>;
  refreshActivity: () => void;         // Reset inactivity timer
  checkSessionExpiry: () => boolean;    // Cek apakah 30 menit terlewat
}
```

**Store 2: `useTransactionStore`**
```typescript
interface TransactionState {
  draftIntent: IntentResult | null;     // Intent dari voice/scan, sebelum konfirmasi
  pendingTx: {
    userOpHash: string;
    status: 'sending' | 'polling' | 'pending';
  } | null;
  recentTransactions: Transaction[];    // Cache 3 terakhir untuk Home

  // Actions
  setDraftIntent: (intent: IntentResult) => void;
  clearDraft: () => void;
  submitTransaction: () => Promise<string>; // Returns userOpHash
  pollStatus: (hash: string) => Promise<'success' | 'failed' | 'pending'>;
}
```

**Store 3: `useVoiceStore`**
```typescript
interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;                // STT sedang berjalan
  recordingDuration: number;            // 0-10 detik
  rawTranscript: string | null;         // Teks mentah dari STT
  error: string | null;                 // Error message

  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>; // Returns audio file path
  processAudio: (filePath: string) => Promise<IntentResult>;
  reset: () => void;
}
```

**Store 4: `useNetworkStore`**
```typescript
interface NetworkState {
  isConnected: boolean;
  draftQueueCount: number;              // Jumlah transaksi di antrian

  // Actions
  updateConnectionStatus: (connected: boolean) => void;
  retryDraftQueue: () => Promise<void>; // Kirim ulang semua draft
}
```

### 7.5 UI Design System

#### 7.5.1 Color Palette

```typescript
// File: src/constants/theme.ts

export const colors = {
  // Background (Dark Mode)
  bgPrimary:    '#0F0F14',   // Layar utama, hampir hitam
  bgSecondary:  '#1A1A24',   // Card, form background
  bgTertiary:   '#252530',   // Input field, nested card

  // Brand
  bnbGold:      '#F0B90B',   // Aksen utama, tombol CTA, ikon aktif
  emerald:      '#10B981',   // Status sukses, saldo positif
  emeraldDark:  '#059669',   // Hover/pressed emerald

  // Text
  textPrimary:  '#FFFFFF',   // Heading, saldo
  textSecondary:'#A1A1AA',   // Label, placeholder, subtitle
  textMuted:    '#71717A',   // Timestamp, info minor

  // Status / Security Badge
  statusGreen:  '#10B981',   // Aman
  statusYellow: '#F59E0B',   // Warning (unlimited allowance)
  statusRed:    '#EF4444',   // Danger (blacklist)

  // Functional
  error:        '#EF4444',
  border:       '#2E2E3A',   // Border card, divider
  overlay:      'rgba(0,0,0,0.6)', // Modal backdrop
};
```

#### 7.5.2 Typography

```typescript
export const typography = {
  // Heading
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },  // Saldo utama
  h2: { fontSize: 22, fontWeight: '600', lineHeight: 28 },  // Section title
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },  // Card title

  // Body
  body:   { fontSize: 16, fontWeight: '400', lineHeight: 22 },  // Teks umum
  bodyBold:{ fontSize: 16, fontWeight: '600', lineHeight: 22 }, // Label form
  small:  { fontSize: 14, fontWeight: '400', lineHeight: 18 },  // Secondary info
  tiny:   { fontSize: 12, fontWeight: '400', lineHeight: 16 },  // Timestamp, badge

  // Mono (untuk alamat wallet, hash)
  mono:   { fontSize: 14, fontWeight: '400', fontFamily: 'monospace' },
};
```

#### 7.5.3 Spacing & Layout

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,  // Tombol bulat (mic button)
};
```

#### 7.5.4 Component Variants

| Component | Variants | Catatan |
| :-- | :-- | :-- |
| Button | `primary` (BNB Gold bg), `secondary` (border only), `danger` (red), `ghost` (text only) | Height: 48px, border-radius: 12px |
| Card | `default` (bgSecondary), `elevated` (shadow) | Padding: 16px, border-radius: 12px |
| Badge | `green` / `yellow` / `red` | Font: tiny, padding: 4px 8px, border-radius: full |
| Input | `default`, `error` (border merah), `disabled` | Height: 48px, bgTertiary, border-radius: 8px |
| Toast | `success` (emerald), `error` (red), `info` (gold) | Auto-dismiss 3 detik, bottom position |

#### 7.5.5 Icon Strategy

Gunakan `react-native-vector-icons` (MaterialCommunityIcons) atau inline SVG via `react-native-svg` untuk ikon minimal:
- Tab bar: Home (wallet), Scan (qr-code), History (history), Profile (account-circle)
- Action: mic, send, copy, external-link, shield-check, alert-triangle
- Status: check-circle (sukses), clock (pending), x-circle (gagal)

---

## 8. Persyaratan Non-Fungsional (NFR)

1. **Latensi**
   - Transkripsi suara + parsing intent: target internal 1.2 detik.
   - Pengiriman UserOp hingga konfirmasi opBNB: target internal 1.8 detik.
   - Total waktu eksekusi suara-ke-transaksi: target internal di bawah 3 detik.
   - Target di atas adalah acuan optimasi internal, bukan angka yang boleh langsung dipasang di pitch deck. Groq API dan opBNB Testnet publik sama-sama punya variasi latensi di luar kendali TUTUR. Ukur angka aktual dari uji coba sendiri (rata-rata dari minimal 10 kali percobaan) dan pakai angka itu di pitch deck, supaya tidak ada celah pertanyaan juri saat demo live meleset dari target ideal.
2. **Keamanan & Privasi**
   - Kunci privat penandatangan disimpan di Secure Enclave/Android Keystore.
   - Audio tidak pernah disimpan permanen di disk perangkat atau di backend TUTUR sendiri. Audio tetap dikirim ke Groq API untuk transkripsi, jadi klaim privasi ke juri harus dibatasi ke "tidak disimpan permanen oleh TUTUR", bukan "zero PII storage" tanpa syarat. Kebijakan retensi data Groq dicek di H-1 (Section 11) supaya klaim final di pitch deck sudah akurat sebelum Hari 4, bukan dicek mendadak menjelang submit.
3. **Efisiensi Biaya**
   - Biaya transaksi opBNB yang disubsidi Paymaster rata-rata di bawah $0.001 per transaksi.
4. **Ketahanan Jaringan**
   - Aplikasi tetap dapat dibuka dan menampilkan riwayat lokal saat offline.
   - Transaksi baru yang gagal terkirim karena jaringan disimpan di antrian lokal, dicoba ulang otomatis saat koneksi kembali.

---

## 9. Checklist Pengujian Sebelum Submit

Developer menjalankan checklist ini sebelum merekam video demo di Hari 4.

- [x] Login Google berhasil dan Smart Account ter-deploy di block explorer opBNB Testnet (Persona Rian Senja terhubung).
- [x] Perintah suara "kirim goceng USDT ke Budi" menghasilkan JSON intent yang benar (100% test cases pass).
- [x] Perintah suara tanpa nominal memicu Quick-Fill Form, bukan re-record.
- [x] Transaksi transfer USDT sukses tercatat di block explorer dengan gas disponsori (0 BNB dari saldo user).
- [x] Scan QR alamat wallet valid mengisi form penerima dengan benar (format EIP-681, hex polos, & .bnb).
- [x] Scan QR yang bukan alamat wallet menampilkan pesan error, tidak crash (FR-5.2 toast handling).
- [x] Alamat yang cocok blacklist memicu badge merah dan blokir transaksi (Security Shield modal merah).
- [x] Calldata `approve` unlimited memicu warning kuning dengan dua opsi yang berfungsi (Security Shield modal kuning).
- [x] Riwayat transaksi muncul instan saat aplikasi dibuka ulang, termasuk saat offline (persisten di SQLite lokal).
- [x] Audio rekaman tidak tersisa di penyimpanan device setelah intent diekstraksi (ephemeral memory handling).
- [x] Retry logic UserOp (FR-4.6) diuji dengan sengaja memutus koneksi di tengah pengiriman, pastikan tidak menghasilkan dua transaksi transfer dobel di block explorer.
- [ ] Build APK sudah diuji di device fisik kedua (bukan hanya device pengembangan), termasuk alur login Google dari awal.

---

## 10. Metrik Kunci untuk Pitch Deck

| Metrik | Target Demo | Pesan Kunci untuk Juri |
| :-- | :-- | :-- |
| Execution Latency | Angka hasil ukur sendiri (lihat NFR 1), bukan target ideal | Transaksi kripto secepat kirim voice note. |
| Onboarding Cost | $0 / 0 gas fee | Tidak perlu deposit BNB dulu untuk mulai. |
| Intent Accuracy | Di atas 90%, diukur lewat metodologi Section 10.1 | Paham gaya bicara orang Indonesia termasuk slang nominal harian. |

### 10.1 Metodologi Pengukuran Intent Accuracy
Angka "di atas 90%" wajib punya dasar pengukuran, bukan klaim tanpa data. Metodologi minimum:
- Gunakan 10–15 kalimat uji yang disiapkan di H-1, dengan variasi: nominal slang (goceng, ceban, gocap), nominal rupiah penuh, tiga jenis aksi (transfer, cek saldo, swap), dan beberapa kalimat dengan parameter sengaja tidak lengkap.
- Jalankan tiap kalimat minimal 3 kali (beda waktu/kondisi noise) untuk dapat total minimal 30–45 percobaan.
- Hitung akurasi sebagai persentase percobaan yang menghasilkan `action`, `recipient` (jika ada), dan `amount` yang benar tanpa perlu koreksi manual di Quick-Fill Form.
- Catat metodologi ini di satu slide pitch deck, supaya siap kalau juri tanya "diukur dari berapa sampel".

---

## 11. Rencana Eksekusi (H-1 sampai Hari 4)

Solo builder. Hari 1 versi sebelumnya terlalu padat (setup proyek, auth, AA, deploy token, deploy Smart Account, aktivasi Paymaster dalam satu hari). Native module React Native untuk biometrik/passkey sering molor karena masalah linking dan versi dependency, jadi beban Hari 1 dipangkas dan sebagian dipindah ke H-1 (malam sebelum mulai) serta ke pagi Hari 2.

**H-1 (malam sebelum 27 Sep) — Persiapan yang Tidak Butuh Coding**
- `[HUMAN]` Buat project di Particle Dashboard, catat Project ID/Client Key/App ID.
- `[HUMAN]` Request tBNB dari faucet resmi BNB Chain (proses approval/bridge kadang butuh waktu tunggu di luar kendali kamu, mulai dari malam supaya tidak menghambat Hari 1).
- `[AI]` Kumpulkan 5–10 alamat blacklist dari laporan scam Web3 publik, simpan sebagai draf `blacklist.json`. Ini menghindari Hari 3 terpakai untuk riset alih-alih implementasi.
- `[AI]` Siapkan 10–15 kalimat uji suara dengan variasi slang untuk dipakai nanti sebagai basis pengukuran Intent Accuracy (lihat Section 10.1).
- `[HUMAN]` Cek dokumentasi Particle Network soal model custody yang dipakai (MPC, TSS, atau model lain) dan catat satu kalimat penjelasannya. Jangan tunda ke Hari 4, karena ini bagian dari keputusan D1 yang sudah dipakai, bukan sekadar catatan pitch deck di akhir.
- `[HUMAN]` Cek kebijakan retensi data Groq untuk audio yang dikirim lewat API `audio/transcriptions`, supaya klaim privasi di NFR 2 dan pitch deck akurat.
- `[HUMAN]` Cek ketentuan portal `indonesiaweb3hack.xyz` soal metode penilaian: apakah juri menonton video saja atau menginstal APK dan mencoba sendiri. Ini menentukan prioritas kerja Hari 4, jadi harus jelas dari awal, bukan menjelang submit.

**Hari 1 (27 Sep) — Setup & Auth**
- `[AI]` Setup proyek React Native + TypeScript + NativeWind.
- `[AI]` Integrasi `@particle-network/rn-auth-core`, selesaikan alur login Google saja dulu (auth, belum AA), memakai Project ID/Client Key dari H-1.
- `[HUMAN]`+`[AI]` Deploy `MockUSDT` lewat Remix ke opBNB Testnet: agen menyiapkan kode kontrak dan langkah deploy, Senja yang menandatangani transaksi deploy dengan wallet asli. Catat contract address ke `.env`.
- `[AI]` Jika waktu masih tersisa: mulai integrasi `@particle-network/rn-aa`, tapi jangan paksakan selesai hari ini.

**Hari 2 (28 Sep) — AA + Voice Pipeline**
- `[HUMAN]`+`[AI]` Pagi: selesaikan integrasi `@particle-network/rn-aa` (agen), deploy Smart Account pertama dan aktifkan sponsor policy Paymaster di Particle Dashboard (Senja, karena butuh akses dashboard dan signing asli). Kirim satu transaksi transfer MockUSDT manual (tanpa UI) untuk pastikan seluruh rantai on-chain jalan. **Ini titik go/no-go**: beri batas waktu sampai jam 15:00. Kalau belum berhasil di jam itu, jalankan Exit Plan di Section 11.2 alih-alih terus mencoba sampai malam.
- `[AI]` Siang–sore: integrasi Groq Whisper API, uji rekaman dan transkripsi.
- `[AI]` Bangun `slangDictionary.ts` (minimal 20 entri), `resolver.ts` (FR-3.5), dan Intent Parser (FR-2.3).
- `[AI]` Bangun skema database lokal WatermelonDB (Section 5).

**Hari 3 (29 Sep) — UI & Security Shield**
- `[AI]` Bangun UI Quick-Fill Form (FR-3).
- `[AI]` Bangun Security Shield pakai `blacklist.json` yang sudah disiapkan di H-1, dan unlimited allowance detector (FR-6).
- `[AI]` Sambungkan Voice Pipeline (Hari 2) ke Smart Account (Hari 1–2), uji transaksi transfer end-to-end lewat UI, termasuk jalur gagal prioritas tinggi di Section 2.3.
- `[AI]` Bangun scanner QR (FR-5.1) dan dua tombol preset OCR (FR-5.3).

**Hari 4 (30 Sep) — Hardening, Build, Submit**
- `[AI]` Pagi: jalankan checklist pengujian penuh (Section 9), perbaiki bug kritis saja, jangan tambah fitur baru.
- `[HUMAN]` Siang: build APK dan uji di device fisik kedua (lihat Section 11.1 soal metode pengujian juri). Rekam video demo 2 sampai 3 menit di siang hari, bukan sore, supaya ada waktu re-take kalau gagal.
- `[HUMAN]`+`[AI]` Sore: finalisasi pitch deck dengan metrik kunci (Section 10). Agen menyusun draf teks dan angka, Senja mengecek keakuratan klaim (custody, privasi, latensi) sebelum dipakai.
- `[HUMAN]` Submit ke portal `indonesiaweb3hack.xyz` sebelum 21:30 WIB, sisakan minimal 2 jam buffer untuk masalah upload (ukuran file besar, koneksi lambat, portal error).

Karena solo, OCR struk penuh dan fitur di luar Scope Matrix (Section 3) tidak disentuh sama sekali dalam rentang waktu ini.

### 11.1 Metode Pengujian Juri
Dicek di H-1 lewat ketentuan portal `indonesiaweb3hack.xyz`, bukan diasumsikan menjelang submit. Kalau juri menginstal APK, build Hari 4 wajib bisa connect ke Particle Dashboard project milikmu dari device asing (bukan cuma device pengembangan). Kalau juri cukup menonton video, prioritas Hari 4 bergeser ke kualitas rekaman demo dibanding stabilitas build lintas device.

### 11.2 Exit Plan Jika Go/No-Go Hari 2 Gagal
Kalau integrasi `@particle-network/rn-aa` belum menghasilkan satu transaksi sukses sampai jam 15:00 Hari 2, jalankan langkah berikut alih-alih terus debugging tanpa batas:
1. `[AI]` Turunkan scope eksekusi on-chain: pakai satu EOA wallet biasa (ethers.js, private key tersimpan di `.env` lokal, bukan diserahkan ke pengguna) yang sudah didanai tBNB dan MockUSDT, untuk mengeksekusi transfer langsung tanpa lapisan Smart Account/Paymaster.
2. `[AI]` UI dan voice pipeline tetap jalan penuh seperti rencana, hanya bagian "siapa yang menandatangani transaksi" yang disederhanakan.
3. `[HUMAN]` Sampaikan status ini secara jujur ke juri di pitch deck: "Layer Account Abstraction (Smart Account + Paymaster) sudah diimplementasikan di kode, demo live memakai wallet EOA sementara untuk memastikan stabilitas selama sesi juri." Sertakan cuplikan kode AA yang sudah ditulis sebagai bukti, bukan disembunyikan.
4. `[AI]`+`[HUMAN]` Jangan buang waktu Hari 3 untuk debug AA lagi kecuali sisa waktu benar-benar ada setelah semua fitur lain di Scope Matrix selesai. Keputusan "lanjut debug atau tidak" tetap ada di tangan Senja, agen tidak memutuskan sendiri untuk kembali ke jalur AA tanpa persetujuan eksplisit.

---

## 12. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| :-- | :-- | :-- |
| SDK AA (D1) punya masalah kompatibilitas dengan React Native versi terbaru | Blokir seluruh alur transaksi | Uji integrasi di Hari 1 pagi, siapkan waktu buffer sebelum lanjut fitur lain |
| Groq API mengalami rate limit saat demo langsung | Voice command gagal di depan juri | Siapkan fallback input teks manual yang selalu berfungsi tanpa STT |
| Testnet opBNB mengalami kongesti atau downtime | Transaksi tidak terkonfirmasi saat demo | Rekam video demo dengan transaksi yang sudah terbukti sukses sebagai cadangan, jangan hanya andalkan demo live |
| Paymaster kehabisan saldo di tengah demo | Transaksi gagal tanpa penjelasan jelas ke juri | Cek saldo Paymaster manual sebelum sesi demo, siapkan top up cadangan |
| Hari 1 molor karena integrasi native module biometrik/passkey | Menunda seluruh rencana karena Hari 1 jadi fondasi fitur lain | Sebagian setup (Particle Dashboard, faucet) dipindah ke H-1; auth dan AA dipisah ke dua hari (lihat Section 11) |
| Juri bertanya soal model custody Particle Network (MPC/TSS atau model lain) | Tidak bisa menjawab pertanyaan keamanan dasar saat sesi Q&A | Dicek di H-1, bukan Hari 4 (lihat Section 11), siapkan satu kalimat penjelasan di pitch deck |
| Groq API dan opBNB Testnet bermasalah bersamaan saat demo live | Tidak ada satu pun jalur transaksi yang bisa ditunjukkan ke juri secara langsung | Rekam satu video demo penuh yang sudah terbukti sukses (Hari 4 siang) sebagai fallback mutlak yang bisa langsung diputar kalau kedua layanan eksternal gagal bersamaan saat sesi live, terpisah dari video demo utama yang disubmit |

---

## 13. Wireframe ASCII

Semua wireframe mengacu pada dark mode (bg `#0F0F14`). Keterangan warna ditulis dalam komentar `// warna`. Ukuran mengacu pada layout Android standar (~360dp lebar).

### 13.1 Splash Screen

```
┌──────────────────────────────┐
│                              │
│                              │
│                              │
│                              │
│         ╔══════════╗         │
│         ║  TUTUR   ║         │  // #F0B90B (BNB Gold), h1, bold
│         ╚══════════╝         │
│                              │
│    Dompet Kripto Bahasa      │  // #A1A1AA, small
│       Sehari-hari            │
│                              │
│         ┌────────┐           │
│         │ · · ·  │           │  // Loading dots animation
│         └────────┘           │
│                              │
│                              │
│                              │
│                              │
│                              │
└──────────────────────────────┘
```
- Auto-redirect ke LoginScreen jika belum login, atau HomeScreen jika sesi aktif.
- Durasi tampil: 1.5 detik atau sampai auth check selesai (mana yang lebih lama).

### 13.2 Login Screen

```
┌──────────────────────────────┐
│                              │
│                              │
│         ╔══════════╗         │
│         ║  TUTUR   ║         │  // #F0B90B, h1
│         ╚══════════╝         │
│                              │
│   Transaksi kripto semudah   │  // #FFFFFF, body
│      ngobrol biasa           │
│                              │
│                              │
│  ┌────────────────────────┐  │
│  │  G  Masuk dengan Google│  │  // Button primary, #F0B90B bg
│  └────────────────────────┘  │
│                              │
│                              │
│  Dengan masuk, kamu setuju   │  // #71717A, tiny
│  dengan Syarat & Ketentuan   │
│                              │
│                              │
│                              │
└──────────────────────────────┘
```
- Setelah login Google berhasil, redirect ke HomeScreen.
- Jika gagal: tampilkan toast error merah + tombol "Coba Lagi".
- Tidak ada form email/password manual, hanya Google SSO via Particle SDK.

### 13.3 Home Screen (Tab 1)

```
┌──────────────────────────────┐
│  TUTUR              (avatar) │  // Header: #F0B90B logo, avatar kanan
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │
│  │  Saldo Kamu             │  │  // #A1A1AA, small
│  │                         │  │
│  │  5.00 USDT              │  │  // #FFFFFF, h1, 28px bold
│  │  ≈ Rp 89.580            │  │  // #A1A1AA, small
│  │                         │  │
│  │  0x89...2A1F   [copy]   │  │  // #71717A, mono, copy icon
│  │                         │  │
│  │  ┌──────────────────┐   │  │
│  │  │ Minta 100 USDT   │   │  │  // Button secondary, border #F0B90B
│  │  └──────────────────┘   │  │
│  └────────────────────────┘  │  // Card: bgSecondary, rounded-lg
│                              │
│  Aktivitas Terakhir          │  // #FFFFFF, h3
│  ┌────────────────────────┐  │
│  │ ↑ Kirim 5 USDT         │  │  // #EF4444 (keluar)
│  │   ke budi.bnb           │  │  // #A1A1AA
│  │   2 menit lalu  [hijau]│  │  // #71717A + badge green
│  ├────────────────────────┤  │
│  │ ↓ Terima 10 USDT       │  │  // #10B981 (masuk)
│  │   dari afif.bnb         │  │
│  │   1 jam lalu    [hijau]│  │
│  ├────────────────────────┤  │
│  │ ↑ Kirim 50 USDT        │  │
│  │   ke warung.bnb         │  │
│  │   kemarin      [hijau] │  │
│  └────────────────────────┘  │
│                              │
│       ┌──────────────┐       │
│       │              │       │
│       │    ( MIC )   │       │  // Tombol bulat 72dp, #F0B90B bg
│       │              │       │  // Ikon mic putih di tengah
│       └──────────────┘       │
│   Tekan & tahan untuk bicara │  // #71717A, tiny, center
│                              │
├──────────────────────────────┤
│  [Home]  [Scan] [History] [Me]│ // Bottom tab, active = #F0B90B
└──────────────────────────────┘
```
- Saldo diambil dari `balanceOf` RPC call saat screen mount + setiap 30 detik.
- Estimasi rupiah = saldo * 17916.
- Tombol mic: push-to-talk, tekan tahan → VoiceOverlay muncul.
- "Minta 100 USDT" = faucet button, cooldown 60 detik setelah mint.

### 13.4 Voice Recording Overlay (Modal)

```
┌──────────────────────────────┐
│                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │  // Overlay gelap 60% opacity
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │   Mendengarkan...      │  │  // #FFFFFF, h2, center
│  │                        │  │
│  │  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿  │  │  // Waveform animasi, #F0B90B
│  │                        │  │
│  │      ◉ 3.2 detik       │  │  // Timer recording, #EF4444 dot
│  │                        │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Lepas untuk      │  │  │  // #A1A1AA, small
│  │  │  mengirim         │  │  │
│  │  └──────────────────┘  │  │
│  │                        │  │
│  │       [Batalkan]       │  │  // Ghost button, #A1A1AA
│  │                        │  │
│  └────────────────────────┘  │  // Card: bgSecondary, rounded-lg
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────┘
```

**State: Setelah lepas (processing)**
```
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │   Memproses...         │  │  // #FFFFFF, h2
│  │                        │  │
│  │       [spinner]        │  │  // Loading spinner, #F0B90B
│  │                        │  │
│  │  "kirim goceng USDT    │  │  // Teks transkripsi muncul
│  │   ke Budi"             │  │  // #10B981, body, italic
│  │                        │  │
│  └────────────────────────┘  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────┘
```

**State: Error/timeout**
```
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │  Tidak terdengar jelas │  │  // #EF4444, h3
│  │                        │  │
│  │  Coba lagi atau ketik  │  │  // #A1A1AA, body
│  │  perintah secara manual│  │
│  │                        │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Coba Lagi       │  │  │  // Button primary, #F0B90B
│  │  └──────────────────┘  │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Ketik Manual    │  │  │  // Button secondary
│  │  └──────────────────┘  │  │
│  │                        │  │
│  └────────────────────────┘  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────┘
```
- "Ketik Manual" → buka QuickFillModal dengan semua field kosong.

### 13.5 Confirmation Screen

```
┌──────────────────────────────┐
│  ←  Konfirmasi Transaksi     │  // Back arrow + title, #FFFFFF
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │
│  │  Kirim                 │  │  // #A1A1AA, small
│  │  5.00 USDT             │  │  // #FFFFFF, h1, bold
│  │  ≈ Rp 89.580           │  │  // #A1A1AA, small
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  Kepada                │  │  // #A1A1AA, small
│  │  budi.bnb              │  │  // #FFFFFF, body, bold
│  │  0x7099...79C8         │  │  // #71717A, mono
│  ├────────────────────────┤  │
│  │  Token                 │  │
│  │  USDT                  │  │  // #FFFFFF, body
│  ├────────────────────────┤  │
│  │  Biaya Gas             │  │
│  │  0 BNB (Disponsori)    │  │  // #10B981, body
│  ├────────────────────────┤  │
│  │  Status Keamanan       │  │
│  │  ● Aman                │  │  // Badge green: #10B981
│  └────────────────────────┘  │  // Card: bgSecondary
│                              │
│  ┌────────────────────────┐  │
│  │  Dikenali dari suara:  │  │  // #71717A, small
│  │  "kirim goceng USDT    │  │  // #A1A1AA, small, italic
│  │   ke Budi"             │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  Konfirmasi & Kirim    │  │  // Button primary, #F0B90B, h3
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │  Batalkan              │  │  // Button ghost, #A1A1AA
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```
- Tombol "Konfirmasi & Kirim" memicu biometric prompt (jika tersedia).
- Setelah konfirmasi → TransactionStatus loading → redirect ke Home dengan toast sukses/gagal.
- Jika confidence < 0.75: field dengan warna kuning, hint "Periksa kembali".

### 13.6 Quick-Fill Form (Modal)

```
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ┌────────────────────────┐  │
│  │  Lengkapi Transaksi    │  │  // #FFFFFF, h2
│  │                        │  │
│  │  Beberapa info belum   │  │  // #A1A1AA, body
│  │  terdeteksi dari suara │  │
│  │                        │  │
│  │  Tindakan              │  │  // Label, #A1A1AA
│  │  ┌──────────────────┐  │  │
│  │  │ TRANSFER     [v] │  │  │  // Dropdown, pre-filled jika ada
│  │  └──────────────────┘  │  │
│  │                        │  │
│  │  Penerima              │  │  // Label, #A1A1AA
│  │  ┌──────────────────┐  │  │
│  │  │                  │  │  │  // Input KOSONG = border #EF4444
│  │  └──────────────────┘  │  │  // Input TERISI = border #2E2E3A
│  │  [Scan QR] [Tempel]   │  │  // 2 link/button kecil, #F0B90B
│  │                        │  │
│  │  Jumlah                │  │
│  │  ┌──────────────────┐  │  │
│  │  │ 5.00         USDT│  │  │  // Numeric input + token suffix
│  │  └──────────────────┘  │  │
│  │                        │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Lanjutkan       │  │  │  // Disabled jika field wajib kosong
│  │  └──────────────────┘  │  │  // Enabled: #F0B90B, Disabled: #71717A
│  │                        │  │
│  │  [Batalkan]            │  │  // Ghost button
│  └────────────────────────┘  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────┘
```
- Field yang ter-detect dari voice: pre-filled, editable, border default.
- Field yang TIDAK ter-detect: kosong, border merah, label merah.
- Tombol "Lanjutkan" disabled sampai semua field wajib (action, penerima, jumlah) terisi.
- "Lanjutkan" → push ke ConfirmationScreen.

### 13.7 Security Warning Modal

**Variant A: Blacklist Detected (MERAH)**
```
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │     ⚠ PERINGATAN       │  │  // #EF4444, h2, center
│  │                        │  │
│  │  ┌──────────────────┐  │  │
│  │  │  ● BERBAHAYA     │  │  │  // Badge red, full width
│  │  └──────────────────┘  │  │
│  │                        │  │
│  │  Alamat tujuan terdata │  │  // #FFFFFF, body
│  │  sebagai alamat yang   │  │
│  │  dilaporkan terlibat   │  │
│  │  penipuan.             │  │
│  │                        │  │
│  │  0x1234...5678         │  │  // #EF4444, mono
│  │                        │  │
│  │  Transaksi DIBLOKIR    │  │  // #EF4444, bodyBold
│  │  demi keamanan kamu.   │  │
│  │                        │  │
│  │  ┌──────────────────┐  │  │
│  │  │ Saya paham       │  │  │  // Button danger, bg #EF4444
│  │  │ risikonya,       │  │  │  // Harus ditekan eksplisit
│  │  │ lanjutkan        │  │  │
│  │  └──────────────────┘  │  │
│  │  ┌──────────────────┐  │  │
│  │  │ Batalkan (aman)  │  │  │  // Button primary, #F0B90B
│  │  └──────────────────┘  │  │  // DEFAULT terpilih
│  │                        │  │
│  └────────────────────────┘  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────┘
```

**Variant B: Unlimited Allowance (KUNING)**
```
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │     ⚠ Perhatian        │  │  // #F59E0B, h2
│  │                        │  │
│  │  ┌──────────────────┐  │  │
│  │  │  ● PERIKSA       │  │  │  // Badge yellow
│  │  └──────────────────┘  │  │
│  │                        │  │
│  │  Kontrak ini meminta   │  │  // #FFFFFF, body
│  │  izin mengakses SELURUH│  │
│  │  saldo USDT kamu tanpa │  │
│  │  batas.                │  │
│  │                        │  │
│  │  ┌──────────────────┐  │  │
│  │  │ ◉ Batasi izin    │  │  │  // Radio, DEFAULT selected
│  │  │   sesuai transaksi│  │  │  // #10B981
│  │  └──────────────────┘  │  │
│  │  ┌──────────────────┐  │  │
│  │  │ ○ Batalkan       │  │  │  // Radio, not selected
│  │  │   transaksi      │  │  │
│  │  └──────────────────┘  │  │
│  │                        │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Lanjutkan       │  │  │  // Button primary, #F0B90B
│  │  └──────────────────┘  │  │
│  │                        │  │
│  └────────────────────────┘  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────┘
```

### 13.8 Scan Screen (Tab 2)

```
┌──────────────────────────────┐
│  Scan QR                     │  // Header, #FFFFFF
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │                        │  │
│  │    ┌──────────────┐    │  │
│  │    │              │    │  │
│  │    │   VIEWFINDER │    │  │  // Kamera live, frame #F0B90B
│  │    │              │    │  │
│  │    │              │    │  │
│  │    └──────────────┘    │  │
│  │                        │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Arahkan kamera ke QR code   │  // #A1A1AA, small, center
│  alamat wallet               │
│                              │
│  ── atau bayar tagihan ──    │  // Divider + text, #71717A
│                              │
│  ┌────────────────────────┐  │
│  │  Tagihan Hosting $15   │  │  // Button secondary, border gold
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │  Struk Kopi Rp 25.000  │  │  // Button secondary, border gold
│  └────────────────────────┘  │
│                              │
├──────────────────────────────┤
│  [Home]  [Scan] [History] [Me]│
└──────────────────────────────┘
```
- QR berhasil scan alamat valid → push ConfirmationScreen (recipient pre-filled).
- QR tidak valid → toast error "QR tidak dikenali sebagai alamat wallet".
- Tombol preset → langsung push ConfirmationScreen dengan data preset:
  - "Tagihan Hosting $15" → amount: 15, token: USDT, recipient: kosong (user isi manual)
  - "Struk Kopi Rp 25.000" → amount: 1.40 USDT (25000/17916), recipient: kosong

### 13.9 History Screen (Tab 3)

```
┌──────────────────────────────┐
│  Riwayat Transaksi           │  // Header, #FFFFFF
├──────────────────────────────┤
│                              │
│  Hari Ini                    │  // #A1A1AA, small, section header
│  ┌────────────────────────┐  │
│  │ ↑ Kirim 5.00 USDT      │  │  // Arrow: #EF4444
│  │   ke budi.bnb           │  │  // #A1A1AA
│  │   14:32  ● Berhasil     │  │  // #71717A + badge green
│  │   Gas: Disponsori       │  │  // #10B981, tiny
│  ├────────────────────────┤  │
│  │ ↓ Terima 10.00 USDT    │  │  // Arrow: #10B981
│  │   dari afif.bnb         │  │
│  │   12:15  ● Berhasil     │  │
│  │   Gas: Disponsori       │  │
│  └────────────────────────┘  │
│                              │
│  Kemarin                     │  // Section header
│  ┌────────────────────────┐  │
│  │ ↑ Kirim 50.00 USDT     │  │
│  │   ke warung.bnb         │  │
│  │   20:45  ● Berhasil     │  │
│  │   Gas: Disponsori       │  │
│  ├────────────────────────┤  │
│  │ ↑ Kirim 3.00 USDT      │  │
│  │   ke 0x3C44...93BC      │  │  // Tanpa BNS, tampilkan hex
│  │   15:20  ● Tertunda     │  │  // Badge yellow: pending
│  │   Gas: Disponsori       │  │
│  └────────────────────────┘  │
│                              │
│  (scroll for more)           │  // #71717A, tiny, center
│                              │
├──────────────────────────────┤
│  [Home]  [Scan] [History] [Me]│
└──────────────────────────────┘
```
- Data dari WatermelonDB, grouped by date.
- Tap item → push TransactionDetailScreen (opsional untuk MVP, bisa skip).
- Status badge: Berhasil (green), Tertunda (yellow), Gagal (red).
- Saat offline: data tetap tampil dari cache lokal, banner kecil "Offline" di atas.

### 13.10 Profile Screen (Tab 4)

```
┌──────────────────────────────┐
│  Profil                      │  // Header, #FFFFFF
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │
│  │  ┌────┐                │  │
│  │  │ AH │  Afif Hamzah   │  │  // Avatar circle, initials
│  │  └────┘  afif@gmail.com│  │  // #A1A1AA, small
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  Smart Account          │  │  // #A1A1AA, small
│  │  0x90F7...3b906        │  │  // #FFFFFF, mono
│  │                 [copy]  │  │  // Copy icon, #F0B90B
│  ├────────────────────────┤  │
│  │  EOA Address            │  │
│  │  0x1234...5678          │  │  // #71717A, mono
│  │                 [copy]  │  │
│  ├────────────────────────┤  │
│  │  Jaringan               │  │
│  │  opBNB Testnet (5611)   │  │  // #10B981, body
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  Minta 100 USDT Faucet │  │  // Button secondary
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  Lihat di Block Explorer│  │  // Button ghost, #F0B90B text
│  └────────────────────────┘  │  // Opens opbnb-testnet.bscscan.com
│                              │
│  ┌────────────────────────┐  │
│  │  Keluar                 │  │  // Button danger, #EF4444 text
│  └────────────────────────┘  │
│                              │
│  TUTUR v1.0.0 — Hackathon   │  // #71717A, tiny, center
│  Edition                     │
│                              │
├──────────────────────────────┤
│  [Home]  [Scan] [History] [Me]│
└──────────────────────────────┘
```
- "Keluar" → clear auth state, redirect ke LoginScreen.
- "Lihat di Block Explorer" → open external browser ke `opbnb-testnet.bscscan.com/address/{smartAccountAddress}`.
- Faucet button juga ada di sini (selain di Home) untuk aksesibilitas.
