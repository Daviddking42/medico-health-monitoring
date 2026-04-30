import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Activity, User, AlertCircle, Thermometer, Heart, Wind } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';

export default function DoctorDashboardScreen() {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await doctorAPI.getPatients();
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  const getStatusColor = (vitals, alerts) => {
    if (alerts && alerts.length > 0) return '#ef4444'; // Red for active alerts
    if (!vitals) return '#9ca3af'; // Gray for no data
    
    // Check for abnormal vitals
    if (
      vitals.temperature > 38 || vitals.temperature < 36 ||
      vitals.heartRate > 100 || vitals.heartRate < 60 ||
      vitals.spO2 < 95
    ) {
      return '#f59e0b'; // Yellow/Orange for abnormal
    }
    
    return '#10b981'; // Green for normal
  };

  const renderPatientCard = ({ item }) => {
    const statusColor = getStatusColor(item.latestVitals, item.recentAlerts);
    
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.patientInfo}>
            <User color="#374151" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.patientName}>{item.name}</Text>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        </View>

        {item.latestVitals ? (
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Heart color="#ef4444" size={16} />
              <Text style={styles.vitalValue}>{item.latestVitals.heartRate} bpm</Text>
            </View>
            <View style={styles.vitalItem}>
              <Thermometer color="#f59e0b" size={16} />
              <Text style={styles.vitalValue}>{item.latestVitals.temperature}°C</Text>
            </View>
            <View style={styles.vitalItem}>
              <Wind color="#3b82f6" size={16} />
              <Text style={styles.vitalValue}>{item.latestVitals.spO2}%</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>No recent vitals recorded.</Text>
        )}

        {item.recentAlerts && item.recentAlerts.length > 0 && (
          <View style={styles.alertContainer}>
            <AlertCircle color="#ef4444" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.alertText}>{item.recentAlerts[0].message}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Dr. {user?.name.split(' ')[1] || user?.name}</Text>
          <Text style={styles.subtitle}>Patient Overview</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut color="#ef4444" size={24} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : patients.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No patients assigned to you yet.</Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPatientCard}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutBtn: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vitalValue: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  noDataText: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  alertText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  }
});
