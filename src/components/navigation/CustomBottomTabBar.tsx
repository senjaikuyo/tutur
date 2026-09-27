import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';

export default function CustomBottomTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <View style={styles.tabBarContainer}>
      <View style={[styles.tabBar, {paddingBottom: bottomPadding, height: 60 + bottomPadding}]}>
        {state.routes.map((route, index) => {
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

          // Tampilan Tombol Scan di Tengah (Elevated Protruding Button beraksen Binance Gold / Emas)
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
                      color="#0F131A"
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
              {/* Ikon Tab Bersih Tanpa Kotak Kaku */}
              <MaterialCommunityIcons
                name={iconName}
                size={23}
                color={isFocused ? colors.bnbGold : '#848E9C'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.labelFocused : styles.labelUnfocused,
                ]}>
                {labelText}
              </Text>

              {/* Indikator Titik/Garis Halus Emas saat Aktif (Elegan & Rapi) */}
              {isFocused ? <View style={styles.activeIndicatorPill} /> : <View style={styles.inactiveIndicatorPlaceholder} />}
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
    backgroundColor: '#121620',
    borderTopWidth: 1,
    borderTopColor: '#222938',
    paddingTop: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  labelFocused: {
    color: colors.bnbGold,
    fontWeight: '700',
  },
  labelUnfocused: {
    color: '#848E9C',
  },
  activeIndicatorPill: {
    width: 14,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: colors.bnbGold,
    marginTop: 3,
  },
  inactiveIndicatorPlaceholder: {
    width: 14,
    height: 2.5,
    marginTop: 3,
  },
  centerItemWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingBottom: 2,
  },
  scanElevatedButtonOuter: {
    position: 'absolute',
    top: -22,
    width: 62,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1F1A08',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.bnbGold,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#3D3310',
  },
  scanElevatedButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.bnbGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 22,
  },
});
