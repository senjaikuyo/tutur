import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import {useAuthStore} from '../../stores/useAuthStore';
import {useTransactionStore} from '../../stores/useTransactionStore';
import {useToastStore} from '../../stores/useToastStore';
import {formatIdr, usdtToIdr, idrToUsdt} from '../../utils/formatters';
import FeatureGrid, {FeatureItem} from '../../components/home/FeatureGrid';
import ContactShortcuts, {
  ShortcutContact,
} from '../../components/home/ContactShortcuts';

const FALLBACK_ADDRESS = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';

export default function HomeScreen() {
  const rootNav = useNavigation<any>();
  const showToast = useToastStore(s => s.show);

  const {user, refreshActivity} = useAuthStore();
  const {
    balance,
    claimFaucet,
    faucetLoading,
    faucetCooldown,
    refreshBalance,
  } = useTransactionStore();

  const [showBalance, setShowBalance] = useState(true);

  const userAddress = user?.smartAccountAddress || FALLBACK_ADDRESS;

  useEffect(() => {
    if (userAddress) {
      refreshBalance(userAddress);
    }
  }, [userAddress, refreshBalance]);

  const handleTopUp = async () => {
    refreshActivity();
    if (faucetCooldown > 0) {
      showToast(`Tunggu cooldown ${faucetCooldown} detik...`, 'info');
      return;
    }

    showToast('Meminta 100 USDT Faucet via opBNB Paymaster...', 'info');
    const success = await claimFaucet(userAddress);
    if (success) {
      showToast('100 USDT berhasil ditambahkan ke saldo!', 'success');
    }
  };

  const handleHelp = () => {
    refreshActivity();
    rootNav.navigate('Faq');
  };

  const handleSelectContact = (contact: ShortcutContact) => {
    refreshActivity();
    rootNav.navigate('QuickFillModal', {
      intent: {
        action: 'TRANSFER',
        recipient: contact.bnsName || contact.recipientAddress,
        token: 'USDT',
        amount: null,
        confidence: 0.8,
        rawText: `Kirim ke ${contact.name}`,
        normalizedText: `kirim ke ${contact.name.toLowerCase()}`,
        missingFields: ['amount'],
      },
    });
  };

  const handleMoreContacts = () => {
    refreshActivity();
    rootNav.navigate('QuickFillModal', {intent: {}});
  };

  const balanceInRupiah = usdtToIdr(balance);

  // 8 Fitur Utama Grid Beranda (Konsisten Tema Dark Emas/Oren Binance, Bersih Tanpa Stiker)
  const features: FeatureItem[] = [
    {
      id: 'transfer',
      label: 'Transfer',
      icon: 'send',
      iconColor: colors.bnbGold,
      onPress: () => {
        refreshActivity();
        rootNav.navigate('QuickFillModal', {intent: {}});
      },
    },
    {
      id: 'faucet',
      label: 'Minta\nSaldo',
      icon: 'cash-plus',
      iconColor: colors.emerald,
      onPress: handleTopUp,
    },
    {
      id: 'data',
      label: 'Paket\nData',
      icon: 'cellphone-wireless',
      iconColor: colors.bnbOrange,
      onPress: () => {
        refreshActivity();
        showToast('Fitur Paket Data akan hadir di update berikutnya', 'info');
      },
    },
    {
      id: 'pulsa',
      label: 'Pulsa',
      icon: 'cellphone-message',
      iconColor: '#38BDF8',
      onPress: () => {
        refreshActivity();
        showToast('Fitur Pulsa akan hadir di update berikutnya', 'info');
      },
    },
    {
      id: 'pln',
      label: 'Token\nPLN',
      icon: 'flash',
      iconColor: '#FACC15',
      onPress: () => {
        refreshActivity();
        showToast(
          'Fitur Token Listrik PLN akan hadir di update berikutnya',
          'info',
        );
      },
    },
    {
      id: 'hosting',
      label: 'Tagihan\nHosting',
      icon: 'server',
      iconColor: '#A78BFA',
      onPress: () => {
        refreshActivity();
        rootNav.navigate('HomeTab', {
          screen: 'Confirmation',
          params: {
            intent: {
              action: 'TRANSFER',
              recipient: 'warung.bnb',
              token: 'USDT',
              amount: 15,
              amountInRupiah: null,
              confidence: 1.0,
              rawText: 'Tagihan Hosting $15',
              normalizedText: 'tagihan hosting 15 usdt',
              missingFields: [],
            },
          },
        });
      },
    },
    {
      id: 'kopi',
      label: 'Struk Kopi',
      icon: 'coffee',
      iconColor: '#F97316',
      onPress: () => {
        refreshActivity();
        const usdtAmount = idrToUsdt(25000);
        rootNav.navigate('HomeTab', {
          screen: 'Confirmation',
          params: {
            intent: {
              action: 'TRANSFER',
              recipient: 'warung.bnb',
              token: 'USDT',
              amount: usdtAmount,
              amountInRupiah: 25000,
              confidence: 1.0,
              rawText: 'Struk Kopi Rp 25.000',
              normalizedText: 'struk kopi rp 25000',
              missingFields: [],
            },
          },
        });
      },
    },
    {
      id: 'all',
      label: 'Lihat\nsemua',
      icon: 'dots-grid',
      iconColor: '#94A3B8',
      onPress: () => {
        refreshActivity();
        showToast('Semua layanan utama sudah tersedia di Beranda', 'info');
      },
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* ============================================================ */}
        {/* 1. HEADER & HERO SALDO (Konsisten Emas/Oren Binance)          */}
        {/* ============================================================ */}
        <View style={styles.heroSection}>
          {/* Top Bar: Murni Logo tutur Emas di Kiri, Tombol Bantuan di Kanan */}
          <View style={styles.topBar}>
            <Text style={styles.logoText}>tutur</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleHelp}
              style={styles.helpButton}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={22}
                color={colors.bnbGold}
              />
            </TouchableOpacity>
          </View>

          {/* Area Saldo Utama & Tombol Top Up */}
          <View style={styles.balanceArea}>
            {/* Sisi Kiri: Saldo Besar */}
            <View style={styles.balanceInfo}>
              <View style={styles.balanceRow}>
                <Text style={styles.currencyPrefix}>Rp</Text>
                <Text style={styles.mainBalance}>
                  {showBalance
                    ? formatIdr(balanceInRupiah).replace('Rp ', '')
                    : '••••••••'}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowBalance(!showBalance)}
                  style={styles.eyeBtn}>
                  <MaterialCommunityIcons
                    name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.cryptoEquiv}>
                {showBalance
                  ? `≈ ${balance.toFixed(2)} USDT di opBNB`
                  : 'Saldo disembunyikan'}
              </Text>
            </View>

            {/* Sisi Kanan: Tombol Top Up Emas/Oren Binance */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleTopUp}
              disabled={faucetCooldown > 0 || faucetLoading}
              style={[
                styles.topUpButton,
                (faucetCooldown > 0 || faucetLoading) && styles.topUpDisabled,
              ]}>
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color="#0B0E14"
              />
              <Text style={styles.topUpText}>
                {faucetLoading
                  ? 'Proses...'
                  : faucetCooldown > 0
                  ? `${faucetCooldown}s`
                  : 'Top up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. BODY: GRID FITUR & KONTAK CEPAT (Rounded Surface)          */}
        {/* ============================================================ */}
        <View style={styles.bodyContent}>
          {/* 8 Grid Fitur */}
          <FeatureGrid features={features} />

          {/* Shortcut Kontak */}
          <ContactShortcuts
            onSelectContact={handleSelectContact}
            onPressMore={handleMoreContacts}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  /* Hero Header Saldo beraksen Binance Dark Gold */
  heroSection: {
    backgroundColor: '#181E28',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#263040',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.bnbGold,
    letterSpacing: 0.5,
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#202836',
    borderWidth: 1,
    borderColor: '#2D3747',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Saldo Utama & Top Up */
  balanceArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.bnbGold,
  },
  mainBalance: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  eyeBtn: {
    marginLeft: 6,
    padding: 2,
    alignSelf: 'center',
  },
  cryptoEquiv: {
    fontSize: 12,
    color: '#8C9BAA',
    marginTop: 2,
    fontWeight: '500',
  },
  topUpButton: {
    backgroundColor: colors.bnbGold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 22,
    shadowColor: colors.bnbGold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  topUpDisabled: {
    opacity: 0.6,
  },
  topUpText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0E14',
  },
  bodyContent: {
    padding: 16,
    paddingTop: 18,
  },
});
