/**
 * QR Code & Invoice Parser (FR-5 di PRD)
 *
 * Mendukung format:
 * - Hex polos 42 karakter (0x...)
 * - EIP-681 uri format: ethereum:0x... atau ethereum:0x...?value=...
 * - BNS name (.bnb)
 */

import {isValidAddress, resolveRecipient} from './resolver';

export interface ParsedQRResult {
  valid: boolean;
  address: string | null;
  label: string | null;
  amount: number | null;
  token: string;
  errorMessage?: string;
}

export function parseQRContent(rawContent: string): ParsedQRResult {
  const cleaned = rawContent.trim();

  if (!cleaned) {
    return {
      valid: false,
      address: null,
      label: null,
      amount: null,
      token: 'USDT',
      errorMessage: 'QR kosong atau tidak dapat dibaca.',
    };
  }

  // 1. Cek format EIP-681: ethereum:0x... atau ethereum:pay-0x...
  if (cleaned.toLowerCase().startsWith('ethereum:')) {
    const withoutPrefix = cleaned.replace(/^ethereum:/i, '');
    const [addressPart, queryPart] = withoutPrefix.split('?');

    // Cek query parameters (jika ada amount/value)
    let parsedAmount: number | null = null;
    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      const val = params.get('value') || params.get('amount');
      if (val) {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          parsedAmount = num;
        }
      }
    }

    const resolved = resolveRecipient(addressPart);
    if (resolved.address || isValidAddress(addressPart)) {
      return {
        valid: true,
        address: resolved.address || addressPart,
        label: resolved.label,
        amount: parsedAmount,
        token: 'USDT',
      };
    }
  }

  // 2. Cek hex address polos (0x...)
  if (isValidAddress(cleaned)) {
    return {
      valid: true,
      address: cleaned,
      label: null,
      amount: null,
      token: 'USDT',
    };
  }

  // 3. Cek BNS name (.bnb)
  if (cleaned.toLowerCase().endsWith('.bnb')) {
    const resolved = resolveRecipient(cleaned);
    if (resolved.address) {
      return {
        valid: true,
        address: resolved.address,
        label: resolved.label,
        amount: null,
        token: 'USDT',
      };
    }
  }

  // QR bukan alamat yang valid (FR-5.2)
  return {
    valid: false,
    address: null,
    label: null,
    amount: null,
    token: 'USDT',
    errorMessage: 'QR tidak dikenali sebagai alamat wallet.',
  };
}
