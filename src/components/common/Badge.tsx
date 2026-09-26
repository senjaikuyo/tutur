import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../constants/theme';

export type BadgeColor = 'green' | 'yellow' | 'red' | 'gray';

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  dot?: boolean;
}

const colorMap: Record<BadgeColor, string> = {
  green: colors.statusGreen,
  yellow: colors.statusYellow,
  red: colors.statusRed,
  gray: colors.textMuted,
};

export default function Badge({label, color = 'green', dot = false}: BadgeProps) {
  const c = colorMap[color];
  return (
    <View style={[styles.container, {backgroundColor: `${c}22`}]}>
      {dot && <View style={[styles.dot, {backgroundColor: c}]} />}
      <Text style={[styles.label, {color: c}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
