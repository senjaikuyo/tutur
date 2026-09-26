import {USDT_IDR_RATE} from '../constants/chains';

/**
 * Format angka token dengan desimal tetap.
 * Contoh: 5 -> "5.00 USDT"
 */
export function formatToken(amount: number, symbol = 'USDT'): string {
  return `${amount.toFixed(2)} ${symbol}`;
}

/**
 * Konversi USDT ke rupiah dengan hardcoded rate (Keputusan D9).
 * Contoh: 5 -> 89580
 */
export function usdtToIdr(usdt: number): number {
  return usdt * USDT_IDR_RATE;
}

/**
 * Konversi rupiah ke USDT, dibulatkan 2 desimal.
 * Contoh: 100000 -> 5.58
 */
export function idrToUsdt(idr: number): number {
  return Math.round((idr / USDT_IDR_RATE) * 100) / 100;
}

/**
 * Format nominal rupiah dengan pemisah ribuan.
 * Contoh: 89580 -> "Rp 89.580"
 */
export function formatIdr(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}

/**
 * Format estimasi saldo token ke rupiah.
 * Contoh: 5 -> "≈ Rp 89.580"
 */
export function formatIdrEstimate(usdt: number): string {
  return `≈ ${formatIdr(usdtToIdr(usdt))}`;
}

/**
 * Potong alamat wallet jadi format pendek.
 * Contoh: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" -> "0x7099...79C8"
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) {
    return address;
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format timestamp jadi waktu relatif berbahasa Indonesia.
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'baru saja';
  }
  if (minutes < 60) {
    return `${minutes} menit lalu`;
  }
  if (hours < 24) {
    return `${hours} jam lalu`;
  }
  if (days === 1) {
    return 'kemarin';
  }
  return `${days} hari lalu`;
}

/**
 * Format timestamp jadi jam:menit.
 * Contoh: "14:32"
 */
export function formatClock(timestamp: number): string {
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Format tanggal jadi label section (Hari Ini / Kemarin / tanggal lengkap).
 */
export function formatDateLabel(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return 'Hari Ini';
  }
  if (diffDays === 1) {
    return 'Kemarin';
  }
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Inisial dari nama/email untuk avatar.
 * Contoh: "Afif Hamzah" -> "AH"
 */
export function getInitials(name: string): string {
  if (!name) {
    return '?';
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
