import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import CalendarScreen from './components/CalendarScreen';
import ManageParticipants from './components/ManageParticipants';
import CreateNotes from './components/CreateNotes';
import CreateMeeting from './components/CreateMeeting';
import AnalyzeStats from './components/AnalyzeStats';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Logowanie' }} />
        <Stack.Screen name="Registration" component={RegistrationScreen} options={{ title: 'Rejestracja' }} />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Kalendarz Spotkań' }} />
        <Stack.Screen name="ManageParticipants" component={ManageParticipants} options={{ title: 'Zarządzanie Uczestnikami' }} />
        <Stack.Screen name="CreateNotes" component={CreateNotes} options={{ title: 'Tworzenie Notatek' }} />
        <Stack.Screen name="CreateMeeting" component={CreateMeeting} options={{ title: 'Tworzenie Spotkań' }} />
        <Stack.Screen name="AnalyzeStats" component={AnalyzeStats} options={{ title: 'Analiza Statystyk' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
