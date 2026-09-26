import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  onPressMic: () => void;
  disabled?: boolean;
}

export default function ChatInputBar({
  onSendMessage,
  onPressMic,
  disabled = false,
}: ChatInputBarProps) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || disabled) {
      return;
    }
    onSendMessage(trimmed);
    setInputText('');
    Keyboard.dismiss();
  };

  const hasText = inputText.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.textInput}
          placeholder="Ketik pesan atau perintah transfer..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!disabled}
        />

        {hasText && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.sendBtn}
            onPress={handleSend}>
            <MaterialCommunityIcons
              name="send"
              size={18}
              color={colors.bgPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Tombol Mic Push-to-Talk */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.micBtn}
        onPress={onPressMic}
        disabled={disabled}>
        <MaterialCommunityIcons
          name="microphone"
          size={24}
          color={colors.bgPrimary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 46,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bnbGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bnbGold,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.bnbGold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
