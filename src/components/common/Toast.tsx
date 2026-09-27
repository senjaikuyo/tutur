import React from 'react';
import {Text, StyleSheet, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../constants/theme';
import {useToastStore, ToastType} from '../../stores/useToastStore';

const bgMap: Record<ToastType, string> = {
  success: colors.emerald,
  error: colors.error,
  info: colors.bnbGold,
};

export default function Toast() {
  const {visible, message, type} = useToastStore();
  const insets = useSafeAreaInsets();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  if (!visible) {
    return null;
  }

  const textColor = type === 'info' ? colors.bgPrimary : colors.textPrimary;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          bottom: insets.bottom + 80,
          backgroundColor: bgMap[type],
          opacity,
        },
      ]}>
      <Text style={[styles.text, {color: textColor}]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
