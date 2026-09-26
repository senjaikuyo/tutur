import './global.css';
import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/app/Navigation';
import Toast from './src/components/common/Toast';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <Navigation />
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
