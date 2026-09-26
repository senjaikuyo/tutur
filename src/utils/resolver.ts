/**
 * Mock BNS Name Resolver (Keputusan D2 di PRD)
 *
 * Lookup table lokal untuk resolusi nama .bnb → alamat wallet.
 * Space ID belum stabil di opBNB Testnet, resolver lokal dipakai demi
 * stabilitas demo.
 *
 * Batasan: hanya 3 nama demo yang bisa di-resolve.
 * Versi produksi: panggil Space ID RPC.
 */

const BNS_DIRECTORY: Record<string, string> = {
  'budi.bnb': '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  'warung.bnb': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  'afif.bnb': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
};

/**
 * Resolve nama kontak atau BNS ke alamat wallet.
 *
 * Logika:
 * 1. Jika input sudah berformat 0x... (42 karakter hex), return langsung.
 * 2. Jika input berakhiran .bnb, cari di BNS_DIRECTORY.
 * 3. Jika input berupa nama pendek (tanpa .bnb), coba tambahkan .bnb dan cari.
 * 4. Jika tidak ditemukan, return null.
 */
export function resolveRecipient(input: string): {
  address: string | null;
  label: string;
  isBns: boolean;
} {
  const cleaned = input.trim().toLowerCase();

  // Sudah berformat alamat hex
  if (/^0x[a-fA-F0-9]{40}$/.test(cleaned)) {
    return {address: cleaned, label: cleaned, isBns: false};
  }

  // Cek langsung di BNS directory
  if (cleaned.endsWith('.bnb')) {
    const addr = BNS_DIRECTORY[cleaned] || null;
    return {address: addr, label: cleaned, isBns: addr !== null};
  }

  // Coba tambahkan .bnb
  const withBnb = `${cleaned}.bnb`;
  if (BNS_DIRECTORY[withBnb]) {
    return {address: BNS_DIRECTORY[withBnb], label: withBnb, isBns: true};
  }

  // Tidak ditemukan
  return {address: null, label: cleaned, isBns: false};
}

/**
 * Daftar nama BNS yang tersedia untuk demo.
 * Dipakai untuk autocomplete atau suggestion di Quick-Fill Form.
 */
export function getAvailableBnsNames(): string[] {
  return Object.keys(BNS_DIRECTORY);
}

/**
 * Cek apakah string adalah alamat hex valid (0x + 40 hex chars).
 */
export function isValidAddress(input: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(input.trim());
}
