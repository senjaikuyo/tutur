import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface FeatureItem {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  iconBgColor?: string;
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
            {/* Clean Icon Box Tanpa Badge Menumpuk */}
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
            </View>

            {/* Label Layanan Rapi & Minimalis */}
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
    backgroundColor: '#181E28',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#263040',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
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
    backgroundColor: '#222936',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D3747',
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DCE5EE',
    textAlign: 'center',
    lineHeight: 15,
  },
});
