import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../constants/theme';
import {getInitials} from '../../utils/formatters';
import BalanceCard from '../../components/home/BalanceCard';
import VoiceButton from '../../components/home/VoiceButton';
import RecentTransactions from '../../components/home/RecentTransactions';
import type {HomeStackParamList} from '../../types/navigation';
import {useToastStore} from '../../stores/useToastStore';
import {useAuthStore} from '../../stores/useAuthStore';
import {useTransactionStore} from '../../stores/useTransactionStore';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const FALLBACK_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const rootNav = useNavigation<{
    navigate: (screen: string, params?: object) => void;
  }>();
  const showToast = useToastStore(s => s.show);
  const {user, refreshActivity} = useAuthStore();
  const {recentTransactions} = useTransactionStore();

  const userAddress = user?.smartAccountAddress || FALLBACK_ADDRESS;
  const userName = user?.name || 'Pengguna';

  const handlePressIn = () => {
    refreshActivity();
    rootNav.navigate('VoiceOverlay');
  };

  const handlePressOut = () => {
    // Selesai recording via VoiceOverlay
  };

  const handleFaucet = () => {
    refreshActivity();
    showToast('Permintaan 100 USDT Faucet sedang diproses...', 'info');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLogo}>TUTUR</Text>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => rootNav.navigate('ProfileTab')}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </TouchableOpacity>
        </View>

        <BalanceCard
          balance={0}
          address={userAddress}
          onFaucet={handleFaucet}
        />

        <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
        <RecentTransactions transactions={recentTransactions} />
      </ScrollView>

      {/* Mic Button */}
      <View style={styles.micWrapper}>
        <VoiceButton onPressIn={handlePressIn} onPressOut={handlePressOut} />
        <Text style={styles.micHint}>Tekan & tahan untuk bicara</Text>
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
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLogo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.bnbGold,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  micWrapper: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  micHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
