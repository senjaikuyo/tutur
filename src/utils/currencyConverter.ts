/**
 * Konversi mata uang Rupiah ↔ USDT
 * Hardcoded rate: 1 USDT = Rp 17.916 (Keputusan D9 di PRD)
 *
 * Versi produksi akan pakai oracle/API CoinGecko real-time.
 */

import {USDT_IDR_RATE} from '../constants/chains';

/**
 * Konversi rupiah ke USDT, dibulatkan ke 2 desimal.
 * Contoh: 100000 → 5.58
 */
export function rupiahToUsdt(rupiahAmount: number): number {
  if (rupiahAmount <= 0) {
    return 0;
  }
  return Math.round((rupiahAmount / USDT_IDR_RATE) * 100) / 100;
}

/**
 * Konversi USDT ke rupiah.
 * Contoh: 5 → 89580
 */
export function usdtToRupiah(usdtAmount: number): number {
  return Math.round(usdtAmount * USDT_IDR_RATE);
}

/**
 * Deteksi apakah angka kemungkinan dalam rupiah (bukan token langsung).
 *
 * Heuristik: jika angka >= 1000, kemungkinan besar rupiah.
 * Pengecualian: jika teks eksplisit menyebut "USDT", anggap token langsung.
 *
 * Contoh:
 *   100000 (tanpa "USDT") → true (rupiah)
 *   5 (tanpa "USDT")      → false (token langsung)
 *   100000 (dengan "USDT") → false (token langsung)
 */
export function isProbablyRupiah(amount: number, hasExplicitToken: boolean): boolean {
  if (hasExplicitToken) {
    return false;
  }
  return amount >= 1000;
}

/**
 * Deteksi angka rupiah dari teks menggunakan regex patterns.
 * Mengembalikan angka rupiah mentah jika ditemukan, null jika tidak.
 *
 * Pattern yang dikenali:
 *   - "100 ribu" / "100ribu" / "100rb" / "100k" → 100000
 *   - "1 juta" / "1jt" / "1juta" → 1000000
 *   - "Rp 100.000" / "Rp100000" / "rupiah 100000" → 100000
 */
export function extractRupiahFromText(text: string): {
  amount: number;
  matched: string;
} | null {
  const lower = text.toLowerCase();

  // Pattern 1: angka + ribu/rb/k
  const ribuMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:ribu|rb|k)\b/);
  if (ribuMatch) {
    const num = parseFloat(ribuMatch[1].replace(',', '.'));
    return {amount: num * 1000, matched: ribuMatch[0]};
  }

  // Pattern 2: angka + juta/jt
  const jutaMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:juta|jt)\b/);
  if (jutaMatch) {
    const num = parseFloat(jutaMatch[1].replace(',', '.'));
    return {amount: num * 1_000_000, matched: jutaMatch[0]};
  }

  // Pattern 3: Rp/rupiah + angka
  const rpMatch = lower.match(/(?:rp\.?\s*|rupiah\s*)(\d+(?:[.,]\d+)*)/);
  if (rpMatch) {
    const cleaned = rpMatch[1].replace(/\./g, '').replace(',', '.');
    return {amount: parseFloat(cleaned), matched: rpMatch[0]};
  }

  return null;
}
