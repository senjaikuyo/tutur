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

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

// TODO Fitur #3 & #7: ganti dengan data nyata dari store + on-chain
const MOCK_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const rootNav = useNavigation<{
    navigate: (screen: string, params?: object) => void;
  }>();
  const showToast = useToastStore(s => s.show);

  const handlePressIn = () => {
    // TODO Fitur #5: mulai rekam audio sungguhan, lalu buka VoiceOverlay
    rootNav.navigate('VoiceOverlay');
  };

  const handlePressOut = () => {
    // Rekaman dihentikan di dalam VoiceOverlay (Fitur #5)
  };

  const handleFaucet = () => {
    // TODO Fitur #7: mint 100 USDT via Smart Account
    showToast('Fitur faucet akan hadir di langkah berikutnya', 'info');
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
            <Text style={styles.avatarText}>{getInitials('Afif')}</Text>
          </TouchableOpacity>
        </View>

        <BalanceCard
          balance={0}
          address={MOCK_ADDRESS}
          onFaucet={handleFaucet}
        />

        <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
        <RecentTransactions transactions={[]} />
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
