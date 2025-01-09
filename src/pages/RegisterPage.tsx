import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { showAlert } from '../utils/alert'
import { TextInput, Button, Text, Headline } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../services/api'; // Thay vì authService
import { validatePassword } from '../utils/validators';
import './css/styles.css';

interface FormData {
  username: string;
  password: string;
}

const RegisterPage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await registerUser(formData.username, formData.password); // Đăng nhập ngay sau khi đăng ký
      console.log(response);
      showAlert(
        'Registration successful! Please login.','Success',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (error) {
      showAlert(
        error instanceof Error ? error.message : 'An error occurred', 'Registration Failed',
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Headline style={styles.title}>Đăng kí</Headline>

          <TextInput
            label="Username"
            value={formData.username}
            onChangeText={updateField('username')}
            error={!!errors.username}
            disabled={loading}
            style={styles.input}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={updateField('password')}
            secureTextEntry={secureTextEntry}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye' : 'eye-off'}
                onPress={() => setSecureTextEntry(prev => !prev)}
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
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Đăng kí
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login' as never)}
            disabled={loading}
            style={styles.linkButton}
          >
            Bạn đã có tài khoản? Đăng nhập ở đây!
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
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

export default RegisterPage;
