// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Pressable, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (email === 'TTDHSX@123456' && password === 'Cangdanang1901') {
      // Simulate saving an auth token to AsyncStorage
      await AsyncStorage.setItem('authToken', 'dummy-auth-token');
      router.replace('/');
    } else {
      Alert.alert("Báo lỗi", 'Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background-login.png')}  // Path to your background image
      style={styles.background}
    >
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo-png.png')}  // Path to your logo
        style={styles.logo}
        resizeMode="contain"   // Adjust how the image fits
      />
      <Text style={styles.title}>DNP Đo quan trắc</Text>
      <TextInput
        placeholder="Tên đăng nhập"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.text}>Đăng nhập</Text>
      </Pressable>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',    // Centers vertically
    alignItems: 'center',        // Centers horizontally
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    width: '80%',
    backgroundColor: 'white',
  },
  logo: {
    width: 150,   // Adjust the size of the logo
    height: 150,
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#725CA9',
    width: '80%',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default LoginScreen;
