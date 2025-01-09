import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.3:3000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = async (username: string, password: string) => {
  const response = await api.post(`/auth/register`, { username, password });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await api.post(`/auth/login`, { username, password });
  const { token, deviceControl } = response.data;  
  if (token) {
    await AsyncStorage.setItem('token', response.data.token);
  }
  if (deviceControl) {
    await AsyncStorage.setItem('deviceControl', JSON.stringify(deviceControl));
  }
  return response.data;
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.clear();
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:');
  }
};

export const getDeviceConfig = async (deviceID: string) => {
  try {
      const response = await api.get(`auth/device/${deviceID}/config`);
      return response.data;
  } catch (error: any) {
      throw error.response?.data?.error || 'Failed to fetch device configuration';
  }
};

export const updateDeviceConfig = async (deviceID: string, updatedConfig: any) => {
  try {
      const response = await api.put(`auth/device/${deviceID}/config`, updatedConfig);
      return response.data;
  } catch (error: any) {
      throw error.response?.data?.error || 'Failed to update device configuration';
  }
};

export const fetchHistoryData = async (deviceID: string) => {
  try {
    const response = await api.get(`auth/device/${deviceID}/history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching history data:", error);
    throw error;
  }
};

export const fetchDeviceControl = async (deviceID: string) => {
  try {
    const response = await api.get(`auth/device/${deviceID}/config`);
    return response.data;
  } catch (error) {
    console.error("Error fetching history data:", error);
    throw error;
  }
}
