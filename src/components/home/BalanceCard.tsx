import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {copyText} from '../../utils/clipboard';
import {colors} from '../../constants/theme';
import {
  formatToken,
  formatIdrEstimate,
  shortenAddress,
} from '../../utils/formatters';
import {useToastStore} from '../../stores/useToastStore';

interface BalanceCardProps {
  balance: number;
  address: string;
  onFaucet: () => void;
  faucetLoading?: boolean;
  faucetCooldown?: number;
}

export default function BalanceCard({
  balance,
  address,
  onFaucet,
  faucetLoading = false,
  faucetCooldown = 0,
}: BalanceCardProps) {
  const onCooldown = faucetCooldown > 0;
  const showToast = useToastStore(s => s.show);

  const handleCopy = () => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return;
    }
    copyText(address);
    showToast('Alamat berhasil disalin ke clipboard!', 'success');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Saldo Kamu</Text>
      <Text style={styles.balance}>{formatToken(balance)}</Text>
      <Text style={styles.estimate}>{formatIdrEstimate(balance)}</Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleCopy}
        style={styles.addrRow}>
        <Text style={styles.address}>{shortenAddress(address)}</Text>
        <MaterialCommunityIcons
          name="content-copy"
          size={14}
          color={colors.bnbGold}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.faucetBtn, (faucetLoading || onCooldown) && styles.disabled]}
        onPress={onCooldown || faucetLoading ? undefined : onFaucet}
        disabled={onCooldown || faucetLoading}>
        {faucetLoading ? (
          <Text style={styles.faucetText}>Memproses...</Text>
        ) : onCooldown ? (
          <Text style={styles.faucetText}>Tunggu {faucetCooldown} detik...</Text>
        ) : (
          <Text style={styles.faucetText}>Minta 100 USDT</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  balance: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  estimate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  address: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  faucetBtn: {
    borderWidth: 1,
    borderColor: colors.bnbGold,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  faucetText: {
    color: colors.bnbGold,
    fontSize: 14,
    fontWeight: '600',
  },
});
