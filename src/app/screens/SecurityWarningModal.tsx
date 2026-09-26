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

type Nav = NativeStackNavigationProp<RootStackParamList, 'SecurityWarningModal'>;
type Route = RouteProp<RootStackParamList, 'SecurityWarningModal'>;

export default function SecurityWarningModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const type = route.params?.type ?? 'blacklist';
  const address = route.params?.address ?? '';
  const [limit, setLimit] = useState(true);

  const close = () => navigation.goBack();

  if (type === 'blacklist') {
    return (
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="alert-triangle"
            size={40}
            color={colors.statusRed}
            style={styles.icon}
          />
          <Text style={[styles.title, {color: colors.statusRed}]}>
            PERINGATAN
          </Text>

          <View style={styles.badgeRed}>
            <Text style={styles.badgeRedText}>● BERBAHAYA</Text>
          </View>

          <Text style={styles.body}>
            Alamat tujuan terdata sebagai alamat yang dilaporkan terlibat
            penipuan.
          </Text>
          <Text style={styles.monoRed}>{shortenAddress(address)}</Text>
          <Text style={[styles.body, styles.bold, {color: colors.statusRed}]}>
            Transaksi DIBLOKIR demi keamanan kamu.
          </Text>

          <Button
            label="Saya paham risikonya, lanjutkan"
            onPress={close}
            variant="danger"
            fullWidth
            style={styles.actionBtn}
          />
          <Button
            label="Batalkan (aman)"
            onPress={close}
            variant="primary"
            fullWidth
          />
        </View>
      </View>
    );
  }

  // unlimited_allowance
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <MaterialCommunityIcons
          name="alert-outline"
          size={40}
          color={colors.statusYellow}
          style={styles.icon}
        />
        <Text style={[styles.title, {color: colors.statusYellow}]}>
          Perhatian
        </Text>

        <View style={styles.badgeYellow}>
          <Text style={styles.badgeYellowText}>● PERIKSA</Text>
        </View>

        <Text style={styles.body}>
          Kontrak ini meminta izin mengakses SELURUH saldo USDT kamu tanpa
          batas.
        </Text>

        {/* Radio options */}
        <TouchableOpacity
          style={styles.radioRow}
          onPress={() => setLimit(true)}>
          <MaterialCommunityIcons
            name={limit ? 'radiobox-marked' : 'radiobox-blank'}
            size={22}
            color={limit ? colors.emerald : colors.textMuted}
          />
          <Text style={styles.radioText}>Batasi izin sesuai transaksi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioRow}
          onPress={() => setLimit(false)}>
          <MaterialCommunityIcons
            name={!limit ? 'radiobox-marked' : 'radiobox-blank'}
            size={22}
            color={!limit ? colors.emerald : colors.textMuted}
          />
          <Text style={styles.radioText}>Batalkan transaksi</Text>
        </TouchableOpacity>

        <Button
          label={limit ? 'Lanjutkan' : 'Batalkan Transaksi'}
          onPress={close}
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
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  badgeRed: {
    backgroundColor: `${colors.statusRed}22`,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  badgeRedText: {
    color: colors.statusRed,
    fontSize: 13,
    fontWeight: '700',
  },
  badgeYellow: {
    backgroundColor: `${colors.statusYellow}22`,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  badgeYellowText: {
    color: colors.statusYellow,
    fontSize: 13,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
  },
  monoRed: {
    fontSize: 14,
    color: colors.statusRed,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  actionBtn: {
    marginTop: 16,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 12,
  },
  radioText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
  },
});
