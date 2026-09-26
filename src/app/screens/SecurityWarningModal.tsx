import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import Button from '../../components/common/Button';
import {shortenAddress} from '../../utils/formatters';
import type {RootStackParamList} from '../../types/navigation';
import {useToastStore} from '../../stores/useToastStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SecurityWarningModal'>;
type Route = RouteProp<RootStackParamList, 'SecurityWarningModal'>;

export default function SecurityWarningModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const showToast = useToastStore(s => s.show);

  const type = route.params?.type ?? 'blacklist';
  const address = route.params?.address ?? '';
  const onProceed = route.params?.onProceed;
  const onCancel = route.params?.onCancel;

  const [limitAllowance, setLimitAllowance] = useState(true);

  const handleBlacklistProceed = () => {
    navigation.goBack();
    showToast('Peringatan: Kamu melanjutkan ke alamat berisiko!', 'error');
    if (onProceed) {
      onProceed();
    }
  };

  const handleBlacklistCancel = () => {
    navigation.goBack();
    showToast('Transaksi dibatalkan demi keamanan.', 'info');
    if (onCancel) {
      onCancel();
    }
  };

  const handleAllowanceAction = () => {
    navigation.goBack();
    if (limitAllowance) {
      showToast(
        'Izin saldo dibatasi hanya sesuai nominal transaksi (Aman).',
        'success',
      );
      if (onProceed) {
        onProceed();
      }
    } else {
      showToast('Transaksi dibatalkan.', 'info');
      if (onCancel) {
        onCancel();
      }
    }
  };

  if (type === 'blacklist') {
    return (
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="alert-octagon"
            size={46}
            color={colors.statusRed}
            style={styles.icon}
          />
          <Text style={[styles.title, {color: colors.statusRed}]}>
            PERINGATAN KEAMANAN
          </Text>

          <View style={styles.badgeRed}>
            <Text style={styles.badgeRedText}>● ALAMAT BLACKLIST</Text>
          </View>

          <Text style={styles.body}>
            Alamat kontrak/wallet tujuan terdata sebagai alamat yang dilaporkan
            terlibat penipuan (phishing/wallet drainer).
          </Text>

          <Text style={styles.monoRed}>{shortenAddress(address)}</Text>

          <Text style={[styles.body, styles.bold, {color: colors.statusRed}]}>
            Transaksi DIBLOKIR demi keamanan dana kamu.
          </Text>

          <Button
            label="Batalkan (Sangat Direkomendasikan)"
            onPress={handleBlacklistCancel}
            variant="primary"
            fullWidth
            style={styles.actionBtn}
          />

          <TouchableOpacity
            style={styles.riskLink}
            onPress={handleBlacklistProceed}>
            <Text style={styles.riskLinkText}>
              Saya paham risikonya, tetap lanjutkan &gt;
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Variant: unlimited_allowance (FR-6.2 & FR-6.3)
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <MaterialCommunityIcons
          name="shield-alert"
          size={46}
          color={colors.statusYellow}
          style={styles.icon}
        />
        <Text style={[styles.title, {color: colors.statusYellow}]}>
          Perhatian Izin Saldo
        </Text>

        <View style={styles.badgeYellow}>
          <Text style={styles.badgeYellowText}>● UNLIMITED ALLOWANCE</Text>
        </View>

        <Text style={styles.body}>
          Kontrak ini meminta izin mengakses <Text style={styles.bold}>SELURUH</Text> saldo USDT kamu tanpa batas. Tetap lanjutkan dengan nominal terbatas?
        </Text>

        {address ? (
          <Text style={styles.monoMuted}>Spender: {shortenAddress(address)}</Text>
        ) : null}

        {/* Radio Option 1: Batasi Izin (Default Terpilih - FR-6.3) */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.radioBox,
            limitAllowance && styles.radioBoxActive,
          ]}
          onPress={() => setLimitAllowance(true)}>
          <MaterialCommunityIcons
            name={limitAllowance ? 'radiobox-marked' : 'radiobox-blank'}
            size={22}
            color={limitAllowance ? colors.emerald : colors.textMuted}
          />
          <View style={styles.radioTextWrap}>
            <Text style={styles.radioTitle}>
              Batasi Izin Sesuai Transaksi
            </Text>
            <Text style={styles.radioSub}>
              Hanya izinkan nominal yang kamu transfer sekarang (Direkomendasikan)
            </Text>
          </View>
        </TouchableOpacity>

        {/* Radio Option 2: Batalkan Transaksi */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.radioBox,
            !limitAllowance && styles.radioBoxActive,
          ]}
          onPress={() => setLimitAllowance(false)}>
          <MaterialCommunityIcons
            name={!limitAllowance ? 'radiobox-marked' : 'radiobox-blank'}
            size={22}
            color={!limitAllowance ? colors.bnbGold : colors.textMuted}
          />
          <View style={styles.radioTextWrap}>
            <Text style={styles.radioTitle}>Batalkan Transaksi</Text>
            <Text style={styles.radioSub}>
              Jangan berikan izin apa pun ke kontrak ini
            </Text>
          </View>
        </TouchableOpacity>

        <Button
          label={
            limitAllowance
              ? 'Lanjutkan dengan Batas Aman'
              : 'Batalkan Transaksi'
          }
          onPress={handleAllowanceAction}
          variant="primary"
          fullWidth
          style={styles.actionBtn}
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  badgeRed: {
    backgroundColor: `${colors.statusRed}22`,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  badgeRedText: {
    color: colors.statusRed,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeYellow: {
    backgroundColor: `${colors.statusYellow}22`,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  badgeYellowText: {
    color: colors.statusYellow,
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
  },
  monoRed: {
    fontSize: 13,
    color: colors.statusRed,
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  monoMuted: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'monospace',
    marginBottom: 14,
  },
  actionBtn: {
    marginTop: 14,
    marginBottom: 8,
  },
  riskLink: {
    paddingVertical: 8,
  },
  riskLinkText: {
    fontSize: 13,
    color: colors.statusRed,
    textDecorationLine: 'underline',
  },
  radioBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  radioBoxActive: {
    borderColor: colors.bnbGold,
    backgroundColor: `${colors.bnbGold}10`,
  },
  radioTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  radioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  radioSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
