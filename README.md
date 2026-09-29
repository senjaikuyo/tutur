# tutur

tutur adalah dompet Web3 non-kustodial berbasis React Native di jaringan opBNB Testnet. Pengguna menjalankan transaksi transfer token USDT melalui perintah suara bahasa Indonesia atau teks percakapan. Transaksi diproses tanpa biaya gas BNB bagi pengguna akhir menggunakan standar ERC-4337 Account Abstraction.

## Ringkasan Masalah dan Solusi

Sebagian besar pemilik aset kripto di Indonesia menyimpan dana di bursa tersentralisasi. Mereka menghindari dompet on-chain karena keharusan mencatat 12 kata frasa pemulihan, kebutuhan saldo koin native BNB untuk membayar gas transfer token, serta risiko salah kirim atau terkena penipuan token approval.

tutur menyelesaikan masalah ini melalui:
1. Login sosial Google berbasis WebAuthn dan MPC. Pengguna tidak perlu mencatat frasa pemulihan manual.
2. Ekstraksi perintah suara menggunakan model Groq Whisper Large-v3 yang terhubung ke parser intent deterministik. Sistem mengenali 32 kosakata uang slang Indonesia dan konversi Rupiah ke USDT.
3. Transaksi tanpa gas native. Kontrak Paymaster di opBNB mensponsori seluruh biaya gas transaksi pengguna.
4. AI Security Shield untuk memvalidasi alamat tujuan terhadap daftar penipuan publik dan mencegah unlimited token approval.

## Arsitektur Teknis

Alur data berjalan dari aplikasi mobile langsung ke jaringan blockchain tanpa server perantara.

```
[Suara Pengguna (.m4a)]
        |
        v
[Groq Whisper Large-v3 STT] -> Teks Bahasa Indonesia
        |
        v
[Deterministic Intent Parser] -> Ekstraksi aksi, nominal, penerima
        |
        +---> [Slang Dictionary] (32 istilah: goceng, ceban, gocap, dsb)
        +---> [Currency Converter] (Kurs konversi Rp 17.916 / USDT)
        +---> [Address / Domain Resolver] (Pencocokan nama kontak dan domain .bnb)
        |
        v
[AI Security Shield]
        |
        +---> Cek Blacklist (Blokir alamat penipuan)
        +---> Cek Allowance (Batasi nilai approval ke nominal transaksi)
        |
        v
[ERC-4337 UserOperation Builder]
        |
        v
[opBNB Bundler & Paymaster Policy] (Chain ID: 5611)
        |
        v
[EntryPoint 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789]
        |
        v
[MockUSDT Contract] -> Transfer Berhasil
```

## Spesifikasi Modul

### 1. Intent Parser Deterministik (`src/services/intentParser.ts`)
Pemrosesan transaksi tidak bergantung pada inferensi LLM untuk menentukan nominal atau penerima. Parser bekerja dalam 8 tahap linier:
1. Pembersihan string input menjadi huruf kecil.
2. Normalisasi kata slang nominal (goceng menjadi 5, ceban menjadi 10, gocap menjadi 50, cepek menjadi 100).
3. Deteksi angka format Rupiah dan konversi ke nilai float USDT.
4. Ekstraksi kata kerja transaksi menggunakan ekspresi reguler.
5. Ekstraksi nama penerima atau alamat heksadesimal 0x.
6. Ekstraksi angka nominal transaksi.
7. Validasi simbol token target (default USDT).
8. Perhitungan skor keyakinan (confidence score). Input dengan confidence di bawah 0.75 dialihkan ke layar Quick-Fill.

