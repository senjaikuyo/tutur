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
import {formatIdr, usdtToIdr} from '../../utils/formatters';

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

  const handleSecurityCheck = () => {
    refreshActivity();
    rootNav.navigate('SecurityWarningModal', {
      type: 'blacklist',
      address: userAddress,
    });
  };

  const handleHelp = () => {
    refreshActivity();
    showToast(
      'TUTUR: Dompet Kripto Bahasa Sehari-hari di opBNB. Gunakan tombol Scan atau Chat untuk transaksi.',
      'info',
    );
  };

  const balanceInRupiah = usdtToIdr(balance);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* ============================================================ */}
        {/* 1. HEADER & HERO SALDO (Gaya GoPay x TUTUR - Referensi Gambar 2) */}
        {/* ============================================================ */}
        <View style={styles.heroSection}>
          {/* Top Bar: Logo & Keamanan / Bantuan */}
          <View style={styles.topBar}>
            {/* Logo Kiri Atas */}
            <View style={styles.logoRow}>
              <View style={styles.logoIconBg}>
                <MaterialCommunityIcons
                  name="wallet"
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.logoText}>tutur</Text>
            </View>

            {/* Kanan Atas: Indikator Keamanan Akun & Tombol Bantuan */}
            <View style={styles.topRightActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSecurityCheck}
                style={styles.securityBadge}>
                <View style={styles.securityPill}>
                  <Text style={styles.securityPercent}>80%</Text>
                </View>
                <Text style={styles.securityText}>Akun terlindungi</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={14}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleHelp}
                style={styles.helpButton}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Area Saldo Utama & Tombol Top Up (Tanpa Tarik Tunai, Tanpa Poin) */}
          <View style={styles.balanceArea}>
            {/* Sisi Kiri: Saldo Besar */}
            <View style={styles.balanceInfo}>
              <View style={styles.balanceRow}>
                <Text style={styles.currencyPrefix}>Rp</Text>
                <Text style={styles.mainBalance}>
                  {showBalance ? formatIdr(balanceInRupiah).replace('Rp ', '') : '••••••••'}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowBalance(!showBalance)}
                  style={styles.eyeBtn}>
                  <MaterialCommunityIcons
                    name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.cryptoEquiv}>
                {showBalance
                  ? `≈ ${balance.toFixed(2)} USDT di opBNB`
                  : 'Saldo disembunyikan'}
              </Text>
            </View>

            {/* Sisi Kanan: HANYA Tombol Top Up */}
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
                color="#FFFFFF"
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

        {/* Placeholder container untuk Tahap 3 (Grid Fitur) & Tahap 4 (Kontak) */}
        <View style={styles.bodyContent}>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>
              Grid Fitur (Tahap 3) akan dimuat di sini...
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1118',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  /* Hero Header Saldo bergaya GoPay */
  heroSection: {
    backgroundColor: '#08486A',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00AED6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 8,
    gap: 6,
  },
  securityPill: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  securityPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  securityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
    color: '#FFFFFF',
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
    color: '#D1EBF6',
    marginTop: 2,
    fontWeight: '500',
  },
  topUpButton: {
    backgroundColor: '#00AED6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  topUpDisabled: {
    opacity: 0.6,
  },
  topUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bodyContent: {
    padding: 16,
  },
  placeholderCard: {
    backgroundColor: '#131D28',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1D2C3D',
  },
  placeholderText: {
    fontSize: 13,
    color: '#6E8294',
    fontStyle: 'italic',
  },
});
