// Contract addresses — isi setelah deploy
export const CONTRACTS = {
  MOCK_USDT: '', // Isi setelah deploy MockUSDT ke opBNB Testnet
  ENTRYPOINT: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
};

// MockUSDT ABI (minimal, untuk transfer & balanceOf)
export const MOCK_USDT_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];
