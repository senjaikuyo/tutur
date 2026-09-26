/**
 * Inactivity Timer Hook (FR-1.5 di PRD TUTUR)
 *
 * Mengelola timeout sesi 30 menit:
 * 1. Menggunakan AppState listener untuk mendeteksi kapan aplikasi masuk background.
 * 2. Mencatat timestamp ke AsyncStorage saat background.
 * 3. Saat aplikasi kembali ke foreground, periksa apakah selisih waktu >30 menit.
 * 4. Jika kedaluwarsa, paksa re-autentikasi dan arahkan ke layar Login.
 */

import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../stores/useAuthStore';
import {useToastStore} from '../stores/useToastStore';

const BACKGROUND_TIMESTAMP_KEY = '@tutur_last_background_timestamp';
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export function useInactivityTimer(onSessionExpired?: () => void) {
  const {isAuthenticated, refreshActivity, checkSessionExpiry} = useAuthStore();
  const showToast = useToastStore(s => s.show);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        // App beralih dari active ke background/inactive
        if (
          appState.current === 'active' &&
          nextAppState.match(/inactive|background/)
        ) {
          await AsyncStorage.setItem(
            BACKGROUND_TIMESTAMP_KEY,
            Date.now().toString(),
          );
        }

        // App kembali ke foreground
        if (
          appState.current?.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          const rawBgTime = await AsyncStorage.getItem(
            BACKGROUND_TIMESTAMP_KEY,
          );

          if (rawBgTime) {
            const bgTime = parseInt(rawBgTime, 10);
            const elapsed = Date.now() - bgTime;

            if (elapsed >= THIRTY_MINUTES_MS || checkSessionExpiry()) {
              showToast(
                'Sesi kamu telah berakhir (30 menit tanpa aktivitas). Silakan masuk kembali.',
                'info',
              );
              if (onSessionExpired) {
                onSessionExpired();
              }
              return;
            }
          }

          // Masih dalam batas waktu aman, perbarui aktivitas
          refreshActivity();
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, checkSessionExpiry, refreshActivity, showToast, onSessionExpired]);
}
