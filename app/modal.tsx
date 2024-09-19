import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Platform } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import { supabase } from '~/utils/supabase';

export default function Modal() {

  const logOut = async () => {
   const {error} = await supabase.auth.signOut()

   if (error) {
    alert(error)
   }

    router.back()
  }

  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Button onPress={logOut} title={'log out'} />
    </>
  );
}
