import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, checkSessionExpiry]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
});
