import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../constants/theme';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  formatToken,
  formatIdrEstimate,
  shortenAddress,
} from '../../utils/formatters';
import {resolveRecipient} from '../../utils/resolver';
import {checkAddressSecurity} from '../../services/securityService';
import type {HomeStackParamList} from '../../types/navigation';
import {useToastStore} from '../../stores/useToastStore';
import {useTransactionStore} from '../../stores/useTransactionStore';
import {useAuthStore} from '../../stores/useAuthStore';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Confirmation'>;
type Route = RouteProp<HomeStackParamList, 'Confirmation'>;

export default function ConfirmationScreen() {
  const navigation = useNavigation<Nav>();
  const rootNav = useNavigation<any>();
  const route = useRoute<Route>();
  const showToast = useToastStore(s => s.show);
  const {user} = useAuthStore();
  const {sendTransfer, isSending, balance} = useTransactionStore();

  const intent = route.params?.intent;
  const amount = intent?.amount ?? 0;
  const rawRecipient = intent?.recipient ?? '-';
  const rawText = intent?.rawText ?? '';
  const confidence = intent?.confidence ?? 1;
  const isUnlimitedAllowance = Boolean(intent?.isUnlimitedAllowance);

  // State override setelah interaksi modal warning
  const [overrideRisk, setOverrideRisk] = useState(false);
  const [allowanceLimited, setAllowanceLimited] = useState(false);

  // Resolusi nama BNS atau alamat wallet penerima
  const resolved = resolveRecipient(rawRecipient);
  const displayAddress = resolved.address || rawRecipient;
  const displayLabel = resolved.isBns ? resolved.label : null;

  // Audit keamanan alamat penerima (FR-6.1)
  const securityAudit = checkAddressSecurity(displayAddress);

  // Tentukan warna dan label badge
  let securityColor: 'red' | 'yellow' | 'green' = 'green';
  let securityLabel = 'Aman';

  if (securityAudit.level === 'red') {
    securityColor = overrideRisk ? 'yellow' : 'red';
    securityLabel = overrideRisk ? 'Risiko Diabaikan User' : 'Berbahaya (Blacklist)';
  } else if ((isUnlimitedAllowance && !allowanceLimited) || confidence < 0.75) {
    securityColor = 'yellow';
    securityLabel = isUnlimitedAllowance
      ? 'Izin Tak Terbatas'
      : 'Periksa Kembali';
  } else if (allowanceLimited) {
    securityColor = 'green';
    securityLabel = 'Aman (Izin Dibatasi)';
  }

  const openWarningModal = (type: 'blacklist' | 'unlimited_allowance') => {
    rootNav.navigate('SecurityWarningModal', {
      type,
      address: displayAddress,
      onProceed: () => {
        if (type === 'blacklist') {
          setOverrideRisk(true);
        } else {
          setAllowanceLimited(true);
        }
      },
      onCancel: () => {
        navigation.goBack();
      },
    });
  };

  const handleConfirm = async () => {
    // 1. Blokir Blacklist jika belum di-override secara sadar (FR-6.1 & FR-6.4)
    if (securityAudit.blocked && !overrideRisk) {
      openWarningModal('blacklist');
      return;
    }

    // 2. Intersepsi Unlimited Allowance jika belum dibatasi (FR-6.2 & FR-6.3)
    if (isUnlimitedAllowance && !allowanceLimited) {
      openWarningModal('unlimited_allowance');
      return;
    }

    if (amount <= 0) {
      showToast('Nominal transfer harus lebih dari 0 USDT.', 'error');
      return;
    }

    // 3. Pengecekan saldo sebelum kirim UserOp (FR-4.4)
    if (balance < amount) {
      showToast(
        `Saldo tidak cukup! Saldo kamu: ${balance.toFixed(2)} USDT, diperlukan: ${amount.toFixed(2)} USDT.`,
        'error',
      );
      return;
    }

    const sender =
      user?.smartAccountAddress || '0x90F79bf6EB2c4f870365E785982E1f101E93b906';

    const res = await sendTransfer({
      senderAddress: sender,
      recipientAddress: displayAddress,
      amount,
      tokenSymbol: intent?.token || 'USDT',
      recipientLabel: displayLabel,
      securityFlag: securityColor as any,
    });

    if (res.success) {
      showToast(
        `Transfer ${amount} USDT berhasil dikirim via opBNB!`,
        'success',
      );
      navigation.navigate('Home');
    } else {
      showToast(res.error || 'Gagal mengirim transaksi on-chain.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        {/* Nominal Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Kirim</Text>
          <Text style={styles.amount}>{formatToken(amount)}</Text>
          <Text style={styles.estimate}>{formatIdrEstimate(amount)}</Text>
        </View>

        {/* Transaction Details Card */}
        <View style={styles.card}>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Kepada</Text>
            <Text style={styles.detailValue}>
              {displayLabel ? `${displayLabel}` : shortenAddress(displayAddress)}
            </Text>
            {displayLabel && (
              <Text style={styles.detailMono}>
                {shortenAddress(displayAddress)}
              </Text>
            )}
          </View>
          <View style={styles.divider} />

          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Token</Text>
            <Text style={styles.detailValue}>{intent?.token ?? 'USDT'}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Biaya Gas</Text>
            <Text style={[styles.detailValue, {color: colors.emerald}]}>
              0 BNB (Disponsori Paymaster)
            </Text>
          </View>
          <View style={styles.divider} />

          {/* Status Keamanan Interaktif */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (securityAudit.level === 'red') {
                openWarningModal('blacklist');
              } else if (isUnlimitedAllowance) {
                openWarningModal('unlimited_allowance');
              }
            }}
            style={styles.detailBlock}>
            <View style={styles.securityHeaderRow}>
              <Text style={styles.detailLabel}>Status Keamanan (AI Shield)</Text>
              {(securityColor === 'red' || securityColor === 'yellow') && (
                <Text style={styles.clickHint}>Klik untuk info &gt;</Text>
              )}
            </View>
            <Badge label={securityLabel} color={securityColor} dot />
          </TouchableOpacity>
        </View>

        {/* Source Text Speech Recognition */}
        {rawText ? (
          <View style={styles.card}>
            <Text style={styles.sourceLabel}>Dikenali dari:</Text>
            <Text style={styles.sourceText}>"{rawText}"</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          label={
            isSending
              ? 'Memproses UserOp...'
              : securityColor === 'red' && !overrideRisk
              ? 'Periksa Risiko Keamanan (Blacklist)'
              : 'Konfirmasi & Kirim'
          }
          onPress={handleConfirm}
          loading={isSending}
          disabled={isSending}
          variant={securityColor === 'red' && !overrideRisk ? 'danger' : 'primary'}
          fullWidth
          style={styles.confirmBtn}
        />
        <Button
          label="Batalkan"
          onPress={() => navigation.goBack()}
          disabled={isSending}
          variant="ghost"
          fullWidth
          style={styles.cancelBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  amount: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  estimate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailBlock: {
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  securityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clickHint: {
    fontSize: 11,
    color: colors.bnbGold,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  detailMono: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  sourceLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  sourceText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actions: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: colors.bgPrimary,
    overflow: 'hidden',
  },
  confirmBtn: {
    marginBottom: 10,
  },
  cancelBtn: {
    height: 40,
  },
});
