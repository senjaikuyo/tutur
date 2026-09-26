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
  };
};

export type HomeStackParamList = {
  Home: undefined;
  Confirmation: {intent: IntentResult};
  TransactionDetail: {txId: string};
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
  ScanTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};
