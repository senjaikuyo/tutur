/**
 * Local Database Adapter (Section 5 & FR-7.1 di PRD TUTUR)
 *
 * Mengelola penyimpanan persisten lokal SQLite (via AsyncStorage Native SQLite Engine).
 * Menyimpan tabel:
 * - `transactions`: riwayat transaksi persisten (FR-7.1)
 * - `contacts`: buku kontak lokal manual
 * - `offline_queue`: antrian UserOp yang tertunda saat offline (FR-4.7)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Transaction, Contact} from '../types/transaction';

const STORAGE_KEYS = {
  TRANSACTIONS: '@tutur_transactions_v1',
  CONTACTS: '@tutur_contacts_v1',
  OFFLINE_QUEUE: '@tutur_offline_queue_v1',
};

// Default seed contacts (sesuai Section 5 & FR-3.5)
const SEED_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    label: 'Budi',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    bnsName: 'budi.bnb',
  },
  {
    id: 'contact-2',
    label: 'Warung Kopi',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    bnsName: 'warung.bnb',
  },
  {
    id: 'contact-3',
    label: 'Afif Siregar',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    bnsName: 'afif.bnb',
  },
];

// ============================================================
// Transaksi Repository
// ============================================================

export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[DB] Failed to load transactions:', err);
    return [];
  }
}

export async function saveTransaction(tx: Transaction): Promise<void> {
  try {
    const existing = await getAllTransactions();
    const index = existing.findIndex(item => item.id === tx.id);
    let updated: Transaction[];

    if (index >= 0) {
      // Update existing record
      updated = [...existing];
      updated[index] = {...updated[index], ...tx};
    } else {
      // Insert new record di urutan pertama (paling baru)
      updated = [tx, ...existing];
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(updated),
    );
  } catch (err) {
    console.warn('[DB] Failed to save transaction:', err);
  }
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | null> {
  const all = await getAllTransactions();
  return all.find(tx => tx.id === id) || null;
}

export async function updateTransactionStatus(
  id: string,
  status: Transaction['status'],
  confirmedAt?: number,
): Promise<void> {
  const existing = await getAllTransactions();
  const updated = existing.map(tx =>
    tx.id === id ? {...tx, status, confirmedAt: confirmedAt ?? tx.confirmedAt} : tx,
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.TRANSACTIONS,
    JSON.stringify(updated),
  );
}

// ============================================================
// Kontak Repository (Tabel contacts Section 5)
// ============================================================

export async function getAllContacts(): Promise<Contact[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (!raw) {
      // Inisialisasi seed default
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONTACTS,
        JSON.stringify(SEED_CONTACTS),
      );
      return SEED_CONTACTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[DB] Failed to load contacts:', err);
    return SEED_CONTACTS;
  }
}

export async function saveContact(contact: Contact): Promise<void> {
  try {
    const existing = await getAllContacts();
    const updated = [contact, ...existing.filter(c => c.id !== contact.id)];
    await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(updated));
  } catch (err) {
    console.warn('[DB] Failed to save contact:', err);
  }
}

// ============================================================
// Offline Queue (FR-4.7)
// ============================================================

export async function getOfflineQueue(): Promise<Transaction[]> {
  const all = await getAllTransactions();
  // Ambil transaksi berstatus draft
  return all.filter(tx => tx.status === 'draft');
}
