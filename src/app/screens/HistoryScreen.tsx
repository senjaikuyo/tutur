import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {colors} from '../../constants/theme';
import RecentTransactions from '../../components/home/RecentTransactions';
import type {Transaction} from '../../types/transaction';

// TODO Fitur #9: ganti dengan data dari WatermelonDB
const MOCK: Transaction[] = [];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Riwayat Transaksi</Text>
      <ScrollView style={styles.scroll}>
        <RecentTransactions transactions={MOCK} />
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
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  scroll: {
    flex: 1,
  },
});
