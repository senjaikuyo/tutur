import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {colors} from '../../constants/theme';

export default function QuickFillModal() {
  return (
    <View className="flex-1 bg-overlay justify-center px-4">
      <View className="bg-bg-secondary rounded-lg p-6">
        <Text className="text-xl font-semibold text-text-primary mb-1">
          Lengkapi Transaksi
        </Text>
        <Text className="text-sm text-text-secondary mb-6">
          Beberapa info belum terdeteksi dari suara
        </Text>

        {/* Action Field */}
        <Text className="text-sm text-text-secondary mb-1">Tindakan</Text>
        <View className="bg-bg-tertiary rounded-sm border border-border px-3 py-3 mb-4">
          <Text className="text-base text-text-primary">TRANSFER</Text>
        </View>

        {/* Recipient Field */}
        <Text className="text-sm text-text-secondary mb-1">Penerima</Text>
        <TextInput
          className="bg-bg-tertiary rounded-sm border border-error px-3 py-3 mb-1 text-text-primary"
          placeholder="Nama atau alamat wallet"
          placeholderTextColor={colors.textMuted}
        />
        <View className="flex-row mb-4">
          <TouchableOpacity className="mr-4">
            <Text className="text-bnb-gold text-xs">Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-bnb-gold text-xs">Tempel</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Field */}
        <Text className="text-sm text-text-secondary mb-1">Jumlah</Text>
        <View className="flex-row bg-bg-tertiary rounded-sm border border-border px-3 py-3 mb-6">
          <TextInput
            className="flex-1 text-text-primary text-base"
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <Text className="text-text-secondary text-base ml-2">USDT</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity className="bg-text-muted rounded-md py-3 items-center mb-2">
          <Text className="text-bg-primary text-base font-semibold">
            Lanjutkan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 items-center">
          <Text className="text-text-secondary text-sm">Batalkan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
