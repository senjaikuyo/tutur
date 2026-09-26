/**
 * Intent Parser Rule-Based (FR-2A di PRD, Keputusan D8)
 *
 * Pipeline 8 langkah:
 *   1. Lowercase + trim
 *   2. Slang Normalizer
 *   3. Rupiah Detector
 *   4. Action Extractor
 *   5. Recipient Extractor
 *   6. Amount Extractor
 *   7. Token Extractor
 *   8. Confidence Calculator
 *
 * Tidak ada LLM call. Deterministik, gratis, tanpa dependency API tambahan.
 */

import type {IntentResult} from '../types/intent';
import {
  normalizeSlang,
  isAmountAll,
  ACTION_KEYWORDS,
  type ActionType,
} from '../utils/slangDictionary';
import {
  extractRupiahFromText,
  rupiahToUsdt,
  isProbablyRupiah,
} from '../utils/currencyConverter';

// ============================================================
// Step 4: Action Extraction — Regex patterns
// ============================================================

const ACTION_PATTERNS: Record<ActionType, RegExp> = {
  TRANSFER:
    /\b(kirim|kirimin|kirimkan|oper|transfer|kasih|beri|send|bayar|bayarin)\b/i,
  BALANCE:
    /\b(cek saldo|berapa duit|berapa sisa|saldo gue|saldo saya|saldo ku|saldoku|balance|saldo|tunjukin saldo|lihat saldo)\b/i,
  SWAP_UNAVAILABLE:
    /\b(cairin|tukar|tuker|swap|convert|konversi|jual|beli)\b/i,
};

// ============================================================
// Step 5: Recipient Extraction
// ============================================================

// Menangkap nama setelah "ke", "buat", "untuk", "sama", "to"
const RECIPIENT_AFTER_PREP =
  /\b(?:ke|buat|untuk|sama|to)\s+([a-zA-Z][a-zA-Z0-9_.]*(?:\.bnb)?)\b/i;

// Menangkap nama sebelum nominal: "kirimin Afif gocap"
const RECIPIENT_BEFORE_AMOUNT =
  /\b(?:kirim|kirimin|kirimkan|oper|transfer|kasih|beri|send|bayar|bayarin)\s+([a-zA-Z][a-zA-Z0-9_.]*(?:\.bnb)?)\s+\d/i;

// ============================================================
// Step 6: Amount Extraction (setelah slang sudah di-replace jadi angka)
// ============================================================

const AMOUNT_PATTERN = /\b(\d+(?:\.\d+)?)\b/;

// ============================================================
// Step 7: Token Extraction
// ============================================================

const TOKEN_PATTERN = /\b(usdt|usdc|bnb|busd)\b/i;

// ============================================================
// Main Parser
// ============================================================

/**
 * Parse teks input menjadi IntentResult.
 *
 * @param rawText Teks mentah dari STT (Groq Whisper) atau input manual user
 * @returns IntentResult dengan semua field ter-extract
 */
