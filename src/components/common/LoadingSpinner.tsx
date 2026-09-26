import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {colors} from '../../constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingSpinner({
  size = 'large',
  color = colors.bnbGold,
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
