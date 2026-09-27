import type {IntentResult} from './intent';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  VoiceOverlay: undefined;
  QuickFillModal: {intent?: Partial<IntentResult>};
  SecurityWarningModal: {
    type: 'blacklist' | 'unlimited_allowance';
    address?: string;
    onProceed?: () => void;
    onCancel?: () => void;
  };
  Faq: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Confirmation: {intent: IntentResult};
  TransactionDetail: {txId: string};
  Faq: undefined;
};

export type ChatStackParamList = {
  Chat: undefined;
  Confirmation: {intent: IntentResult};
};

export type ScanStackParamList = {
  Scan: undefined;
  Confirmation: {intent: IntentResult};
};

export type HistoryStackParamList = {
  History: undefined;
  TransactionDetail: {txId: string};
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ChatTab: undefined;
  ScanTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};
