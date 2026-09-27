import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';

interface VoiceButtonProps {
  onPressIn: () => void;
  onPressOut: () => void;
  disabled?: boolean;
}

export default function VoiceButton({
  onPressIn,
  onPressOut,
  disabled = false,
}: VoiceButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      disabled={disabled}
      className="w-16 h-16 rounded-full bg-bnb-gold items-center justify-center mb-1"
      style={disabled ? styles.disabled : undefined}>
      <MaterialCommunityIcons name="microphone" size={28} color={colors.bgPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
