import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DoctorDashboardScreen from './src/screens/DoctorDashboardScreen';
import RelativeDashboardScreen from './src/screens/RelativeDashboardScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.role === 'DOCTOR' ? (
          <Stack.Screen name="DoctorDashboard" component={DoctorDashboardScreen} />
        ) : user.role === 'RELATIVE' ? (
          <Stack.Screen name="RelativeDashboard" component={RelativeDashboardScreen} />
        ) : (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        )
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
