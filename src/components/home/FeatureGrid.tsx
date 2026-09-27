import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';

export interface FeatureItem {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  iconBgColor?: string;
  badge?: {
    text: string;
    bgColor: string;
    textColor: string;
  };
  onPress: () => void;
}

interface FeatureGridProps {
  features: FeatureItem[];
}

export default function FeatureGrid({features}: FeatureGridProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.grid}>
        {features.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={item.onPress}
            style={styles.gridItem}>
            {/* Icon Box with optional mini badge tag ala GoPay (Gambar 2) */}
            <View
              style={[
                styles.iconBox,
                item.iconBgColor ? {backgroundColor: item.iconBgColor} : undefined,
              ]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={26}
                color={item.iconColor}
              />

              {/* Tag Mini Badge (Contoh: MURAAAH / GRATIS GAS) */}
              {item.badge && (
                <View
                  style={[
                    styles.tagBadge,
                    {backgroundColor: item.badge.bgColor},
                  ]}>
                  <Text
                    style={[
                      styles.tagBadgeText,
                      {color: item.badge.textColor},
                    ]}>
                    {item.badge.text}
                  </Text>
                </View>
              )}
            </View>

            {/* Label Layanan */}
            <Text style={styles.itemLabel} numberOfLines={2}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#121C27',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1D2D3E',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1A2737',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#24374D',
  },
  tagBadge: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0D1722',
  },
  tagBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DCE5EE',
    textAlign: 'center',
    lineHeight: 15,
  },
});