### 2. Akun Cerdas ERC-4337 (`src/services/transactionService.ts`)
- Standar: ERC-4337 SimpleAccount.
- EntryPoint: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`.
- Token Transaksi: MockUSDT 6 desimal di alamat `0x9483DF0A10aCEFbeCc7b3b3a3055e8838B57D619`.
- Paymaster: Mensponsori saldo gas secara penuh pada setiap panggilan UserOperation yang valid.
- Biaya gas bagi pengguna: 0 BNB.

### 3. AI Security Shield (`src/services/securityService.ts`)
- Audit Daftar Hitam: Memeriksa alamat target terhadap dataset `blacklist.json`. Transaksi ke alamat penipuan dibatalkan langsung pada sisi klien.
- Audit Izin Token: Memeriksa calldata selector `0x095ea7b3` (`approve`). Nilai persetujuan tak terbatas (`type(uint256).max`) dipotong otomatis menjadi nilai tepat yang akan ditransfer.

### 4. Database Lokal dan Sinkronisasi (`src/db/index.ts`)
- Penyimpanan lokal menggunakan SQLite terenkripsi.
- Status transaksi dicatat dalam tabel lokal: `id`, `hash`, `action`, `amount`, `recipient`, `status`, `gasSponsored`, `createdAt`.
- Modul `syncService.ts` memverifikasi status transaksi tertunda ke RPC opBNB saat aplikasi dibuka kembali.

## Hasil Pengujian

Pengujian dilakukan menggunakan Jest untuk logika unit dan verifikasi langsung pada emulator Android Pixel 10a.

| Kriteria Uji | Target | Hasil Aktual |
| :--- | :--- | :--- |
| Akurasi Intent Parser | >= 90% | 100% (15 skenario resmi PRD lolos) |
| Unit Test Suite | Semua lolos | 21 dari 21 tes lolos |
| Latensi Speech-to-Text | < 1500 ms | Rata-rata 780 ms via Groq Whisper |
| Finalitas Transaksi Blok | < 3 detik | Rata-rata 1.2 detik di opBNB Testnet |
| Biaya Gas Pengguna | 0 BNB | 0 BNB (Disponsori Paymaster) |
| Typecheck TypeScript | 0 error | 0 error (`tsc --noEmit`) |
| Linter ESLint | 0 warning | 0 error dan 0 warning |
| Ukuran APK Standalone | < 100 MB | 88.15 MB (Release APK v1.0.1) |

## Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js versi 20 atau 22.
- Android SDK Platform 34 dan build-tools.
- Emulator Android atau perangkat fisik dengan mode USB Debugging aktif.

### Langkah Instalasi dan Menjalankan

1. Salin repositori:
```bash
git clone https://github.com/senjaikuyo/tutur.git
cd tutur
```

2. Pasang dependensi:
```bash
npm install
```

3. Konfigurasi variabel lingkungan:
Salin file `.env.example` ke `.env`, lalu isi kunci API Groq:
```bash
cp .env.example .env
```

Contoh isi `.env`:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
OPBNB_RPC_URL=https://opbnb-testnet-rpc.bnbchain.org
ENTRYPOINT_CONTRACT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
MOCK_USDT_CONTRACT_ADDRESS=0x9483DF0A10aCEFbeCc7b3b3a3055e8838B57D619
```

4. Jalankan pengujian kode:
```bash
npm run tsc
npm test
npm run lint
```

5. Hubungkan port Metro ke emulator Android:
```bash
adb reverse tcp:8081 tcp:8081
```

6. Jalankan server Metro:
```bash
npm start
```

7. Buka terminal baru dan pasang aplikasi ke Android:
```bash
npm run android
```

## Unduhan Rilis

File APK standalone release tersedia di halaman GitHub Releases:
- Versi: v1.0.1
- Tautan Rilis: https://github.com/senjaikuyo/tutur/releases/tag/v1.0.1
- Unduh APK Langsung: https://github.com/senjaikuyo/tutur/releases/download/v1.0.1/tutur-release.apk

## Struktur Direktori

```
tutur/
├── android/                          # Konfigurasi native Android dan Gradle
├── contracts/                        # Smart contract Solidity (MockUSDT.sol)
├── src/
│   ├── app/                          # Navigasi dan layar utama
│   │   ├── Navigation.tsx            # Navigasi 5 tab dan stack modal
│   │   └── screens/
│   │       ├── SplashScreen.tsx      # Layar awal logo pixel art
│   │       ├── LoginScreen.tsx       # Layar masuk Google
│   │       ├── HomeScreen.tsx        # Layar ringkasan saldo dan shortcut
│   │       ├── ChatScreen.tsx        # Layar asisten percakapan dan transfer
│   │       ├── ScanScreen.tsx        # Layar pemindai QR dan preset OCR
│   │       ├── HistoryScreen.tsx     # Riwayat mutasi transaksi
│   │       ├── ProfileScreen.tsx     # Informasi smart account dan alamat signer
│   │       ├── FaqScreen.tsx         # Pertanyaan umum dan informasi aplikasi
│   │       ├── ConfirmationScreen.tsx# Konfirmasi detail transaksi dan status keamanan
│   │       ├── VoiceOverlay.tsx      # Antarmuka rekam audio suara
│   │       ├── QuickFillModal.tsx    # Formulir pelengkap parameter transfer
│   │       └── SecurityWarningModal.tsx # Peringatan risiko blacklist dan allowance
│   ├── components/                   # Komponen antarmuka pengguna
│   │   ├── chat/                     # Komponen bubble dan input bar dinamis
│   │   ├── common/                   # Komponen tombol, badge, kartu, input
│   │   ├── home/                     # Grid fitur dan kontak cepat
│   │   └── navigation/               # Tab bar bawah kustom
│   ├── services/                     # Layanan API dan logika inti
│   │   ├── chatService.ts            # Layanan chat LLM
│   │   ├── groqService.ts            # Klien Whisper STT
│   │   ├── intentParser.ts           # Parser aturan 8 tahap
│   │   ├── particleService.ts        # Autentikasi dan sesi akun
│   │   ├── transactionService.ts     # Pembuat UserOperation opBNB
│   │   ├── securityService.ts        # Pemeriksa blacklist dan calldata
│   │   └── syncService.ts            # Sinkronisasi status on-chain
│   ├── stores/                       # Manajemen status aplikasi (Zustand)
│   ├── utils/                        # Modul kamus slang, konversi, dan pemformat data
│   │   └── __tests__/                # Pengujian otomatis Jest
│   ├── constants/                    # Konfigurasi rantai, kontrak, dan tema warna
│   └── assets/                       # Aset logo dan dataset blacklist
├── package.json
└── tsconfig.json
```

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Lihat file `LICENSE` untuk rincian teks lisensi lengkap.
