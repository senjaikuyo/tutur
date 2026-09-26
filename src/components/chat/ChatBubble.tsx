import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import Badge from '../common/Badge';
import {
  formatToken,
  formatIdrEstimate,
  formatClock,
  shortenAddress,
} from '../../utils/formatters';
import type {ChatMessage} from '../../types/chat';
import type {IntentResult} from '../../types/intent';

interface ChatBubbleProps {
  message: ChatMessage;
  onPressAction?: (intent: IntentResult) => void;
}

export default function ChatBubble({message, onPressAction}: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const intent = message.attachedIntent;

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.asstContainer,
      ]}>
      {/* Bot Avatar Icon */}
      {!isUser && (
        <View style={styles.botAvatar}>
          <MaterialCommunityIcons
            name="robot-happy-outline"
            size={18}
            color={colors.bnbGold}
          />
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.asstBubble,
        ]}>
        {/* Voice Indicator Tag */}
        {message.isVoice && (
          <View style={styles.voiceTag}>
            <MaterialCommunityIcons
              name="microphone"
              size={12}
              color={isUser ? colors.bgPrimary : colors.bnbGold}
            />
            <Text
              style={[
                styles.voiceTagText,
                {color: isUser ? colors.bgPrimary : colors.bnbGold},
              ]}>
              Perintah Suara
            </Text>
          </View>
        )}

        {/* Message Content */}
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.asText,
          ]}>
          {message.content}
        </Text>

        {/* Interactive Transaction Action Card */}
        {intent && intent.action === 'TRANSFER' && (
          <View style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <View style={styles.actionIconWrap}>
                <MaterialCommunityIcons
                  name="arrow-top-right"
                  size={16}
                  color={colors.bnbGold}
                />
              </View>
              <Text style={styles.actionTitle}>Siap Dikirim</Text>
              <Badge label="● Aman" color="green" />
            </View>

            <Text style={styles.actionAmount}>
              {formatToken(intent.amount || 0)}
            </Text>
            <Text style={styles.actionEstimate}>
              {formatIdrEstimate(intent.amount || 0)}
            </Text>

            <View style={styles.divider} />

            <View style={styles.actionDetailRow}>
              <Text style={styles.actionDetailLabel}>Penerima:</Text>
              <Text style={styles.actionDetailVal}>
                {intent.recipient || 'Belum ditentukan'}
              </Text>
            </View>

            <View style={styles.actionDetailRow}>
              <Text style={styles.actionDetailLabel}>Biaya Gas:</Text>
              <Text style={[styles.actionDetailVal, {color: colors.emerald}]}>
                0 BNB (Paymaster)
              </Text>
            </View>

            {onPressAction && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionBtn}
                onPress={() => onPressAction(intent)}>
                <Text style={styles.actionBtnText}>
                  Lanjutkan Transaksi &gt;
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Timestamp */}
        <Text
          style={[
            styles.timeText,
            isUser ? styles.userTime : styles.asstTime,
          ]}>
          {formatClock(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  asstContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  userBubble: {
    backgroundColor: colors.bnbGold,
    borderBottomRightRadius: 4,
  },
  asstBubble: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  voiceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  voiceTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: colors.bgPrimary,
    fontWeight: '500',
  },
  asText: {
    color: colors.textPrimary,
  },
  timeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(15, 15, 20, 0.65)',
  },
  asstTime: {
    color: colors.textMuted,
  },
  actionCard: {
    backgroundColor: colors.bgTertiary,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  actionIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: `${colors.bnbGold}22`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
    marginLeft: 6,
  },
  actionAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionEstimate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  actionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  actionDetailLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  actionDetailVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionBtn: {
    backgroundColor: colors.bnbGold,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.bgPrimary,
  },
});
