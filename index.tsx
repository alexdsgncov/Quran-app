
import { registerRootComponent } from 'expo';
import React from 'react';
import { Platform } from 'react-native';
import ReactDOM from 'react-dom/client';
import App from './App';

// В среде Expo нативной точкой входа является registerRootComponent
if (Platform.OS === 'web') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} else {
  // Для Android/iOS
  registerRootComponent(App);
}
