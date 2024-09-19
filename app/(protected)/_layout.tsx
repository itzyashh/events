import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/providers/AuthProvider';

const ProtectedLayout = () => {

    const { isAuthenticated } = useAuth();

    if ( !isAuthenticated ) {
      return <Redirect href={'/(auth)/login'} />;
    }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}

export default ProtectedLayout