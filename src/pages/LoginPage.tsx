import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { showAlert } from '../utils/alert';
import { Headline, Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../services/api';
// import { validateEmail } from '../utils/validators';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // Import RootStackParamList từ App.tsx
import './css/styles.css';

// Định nghĩa loại navigation cho LoginPage
type LoginPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginPage = () => {
  const navigation = useNavigation<LoginPageNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await loginUser(formData.username, formData.password);
      console.log(response);
      showAlert('Đăng nhập thành công', 'Thông báo');
      // Navigation sẽ được xử lý bởi AppNavigator dựa trên trạng thái xác thực
      navigation.navigate('SchedulePage');
    } catch (error) {
      showAlert( 
        error instanceof Error ? error.message : 'An error occurred', 'Login Failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <View style={styles.content}>
      <Headline style={styles.title}>PET FEEDING</Headline>

      <TextInput
        label="Username"
        value={formData.username}
        onChangeText={(text) => {
          setFormData({ ...formData, username: text });
          if (errors.username) setErrors({ ...errors, username: undefined });
        }}
        error={!!errors.username}
        disabled={loading}
        autoCapitalize="none"
        style={styles.input}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => {
          setFormData({ ...formData, password: text });
          if (errors.password) setErrors({ ...errors, password: undefined });
        }}
        secureTextEntry={secureTextEntry}
        right={
          <TextInput.Icon
            icon={secureTextEntry ? 'eye' : 'eye-off'}
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        }
        error={!!errors.password}
        disabled={loading}
        style={styles.input}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Đăng nhập
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Register' as never)}
        disabled={loading}
        style={styles.linkButton}
      >
        Bạn chưa có tài khoản? Đăng kí tài khoản ở đây.
      </Button>
    </View>
  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
      color: '#1976D2',
    },
    input: {
      marginBottom: 8,
      backgroundColor: 'transparent',
    },
    errorText: {
      color: '#B00020',
      fontSize: 12,
      marginBottom: 8,
      marginLeft: 4,
    },
    button: {
      marginTop: 16,
      paddingVertical: 8,
      backgroundColor: '#1976D2',
    },
    linkButton: {
      marginTop: 16,
    },
  });

export default LoginPage;
