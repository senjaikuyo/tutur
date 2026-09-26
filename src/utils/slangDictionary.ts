/**
 * Kamus Slang Indonesia → Nilai
 * Dipakai oleh Intent Parser (FR-2A) untuk normalisasi teks sebelum parsing.
 *
 * Total: 32 entri (Kategori A: nominal, B: kata kerja, C: modifier)
 * Case-insensitive — semua key di-lowercase saat matching.
 */

// ============================================================
// Kategori A: Nominal Slang → Angka
// ============================================================
export const NOMINAL_SLANG: Record<string, number> = {
  goceng: 5,
  ceban: 10,
  gocap: 50,
  cepek: 100,
  gopek: 500,
  seceng: 1000,
  sejuta: 1_000_000,
  'dua juta': 2_000_000,
  'tiga juta': 3_000_000,
  'lima juta': 5_000_000,
  'sepuluh juta': 10_000_000,
  setengah: 0.5,
  seperempat: 0.25,
};

// ============================================================
// Kategori B: Kata Kerja → Action Type
// ============================================================
export type ActionType = 'TRANSFER' | 'BALANCE' | 'SWAP_UNAVAILABLE';

export const ACTION_KEYWORDS: Record<ActionType, string[]> = {
  TRANSFER: [
    'kirim',
    'kirimin',
    'oper',
    'transfer',
    'kasih',
    'beri',
    'send',
    'bayar',
    'bayarin',
    'kirimkan',
  ],
  BALANCE: [
    'cek saldo',
    'berapa duit',
    'berapa sisa',
    'saldo gue',
    'saldo saya',
    'saldo ku',
    'saldoku',
    'balance',
    'saldo',
    'tunjukin saldo',
    'lihat saldo',
  ],
  SWAP_UNAVAILABLE: [
    'cairin',
    'tukar',
    'swap',
    'convert',
    'jual',
    'beli',
    'tuker',
    'konversi',
  ],
};

// ============================================================
// Kategori C: Modifier Khusus
// ============================================================
export const AMOUNT_ALL_KEYWORDS: string[] = [
  'semua',
  'all',
  'seluruh',
  'semuanya',
];

// ============================================================
// Rupiah Word → Angka (untuk "seratus ribu", "lima ratus ribu", dll)
// ============================================================
export const RUPIAH_WORDS: Record<string, number> = {
  'seratus ribu': 100_000,
  'dua ratus ribu': 200_000,
  'tiga ratus ribu': 300_000,
  'lima ratus ribu': 500_000,
  'dua puluh lima ribu': 25_000,
  'lima puluh ribu': 50_000,
  'satu juta': 1_000_000,
  'dua juta': 2_000_000,
  'tiga juta': 3_000_000,
  'lima juta': 5_000_000,
  'sepuluh juta': 10_000_000,
};

/**
 * Normalisasi teks: replace semua slang nominal dengan angka.
 * Proses dari frasa terpanjang ke terpendek untuk menghindari partial match.
 *
 * Contoh: "kirim goceng USDT ke Budi" → "kirim 5 USDT ke Budi"
 * Contoh: "bayar lima ratus ribu ke warung" → "bayar 500000 ke warung"
 */
export function normalizeSlang(text: string): string {
  let result = text.toLowerCase().trim();

  // 1. Replace frasa rupiah panjang dulu (multi-word → angka rupiah)
  const sortedRupiahWords = Object.keys(RUPIAH_WORDS).sort(
    (a, b) => b.length - a.length,
  );
  for (const phrase of sortedRupiahWords) {
    if (result.includes(phrase)) {
      result = result.replace(phrase, String(RUPIAH_WORDS[phrase]));
    }
  }

  // 2. Replace nominal slang (multi-word dulu, lalu single-word)
  const sortedNominal = Object.keys(NOMINAL_SLANG).sort(
    (a, b) => b.length - a.length,
  );
  for (const phrase of sortedNominal) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, String(NOMINAL_SLANG[phrase]));
    }
  }

  return result;
}

/**
 * Deteksi apakah teks mengandung kata kunci "kirim semua" / "all".
 */
export function isAmountAll(text: string): boolean {
  const lower = text.toLowerCase();
  return AMOUNT_ALL_KEYWORDS.some(kw => lower.includes(kw));
}
