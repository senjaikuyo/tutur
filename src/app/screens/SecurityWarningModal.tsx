import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default function SecurityWarningModal() {
  return (
    <View className="flex-1 bg-overlay justify-center px-4">
      <View className="bg-bg-secondary rounded-lg p-6">
        <Text className="text-xl font-semibold text-status-red text-center mb-4">
          ⚠ PERINGATAN
        </Text>

        <View className="bg-status-red/20 rounded-sm py-2 px-3 items-center mb-4">
          <Text className="text-status-red text-sm font-semibold">
            ● BERBAHAYA
          </Text>
        </View>

        <Text className="text-base text-text-primary mb-2">
          Alamat tujuan terdata sebagai alamat yang dilaporkan terlibat penipuan.
        </Text>

        <Text className="text-sm text-status-red font-mono mb-4">
          0x0000...0000
        </Text>

        <Text className="text-base font-semibold text-status-red mb-6">
          Transaksi DIBLOKIR demi keamanan kamu.
        </Text>

        <TouchableOpacity className="bg-status-red rounded-md py-3 items-center mb-2">
          <Text className="text-text-primary text-sm font-semibold">
            Saya paham risikonya, lanjutkan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-bnb-gold rounded-md py-3 items-center">
          <Text className="text-bg-primary text-sm font-semibold">
            Batalkan (aman)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
