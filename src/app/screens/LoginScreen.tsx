import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
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

  // Animasi mengambang halus (gentle floating) untuk logo
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animasi mengambang naik-turun halus logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatAnim]);

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
      <View style={styles.contentWrap}>
        {/* Logo Pixel Art dengan animasi floating lembut */}
        <Animated.View
          style={[
            styles.logoWrap,
            {transform: [{translateY: floatAnim}]},
          ]}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.brandTitle}>tutur</Text>

        {/* Sapaan Ramah & Interaktif */}
        <View style={styles.greetingBox}>
          <Text style={styles.welcomeText}>Halo, selamat datang di aplikasi tutur 👋</Text>
          <Text style={styles.subWelcomeText}>
            Kelola transaksi kripto di jaringan opBNB semudah ngobrol santai sehari-hari.
          </Text>
        </View>

        {/* Tombol Masuk dengan Google */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogin}
          disabled={loading}
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}>
          <MaterialCommunityIcons
            name="google"
            size={20}
            color="#0B0E14"
            style={styles.googleIcon}
          />
          <Text style={styles.loginBtnText}>
            {loading ? 'Menghubungkan...' : 'Masuk dengan Google'}
          </Text>
        </TouchableOpacity>

        <View style={styles.termsRow}>
          <MaterialCommunityIcons
            name="shield-check"
            size={16}
            color={colors.bnbGold}
          />
          <Text style={styles.terms}>
            Tanpa seed phrase • Akun diamankan biometrik & MPC
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B0E14',
    paddingHorizontal: 24,
  },
  contentWrap: {
    width: '100%',
    alignItems: 'center',
  },
  logoWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 84,
    height: 84,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.bnbGold,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  greetingBox: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  welcomeText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subWelcomeText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  loginBtn: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.bnbGold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 4,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    marginRight: 8,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0E14',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 8,
  },
  terms: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    flexShrink: 1,
  },
});
