import { Capacitor } from '@capacitor/core';

export const isNativeApp = () => Capacitor.isNativePlatform();

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const isIOS = () => Capacitor.getPlatform() === 'ios';

export const isWeb = () => Capacitor.getPlatform() === 'web';
