/**
 * Transaction Store (Zustand) — PRD Section 7.4 Store 2
 *
 * Mengelola draft intent (dari voice/scan), pending transaction,
 * dan cache 3 transaksi terakhir untuk HomeScreen.
 */

import {create} from 'zustand';
import type {IntentResult} from '../types/intent';
import type {Transaction} from '../types/transaction';

interface TransactionState {
  draftIntent: IntentResult | null;
  pendingTx: {
    userOpHash: string;
    status: 'sending' | 'polling' | 'pending';
  } | null;
  recentTransactions: Transaction[];

  // Actions
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
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  draftIntent: null,
  pendingTx: null,
  recentTransactions: [],

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
    // Simpan hanya 10 terbaru di memory
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
}));
