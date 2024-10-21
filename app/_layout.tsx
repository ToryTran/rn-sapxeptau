import React, { useCallback, useEffect, useState,  type PropsWithChildren  } from 'react';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import {SafeAreaView} from 'react-native'
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { getDBConnection, createTable } from './db-service';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // secondary: 'yellow',
  },
};

export default function RootLayout() {

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" 
            options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
    </PaperProvider>
  );
}
