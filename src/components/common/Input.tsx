import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import {colors} from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: boolean;
  suffix?: string;
  hint?: string;
}

export default function Input({
  label,
  error = false,
  suffix,
  hint,
  style,
  ...rest
}: InputProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          {...rest}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  suffix: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
