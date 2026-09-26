import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {useVoiceStore} from '../../stores/useVoiceStore';
import {useTransactionStore} from '../../stores/useTransactionStore';
import {useChatStore} from '../../stores/useChatStore';
import {transcribeAudio} from '../../services/groqService';
import {parseIntent} from '../../services/intentParser';
import {useToastStore} from '../../stores/useToastStore';

type VoiceState = 'recording' | 'processing' | 'error';

export default function VoiceOverlay() {
  const navigation = useNavigation<any>();
  const showToast = useToastStore(s => s.show);
  const {setDraftIntent, balance} = useTransactionStore();
  const {addUserMessage} = useChatStore();

  const [state, setState] = useState<VoiceState>('recording');
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Animasi waveform
  const waveAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation untuk waveform
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1.25,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0.95,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Timer perekaman
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev >= 9.9) {
          // Maksimal 10 detik sesuai FR-2.1
          clearInterval(interval);
          handleFinishRecording();
          return 10.0;
        }
        return Number((prev + 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const close = () => {
    navigation.goBack();
  };

  const handleFinishRecording = async () => {
    setState('processing');
    try {
      // 1. STT via Groq Whisper
      const text = await transcribeAudio();
      setTranscript(text);

      // 2. Parse Intent via Rule-Based Pipeline
      const intentResult = parseIntent(text);
      setDraftIntent(intentResult);

      // 3. Masukkan ke riwayat chat percakapan
      addUserMessage(text, true, balance);

      // 4. Tutup modal suara dan arahkan ke layar yang relevan
      setTimeout(() => {
        close();
        if (intentResult.action === 'SWAP_UNAVAILABLE') {
          showToast(
            'Fitur penukaran token belum tersedia. Kamu bisa melakukan transfer atau cek saldo.',
            'info',
          );
        } else if (intentResult.confidence < 0.75 || intentResult.missingFields.length > 0) {
          navigation.navigate('QuickFillModal', {intent: intentResult});
        }
      }, 700);
    } catch (err: any) {
      console.error('Voice process error:', err);
      setErrorMessage(err.message || 'Gagal mengenali suara.');
      setState('error');
    }
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        {state === 'recording' && (
          <>
            <Text style={styles.title}>Mendengarkan...</Text>
            <Animated.Text
              style={[
                styles.waveform,
                {transform: [{scale: waveAnim}]},
              ]}>
              ∿∿∿∿∿∿∿∿∿∿∿∿
            </Animated.Text>
            <View style={styles.timerRow}>
              <View style={styles.recDot} />
              <Text style={styles.timer}>{seconds.toFixed(1)} detik</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.doneBtn}
              onPress={handleFinishRecording}>
              <Text style={styles.doneBtnText}>Selesai Bicara</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={close} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Batalkan</Text>
            </TouchableOpacity>
          </>
        )}

        {state === 'processing' && (
          <>
            <Text style={styles.title}>Memproses Suara...</Text>
            <LoadingSpinner size="large" />
            {transcript ? (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptLabel}>Terdengar:</Text>
                <Text style={styles.transcriptText}>"{transcript}"</Text>
              </View>
            ) : null}
          </>
        )}

        {state === 'error' && (
          <>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={44}
              color={colors.statusRed}
              style={styles.errorIcon}
            />
            <Text style={styles.errorTitle}>Tidak Terdengar Jelas</Text>
            <Text style={styles.errorBody}>
              {errorMessage || 'Coba ulangi bicara atau gunakan input manual.'}
            </Text>
            <Button
              label="Coba Bicara Lagi"
              onPress={() => {
                setSeconds(0);
                setState('recording');
              }}
              variant="primary"
              fullWidth
              style={styles.errorBtn}
            />
            <Button
              label="Ketik Manual"
              onPress={() => {
                close();
                navigation.navigate('QuickFillModal', {intent: {}});
              }}
              variant="secondary"
              fullWidth
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  waveform: {
    fontSize: 26,
    color: colors.bnbGold,
    letterSpacing: 4,
    marginBottom: 20,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.statusRed,
    marginRight: 8,
  },
  timer: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  doneBtn: {
    backgroundColor: colors.bnbGold,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  doneBtnText: {
    color: colors.bgPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  transcriptBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.bgTertiary,
    borderRadius: 8,
    alignItems: 'center',
  },
  transcriptLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 16,
    color: colors.emerald,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.statusRed,
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  errorBtn: {
    marginBottom: 12,
  },
});
