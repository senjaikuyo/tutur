import React, {useRef} from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {colors} from '../constants/theme';
import {useInactivityTimer} from '../hooks/useInactivityTimer';
import {useAuthStore} from '../stores/useAuthStore';
import type {
  RootStackParamList,
  HomeStackParamList,
  ScanStackParamList,
  HistoryStackParamList,
  ProfileStackParamList,
} from '../types/navigation';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import VoiceOverlay from './screens/VoiceOverlay';
import QuickFillModal from './screens/QuickFillModal';
import SecurityWarningModal from './screens/SecurityWarningModal';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ScanStack = createNativeStackNavigator<ScanStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator();

// --- Stack Navigators per Tab ---

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.bgPrimary},
      }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          headerShown: true,
          title: 'Konfirmasi Transaksi',
          headerStyle: {backgroundColor: colors.bgPrimary},
          headerTintColor: colors.textPrimary,
        }}
      />
    </HomeStack.Navigator>
  );
}

function ScanStackNavigator() {
  return (
    <ScanStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.bgPrimary},
      }}>
      <ScanStack.Screen name="Scan" component={ScanScreen} />
      <ScanStack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          headerShown: true,
          title: 'Konfirmasi Transaksi',
          headerStyle: {backgroundColor: colors.bgPrimary},
          headerTintColor: colors.textPrimary,
        }}
      />
    </ScanStack.Navigator>
  );
}

function HistoryStackNavigator() {
  return (
    <HistoryStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.bgPrimary},
      }}>
      <HistoryStack.Screen name="History" component={HistoryScreen} />
    </HistoryStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.bgPrimary},
      }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// --- Bottom Tab Navigator ---

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgSecondary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.bnbGold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanStackNavigator}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// --- Root Navigator ---

export default function Navigation() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const {logout} = useAuthStore();

  // Hook timeout sesi 30 menit tanpa aktivitas (FR-1.5)
  useInactivityTimer(() => {
    logout();
    navigationRef.current?.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  });

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: colors.bgPrimary},
        }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{gestureEnabled: false}}
        />
        <RootStack.Screen
          name="VoiceOverlay"
          component={VoiceOverlay}
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
        <RootStack.Screen
          name="QuickFillModal"
          component={QuickFillModal}
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
          }}
        />
        <RootStack.Screen
          name="SecurityWarningModal"
          component={SecurityWarningModal}
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
