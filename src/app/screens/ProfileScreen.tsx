import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-bg-primary px-4 pt-4">
      <Text className="text-xl font-semibold text-text-primary mb-4">
        Profil
      </Text>

      {/* User Info */}
      <View className="bg-bg-secondary rounded-lg p-4 mb-4 flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-bg-tertiary items-center justify-center mr-3">
          <Text className="text-text-secondary font-semibold">AH</Text>
        </View>
        <View>
          <Text className="text-base font-semibold text-text-primary">
            Belum login
          </Text>
          <Text className="text-sm text-text-secondary">-</Text>
        </View>
      </View>

      {/* Account Details */}
      <View className="bg-bg-secondary rounded-lg p-4 mb-4">
        <View className="mb-3">
          <Text className="text-xs text-text-secondary mb-1">Smart Account</Text>
          <Text className="text-sm text-text-muted font-mono">0x0000...0000</Text>
        </View>
        <View className="h-px bg-border mb-3" />
        <View className="mb-3">
          <Text className="text-xs text-text-secondary mb-1">EOA Address</Text>
          <Text className="text-sm text-text-muted font-mono">0x0000...0000</Text>
        </View>
        <View className="h-px bg-border mb-3" />
        <View>
          <Text className="text-xs text-text-secondary mb-1">Jaringan</Text>
          <Text className="text-sm text-emerald">opBNB Testnet (5611)</Text>
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity className="border border-bnb-gold rounded-md py-3 items-center mb-3">
        <Text className="text-bnb-gold text-sm font-semibold">
          Minta 100 USDT Faucet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="rounded-md py-3 items-center mb-3">
        <Text className="text-bnb-gold text-sm">
          Lihat di Block Explorer
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="rounded-md py-3 items-center">
        <Text className="text-error text-sm">Keluar</Text>
      </TouchableOpacity>

      <Text className="text-xs text-text-muted text-center mt-6">
        TUTUR v1.0.0 — Hackathon Edition
      </Text>
    </View>
  );
}
