import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { deviceAPI, alertAPI } from '../services/api';
import * as Location from 'expo-location';

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [devRes, alertRes] = await Promise.all([
        deviceAPI.getDevices(),
        alertAPI.getAlerts(),
      ]);
      setDevices(devRes.data.devices);
      setAlerts(alertRes.data.alerts);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>Hi, {user?.name} 👋</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Devices</Text>
        {devices.map((device) => (
          <View key={device.id} style={styles.card}>
            <Text style={styles.deviceName}>{device.deviceName}</Text>
            {device.deviceData?.[0] && (
              <View style={styles.statsGrid}>
                <Text style={styles.stat}>🌡️ {device.deviceData[0].temperature}°C</Text>
                <Text style={styles.stat}>❤️ {device.deviceData[0].heartRate} bpm</Text>
                <Text style={styles.stat}>🫁 {device.deviceData[0].spO2}%</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {alerts.map((alert) => (
          <View key={alert.id} style={[styles.alertCard, styles[alert.severity]]}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertType}>{alert.type}</Text>
              <Text style={styles.alertSeverity}>{alert.severity.toUpperCase()}</Text>
            </View>
            <Text style={styles.alertMessage}>{alert.message}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logout: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  alertType: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertSeverity: {
    fontSize: 12,
    fontWeight: '800',
  },
  critical: { borderLeftColor: '#ef4444' },
  high: { borderLeftColor: '#f97316' },
  medium: { borderLeftColor: '#4f46e5' },
  low: { borderLeftColor: '#22c55e' },
  alertMessage: {
    color: '#475569',
  },
});

export default DashboardScreen;
