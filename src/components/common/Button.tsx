import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors} from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: colors.bnbGold,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.bnbGold,
  },
  danger: {
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  labelBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  labelPrimary: {
    color: colors.bgPrimary,
  },
  labelSecondary: {
    color: colors.bnbGold,
  },
  labelDanger: {
    color: colors.statusRed,
  },
  labelGhost: {
    color: colors.textSecondary,
  },
});

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const labelColorMap: Record<ButtonVariant, string> = {
    primary: colors.bgPrimary,
    secondary: colors.bnbGold,
    danger: colors.statusRed,
    ghost: colors.textSecondary,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.bgPrimary : colors.bnbGold}
        />
      ) : (
        <Text
          style={[
            styles.labelBase,
            {color: labelColorMap[variant]},
            textStyle,
          ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
