import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

export default function ConfirmationScreen() {
  return (
    <View className="flex-1 bg-bg-primary px-4 pt-4">
      <ScrollView className="flex-1">
        {/* Amount */}
        <View className="bg-bg-secondary rounded-lg p-4 mb-4">
          <Text className="text-sm text-text-secondary mb-1">Kirim</Text>
          <Text className="text-3xl font-bold text-text-primary">0.00 USDT</Text>
          <Text className="text-sm text-text-secondary">≈ Rp 0</Text>
        </View>

        {/* Details */}
        <View className="bg-bg-secondary rounded-lg p-4 mb-4">
          <View className="mb-3">
            <Text className="text-xs text-text-secondary mb-1">Kepada</Text>
            <Text className="text-base font-semibold text-text-primary">-</Text>
            <Text className="text-xs text-text-muted font-mono">0x0000...0000</Text>
          </View>
          <View className="h-px bg-border mb-3" />
          <View className="mb-3">
            <Text className="text-xs text-text-secondary mb-1">Token</Text>
            <Text className="text-base text-text-primary">USDT</Text>
          </View>
          <View className="h-px bg-border mb-3" />
          <View className="mb-3">
            <Text className="text-xs text-text-secondary mb-1">Biaya Gas</Text>
            <Text className="text-base text-emerald">0 BNB (Disponsori)</Text>
          </View>
          <View className="h-px bg-border mb-3" />
          <View>
            <Text className="text-xs text-text-secondary mb-1">
              Status Keamanan
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-status-green mr-2" />
              <Text className="text-base text-status-green">Aman</Text>
            </View>
          </View>
        </View>

        {/* Source Text */}
        <View className="bg-bg-secondary rounded-lg p-4 mb-6">
          <Text className="text-xs text-text-muted mb-1">
            Dikenali dari suara:
          </Text>
          <Text className="text-sm text-text-secondary italic">
            "..."
          </Text>
        </View>
      </ScrollView>

      {/* Actions */}
      <View className="pb-6">
        <TouchableOpacity className="bg-bnb-gold rounded-md py-4 items-center mb-3">
          <Text className="text-bg-primary text-base font-semibold">
            Konfirmasi & Kirim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 items-center">
          <Text className="text-text-secondary text-base">Batalkan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
