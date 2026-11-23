import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SavedProvider } from './src/context/SavedContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SavedProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SavedProvider>
  );
}
