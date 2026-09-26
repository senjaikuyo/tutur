import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../constants/theme';
import type {RootStackParamList} from '../../types/navigation';
import {useAuthStore} from '../../stores/useAuthStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const {isAuthenticated, checkSessionExpiry} = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const isExpired = checkSessionExpiry();
      if (isAuthenticated && !isExpired) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, checkSessionExpiry]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TUTUR</Text>
      <Text style={styles.subtitle}>Dompet Kripto Bahasa Sehari-hari</Text>
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size="large" color={colors.bnbGold} />
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
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.bnbGold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  spinnerWrapper: {
    marginTop: 8,
  },
});
