export interface Transaction {
  id: string;
  userOpHash: string | null;
  action: 'TRANSFER' | 'SWAP' | 'BALANCE_CHECK';
  recipientAddress: string;
  recipientLabel: string | null;
  tokenSymbol: string;
  amount: number;
  status: 'draft' | 'pending' | 'success' | 'failed';
  securityFlag: 'green' | 'yellow' | 'red';
  gasSponsored: boolean;
  createdAt: number;
  confirmedAt: number | null;
}

export interface Contact {
  id: string;
  label: string;
  address: string;
  bnsName: string | null;
}
