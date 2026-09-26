import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {colors} from '../../constants/theme';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-bg-primary">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-bnb-gold">TUTUR</Text>
          <View className="w-8 h-8 rounded-full bg-bg-tertiary items-center justify-center">
            <Text className="text-text-secondary text-xs">AH</Text>
          </View>
        </View>

        {/* Balance Card */}
        <View className="bg-bg-secondary rounded-lg p-4 mb-6">
          <Text className="text-sm text-text-secondary mb-1">Saldo Kamu</Text>
          <Text className="text-3xl font-bold text-text-primary mb-1">
            0.00 USDT
          </Text>
          <Text className="text-sm text-text-secondary mb-3">
            ≈ Rp 0
          </Text>
          <Text className="text-xs text-text-muted font-mono mb-3">
            0x0000...0000
          </Text>
          <TouchableOpacity className="border border-bnb-gold rounded-md py-2 items-center">
            <Text className="text-bnb-gold text-sm font-semibold">
              Minta 100 USDT
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <Text className="text-lg font-semibold text-text-primary mb-3">
          Aktivitas Terakhir
        </Text>
        <View className="bg-bg-secondary rounded-lg p-4 mb-6">
          <Text className="text-sm text-text-muted text-center py-4">
            Belum ada transaksi
          </Text>
        </View>
      </ScrollView>

      {/* Mic Button */}
      <View className="items-center pb-6">
        <TouchableOpacity
          className="w-16 h-16 rounded-full bg-bnb-gold items-center justify-center mb-1"
          onPress={() => {
            // TODO: Open VoiceOverlay
          }}>
          <Text className="text-2xl text-bg-primary">🎤</Text>
        </TouchableOpacity>
        <Text className="text-xs text-text-muted">
          Tekan & tahan untuk bicara
        </Text>
      </View>
    </View>
  );
}
