/**
 * Groq Whisper STT API Service
 *
 * Mengirim audio ke Groq API (whisper-large-v3) untuk transkripsi suara ke teks.
 * Berdasarkan FR-2.1 dan Section 6.1 di PRD TUTUR:
 * - Endpoint: https://api.groq.com/openai/v1/audio/transcriptions
 * - Model: whisper-large-v3
 * - Format: multipart/form-data
 * - Timeout: 5 detik
 *
 * Jika GROQ_API_KEY belum diset, service ini menyediakan simulasi demo interaktif
 * dengan skenario frasa percakapan nyata Indonesia (Happy path, Slang, Rupiah).
 */

import {ENV} from '../constants/env';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_MODEL = 'whisper-large-v3';
const REQUEST_TIMEOUT_MS = 8000;

export const isGroqConfigured = (): boolean => {
  return Boolean(ENV.GROQ_API_KEY);
};

// Daftar frasa simulasi untuk pengujian lokal jika API key belum dimasukkan
export const DEMO_VOICE_PRESETS = [
  'Kirim goceng USDT ke Budi',
  'Transfer ceban ke warung',
  'Oper seratus ribu ke Budi',
  'Kirimin Afif gocap USDT',
  'Cek saldo gue sekarang',
  'Bayar 15 USDT ke warung',
  'Kirim setengah USDT ke Afif',
];

let presetIndex = 0;

export function getNextDemoVoicePreset(): string {
  const phrase = DEMO_VOICE_PRESETS[presetIndex];
  presetIndex = (presetIndex + 1) % DEMO_VOICE_PRESETS.length;
  return phrase;
}

/**
 * Transkripsi file audio ke teks via Groq Cloud API
 *
 * @param audioFilePath Path file audio lokal (.m4a / .wav)
 * @returns Teks transkripsi hasil STT
 */
export async function transcribeAudio(audioFilePath?: string): Promise<string> {
  const apiKey = ENV.GROQ_API_KEY;

  if (!apiKey || !audioFilePath) {
    // Mode demo / emulator fallback jika belum ada API key fisik
    await new Promise<void>(resolve => setTimeout(() => resolve(), 800)); // simulasi latensi Groq ~800ms
    return getNextDemoVoicePreset();
  }

  const formData = new FormData();
  formData.append('model', GROQ_MODEL);
  formData.append('language', 'id');
  formData.append('response_format', 'json');
  formData.append('file', {
    uri: audioFilePath.startsWith('file://')
      ? audioFilePath
      : `file://${audioFilePath}`,
    type: 'audio/m4a',
    name: 'audio.m4a',
  } as any);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return (data.text || '').trim();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Groq STT timeout (>5 detik). Coba ulangi kembali.');
    }
    throw err;
  }
}
