import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export function useAndroidNavigationBar() {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const hideNavigationBar = async () => {
      try {
        await NavigationBar.setVisibilityAsync('hidden');

        setTimeout(async () => {
          await NavigationBar.setVisibilityAsync('hidden');
        }, 500);
      } catch (error) {
        console.log('Navigation bar error:', error);
      }
    };

    void hideNavigationBar();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        void hideNavigationBar();
      }
    });

    return () => subscription.remove();
  }, []);
}
