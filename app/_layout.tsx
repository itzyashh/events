import '../global.css';

import { Redirect, SplashScreen, Stack } from 'expo-router';
import AppLoading from 'expo-app-loading';
import { useFonts, NewRocker_400Regular } from '@expo-google-fonts/new-rocker';
import { Lato_400Regular } from '@expo-google-fonts/lato';
import { useEffect } from 'react';
import AuthProvider, { useAuth } from '~/providers/AuthProvider';
import { Appearance, AppState } from 'react-native';
import { supabase } from '~/utils/supabase';

import * as SystemUI from 'expo-system-ui';
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  SystemUI.setBackgroundColorAsync("black");
  let [fontsLoaded] = useFonts({
    NewRocker_400Regular,
    Lato_400Regular,
  });



  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }


  Appearance.setColorScheme('dark')

  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })

  return (
    <AuthProvider>
    <Stack>
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
    </AuthProvider>
  );
}
