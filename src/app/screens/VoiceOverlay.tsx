import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {colors} from '../../constants/theme';

export default function VoiceOverlay() {
  return (
    <View className="flex-1 bg-overlay justify-center px-4">
      <View className="bg-bg-secondary rounded-lg p-6 items-center">
        <Text className="text-xl font-semibold text-text-primary mb-4">
          Mendengarkan...
        </Text>

        {/* Waveform placeholder */}
        <Text className="text-bnb-gold text-2xl mb-4 tracking-widest">
          ∿∿∿∿∿∿∿∿∿∿∿∿
        </Text>

        {/* Timer */}
        <View className="flex-row items-center mb-6">
          <View className="w-2 h-2 rounded-full bg-status-red mr-2" />
          <Text className="text-text-secondary text-base">0.0 detik</Text>
        </View>

        <Text className="text-sm text-text-secondary mb-6">
          Lepas untuk mengirim
        </Text>

        <TouchableOpacity>
          <Text className="text-text-secondary text-sm">Batalkan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
