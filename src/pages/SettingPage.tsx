import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import Header from '../components/Header'
import './css/styles.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDeviceControl } from '../services/api';
import { logoutUser } from '../services/api'
import SchedulePage from './SchedulePage';
import { showAlert } from '../utils/alert'
 
const SettingPage = ({ navigation }: any) => {
  const [deviceID, setDeviceID] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getDeviceID = async () => {
      const deviceControlData = await AsyncStorage.getItem('deviceControl');
      if (deviceControlData) {
        const parsedData = JSON.parse(deviceControlData);
      }
    };
    getDeviceID();
  }, []);

  const handleSave = async () => {
    if (!deviceID) {
      showAlert('Vui lòng nhập deviceID!', 'Lỗi');
      return;
    }
    try {
      setLoading(true);
      const response = await fetchDeviceControl(deviceID); // Gọi API để lấy deviceControl mới
      if (response && response.deviceID) {
        await AsyncStorage.setItem('deviceControl', JSON.stringify(response));
        showAlert('Cập nhật thiết bị thành công', 'Thông báo');
        navigation.navigate(SchedulePage);
      } else {
        showAlert('Không tìm thấy thiết bị này', 'Lỗi');
      }
    } catch (error) {
      console.error('Error saving device:', error);
      showAlert('Đã xảy ra lỗi khi cập nhật thiết bị', 'Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handLogout = async () => {
    try {
      await logoutUser();
      showAlert('Bạn đã đăng xuất thành công!', 'Thông báo');
      navigation.navigate('Login'); // Chuyển hướng về trang đăng nhập
    } catch (error) {
      console.error('Error logging out:', error);
      showAlert('Đã xảy ra lỗi khi đăng xuất', 'Lỗi');
    }
  }

  return (
    <View style={styles.container}>
        <Header />
      <View>
      <Text style={styles.header}>Cập nhật deviceID</Text>
      <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder="Nhập deviceID"
        value={deviceID}
        onChangeText={setDeviceID}
      />
      
      <Button
        title={loading ? 'Đang cập nhật...' : 'Cập nhật thiết bị'}
        onPress={handleSave}
        disabled={loading}
      />
      </View>
      </View>
      <View>
        <Button title="Logout" onPress={handLogout}/>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SettingPage;