/**
 * Transaction Store (Zustand) — PRD Section 7.4 Store 2
 *
 * Mengelola saldo USDT, draft intent, pending transaction,
 * cooldown faucet 60 detik (FR-4.5), dan cache transaksi.
 */

import {create} from 'zustand';
import type {IntentResult} from '../types/intent';
import type {Transaction} from '../types/transaction';
import {
  getUSDTBalance,
  executeTransferUSDT,
  requestFaucetUSDT,
} from '../services/transactionService';

interface TransactionState {
  balance: number;
  draftIntent: IntentResult | null;
  pendingTx: {
    userOpHash: string;
    status: 'sending' | 'polling' | 'pending';
  } | null;
  recentTransactions: Transaction[];
  isSending: boolean;
  faucetLoading: boolean;
  faucetCooldown: number; // Dalam detik (0 jika siap)

  // Actions
  setBalance: (balance: number) => void;
  refreshBalance: (accountAddress: string) => Promise<void>;
  setDraftIntent: (intent: IntentResult) => void;
  clearDraft: () => void;
  setPendingTx: (hash: string, status: 'sending' | 'polling' | 'pending') => void;
  clearPendingTx: () => void;
  addTransaction: (tx: Transaction) => void;
  updateTransactionStatus: (
    id: string,
    status: Transaction['status'],
    confirmedAt?: number,
  ) => void;
  setRecentTransactions: (txs: Transaction[]) => void;
  sendTransfer: (params: {
    senderAddress: string;
    recipientAddress: string;
    amount: number;
    tokenSymbol?: string;
    recipientLabel?: string | null;
    securityFlag?: 'green' | 'yellow' | 'red';
  }) => Promise<{success: boolean; userOpHash?: string; error?: string}>;
  claimFaucet: (targetAccount: string) => Promise<boolean>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  balance: 100.0, // Saldo awal demo 100 USDT (FR-4.5)
  draftIntent: null,
  pendingTx: null,
  recentTransactions: [],
  isSending: false,
  faucetLoading: false,
  faucetCooldown: 0,

  setBalance: (balance: number) => {
    set({balance});
  },

  refreshBalance: async (accountAddress: string) => {
    try {
      const onChainBalance = await getUSDTBalance(accountAddress);
      if (onChainBalance > 0) {
        set({balance: onChainBalance});
      }
    } catch (e) {
      console.warn('[TransactionStore] Failed to query on-chain balance:', e);
    }
  },

  setDraftIntent: (intent: IntentResult) => {
    set({draftIntent: intent});
  },

  clearDraft: () => {
    set({draftIntent: null});
  },

  setPendingTx: (hash: string, status: 'sending' | 'polling' | 'pending') => {
    set({pendingTx: {userOpHash: hash, status}});
  },

  clearPendingTx: () => {
    set({pendingTx: null});
  },

  addTransaction: (tx: Transaction) => {
    const current = get().recentTransactions;
    const updated = [tx, ...current].slice(0, 10);
    set({recentTransactions: updated});
  },

  updateTransactionStatus: (
    id: string,
    status: Transaction['status'],
    confirmedAt?: number,
  ) => {
    const current = get().recentTransactions;
    const updated = current.map(tx =>
      tx.id === id ? {...tx, status, confirmedAt: confirmedAt ?? tx.confirmedAt} : tx,
    );
    set({recentTransactions: updated});
  },

  setRecentTransactions: (txs: Transaction[]) => {
    set({recentTransactions: txs});
  },

  // Eksekusi Transfer On-Chain via UserOperation
  sendTransfer: async ({
    senderAddress,
    recipientAddress,
    amount,
    tokenSymbol = 'USDT',
    recipientLabel = null,
    securityFlag = 'green',
  }) => {
    const currentBalance = get().balance;

    // Cek saldo pengirim (FR-4.4)
    if (currentBalance < amount) {
      return {
        success: false,
        error: `Saldo tidak cukup! Saldo kamu: ${currentBalance.toFixed(2)} USDT, diperlukan: ${amount.toFixed(2)} USDT.`,
      };
    }

    set({isSending: true});

    try {
      const result = await executeTransferUSDT(
        senderAddress,
        recipientAddress,
        amount,
      );

      if (!result.success) {
        set({isSending: false});
        return {
          success: false,
          error: result.errorMessage || 'Transaksi gagal dikonfirmasi.',
        };
      }

      // Kurangi saldo lokal secara optimistik
      set(state => ({
        balance: Math.max(0, state.balance - amount),
        isSending: false,
      }));

      // Catat ke daftar transaksi
      const newTx: Transaction = {
        id: Date.now().toString(),
        userOpHash: result.userOpHash,
        action: 'TRANSFER',
        recipientAddress,
        recipientLabel,
        tokenSymbol,
        amount,
        status: 'success',
        securityFlag,
        gasSponsored: true,
        createdAt: Date.now(),
        confirmedAt: Date.now(),
      };

      get().addTransaction(newTx);

      return {
        success: true,
        userOpHash: result.userOpHash,
      };
    } catch (err: any) {
      set({isSending: false});
      return {
        success: false,
        error: err.message || 'Terjadi kesalahan saat memproses transaksi.',
      };
    }
  },

  // Faucet Minting dengan Countdown Cooldown 60s (FR-4.5)
  claimFaucet: async (targetAccount: string) => {
    const {faucetCooldown, faucetLoading} = get();
    if (faucetCooldown > 0 || faucetLoading) {
      return false;
    }

    set({faucetLoading: true});

    try {
      const res = await requestFaucetUSDT(targetAccount);
      if (res.success) {
        // Tambahkan 100 USDT ke saldo
        set(state => ({
          balance: state.balance + 100,
          faucetLoading: false,
          faucetCooldown: 60,
        }));

        // Mulai timer cooldown 60 detik
        const intervalId = setInterval(() => {
          const current = get().faucetCooldown;
          if (current <= 1) {
            clearInterval(intervalId);
            set({faucetCooldown: 0});
          } else {
            set({faucetCooldown: current - 1});
          }
        }, 1000);

        return true;
      }
      set({faucetLoading: false});
      return false;
    } catch (e) {
      console.warn('Faucet claim error:', e);
      set({faucetLoading: false});
      return false;
    }
  },
}));
