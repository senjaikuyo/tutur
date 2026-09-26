import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import {formatToken, formatRelativeTime} from '../../utils/formatters';
import type {Transaction} from '../../types/transaction';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onPressItem?: (id: string) => void;
}

export default function RecentTransactions({
  transactions,
  onPressItem,
}: RecentTransactionsProps) {
  return (
    <View style={styles.card}>
      {transactions.length === 0 ? (
        <Text style={styles.empty}>Belum ada transaksi</Text>
      ) : (
        transactions.map((tx, idx) => {
          const outgoing = tx.action === 'TRANSFER';
          const arrowColor = outgoing ? colors.statusRed : colors.emerald;
          const arrowName = outgoing ? 'arrow-up' : 'arrow-down';
          const statusColor =
            tx.status === 'success'
              ? colors.statusGreen
              : tx.status === 'failed'
              ? colors.statusRed
              : colors.statusYellow;

          return (
            <React.Fragment key={tx.id}>
              <TouchableOpacity
                style={styles.row}
                activeOpacity={onPressItem ? 0.7 : 1}
                onPress={onPressItem ? () => onPressItem(tx.id) : undefined}>
                <MaterialCommunityIcons
                  name={outgoing ? 'arrow-up-circle' : 'arrow-down-circle'}
                  size={32}
                  color={arrowColor}
                />
                <View style={styles.rowContent}>
                  <Text style={styles.rowTitle}>
                    {outgoing ? 'Kirim' : 'Terima'} {formatToken(tx.amount)}
                  </Text>
                  <Text style={styles.rowSubtitle}>
                    {outgoing ? 'ke' : 'dari'}{' '}
                    {tx.recipientLabel || tx.recipientAddress}
                  </Text>
                  <Text style={styles.rowTime}>
                    {formatRelativeTime(tx.createdAt)}
                    {'  '}
                    <Text style={{color: statusColor}}>
                      ● {tx.status === 'success' ? 'Berhasil' : tx.status === 'pending' ? 'Tertunda' : 'Gagal'}
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
              {idx < transactions.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          );
        })
      )}
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
  empty: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowContent: {
    marginLeft: 12,
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rowTime: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
});
