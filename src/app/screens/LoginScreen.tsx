import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Image} from 'react-native';
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

  // Animasi mengambang halus (gentle floating) untuk logo
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in seluruh elemen halaman
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

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
  }, [fadeAnim, floatAnim]);

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
      <Animated.View style={[styles.contentWrap, {opacity: fadeAnim}]}>
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
            size={16}
            color={colors.bnbGold}
          />
          <Text style={styles.terms}>
            Tanpa seed phrase • Akun diamankan biometrik & MPC
          </Text>
        </View>
      </Animated.View>
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
    marginTop: 8,
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
