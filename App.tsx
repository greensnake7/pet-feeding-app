import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/pages/LoginPage';
import RegisterPage from './src/pages/RegisterPage';
import SchedulePage from './src/pages/SchedulePage';
import HistoryFeedPage from './src/pages/HistoryFeedPage';
import SettingPage from './src/pages/SettingPage';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  SchedulePage: undefined;
  HistoryFeedPage: undefined;
  SettingPage: undefined
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
        <Stack.Screen name="SchedulePage" component={SchedulePage} options={{ headerShown: false }}  />
        <Stack.Screen name="HistoryFeedPage" component={HistoryFeedPage} options={{ headerShown: false }} />
        <Stack.Screen name="SettingPage" component={SettingPage} options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
