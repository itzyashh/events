import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect,SplashScreen,Stack } from 'expo-router'
import { useAuth } from '~/providers/AuthProvider';

const AuthLayout = () => {

    const { isAuthenticated } = useAuth();

      if (isAuthenticated) {
        return <Redirect href={`/(protected)`} />;
    }

  return (
   <Stack /> 
  )
}

export default AuthLayout