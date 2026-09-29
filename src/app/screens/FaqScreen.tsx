import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import {OPBNB_TESTNET} from '../../constants/chains';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'f1',
    category: 'Transaksi Suara & Slang',
    question: 'Bagaimana cara transfer tanpa mengetik alamat wallet?',
    answer:
      'Cukup tekan tombol Mikrofon atau ketik di tab Chat dengan gaya bahasa santai sehari-hari, misalnya: "Kirim goceng USDT ke Budi" atau "Oper seratus ribu ke Warung". Asisten AI tutur akan langsung membedah nominal, tujuan, dan menyiapkan konfirmasi.',
  },
  {
    id: 'f2',
    category: 'Transaksi Suara & Slang',
    question: 'Istilah slang apa saja yang dimengerti oleh tutur?',
    answer:
      'tutur memahami 32+ istilah percakapan uang Indonesia, antara lain:\n• goceng = 5 USDT\n• ceban = 10 USDT\n• gocap = 50 USDT\n• cepek = 100 USDT\n• gopek = 500 USDT\n• seceng = 1.000 USDT\n• seratus ribu = Rp 100.000 (dikonversi otomatis ke USDT)\n• lima ratus ribu / sejuta / dsb.',
  },
  {
    id: 'f3',
    category: 'Keamanan & Akun',
    question: 'Mengapa di tutur tidak ada 12 kata pemulihan (Seed Phrase)?',
    answer:
      'tutur mengadopsi standar Account Abstraction (ERC-4337) dengan Social Login Google dan WebAuthn Biometrik (MPC). Kunci privat diamankan secara terdistribusi di Secure Enclave perangkat Anda, sehingga Anda terbebas dari rasa cemas kehilangan seed phrase.',
  },
  {
    id: 'f4',
    category: 'Biaya Gas (opBNB)',
    question: 'Mengapa biaya gas transaksi 0 BNB (Gratis)?',
    answer:
      'Setiap transaksi di tutur menggunakan kontrak Paymaster di jaringan opBNB Testnet yang mensubsidi 100% biaya gas. Anda tidak perlu membeli atau menyimpan saldo koin native BNB hanya untuk mentransfer USDT.',
  },
  {
    id: 'f5',
    category: 'AI Security Shield',
    question: 'Bagaimana tutur melindungi dari penipuan dan wallet drainer?',
    answer:
      'AI Security Shield otomatis mengaudit setiap alamat kontrak tujuan terhadap daftar hitam penipuan publik (blacklist). Jika terdeteksi berbahaya, transaksi langsung DIBLOKIR. Sistem kami juga mendeteksi upaya Unlimited Token Approval dan memberikan opsi "Batasi Izin Sesuai Transaksi" agar saldo Anda tidak pernah terkuras.',
  },
  {
    id: 'f6',
    category: 'Jaringan & Blockchain',
    question: 'Blockchain apa yang digunakan oleh tutur?',
    answer:
      `tutur berjalan di atas jaringan opBNB Testnet (Chain ID: ${OPBNB_TESTNET.chainId}), Layer 2 berkecepatan tinggi dari ekosistem BNB Chain dengan finalitas transaksi di bawah 2 detik dan biaya gas super efisien.`,
  },
];

export default function FaqScreen() {
  const navigation = useNavigation<any>();
  const [expandedId, setExpandedId] = useState<string | null>('f1');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bantuan & FAQ</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* About Card */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeaderRow}>
            <View style={styles.appIconWrap}>
              <MaterialCommunityIcons
                name="wallet"
                size={22}
                color={colors.bgPrimary}
              />
            </View>
            <View style={styles.appNameContainer}>
              <Text style={styles.appName}>tutur</Text>
              <Text style={styles.appTagline}>
                Dompet Kripto Bahasa Sehari-hari
              </Text>
            </View>
          </View>

          <Text style={styles.aboutDesc}>
            tutur adalah dompet Web3 pintar pertama di ekosistem opBNB yang
            memungkinkan pengguna kasual bertransaksi kripto lewat perintah
            suara bahasa prokem Indonesia, AI chat interaktif, dan Account
            Abstraction (ERC-4337) tanpa rasa takut.
          </Text>

          <View style={styles.chainBadgeRow}>
            <View style={styles.chainBadge}>
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color={colors.bnbGold}
              />
              <Text style={styles.chainBadgeText}>opBNB Testnet (5611)</Text>
            </View>
            <View style={styles.chainBadge}>
              <MaterialCommunityIcons
                name="gas-cylinder"
                size={14}
                color={colors.emerald}
              />
              <Text style={[styles.chainBadgeText, {color: colors.emerald}]}>
                0 Gas Fee (Paymaster)
              </Text>
            </View>
          </View>
        </View>

        {/* Section FAQ Title */}
        <Text style={styles.sectionTitle}>Pertanyaan yang Sering Diajukan</Text>

        {/* FAQ Accordion List */}
        {FAQ_LIST.map(item => {
          const isExpanded = expandedId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => toggleExpand(item.id)}
              style={[styles.faqCard, isExpanded && styles.faqCardActive]}>
              <View style={styles.faqQuestionRow}>
                <Text style={styles.faqQuestionText}>{item.question}</Text>
                <MaterialCommunityIcons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color={isExpanded ? colors.bnbGold : colors.textMuted}
                />
              </View>

              {isExpanded && (
                <View style={styles.faqAnswerWrap}>
                  <View style={styles.faqDivider} />
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Footer info */}
        <Text style={styles.footerInfo}>
          tutur v1.0.1 • Indonesia Web3 Hackathon 2026{'\n'}
          Author: Afif Hamzah Siregar (Solo Builder)
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    backgroundColor: '#121620',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2532',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A212E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerRightPlaceholder: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  aboutCard: {
    backgroundColor: '#181E28',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#263040',
    marginBottom: 24,
  },
  aboutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.bnbGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appNameContainer: {
    flex: 1,
    marginLeft: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.bnbGold,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  aboutDesc: {
    fontSize: 13,
    color: '#B0BAC5',
    lineHeight: 19,
    marginBottom: 14,
  },
  chainBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2735',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: '#2D394C',
  },
  chainBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.bnbGold,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  faqCard: {
    backgroundColor: '#181E28',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222B3A',
    marginBottom: 10,
  },
  faqCardActive: {
    borderColor: colors.bnbGold,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 19,
  },
  faqAnswerWrap: {
    marginTop: 10,
  },
  faqDivider: {
    height: 1,
    backgroundColor: '#263040',
    marginBottom: 10,
  },
  faqAnswerText: {
    fontSize: 13,
    color: '#9CA7B5',
    lineHeight: 19,
  },
  footerInfo: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
});
