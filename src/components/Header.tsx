import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; // Import type RootStackParamList từ App.tsx

// Định nghĩa NavigationProp sử dụng kiểu RootStackParamList
type NavigationProp = StackNavigationProp<RootStackParamList>;

const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute()

  return (
    <View style={styles.container}>
      {/* Góc trái */}
      <View style={styles.leftContainer}>
        <TouchableOpacity 
          style={route.name === 'SchedulePage' ? styles.activeButton : styles.button}  
          onPress={() => navigation.navigate('SchedulePage')}
        >
          <Text style={route.name === 'SchedulePage' ? styles.activeButtonText : styles.buttonText}>Cấu hình</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={route.name === 'HistoryFeedPage' ? styles.activeButton : styles.button} 
          onPress={() => navigation.navigate('HistoryFeedPage')}
        >
          <Text style={route.name === 'HistoryFeedPage' ? styles.activeButtonText : styles.buttonText}>Theo dõi</Text>
        </TouchableOpacity>
      </View>

      {/* Góc phải */}
      <IconButton
        icon="cogs"
        size={24}
        onPress={() => navigation.navigate('SettingPage')}
        iconColor={route.name === 'SettingPage' ? '#007bff' : '#000'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  settingsButton: {
    padding: 5,
  },
  activeButton: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#000',
    borderRadius: 5, // Màu của nút khi trang hiện tại được chọn
  },
  activeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Header;
