/**
 * Network Store (Zustand) — PRD Section 7.4 Store 4
 *
 * Mengelola state koneksi jaringan dan offline queue.
 * FR-4.7: transaksi draft yang gagal terkirim di-retry saat koneksi kembali.
 */

import {create} from 'zustand';

interface NetworkState {
  isConnected: boolean;
  draftQueueCount: number;

  // Actions
  updateConnectionStatus: (connected: boolean) => void;
  setDraftQueueCount: (count: number) => void;
}

export const useNetworkStore = create<NetworkState>(set => ({
  isConnected: true,
  draftQueueCount: 0,

  updateConnectionStatus: (connected: boolean) => {
    set({isConnected: connected});
  },

  setDraftQueueCount: (count: number) => {
    set({draftQueueCount: count});
  },
}));
