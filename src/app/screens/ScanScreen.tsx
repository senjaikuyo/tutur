import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../constants/theme';
import type {ScanStackParamList} from '../../types/navigation';
import {idrToUsdt} from '../../utils/formatters';

type Nav = NativeStackNavigationProp<ScanStackParamList, 'Scan'>;

export default function ScanScreen() {
  const navigation = useNavigation<Nav>();
  const [scanning] = useState(true);

  // TODO Fitur #10: integrasi kamera Vision Camera + ML Kit
  const handlePresetHosting = () => {
    navigation.navigate('Confirmation', {
      intent: {
        action: 'TRANSFER',
        recipient: null,
        token: 'USDT',
        amount: 15,
        amountInRupiah: null,
        confidence: 0.9,
        rawText: 'Tagihan Hosting $15',
        normalizedText: 'tagihan hosting $15',
        missingFields: ['recipient'],
      },
    });
  };

  const handlePresetCoffee = () => {
    navigation.navigate('Confirmation', {
      intent: {
        action: 'TRANSFER',
        recipient: null,
        token: 'USDT',
        amount: idrToUsdt(25000),
        amountInRupiah: 25000,
        confidence: 0.9,
        rawText: 'Struk Kopi Rp 25.000',
        normalizedText: 'struk kopi rp 25000',
        missingFields: ['recipient'],
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan QR</Text>

      {/* Camera viewfinder placeholder */}
      <View style={styles.viewfinder}>
        <View style={styles.frame}>
          <Text style={styles.frameText}>
            {scanning ? 'KAMERA AKTIF' : 'VIEWFINDER'}
          </Text>
        </View>
      </View>

      <Text style={styles.hint}>
        Arahkan kamera ke QR code alamat wallet
      </Text>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>atau bayar tagihan</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Preset buttons */}
      <TouchableOpacity style={styles.presetBtn} onPress={handlePresetHosting}>
        <Text style={styles.presetText}>Tagihan Hosting $15</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.presetBtn} onPress={handlePresetCoffee}>
        <Text style={styles.presetText}>Struk Kopi Rp 25.000</Text>
      </TouchableOpacity>
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
  viewfinder: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  frame: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderColor: colors.bnbGold,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 12,
  },
  presetBtn: {
    borderWidth: 1,
    borderColor: colors.bnbGold,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.bnbGold,
  },
});
