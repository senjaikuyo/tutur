import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import type {ScanStackParamList} from '../../types/navigation';
import {idrToUsdt} from '../../utils/formatters';
import {parseQRContent} from '../../utils/qrParser';
import {useToastStore} from '../../stores/useToastStore';

type Nav = NativeStackNavigationProp<ScanStackParamList, 'Scan'>;

export default function ScanScreen() {
  const navigation = useNavigation<Nav>();
  const showToast = useToastStore(s => s.show);

  // Animasi laser viewfinder scan
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 180,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scanLineAnim]);

  const handleProcessQR = (qrText: string) => {
    const result = parseQRContent(qrText);

    if (!result.valid || !result.address) {
      showToast(
        result.errorMessage || 'QR tidak dikenali sebagai alamat wallet',
        'error',
      );
      return;
    }

    showToast(`QR Berhasil: ${result.label || result.address}`, 'success');

    navigation.navigate('Confirmation', {
      intent: {
        action: 'TRANSFER',
        recipient: result.label || result.address,
        token: result.token || 'USDT',
        amount: result.amount || 10, // Default 10 USDT jika QR hanya berisi alamat
        amountInRupiah: null,
        confidence: 0.95,
        rawText: `Scan QR: ${result.label || result.address}`,
        normalizedText: `scan qr ${result.label || result.address}`,
        missingFields: [],
      },
    });
  };

  // FR-5.3: Preset Invoice Demo
  const handlePresetHosting = () => {
    navigation.navigate('Confirmation', {
      intent: {
        action: 'TRANSFER',
        recipient: 'warung.bnb',
        token: 'USDT',
        amount: 15,
        amountInRupiah: null,
        confidence: 1.0,
        rawText: 'Tagihan Hosting $15 (Preset OCR)',
        normalizedText: 'tagihan hosting 15 usdt',
        missingFields: [],
      },
    });
  };

  const handlePresetCoffee = () => {
    const usdtAmount = idrToUsdt(25000); // 25.000 / 17916 ≈ 1.40 USDT
    navigation.navigate('Confirmation', {
      intent: {
        action: 'TRANSFER',
        recipient: 'warung.bnb',
        token: 'USDT',
        amount: usdtAmount,
        amountInRupiah: 25000,
        confidence: 1.0,
        rawText: 'Struk Kopi Rp 25.000 (Preset OCR)',
        normalizedText: 'struk kopi rp 25000',
        missingFields: [],
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan QR & Tagihan</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Camera Viewfinder */}
        <View style={styles.viewfinder}>
          <View style={styles.frame}>
            {/* Sudut-sudut frame emas */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Laser scanning bar animasi */}
            <Animated.View
              style={[
                styles.scanLine,
                {transform: [{translateY: scanLineAnim}]},
              ]}
            />

            <MaterialCommunityIcons
              name="qrcode-scan"
              size={54}
              color={`${colors.bnbGold}66`}
            />
          </View>
        </View>

        <Text style={styles.hint}>
          Arahkan kamera ke QR code alamat BNB Chain / opBNB
        </Text>

        {/* Demo Fast Scan Targets untuk Pengujian Juri / Tester */}
        <View style={styles.testSection}>
          <Text style={styles.testTitle}>Uji Coba Scan QR Cepat:</Text>
          <View style={styles.testBtnRow}>
            <TouchableOpacity
              style={styles.testChip}
              onPress={() => handleProcessQR('ethereum:budi.bnb')}>
              <Text style={styles.testChipText}>QR budi.bnb</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testChip}
              onPress={() =>
                handleProcessQR('ethereum:0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
              }>
              <Text style={styles.testChipText}>QR Alamat Hex</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testChip, styles.testChipDanger]}
              onPress={() =>
                handleProcessQR('0xdEAD000000000000000000000000000000000000')
              }>
              <Text style={[styles.testChipText, {color: colors.statusRed}]}>
                QR Blacklist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testChip, {borderColor: colors.statusYellow}]}
              onPress={() => {
                navigation.navigate('Confirmation', {
                  intent: {
                    action: 'TRANSFER',
                    recipient: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
                    token: 'USDT',
                    amount: 50,
                    amountInRupiah: null,
                    confidence: 0.9,
                    rawText: 'Approve USDT (Unlimited Allowance)',
                    normalizedText: 'approve unlimited usdt',
                    missingFields: [],
                    isUnlimitedAllowance: true,
                  },
                });
              }}>
              <Text style={[styles.testChipText, {color: colors.statusYellow}]}>
                Demo Unlimited Allowance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testChip, {borderColor: colors.border}]}
              onPress={() => handleProcessQR('https://google.com/bukan-wallet')}>
              <Text style={[styles.testChipText, {color: colors.textMuted}]}>
                QR Invalid
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>atau bayar tagihan (Preset OCR)</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Preset OCR Buttons (FR-5.3) */}
        <TouchableOpacity
          style={styles.presetBtn}
          activeOpacity={0.8}
          onPress={handlePresetHosting}>
          <View style={styles.presetIconWrap}>
            <MaterialCommunityIcons
              name="server"
              size={22}
              color={colors.bnbGold}
            />
          </View>
          <View style={styles.presetTextWrap}>
            <Text style={styles.presetTitle}>Tagihan Hosting $15</Text>
            <Text style={styles.presetSub}>
              Penerima: warung.bnb • 15.00 USDT
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.presetBtn}
          activeOpacity={0.8}
          onPress={handlePresetCoffee}>
          <View style={styles.presetIconWrap}>
            <MaterialCommunityIcons
              name="coffee"
              size={22}
              color={colors.bnbGold}
            />
          </View>
          <View style={styles.presetTextWrap}>
            <Text style={styles.presetTitle}>Struk Kopi Rp 25.000</Text>
            <Text style={styles.presetSub}>
              Penerima: warung.bnb • ≈ 1.40 USDT
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
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
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  viewfinder: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  frame: {
    width: 190,
    height: 190,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.bnbGold,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: colors.bnbGold,
    shadowColor: colors.bnbGold,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  testSection: {
    marginBottom: 20,
  },
  testTitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 8,
  },
  testBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  testChip: {
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  testChipDanger: {
    borderColor: `${colors.statusRed}66`,
  },
  testChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 10,
  },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  presetIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.bnbGold}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  presetTextWrap: {
    flex: 1,
  },
  presetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  presetSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
