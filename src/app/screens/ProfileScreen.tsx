import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import {OPBNB_TESTNET} from '../../constants/chains';
import {shortenAddress, getInitials} from '../../utils/formatters';
import Button from '../../components/common/Button';
import {useToastStore} from '../../stores/useToastStore';

// TODO Fitur #3: ganti dengan data nyata dari useAuthStore
const MOCK_SMART_ACCOUNT = '0x0000000000000000000000000000000000000000';
const MOCK_EOA = '0x0000000000000000000000000000000000000000';
const MOCK_EMAIL = 'belum login';
const MOCK_NAME = 'Tamu';

export default function ProfileScreen() {
  const showToast = useToastStore(s => s.show);

  const openExplorer = () => {
    Linking.openURL(`${OPBNB_TESTNET.explorerUrl}/address/${MOCK_SMART_ACCOUNT}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Profil</Text>

      {/* User info */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(MOCK_NAME)}</Text>
        </View>
        <View>
          <Text style={styles.userName}>{MOCK_NAME}</Text>
          <Text style={styles.userEmail}>{MOCK_EMAIL}</Text>
        </View>
      </View>

      {/* Account details */}
      <View style={styles.card}>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Smart Account</Text>
          <View style={styles.monoRow}>
            <Text style={styles.mono}>{shortenAddress(MOCK_SMART_ACCOUNT)}</Text>
            <MaterialCommunityIcons
              name="content-copy"
              size={14}
              color={colors.bnbGold}
            />
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>EOA Address</Text>
          <View style={styles.monoRow}>
            <Text style={styles.mono}>{shortenAddress(MOCK_EOA)}</Text>
            <MaterialCommunityIcons
              name="content-copy"
              size={14}
              color={colors.bnbGold}
            />
          </View>
        </View>
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
        label="Minta 100 USDT Faucet"
        onPress={() => showToast('Fitur faucet akan hadir di langkah berikutnya', 'info')}
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

      <TouchableOpacity
        style={styles.logoutRow}
        onPress={() => showToast('Logout akan hadir di langkah berikutnya', 'info')}>
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
