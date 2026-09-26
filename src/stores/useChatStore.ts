/**
 * Chat Store (Zustand)
 *
 * Mengelola riwayat percakapan antara pengguna dan asisten TUTUR AI,
 * status loading saat AI berpikir, dan penyimpanan riwayat chat lokal.
 */

import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {ChatMessage} from '../types/chat';
import type {IntentResult} from '../types/intent';
import {sendChatMessage} from '../services/chatService';

const STORAGE_CHAT_KEY = '@tutur_chat_messages_v1';

// Pesan sambutan awal default
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content:
      'Halo Rian! 👋 Aku asisten dompet TUTUR. Mau kirim uang atau cek saldo? Kamu bisa ketik atau tekan tombol mikrofon untuk bicara langsung pakai bahasa santai, misalnya: "Kirim goceng ke Budi".',
    timestamp: Date.now() - 60000,
  },
];

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;

  // Actions
  loadChatHistory: () => Promise<void>;
  addUserMessage: (
    content: string,
    isVoice?: boolean,
    userBalance?: number,
  ) => Promise<void>;
  addAssistantMessage: (
    content: string,
    attachedIntent?: IntentResult | null,
  ) => Promise<void>;
  clearChat: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: INITIAL_MESSAGES,
  isTyping: false,

  loadChatHistory: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_CHAT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({messages: parsed});
          return;
        }
      }
      set({messages: INITIAL_MESSAGES});
    } catch (e) {
      console.warn('[ChatStore] Failed to load chat history:', e);
      set({messages: INITIAL_MESSAGES});
    }
  },

  addUserMessage: async (content: string, isVoice = false, userBalance = 185) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      isVoice,
    };

    const currentMessages = [...get().messages, userMsg];
    set({messages: currentMessages, isTyping: true});

    try {
      await AsyncStorage.setItem(
        STORAGE_CHAT_KEY,
        JSON.stringify(currentMessages),
      );
    } catch (e) {
      console.warn('[ChatStore] Failed to cache user message:', e);
    }

    // Panggil LLM / intent hook
    try {
      const reply = await sendChatMessage(currentMessages, userBalance);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}-${Math.random()}`,
        role: 'assistant',
        content: reply.text,
        timestamp: Date.now(),
        attachedIntent: reply.intent,
      };

      const updatedWithReply = [...currentMessages, assistantMsg];
      set({messages: updatedWithReply, isTyping: false});

      await AsyncStorage.setItem(
        STORAGE_CHAT_KEY,
        JSON.stringify(updatedWithReply),
      );
    } catch (err) {
      console.warn('[ChatStore] Failed to generate AI reply:', err);
      set({isTyping: false});
    }
  },

  addAssistantMessage: async (
    content: string,
    attachedIntent: IntentResult | null = null,
  ) => {
    const msg: ChatMessage = {
      id: `asst-${Date.now()}-${Math.random()}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
      attachedIntent,
    };

    const updated = [...get().messages, msg];
    set({messages: updated});

    try {
      await AsyncStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('[ChatStore] Failed to save assistant message:', e);
    }
  },

  clearChat: async () => {
    set({messages: INITIAL_MESSAGES});
    try {
      await AsyncStorage.removeItem(STORAGE_CHAT_KEY);
    } catch (e) {
      console.warn('[ChatStore] Failed to clear chat:', e);
    }
  },
}));
