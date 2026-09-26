/**
 * Security Service (FR-6 di PRD)
 *
 * - Blacklist check: cocokkan alamat tujuan ke daftar hitam statis
 * - Unlimited allowance detection: cek calldata approve(spender, MAX_UINT256)
 */

import blacklistData from '../assets/blacklist.json';

export type SecurityLevel = 'green' | 'yellow' | 'red';

interface SecurityCheckResult {
  level: SecurityLevel;
  reason: string | null;
  blocked: boolean;
}

// Load blacklist addresses ke Set untuk O(1) lookup
const BLACKLISTED_ADDRESSES = new Set(
  blacklistData.addresses.map(entry => entry.address.toLowerCase()),
);

// ERC-20 approve function selector: 0x095ea7b3
const APPROVE_SELECTOR = '0x095ea7b3';
// type(uint256).max = 0xfff...fff (32 bytes of ff)
const MAX_UINT256 =
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

/**
 * Cek keamanan alamat tujuan.
 *
 * @param recipientAddress Alamat wallet/contract tujuan
 * @returns SecurityCheckResult
 */
export function checkAddressSecurity(
  recipientAddress: string,
): SecurityCheckResult {
  const lower = recipientAddress.toLowerCase();

  if (BLACKLISTED_ADDRESSES.has(lower)) {
    const entry = blacklistData.addresses.find(
      e => e.address.toLowerCase() === lower,
    );
    return {
      level: 'red',
      reason: entry?.reason || 'Alamat terdata dalam daftar hitam.',
      blocked: true,
    };
  }

  return {
    level: 'green',
    reason: null,
    blocked: false,
  };
}

/**
 * Cek apakah calldata mengandung unlimited approve.
 *
 * @param calldata Hex-encoded calldata dari transaksi
 * @returns SecurityCheckResult
 */
export function checkCalldata(calldata: string): SecurityCheckResult {
  const lower = calldata.toLowerCase();

  // Cek apakah ini approve call
  if (lower.startsWith(APPROVE_SELECTOR)) {
    // Cek apakah amount = MAX_UINT256
    // approve(address spender, uint256 amount)
    // selector(4 bytes) + spender(32 bytes) + amount(32 bytes)
    // Total minimal 4 + 32 + 32 = 68 bytes = 136 hex chars + "0x" prefix
    if (lower.length >= 138) {
      const amountHex = lower.slice(74, 138); // bytes 36-68 (amount parameter)
      if (amountHex === MAX_UINT256) {
        return {
          level: 'yellow',
          reason:
            'Kontrak ini meminta izin mengakses seluruh saldo USDT kamu tanpa batas.',
          blocked: false,
        };
      }
    }
  }

  return {
    level: 'green',
    reason: null,
    blocked: false,
  };
}

/**
 * Cek keamanan gabungan (alamat + calldata).
 * Mengembalikan level tertinggi (red > yellow > green).
 */
export function fullSecurityCheck(
  recipientAddress: string,
  calldata?: string,
): SecurityCheckResult {
  // Cek blacklist dulu (prioritas tertinggi)
  const addressCheck = checkAddressSecurity(recipientAddress);
  if (addressCheck.level === 'red') {
    return addressCheck;
  }

  // Cek calldata
  if (calldata) {
    const calldataCheck = checkCalldata(calldata);
    if (calldataCheck.level === 'yellow') {
      return calldataCheck;
    }
  }

  return {level: 'green', reason: null, blocked: false};
}
