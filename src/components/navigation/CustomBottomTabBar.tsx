import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';

export default function CustomBottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;
          const isCenterScan = route.name === 'ScanTab';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Tampilan Tombol Scan di Tengah (Elevated Protruding Rounded Button ala GoPay - Gambar 1)
          if (isCenterScan) {
            return (
              <View key={route.key} style={styles.centerItemWrapper}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onPress}
                  style={styles.scanElevatedButtonOuter}>
                  <View style={styles.scanElevatedButtonInner}>
                    <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.scanLabel,
                    isFocused ? styles.labelFocused : styles.labelUnfocused,
                  ]}>
                  Scan
                </Text>
              </View>
            );
          }

          // Icon mapper
          let iconName = 'circle';
          let labelText = 'Tab';

          if (route.name === 'HomeTab') {
            iconName = isFocused ? 'home-variant' : 'home-variant-outline';
            labelText = 'Beranda';
          } else if (route.name === 'ChatTab') {
            iconName = isFocused
              ? 'chat-processing'
              : 'chat-processing-outline';
            labelText = 'Chat';
          } else if (route.name === 'HistoryTab') {
            iconName = isFocused ? 'history' : 'history';
            labelText = 'Riwayat';
          } else if (route.name === 'ProfileTab') {
            iconName = isFocused ? 'account-circle' : 'account-circle-outline';
            labelText = 'Profil';
          }

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tabItem}>
              {/* Highlight Pill saat Tab Aktif (Seperti di Referensi Gambar 1) */}
              <View
                style={[
                  styles.iconWrap,
                  isFocused && styles.iconWrapActive,
                ]}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={isFocused ? colors.gopayBlue : colors.textMuted}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.labelFocused : styles.labelUnfocused,
                ]}>
                {labelText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#121A24',
    borderTopWidth: 1,
    borderTopColor: '#1E2D3D',
    height: 68,
    paddingBottom: 6,
    paddingTop: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#163148',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  labelFocused: {
    color: '#FFFFFF',
  },
  labelUnfocused: {
    color: '#8A99A8',
  },
  centerItemWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    height: '100%',
  },
  scanElevatedButtonOuter: {
    position: 'absolute',
    top: -22,
    width: 66,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0E2235',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gopayBlue,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#1D3B55',
  },
  scanElevatedButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.gopayBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 22,
  },
});
