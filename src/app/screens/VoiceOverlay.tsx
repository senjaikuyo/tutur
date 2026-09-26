import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type {RootStackParamList} from '../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VoiceOverlay'>;
type VoiceState = 'recording' | 'processing' | 'error';

export default function VoiceOverlay() {
  const navigation = useNavigation<Nav>();
  const [state, setState] = useState<VoiceState>('recording');
  const [duration] = useState(3.2);
  const [transcript] = useState('');

  const close = () => navigation.goBack();

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        {state === 'recording' && (
          <>
            <Text style={styles.title}>Mendengarkan...</Text>
            <Text style={styles.waveform}>∿∿∿∿∿∿∿∿∿∿∿∿</Text>
            <View style={styles.timerRow}>
              <View style={styles.recDot} />
              <Text style={styles.timer}>{duration.toFixed(1)} detik</Text>
            </View>
            <Text style={styles.hint}>Lepas untuk mengirim</Text>
            <TouchableOpacity onPress={close} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Batalkan</Text>
            </TouchableOpacity>
          </>
        )}

        {state === 'processing' && (
          <>
            <Text style={styles.title}>Memproses...</Text>
            <LoadingSpinner />
            {transcript ? (
              <Text style={styles.transcript}>"{transcript}"</Text>
            ) : null}
          </>
        )}

        {state === 'error' && (
          <>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={40}
              color={colors.statusRed}
              style={styles.errorIcon}
            />
            <Text style={styles.errorTitle}>Tidak terdengar jelas</Text>
            <Text style={styles.errorBody}>
              Coba lagi atau ketik perintah secara manual
            </Text>
            <Button
              label="Coba Lagi"
              onPress={() => setState('recording')}
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
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  waveform: {
    fontSize: 24,
    color: colors.bnbGold,
    letterSpacing: 4,
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.statusRed,
    marginRight: 8,
  },
  timer: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  transcript: {
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
    fontWeight: '600',
    color: colors.statusRed,
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorBtn: {
    marginBottom: 12,
  },
});
