import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {copyText} from '../../utils/clipboard';
import {colors} from '../../constants/theme';
import {OPBNB_TESTNET} from '../../constants/chains';
import {shortenAddress, getInitials} from '../../utils/formatters';
import Button from '../../components/common/Button';
import {useToastStore} from '../../stores/useToastStore';
import {useAuthStore} from '../../stores/useAuthStore';
import {useTransactionStore} from '../../stores/useTransactionStore';
import {logoutParticle} from '../../services/particleService';

export default function ProfileScreen() {
  const showToast = useToastStore(s => s.show);
  const {user, logout} = useAuthStore();
  const {claimFaucet, faucetCooldown, faucetLoading} = useTransactionStore();
  const rootNav = useNavigation<{
    reset: (state: {index: number; routes: {name: string}[]}) => void;
  }>();

  const smartAccount =
    user?.smartAccountAddress || '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
  const eoaAddress =
    user?.eoaAddress || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const email = user?.email || 'rian.web3@gmail.com';
  const name = user?.name || 'Rian Senja';

  const openExplorer = () => {
    Linking.openURL(`${OPBNB_TESTNET.explorerUrl}/address/${smartAccount}`);
  };

  const handleFaucet = async () => {
    if (faucetCooldown > 0) {
      showToast(`Tunggu cooldown ${faucetCooldown} detik...`, 'info');
      return;
    }
    showToast('Meminta 100 USDT Faucet via opBNB Paymaster...', 'info');
    const success = await claimFaucet(smartAccount);
    if (success) {
      showToast('100 USDT berhasil ditambahkan ke saldo!', 'success');
    } else {
      showToast('Gagal meminta faucet. Coba sesaat lagi.', 'error');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    copyText(text);
    showToast(`${label} disalin ke clipboard!`, 'success');
  };

  const handleLogout = async () => {
    await logoutParticle();
    logout();
    showToast('Berhasil keluar dari akun.', 'info');
    rootNav.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Profil</Text>

      {/* User info */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(name)}</Text>
        </View>
        <View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>

      {/* Account details */}
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => copyToClipboard(smartAccount, 'Smart Account')}
          style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Smart Account (ERC-4337)</Text>
          <View style={styles.monoRow}>
            <Text style={styles.mono}>{shortenAddress(smartAccount)}</Text>
            <MaterialCommunityIcons
              name="content-copy"
              size={14}
              color={colors.bnbGold}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => copyToClipboard(eoaAddress, 'EOA Address')}
          style={styles.detailBlock}>
          <Text style={styles.detailLabel}>EOA Signer Address</Text>
          <View style={styles.monoRow}>
            <Text style={styles.mono}>{shortenAddress(eoaAddress)}</Text>
            <MaterialCommunityIcons
              name="content-copy"
              size={14}
              color={colors.bnbGold}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />

        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Jaringan</Text>
          <Text style={styles.network}>
            {OPBNB_TESTNET.chainName} ({OPBNB_TESTNET.chainId})
          </Text>
        </View>
      </View>

      {/* Actions */}
      <Button
        label={
          faucetLoading
            ? 'Memproses...'
            : faucetCooldown > 0
            ? `Tunggu ${faucetCooldown} detik...`
            : 'Minta 100 USDT Faucet'
        }
        onPress={handleFaucet}
        disabled={faucetCooldown > 0 || faucetLoading}
        loading={faucetLoading}
        variant="secondary"
        fullWidth
        style={styles.actionBtn}
      />

      <Button
        label="Lihat di Block Explorer"
        onPress={openExplorer}
        variant="ghost"
        fullWidth
        style={styles.actionBtn}
      />

      <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>

      <Text style={styles.version}>TUTUR v1.0.0 — Hackathon Edition</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    padding: 16,
    paddingTop: 48,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailBlock: {
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  monoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mono: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  network: {
    fontSize: 14,
    color: colors.emerald,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  actionBtn: {
    marginBottom: 12,
  },
  logoutRow: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
  },
  version: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});
