import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
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
import type {HomeStackParamList} from '../../types/navigation';
import {useToastStore} from '../../stores/useToastStore';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Confirmation'>;
type Route = RouteProp<HomeStackParamList, 'Confirmation'>;

export default function ConfirmationScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const showToast = useToastStore(s => s.show);
  const intent = route.params?.intent;

  const amount = intent?.amount ?? 0;
  const recipient = intent?.recipient ?? '-';
  const rawText = intent?.rawText ?? '';
  const confidence = intent?.confidence ?? 1;

  const securityColor =
    confidence < 0.75 ? 'yellow' : 'green';
  const securityLabel = confidence < 0.75 ? 'Periksa Kembali' : 'Aman';

  const handleConfirm = () => {
    // TODO Fitur #7: konfirmasi biometrik + kirim UserOperation
    showToast('Eksekusi on-chain akan hadir di langkah berikutnya', 'info');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        {/* Amount */}
        <View style={styles.card}>
          <Text style={styles.label}>Kirim</Text>
          <Text style={styles.amount}>{formatToken(amount)}</Text>
          <Text style={styles.estimate}>{formatIdrEstimate(amount)}</Text>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Kepada</Text>
            <Text style={styles.detailValue}>{recipient}</Text>
            <Text style={styles.detailMono}>{shortenAddress(recipient)}</Text>
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
              0 BNB (Disponsori)
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Status Keamanan</Text>
            <Badge label={securityLabel} color={securityColor} dot />
          </View>
        </View>

        {/* Source text */}
        {rawText ? (
          <View style={styles.card}>
            <Text style={styles.sourceLabel}>Dikenali dari suara:</Text>
            <Text style={styles.sourceText}>"{rawText}"</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          label="Konfirmasi & Kirim"
          onPress={handleConfirm}
          variant="primary"
          fullWidth
          style={styles.confirmBtn}
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
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  estimate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailBlock: {
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
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
    padding: 16,
    paddingBottom: 24,
  },
  confirmBtn: {
    marginBottom: 8,
  },
});
