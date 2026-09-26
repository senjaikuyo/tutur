export interface IntentResult {
  action: 'TRANSFER' | 'BALANCE' | 'SWAP_UNAVAILABLE' | null;
  recipient: string | null;
  token: string;
  amount: number | null;
  amountInRupiah: number | null;
  confidence: number;
  rawText: string;
  normalizedText: string;
  missingFields: string[];
  calldata?: string;
  isUnlimitedAllowance?: boolean;
}
