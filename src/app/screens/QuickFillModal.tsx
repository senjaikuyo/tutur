import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {colors} from '../../constants/theme';
import Button from '../../components/common/Button';
import type {RootStackParamList} from '../../types/navigation';
import {useToastStore} from '../../stores/useToastStore';

type Route = RouteProp<RootStackParamList, 'QuickFillModal'>;
type ActionType = 'TRANSFER' | 'BALANCE';

export default function QuickFillModal() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const showToast = useToastStore(s => s.show);

  const initialIntent = route.params?.intent;

  const [action, setAction] = useState<ActionType>(
    initialIntent?.action === 'BALANCE' ? 'BALANCE' : 'TRANSFER',
  );
  const [recipient, setRecipient] = useState(initialIntent?.recipient || '');
  const [amount, setAmount] = useState(
    initialIntent?.amount ? String(initialIntent.amount) : '',
  );

  useEffect(() => {
    if (initialIntent?.recipient) {
      setRecipient(initialIntent.recipient);
    }
    if (initialIntent?.amount) {
      setAmount(String(initialIntent.amount));
    }
  }, [initialIntent]);

  const isComplete =
    action === 'BALANCE' || (recipient.trim() !== '' && amount.trim() !== '');

  const handleContinue = () => {
    if (action === 'BALANCE') {
      navigation.goBack();
      showToast('Saldo aktual kamu: 0.00 USDT (≈ Rp 0)', 'success');
      return;
    }

    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Masukkan jumlah nominal yang valid', 'error');
      return;
    }

    navigation.goBack();
    // Navigasi ke ConfirmationScreen dengan data lengkap
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
      params: {
        screen: 'Confirmation',
        params: {
          intent: {
            action: 'TRANSFER',
            recipient: recipient.trim(),
            token: initialIntent?.token || 'USDT',
            amount: numAmount,
            amountInRupiah: initialIntent?.amountInRupiah || null,
            confidence: 0.85,
            rawText: initialIntent?.rawText || `Kirim ${numAmount} USDT ke ${recipient}`,
            normalizedText: `kirim ${numAmount} usdt ke ${recipient}`,
            missingFields: [],
          },
        },
      },
    });
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>Lengkapi Transaksi</Text>
        <Text style={styles.subtitle}>
          Beberapa info belum terdeteksi dari suara
        </Text>

        {/* Action Type Chips */}
        <Text style={styles.label}>Tindakan</Text>
        <View style={styles.actionRow}>
          {(['TRANSFER', 'BALANCE'] as ActionType[]).map(a => (
            <TouchableOpacity
              key={a}
              style={[
                styles.actionChip,
                action === a && styles.actionChipActive,
              ]}
              onPress={() => setAction(a)}>
              <Text
                style={[
                  styles.actionChipText,
                  action === a && styles.actionChipTextActive,
                ]}>
                {a === 'TRANSFER' ? 'TRANSFER' : 'CEK SALDO'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {action === 'TRANSFER' && (
          <>
            {/* Recipient Input */}
            <Text style={styles.label}>Penerima</Text>
            <View
              style={[
                styles.inputWrapper,
                recipient.trim() === '' && styles.inputError,
              ]}>
              <TextInput
                style={styles.input}
                placeholder="Nama BNS (misal: budi.bnb) atau 0x..."
                placeholderTextColor={colors.textMuted}
                value={recipient}
                onChangeText={setRecipient}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.linkRow}>
              <TouchableOpacity
                style={styles.link}
                onPress={() => {
                  setRecipient('budi.bnb');
                }}>
                <Text style={styles.linkText}>Contoh: budi.bnb</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.link}
                onPress={() => {
                  setRecipient('warung.bnb');
                }}>
                <Text style={styles.linkText}>warung.bnb</Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <Text style={styles.label}>Jumlah</Text>
            <View
              style={[
                styles.inputWrapper,
                amount.trim() === '' && styles.inputError,
              ]}>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text style={styles.suffix}>USDT</Text>
            </View>
          </>
        )}

        <Button
          label="Lanjutkan"
          onPress={handleContinue}
          variant="primary"
          fullWidth
          disabled={!isComplete}
          style={styles.continueBtn}
        />
        <Button
          label="Batalkan"
          onPress={() => navigation.goBack()}
          variant="ghost"
          fullWidth
        />
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgTertiary,
    alignItems: 'center',
  },
  actionChipActive: {
    borderColor: colors.bnbGold,
    backgroundColor: `${colors.bnbGold}15`,
  },
  actionChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionChipTextActive: {
    color: colors.bnbGold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: {
    borderColor: colors.statusYellow,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  suffix: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  link: {
    paddingVertical: 2,
  },
  linkText: {
    fontSize: 12,
    color: colors.bnbGold,
    fontWeight: '600',
  },
  continueBtn: {
    marginTop: 12,
    marginBottom: 6,
  },
});
