import React from 'react';
import {View, Text, ScrollView} from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-bg-primary px-4 pt-4">
      <Text className="text-xl font-semibold text-text-primary mb-4">
        Riwayat Transaksi
      </Text>

      <ScrollView className="flex-1">
        <View className="bg-bg-secondary rounded-lg p-4">
          <Text className="text-sm text-text-muted text-center py-8">
            Belum ada riwayat transaksi
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
