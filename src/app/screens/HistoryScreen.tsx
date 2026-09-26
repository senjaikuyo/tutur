import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import Badge from '../../components/common/Badge';
import {
  formatToken,
  formatClock,
  formatDateLabel,
  shortenAddress,
} from '../../utils/formatters';
import {useTransactionStore} from '../../stores/useTransactionStore';
import {syncPendingTransactions} from '../../services/syncService';
import {useToastStore} from '../../stores/useToastStore';
import type {Transaction} from '../../types/transaction';

export default function HistoryScreen() {
  const {allTransactions, loadStoredTransactions} = useTransactionStore();
  const showToast = useToastStore(s => s.show);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStoredTransactions();
    // Sinkronkan status on-chain (FR-7.3)
    syncPendingTransactions();
  }, [loadStoredTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStoredTransactions();
    const synced = await syncPendingTransactions();
    if (synced > 0) {
      showToast(`${synced} transaksi telah disinkronkan on-chain`, 'success');
    }
    setRefreshing(false);
  };

  // Grouping transaksi per tanggal (Hari Ini, Kemarin, dst - Wireframe 13.9)
  const groupedTransactions: Record<string, Transaction[]> = {};
  for (const tx of allTransactions) {
    const label = formatDateLabel(tx.createdAt);
    if (!groupedTransactions[label]) {
      groupedTransactions[label] = [];
    }
    groupedTransactions[label].push(tx);
  }

  const groupKeys = Object.keys(groupedTransactions);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Riwayat Transaksi</Text>
        <TouchableOpacity
          style={styles.syncBtn}
          onPress={onRefresh}
          disabled={refreshing}>
          <MaterialCommunityIcons
            name="cloud-sync-outline"
            size={22}
            color={colors.bnbGold}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.bnbGold}
            colors={[colors.bnbGold]}
          />
        }>
        {groupKeys.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="history"
              size={54}
              color={colors.textMuted}
              style={{marginBottom: 12}}
            />
            <Text style={styles.emptyTitle}>Belum Ada Riwayat Transaksi</Text>
            <Text style={styles.emptySub}>
              Transaksi melalui perintah suara, scan QR, atau faucet akan
              tersimpan di sini.
            </Text>
          </View>
        ) : (
          groupKeys.map(dateLabel => {
            const txList = groupedTransactions[dateLabel];
            return (
              <View key={dateLabel} style={styles.groupSection}>
                <Text style={styles.groupHeader}>{dateLabel}</Text>

                <View style={styles.card}>
                  {txList.map((tx, idx) => {
                    const isTransfer = tx.action === 'TRANSFER';
                    const arrowIcon = isTransfer
                      ? 'arrow-up-circle'
                      : 'arrow-down-circle';
                    const arrowColor = isTransfer
                      ? colors.statusRed
                      : colors.emerald;
                    const recipientText =
                      tx.recipientLabel || shortenAddress(tx.recipientAddress);

                    const statusBadgeColor =
                      tx.status === 'success'
                        ? 'green'
                        : tx.status === 'pending'
                        ? 'yellow'
                        : 'red';

                    const statusBadgeLabel =
                      tx.status === 'success'
                        ? 'Berhasil'
                        : tx.status === 'pending'
                        ? 'Tertunda'
                        : 'Gagal';

                    return (
                      <React.Fragment key={tx.id}>
                        <View style={styles.txRow}>
                          <MaterialCommunityIcons
                            name={arrowIcon}
                            size={36}
                            color={arrowColor}
                            style={styles.txIcon}
                          />

                          <View style={styles.txInfo}>
                            <View style={styles.txTopRow}>
                              <Text style={styles.txTitle}>
                                {isTransfer ? 'Kirim' : 'Terima'}{' '}
                                {formatToken(tx.amount)}
                              </Text>
                              <Badge
                                label={statusBadgeLabel}
                                color={statusBadgeColor}
                                dot
                              />
                            </View>

                            <Text style={styles.txRecipient}>
                              {isTransfer ? 'ke' : 'dari'} {recipientText}
                            </Text>

                            <View style={styles.txBottomRow}>
                              <Text style={styles.txTime}>
                                {formatClock(tx.createdAt)}
                              </Text>
                              {tx.gasSponsored && (
                                <Text style={styles.txGas}>
                                  Gas: Disponsori Paymaster
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>

                        {idx < txList.length - 1 && (
                          <View style={styles.divider} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    padding: 16,
    paddingTop: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  syncBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  groupSection: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  txIcon: {
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  txRecipient: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  txBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  txGas: {
    fontSize: 11,
    color: colors.emerald,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  emptyCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
