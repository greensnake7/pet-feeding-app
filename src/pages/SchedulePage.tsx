import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, Modal, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateDeviceConfig } from '../services/api';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Header from '../components/Header';
import './css/styles.css';
import { showAlert } from '../utils/alert'

const SchedulePage = () => {
  const [deviceControl, setDeviceControl] = useState<any>(null);
  const [deviceID, setDeviceID] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [originalDeviceControl, setOriginalDeviceControl] = useState<any>(null);
  const [isModified, setIsModified] = useState(false);
  const navigation = useNavigation();
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newTime, setNewTime] = useState<Date | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchDeviceControl = async () => {
        const deviceControlData = await AsyncStorage.getItem('deviceControl');
        console.log(deviceControlData);
        if (deviceControlData) {
          const parsedData = JSON.parse(deviceControlData);
          console.log(parsedData);
          console.log(parsedData.deviceID);
          const payload = {
            autoStatus: parsedData.autoStatus,
            schedule: parsedData.schedule.map(({ _id, ...rest }: any) => rest ),
          };
          console.log(payload);
          setDeviceID(parsedData.deviceID);
          setDeviceControl(payload);
          setOriginalDeviceControl(payload);
        }
    };

    fetchDeviceControl();
  }, []);



  if (!deviceControl) {
    return (
      <View style={styles.container}>
        <Header/>
        <Text>Không có thiết bị theo dõi</Text>
      </View>
    );
  }

  const handleAutoStatusToggle = () => {
    setDeviceControl((prevState: any) => ({
      ...prevState,
      autoStatus: prevState.autoStatus === 1 ? 0 : 1,
    }));
    setIsModified(true);
  };

  const handleScheduleToggle = (index: number) => {
    const newSchedule = [...deviceControl.schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
    const updatedDeviceControl = { ...deviceControl, schedule: newSchedule };
    console.log(updatedDeviceControl);
    setDeviceControl(updatedDeviceControl);
    console.log(deviceControl);
    setIsModified(true);
  };

  const handleSave = async () => {
    try {
      console.log(deviceControl);
      console.log(deviceID)
      const response = await updateDeviceConfig(deviceID, deviceControl);
      await AsyncStorage.setItem('deviceControl', JSON.stringify(response));
      console.log(response)
      setOriginalDeviceControl(deviceControl);
      setIsModified(false);
      showAlert('Cập nhật thành công!', 'Thông báo');
    } catch (error) {
      showAlert('Có lỗi khi lưu cấu hình!', 'Lỗi');
    }
  };

  const handleAddSchedule = () => {
    if (!newTime) {
      showAlert("Vui lòng chọn giờ hợp lệ!", 'Lỗi');
      return;
    }

    const newSchedule = [...deviceControl.schedule, { time: moment(newTime).format("HH:mm"), enabled: true }];
    const updatedDeviceControl = { ...deviceControl, schedule: newSchedule };
    setDeviceControl(updatedDeviceControl);
    setIsModified(true);
    setShowAddScheduleModal(false);
    setNewTime(null);
  };

  const handleEditSchedule = (index: number) => {
    setEditingIndex(index);
    setNewTime(moment(deviceControl.schedule[index].time, "HH:mm").toDate());
    setShowTimePicker(true);
  };

  const handleDeleteSchedule = (index: number) => {
    const updatedSchedule = deviceControl.schedule.filter((_: any, i: number) => i !== index);
    const updatedDeviceControl = { ...deviceControl, schedule: updatedSchedule };
    setDeviceControl(updatedDeviceControl);
    setIsModified(true);
  };

  const handleTimePickerConfirm = (time: Date) => {
    setNewTime(time);
    const updatedSchedule = [...deviceControl.schedule];
    if (editingIndex !== null) {
      updatedSchedule[editingIndex].time = moment(time).format("HH:mm");
      setDeviceControl({ ...deviceControl, schedule: updatedSchedule });
      setIsModified(true);
    }
    setShowTimePicker(false);
  };

  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
  };

  return (
    <View style={styles.container}>
        <Header />
      <View style={styles.row}>
        <Text style={styles.header2}>Chế độ tự động</Text>
        <Switch value={deviceControl.autoStatus === 1} onValueChange={handleAutoStatusToggle} />
      </View>

      <Text style={styles.header1}>Schedules:</Text>
      {deviceControl.autoStatus === 0 && (
      <View style= {{ margin : 10}}>
      <FlatList
        data={deviceControl.schedule || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }: { item: any, index: number }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.time}</Text>
            <Switch value={item.enabled} onValueChange={() => handleScheduleToggle(index)} />
            <Button title="Sửa" onPress={() => handleEditSchedule(index)} color="#33cc66"/>
            <Button title="Xóa" onPress={() => handleDeleteSchedule(index)} color="#cc3333" />
          </View>
        )}
      />

      <Button title="Thêm lịch hẹn" onPress={() => setShowAddScheduleModal(true)} />
      </View>
      )}

      {deviceControl.autoStatus === 1 && (
        <Text style={{ fontSize: 16, marginVertical: 5, textAlign: 'center' }}>
            Chế độ tự động đang bật. Không thể thao tác với lịch hẹn.
        </Text>
      )}

      <Modal
        visible={showAddScheduleModal}
        animationType="slide"
        onRequestClose={() => setShowAddScheduleModal(false)}
      >
        <View style={{ padding: 20 }}>
          <Text>Chọn giờ mới:</Text>
          <Button title="Chọn giờ" onPress={() => setShowTimePicker(true)} />
          <Button title="Thêm lịch" onPress={handleAddSchedule} />
          <Button title="Đóng" onPress={() => setShowAddScheduleModal(false)} />
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        date={newTime || new Date()}
        onConfirm={handleTimePickerConfirm}
        onCancel={handleTimePickerCancel}
      />

      <View style= {{ margin : 10 }}>
        <Button title="Lưu" onPress={handleSave} disabled={!isModified} />
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
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgb(200, 200, 200)'
  },
  header2: {
    fontSize: 16,
    marginVertical: 5,
  },
  header1: {
    fontSize: 18,
    fontWeight: 'bold',
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
  itemText: {
    fontSize: 14,
    marginVertical: 5,
  },
});

export default SchedulePage;
