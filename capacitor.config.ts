import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moodybuddy.app',
  appName: 'Amigo',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;