import React, { useCallback, useEffect, useState,  type PropsWithChildren  } from 'react';
import { LogBox } from 'react-native';

import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import {ActivityIndicator, SafeAreaView, View} from 'react-native'
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { getDBConnection, createTable } from './db-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreAllLogs();//Hide all warning notifications on front-end

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // secondary: 'yellow',
  },
};

const checkAuth = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return token !== null;
};


export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const segments = useSegments();

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
    } catch (error) {
      console.log("init db errors");
      console.error(error);
    }
  }, []);
  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  useEffect(() => {
    const validateLogin = async () => {
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    validateLogin();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && segments[0] !== 'login') {
        router.replace('/login');
      }
      // if (isAuthenticated && segments[0] === 'login') {
      //   router.replace('/');
      // }
    }
  }, [isLoading, isAuthenticated, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <PaperProvider theme={theme}>
        
         <Stack
          screenOptions={{
            headerShown: false, // Hide header if you want a full-screen login
          }}
          >
            {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
            <Stack.Screen name="(tabs)/index" />
          </Stack>
    </PaperProvider>
  );
}
