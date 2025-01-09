import { Alert, Platform } from 'react-native';

// Hàm hiển thị thông báo
export const showAlert = (message: string, title: string = 'Notification', buttons: { text: string; onPress: () => void }[] = []) => {
  if (Platform.OS === 'web') {
    // Dùng window.alert cho web
    window.alert(message);
  } else {
    // Dùng Alert của React Native cho các nền tảng khác (Android/iOS)
    if (buttons.length === 0) {
        Alert.alert(title, message);
      } else {
        Alert.alert(title, message, buttons);
      }
  }
};
