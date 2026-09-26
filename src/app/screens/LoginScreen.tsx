import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import Button from '../../components/common/Button';
import type {RootStackParamList} from '../../types/navigation';
import {useAuthStore} from '../../stores/useAuthStore';
import {useToastStore} from '../../stores/useToastStore';
import {loginWithGoogle} from '../../services/particleService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const {login} = useAuthStore();
  const showToast = useToastStore(s => s.show);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userSession = await loginWithGoogle();
      login(userSession);
      showToast(`Selamat datang, ${userSession.name}!`, 'success');
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Login error:', error);
      showToast('Gagal masuk akun. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TUTUR</Text>
      <Text style={styles.tagline}>Transaksi kripto semudah</Text>
      <Text style={styles.tagline}>ngobrol biasa</Text>

      <Button
        label="Masuk dengan Google"
        onPress={handleLogin}
        variant="primary"
        loading={loading}
        disabled={loading}
        fullWidth
        style={styles.loginBtn}
      />

      <View style={styles.termsRow}>
        <MaterialCommunityIcons
          name="shield-check"
          size={14}
          color={colors.textMuted}
        />
        <Text style={styles.terms}>
          Tanpa seed phrase. Akun diamankan biometrik + MPC.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.bnbGold,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  loginBtn: {
    marginTop: 40,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 8,
  },
  terms: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    flexShrink: 1,
  },
});
