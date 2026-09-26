import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {colors} from '../../constants/theme';

export default function SplashScreen() {
  return (
    <View
      className="flex-1 items-center justify-center bg-bg-primary">
      <Text
        className="text-3xl font-bold text-bnb-gold mb-2">
        TUTUR
      </Text>
      <Text className="text-sm text-text-secondary mb-8">
        Dompet Kripto Bahasa Sehari-hari
      </Text>
      <ActivityIndicator size="large" color={colors.bnbGold} />
    </View>
  );
}
