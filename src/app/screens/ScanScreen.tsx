import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default function ScanScreen() {
  return (
    <View className="flex-1 bg-bg-primary px-4 pt-4">
      <Text className="text-xl font-semibold text-text-primary mb-4">
        Scan QR
      </Text>

      {/* Camera Placeholder */}
      <View className="bg-bg-secondary rounded-lg items-center justify-center h-64 mb-4">
        <View className="border-2 border-bnb-gold rounded-md w-40 h-40 items-center justify-center">
          <Text className="text-text-muted text-sm">VIEWFINDER</Text>
        </View>
      </View>

      <Text className="text-sm text-text-secondary text-center mb-6">
        Arahkan kamera ke QR code alamat wallet
      </Text>

      {/* Divider */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-px bg-border" />
        <Text className="text-text-muted text-xs mx-3">atau bayar tagihan</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      {/* Preset Buttons */}
      <TouchableOpacity className="border border-bnb-gold rounded-md py-3 items-center mb-3">
        <Text className="text-bnb-gold text-sm font-semibold">
          Tagihan Hosting $15
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="border border-bnb-gold rounded-md py-3 items-center">
        <Text className="text-bnb-gold text-sm font-semibold">
          Struk Kopi Rp 25.000
        </Text>
      </TouchableOpacity>
    </View>
  );
}