export function parseIntent(rawText: string): IntentResult {
  const missingFields: string[] = [];

  // ---- Step 1: Lowercase + trim ----
  const cleaned = rawText.toLowerCase().trim();

  if (!cleaned) {
    return {
      action: null,
      recipient: null,
      token: 'USDT',
      amount: null,
      amountInRupiah: null,
      confidence: 0,
      rawText,
      normalizedText: '',
      missingFields: ['action', 'recipient', 'amount'],
    };
  }

  // ---- Step 2: Slang Normalize ----
  const normalized = normalizeSlang(cleaned);

  // ---- Step 3: Rupiah Detector ----
  let amountInRupiah: number | null = null;
  let amountFromRupiah: number | null = null;
  let textAfterRupiah = normalized;

  const rupiahResult = extractRupiahFromText(normalized);
  if (rupiahResult) {
    amountInRupiah = rupiahResult.amount;
    amountFromRupiah = rupiahToUsdt(rupiahResult.amount);
    // Remove matched rupiah pattern dari teks agar amount extractor tidak bingung
    textAfterRupiah = normalized.replace(rupiahResult.matched, '').trim();
  }

  // ---- Step 4: Action Extractor ----
  let action: IntentResult['action'] = null;

  // Check multi-word patterns first (e.g. "cek saldo")
  for (const [act, pattern] of Object.entries(ACTION_PATTERNS)) {
    if (pattern.test(normalized)) {
      action = act as ActionType;
      break;
    }
  }

  if (!action) {
    missingFields.push('action');
  }

  // ---- Step 5: Recipient Extractor ----
  let recipient: string | null = null;

  // Try "ke Budi" pattern first
  const afterPrep = RECIPIENT_AFTER_PREP.exec(normalized);
  if (afterPrep) {
    const candidateName = afterPrep[1].toLowerCase();
    // Pastikan bukan token atau kata kerja
    if (!isTokenName(candidateName) && !isActionWord(candidateName)) {
      recipient = candidateName;
    }
  }

  // Try "kirimin Afif 50" pattern (nama sebelum nominal)
  if (!recipient) {
    const beforeAmount = RECIPIENT_BEFORE_AMOUNT.exec(normalized);
    if (beforeAmount) {
      const candidateName = beforeAmount[1].toLowerCase();
      if (!isTokenName(candidateName) && !isActionWord(candidateName)) {
        recipient = candidateName;
      }
    }
  }

  // Untuk BALANCE, recipient tidak wajib
  if (!recipient && action !== 'BALANCE') {
    missingFields.push('recipient');
  }

  // ---- Step 6: Amount Extractor ----
  let amount: number | null = amountFromRupiah;

  if (amount === null) {
    // Check "kirim semua"
    if (isAmountAll(normalized)) {
      // Flag khusus: amount = -1 artinya "semua saldo"
      amount = -1;
    } else {
      // Cari angka di teks yang sudah dinormalisasi
      const textToSearch = amountFromRupiah !== null ? textAfterRupiah : normalized;
      const amountMatch = AMOUNT_PATTERN.exec(textToSearch);
      if (amountMatch) {
        const num = parseFloat(amountMatch[1]);
        // Cek apakah angka ini kemungkinan rupiah
        const hasExplicitToken = TOKEN_PATTERN.test(normalized);
        if (isProbablyRupiah(num, hasExplicitToken)) {
          amountInRupiah = num;
          amount = rupiahToUsdt(num);
        } else {
          amount = num;
        }
      }
    }
  }

  if (amount === null && action !== 'BALANCE') {
    missingFields.push('amount');
  }

  // ---- Step 7: Token Extractor ----
  const tokenMatch = TOKEN_PATTERN.exec(normalized);
  const token = tokenMatch ? tokenMatch[1].toUpperCase() : 'USDT';

  // ---- Step 8: Confidence Calculator ----
  const confidence = calculateConfidence({action, amount, recipient, token});

  return {
    action,
    recipient,
    token,
    amount,
    amountInRupiah,
    confidence,
    rawText,
    normalizedText: normalized,
    missingFields,
  };
}

// ============================================================
// Helpers
// ============================================================

function calculateConfidence(result: {
  action: string | null;
  amount: number | null;
  recipient: string | null;
  token: string;
}): number {
  let score = 0;
  const weights = {
    action: 0.35,
    amount: 0.3,
    recipient: 0.25,
    token: 0.1,
  };

  if (result.action) {
    score += weights.action;
  }
  if (result.amount !== null && result.amount !== 0) {
    score += weights.amount;
  }
  if (result.recipient) {
    score += weights.recipient;
  }
  if (result.token) {
    score += weights.token;
  }

  // BALANCE tidak butuh recipient — redistribute bobotnya
  if (result.action === 'BALANCE' && !result.recipient) {
    score += weights.recipient;
  }

  return Math.round(score * 100) / 100;
}

const TOKEN_NAMES = new Set(['usdt', 'usdc', 'bnb', 'busd', 'token', 'rupiah', 'idr', 'rp']);

function isTokenName(word: string): boolean {
  return TOKEN_NAMES.has(word.toLowerCase());
}

function isActionWord(word: string): boolean {
  for (const keywords of Object.values(ACTION_KEYWORDS)) {
    if (keywords.includes(word.toLowerCase())) {
      return true;
    }
  }
  return false;
}
