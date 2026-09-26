import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default function Card({children, elevated = false, style}: CardProps) {
  return (
    <View style={[styles.base, elevated && styles.elevated, style]}>
      {children}
    </View>
  );
}
