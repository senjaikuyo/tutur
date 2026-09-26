import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg-primary px-6">
      <Text className="text-3xl font-bold text-bnb-gold mb-2">
        TUTUR
      </Text>
      <Text className="text-base text-text-primary mb-1">
        Transaksi kripto semudah
      </Text>
      <Text className="text-base text-text-primary mb-10">
        ngobrol biasa
      </Text>

      <TouchableOpacity
        className="w-full bg-bnb-gold rounded-md py-4 items-center"
        onPress={() => {
          // TODO: Particle SDK Google login
        }}>
        <Text className="text-bg-primary text-base font-semibold">
          G  Masuk dengan Google
        </Text>
      </TouchableOpacity>

      <Text className="text-xs text-text-muted mt-6 text-center">
        Dengan masuk, kamu setuju{'\n'}dengan Syarat & Ketentuan
      </Text>
    </View>
  );
}
