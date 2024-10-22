// app/index.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // Remove the auth token from AsyncStorage
    await AsyncStorage.removeItem('authToken');
    router.replace('/login'); // Redirect to login after logout
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DNP Đo quan trắc</Text>
      <Button title="Đăng xuất" onPress={handleLogout} color="#725CA9" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AuthScreen;
