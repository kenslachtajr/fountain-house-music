import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fountainhousemusic.app',
  appName: 'Fountain House Music',
  webDir: 'out',
  server: {
    url: 'http://192.168.86.27:3000',
    cleartext: true,
  },
  ios: {
    allowsLinkPreview: false,
    contentInset: 'automatic',
  },
};

export default config;
