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

  const handleActionPress = () => {
    if (hasText) {
      handleSend();
    } else {
      Keyboard.dismiss();
      onPressMic();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.textInput}
          placeholder="Ketik pesan atau ucapkan perintah..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!disabled}
        />
      </View>

      {/* Tombol Tunggal Dinamis: Mic jika kosong, Send jika ada teks */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.actionBtn,
          hasText ? styles.sendBtnBg : styles.micBtnBg,
        ]}
        onPress={handleActionPress}
        disabled={disabled}>
        <MaterialCommunityIcons
          name={hasText ? 'send' : 'microphone'}
          size={hasText ? 20 : 22}
          color={colors.bgPrimary}
          style={hasText ? styles.sendIconOffset : undefined}
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
    paddingVertical: 8,
    backgroundColor: '#181E28',
    borderTopWidth: 1,
    borderTopColor: '#263040',
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202836',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2D3747',
    paddingHorizontal: 16,
    height: 46,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.bnbGold,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  micBtnBg: {
    backgroundColor: colors.bnbGold,
  },
  sendBtnBg: {
    backgroundColor: colors.bnbGold,
  },
  sendIconOffset: {
    marginLeft: 2,
  },
});
