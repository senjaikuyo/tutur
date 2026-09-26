/**
 * Voice Store (Zustand) — PRD Section 7.4 Store 3
 *
 * Mengelola state rekaman suara, transkripsi STT,
 * dan hasil parsing intent.
 */

import {create} from 'zustand';
import type {IntentResult} from '../types/intent';

interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  recordingDuration: number;
  rawTranscript: string | null;
  error: string | null;

  // Actions
  setRecording: (recording: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setDuration: (duration: number) => void;
  setTranscript: (text: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVoiceStore = create<VoiceState>(set => ({
  isRecording: false,
  isProcessing: false,
  recordingDuration: 0,
  rawTranscript: null,
  error: null,

  setRecording: (recording: boolean) => {
    set({isRecording: recording, error: null});
  },

  setProcessing: (processing: boolean) => {
    set({isProcessing: processing});
  },

  setDuration: (duration: number) => {
    set({recordingDuration: duration});
  },

  setTranscript: (text: string) => {
    set({rawTranscript: text});
  },

  setError: (error: string | null) => {
    set({error, isRecording: false, isProcessing: false});
  },

  reset: () => {
    set({
      isRecording: false,
      isProcessing: false,
      recordingDuration: 0,
      rawTranscript: null,
      error: null,
    });
  },
}));
