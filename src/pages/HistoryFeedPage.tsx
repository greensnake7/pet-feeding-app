import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchHistoryData } from '../services/api'; // Giả sử bạn đã tạo một API service
import moment from 'moment';
import Header from '../components/Header'
import './css/styles.css';

const HistoryFeedPage = ({ navigation }: any) => {

    const [history, setHistory] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deviceID, setDeviceID] = useState<string>('');
    const [connect, setConnect] = useState<boolean>(true);
  
    // Lấy deviceID từ AsyncStorage khi trang được tải
    useEffect(() => {
      const getDeviceID = async () => {
        const deviceControlData = await AsyncStorage.getItem('deviceControl');
        console.log(deviceControlData);
        if (deviceControlData) {
          const parsedData = JSON.parse(deviceControlData);
          setDeviceID(parsedData.deviceID);
          fetchHistory(parsedData.deviceID);
        } else {
          setConnect(false);
          setLoading(false);
        }
      };
      getDeviceID();
    }, []);
  
    const fetchHistory = async (deviceID: string) => {
      try {
        setLoading(true);
        const response = await fetchHistoryData(deviceID); // Gọi API để lấy lịch sử
        console.log(response);
        setHistory(response.history); // Lưu dữ liệu lịch sử
        setStats(response.stats); // Lưu thống kê
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };
  
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      );
    }

    if(!connect) {
      return (
        <View style={styles.container}>
          <Header/>
          <Text>Không có thiết bị theo dõi</Text>
        </View>
      );
    }

  return (
    <View style={styles.container} >
        <Header />
        <View style={styles.row}>
          <Text style={styles.header2}>Mức thức ăn còn lại: {stats?.latestFoodLevel} kg</Text>
        </View>

        <Text style={styles.header1}>Lịch sử cho ăn</Text>
        <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>
              Thời gian: {moment(item.feedingTime).format('HH:mm DD:MM:YYYY')}
            </Text>
            <Text style={styles.itemText}>
              Loại cho ăn: {item.triggerType === 'MOTION' ? 'Tự động' : 'Theo lịch'}
            </Text>
          </View>
        )}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header2: {
    fontSize: 16,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgb(200, 200, 200)'
  },
  historyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    backgroundColor: 'rgb(200, 200, 200)',
    borderRadius: 10,
  },
  itemText: {
    fontSize: 14,
    marginVertical: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    marginBottom: 10,
    borderBottomColor: '#ccc',
    backgroundColor: 'rgb(200, 200, 200)',
    borderRadius: 10,
  },
});

export default HistoryFeedPage;