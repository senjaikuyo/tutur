import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import {formatToken, getInitials} from '../../utils/formatters';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInputBar from '../../components/chat/ChatInputBar';
import type {IntentResult} from '../../types/intent';
import {useToastStore} from '../../stores/useToastStore';
import {useAuthStore} from '../../stores/useAuthStore';
import {useTransactionStore} from '../../stores/useTransactionStore';
import {useChatStore} from '../../stores/useChatStore';

const FALLBACK_ADDRESS = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const rootNav = useNavigation<any>();
  const showToast = useToastStore(s => s.show);

  const {user, refreshActivity} = useAuthStore();
  const {balance, claimFaucet, faucetCooldown, refreshBalance} =
    useTransactionStore();
  const {messages, isTyping, loadChatHistory, addUserMessage} = useChatStore();

  const flatListRef = useRef<FlatList>(null);
  const userAddress = user?.smartAccountAddress || FALLBACK_ADDRESS;
  const userName = user?.name || 'Rian Senja';

  useEffect(() => {
    loadChatHistory();
    if (userAddress) {
      refreshBalance(userAddress);
    }
  }, [userAddress, refreshBalance, loadChatHistory]);

  useEffect(() => {
    // Auto scroll ke bawah saat pesan baru masuk
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 150);
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    refreshActivity();
    addUserMessage(text, false, balance);
  };

  const handlePressMic = () => {
    refreshActivity();
    rootNav.navigate('VoiceOverlay');
  };

  const handleActionCardPress = (intent: IntentResult) => {
    refreshActivity();
    if (intent.confidence < 0.75 || intent.missingFields.length > 0) {
      rootNav.navigate('QuickFillModal', {intent});
    } else {
      navigation.navigate('Confirmation', {intent});
    }
  };

  const handleFaucet = async () => {
    refreshActivity();
    if (faucetCooldown > 0) {
      showToast(`Tunggu cooldown ${faucetCooldown} detik...`, 'info');
      return;
    }

    showToast('Meminta 100 USDT Faucet via opBNB Paymaster...', 'info');
    const success = await claimFaucet(userAddress);
    if (success) {
      showToast('100 USDT berhasil ditambahkan ke saldo kamu!', 'success');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header Ringkas: Logo + Mini Saldo + Avatar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLogo}>tutur</Text>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI Assistant</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Mini Balance Chip (Tap untuk Faucet) */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.balanceChip}
            onPress={handleFaucet}>
            <MaterialCommunityIcons
              name="wallet"
              size={14}
              color={colors.bnbGold}
            />
            <Text style={styles.balanceText}>{formatToken(balance)}</Text>
            {faucetCooldown === 0 && (
              <MaterialCommunityIcons
                name="plus-circle"
                size={12}
                color={colors.emerald}
              />
            )}
          </TouchableOpacity>

          {/* User Avatar */}
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => rootNav.navigate('ProfileTab')}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daftar Pesan Percakapan */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ChatBubble message={item} onPressAction={handleActionCardPress} />
        )}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingContainer}>
              <View style={styles.botAvatar}>
                <MaterialCommunityIcons
                  name="robot-happy-outline"
                  size={16}
                  color={colors.bnbGold}
                />
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color={colors.bnbGold} />
                <Text style={styles.typingText}>tutur AI sedang mengetik...</Text>
              </View>
            </View>
          ) : undefined
        }
      />

      {/* Input Bar di Bawah */}
      <ChatInputBar
        onSendMessage={handleSendMessage}
        onPressMic={handlePressMic}
        disabled={isTyping}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.bnbGold,
    letterSpacing: 0.5,
  },
  aiBadge: {
    backgroundColor: `${colors.bnbGold}20`,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${colors.bnbGold}40`,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.bnbGold,
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  balanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
