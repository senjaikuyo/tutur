import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../constants/theme';
import Button from '../../components/common/Button';
import type {RootStackParamList} from '../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'QuickFillModal'>;
type ActionType = 'TRANSFER' | 'BALANCE';

export default function QuickFillModal() {
  const navigation = useNavigation<Nav>();
  const [action, setAction] = useState<ActionType>('TRANSFER');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const isComplete =
    action === 'BALANCE' || (recipient.trim() !== '' && amount.trim() !== '');

  const handleContinue = () => {
    // TODO Fitur #6: navigate ke ConfirmationScreen dengan intent lengkap
    navigation.goBack();
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>Lengkapi Transaksi</Text>
        <Text style={styles.subtitle}>
          Beberapa info belum terdeteksi dari suara
        </Text>

        {/* Action */}
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
            {/* Recipient */}
            <Text style={styles.label}>Penerima</Text>
            <View
              style={[
                styles.inputWrapper,
                recipient.trim() === '' && styles.inputError,
              ]}>
              <TextInput
                style={styles.input}
                placeholder="Nama atau alamat wallet"
                placeholderTextColor={colors.textMuted}
                value={recipient}
                onChangeText={setRecipient}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.linkRow}>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Scan QR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Tempel</Text>
              </TouchableOpacity>
            </View>

            {/* Amount */}
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
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
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
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  suffix: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  link: {
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 12,
    color: colors.bnbGold,
    fontWeight: '600',
  },
  continueBtn: {
    marginTop: 8,
    marginBottom: 8,
  },
});
