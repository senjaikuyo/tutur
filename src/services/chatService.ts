/**
 * Groq LLM Chat Service
 *
 * Mengelola percakapan cerdas dengan asisten AI TUTUR menggunakan Groq Cloud API:
 * - Model: llama-3.3-70b-versatile (atau llama-3.1-8b-instant)
 * - Endpoint: https://api.groq.com/openai/v1/chat/completions
 * - Memahami konteks keuangan, Web3 di opBNB, dan slang percakapan Indonesia.
 * - Otomatis mendeteksi intent transaksi dan mengaitkan kartu interaktif.
 */

import {parseIntent} from './intentParser';
import type {IntentResult} from '../types/intent';
import type {ChatMessage} from '../types/chat';

import {ENV} from '../constants/env';

const GROQ_CHAT_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_CHAT_MODEL = 'qwen/qwen3.8-27b';
const REQUEST_TIMEOUT_MS = 15000;

export interface AssistantReply {
  text: string;
  intent: IntentResult | null;
}

/**
 * Buat respons fallback cerdas jika API key belum diset
 */
function generateFallbackReply(
  userText: string,
  userBalance: number,
  intent: IntentResult,
): string {
  const lower = userText.toLowerCase();

  if (intent.action === 'TRANSFER') {
    if (intent.recipient && intent.amount) {
      return `Siap! Aku siapkan transfer ${intent.amount} USDT ke ${intent.recipient}. Klik kartu di bawah untuk konfirmasi ya! 🚀`;
    }
    if (intent.recipient && !intent.amount) {
      return `Mau transfer berapa USDT ke ${intent.recipient}? Sebutkan nominalnya (misal: "goceng", "10 USDT", atau "seratus ribu").`;
    }
    if (!intent.recipient && intent.amount) {
      return `Siap, ${intent.amount} USDT. Mau dikirim ke siapa? Kamu bisa sebut nama kontak (contoh: "ke Budi" atau "warung.bnb") atau scan QR.`;
    }
    return 'Mau kirim token ke siapa dan berapa nominalnya? Kamu bisa bilang misalnya "Kirim goceng USDT ke Budi".';
  }

  if (intent.action === 'BALANCE') {
    return `Saldo dompet kamu saat ini adalah ${userBalance.toFixed(2)} USDT (≈ Rp ${(userBalance * 17916).toLocaleString('id-ID')}) di jaringan opBNB Testnet. 💰`;
  }

  if (intent.action === 'SWAP_UNAVAILABLE') {
    return 'Fitur tukar token (Swap) belum tersedia di versi MVP ini ya. Saat ini kamu bisa melakukan transfer instan bebas gas atau cek saldo!';
  }

  if (lower.includes('halo') || lower.includes('hai') || lower.includes('pagi') || lower.includes('siang') || lower.includes('sore') || lower.includes('malam')) {
    return 'Halo! Aku asisten dompet tutur. Ada yang bisa kubantu? Kamu bisa minta aku transfer token, cek saldo, atau scan invoice!';
  }

  if (lower.includes('bantuan') || lower.includes('bisa apa') || lower.includes('help')) {
    return 'Di tutur kamu bisa:\n1. Kirim token pakai bahasa santai ("kirim goceng ke budi")\n2. Cek saldo kapan saja ("berapa duit gue")\n3. Scan QR alamat wallet atau preset invoice\n4. Minta saldo uji coba di faucet gratis!';
  }

  if (lower.includes('faucet') || lower.includes('minta uang') || lower.includes('isi saldo')) {
    return 'Kamu bisa minta 100 USDT gratis dari faucet opBNB! Ketuk tombol "Minta 100 USDT" di header atas ya.';
  }

  return `Paham! Untuk transaksi kamu cukup bilang apa yang mau dilakukan, misalnya "Kirim 10 USDT ke Budi" atau "Cek saldo". Ada yang mau kamu coba sekarang?`;
}

/**
 * Kirim pesan ke Groq LLM dan dapatkan balasan percakapan asisten
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  userBalance: number,
): Promise<AssistantReply> {
  const latestMessage = messages[messages.length - 1];
  const userText = latestMessage?.content || '';

  // 1. Jalankan Rule-Based Intent Parser kita untuk deteksi aksi
  const intent = parseIntent(userText);

  const apiKey = ENV.GROQ_API_KEY;

  // Jika tanpa API Key fisik, gunakan respons percakapan cerdas instan
  if (!apiKey) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 600));
    return {
      text: generateFallbackReply(userText, userBalance, intent),
      intent: intent.action ? intent : null,
    };
  }

  // 2. Format riwayat pesan untuk Groq Chat API
  const systemPrompt = `Kamu adalah tutur AI, asisten dompet Web3 pintar berbahasa Indonesia kasual, ramah, dan ringkas.
Kamu membantu pengguna mengelola transaksi kripto di jaringan opBNB.
Saldo pengguna saat ini: ${userBalance.toFixed(2)} USDT.
Kurs konversi: 1 USDT = Rp 17.916.
Kamu memahami istilah uang percakapan Indonesia (slang):
- goceng = 5 USDT / Rp 5.000
- ceban = 10 USDT / Rp 10.000
- gocap = 50 USDT / Rp 50.000
- cepek = 100 USDT
- seceng = 1000
- sejuta = Rp 1.000.000 (≈ 55.81 USDT)
- seratus ribu = Rp 100.000 (≈ 5.58 USDT)

Aturan jawaban:
- Jawab secara ringkas, ramah, dan gunakan bahasa Indonesia percakapan yang natural (maksimal 2-3 kalimat).
- Jika pengguna ingin melakukan transfer, tegaskan nominal dan penerima dengan jelas, lalu katakan kamu sudah menyiapkan kartunya di bawah.
- Jangan gunakan formatting Markdown yang berlebihan.`;

  const apiMessages = [
    {role: 'system', content: systemPrompt},
    ...messages.slice(-6).map(m => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(GROQ_CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_CHAT_MODEL,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 250,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Groq LLM Error (${res.status})`);
    }

    const json = await res.json();
    const replyText =
      json.choices?.[0]?.message?.content?.trim() ||
      generateFallbackReply(userText, userBalance, intent);

    return {
      text: replyText,
      intent: intent.action ? intent : null,
    };
  } catch (e) {
    clearTimeout(timeoutId);
    console.warn('[ChatService] LLM call fallback:', e);
    return {
      text: generateFallbackReply(userText, userBalance, intent),
      intent: intent.action ? intent : null,
    };
  }
}
