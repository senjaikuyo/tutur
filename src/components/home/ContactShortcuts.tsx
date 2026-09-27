import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ShortcutContact {
  id: string;
  name: string;
  avatarText?: string;
  avatarBgColor: string;
  subBadge?: {
    text?: string;
    icon?: string;
    bgColor: string;
    textColor?: string;
  };
  recipientAddress: string;
  bnsName?: string;
}

interface ContactShortcutsProps {
  onSelectContact: (contact: ShortcutContact) => void;
  onPressMore: () => void;
}

const DEFAULT_SHORTCUTS: ShortcutContact[] = [
  {
    id: 'c1',
    name: 'Afif',
    avatarText: 'AF',
    avatarBgColor: '#A06148',
    subBadge: {
      text: 'S',
      bgColor: '#EE4D2D',
      textColor: '#FFFFFF',
    },
    recipientAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    bnsName: 'afif.bnb',
  },
  {
    id: 'c2',
    name: 'Terami',
    avatarText: 'T',
    avatarBgColor: '#1E5868',
    subBadge: {
      text: 'BCA',
      bgColor: '#005BAB',
      textColor: '#FFFFFF',
    },
    recipientAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    bnsName: 'terami.bnb',
  },
  {
    id: 'c3',
    name: 'Afif',
    avatarText: 'A',
    avatarBgColor: '#1B5B5E',
    subBadge: {
      text: 'BSI',
      bgColor: '#00A39D',
      textColor: '#FFFFFF',
    },
    recipientAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    bnsName: 'afif.bnb',
  },
];

export default function ContactShortcuts({
  onSelectContact,
  onPressMore,
}: ContactShortcutsProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        {DEFAULT_SHORTCUTS.map(contact => (
          <TouchableOpacity
            key={contact.id}
            activeOpacity={0.75}
            onPress={() => onSelectContact(contact)}
            style={styles.contactItem}>
            {/* Avatar Circle with Sub-badge */}
            <View
              style={[
                styles.avatarCircle,
                {backgroundColor: contact.avatarBgColor},
              ]}>
              <Text style={styles.avatarText}>{contact.avatarText}</Text>

              {/* Mini Bank / Brand Badge at Bottom-Right */}
              {contact.subBadge && (
                <View
                  style={[
                    styles.subBadge,
                    {backgroundColor: contact.subBadge.bgColor},
                  ]}>
                  {contact.subBadge.icon ? (
                    <MaterialCommunityIcons
                      name={contact.subBadge.icon}
                      size={10}
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.subBadgeText,
                        {color: contact.subBadge.textColor || '#FFFFFF'},
                      ]}>
                      {contact.subBadge.text}
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Nama Kontak */}
            <Text style={styles.contactName} numberOfLines={1}>
              {contact.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Kontak "Lainnya" */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPressMore}
          style={styles.contactItem}>
          <View style={styles.moreCircle}>
            <MaterialCommunityIcons
              name="account-multiple-outline"
              size={24}
              color="#CBD5E1"
            />
          </View>
          <Text style={styles.contactName} numberOfLines={1}>
            Lainnya
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#121C27',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1D2D3E',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contactItem: {
    alignItems: 'center',
    width: '22%',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#24374D',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#121C27',
  },
  subBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  moreCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1C2938',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#2B3C50',
  },
  contactName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
    textAlign: 'center',
  },
});
