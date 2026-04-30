import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, TextInput, Alert, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Activity, User, AlertCircle, Thermometer, Heart, Wind, Search } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { relativeAPI } from '../services/api';

export default function RelativeDashboardScreen() {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [linking, setLinking] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await relativeAPI.getPatients();
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Error fetching linked patients:', error);
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

  const handleLinkPatient = async () => {
    if (!searchName.trim()) {
      Alert.alert('Error', 'Please enter a patient name');
      return;
    }
    
    setLinking(true);
    try {
      await relativeAPI.linkPatient(searchName.trim());
      Alert.alert('Success', `Successfully linked to ${searchName}`);
      setSearchName('');
      fetchPatients(); // Refresh the list
    } catch (error) {
      console.error('Error linking patient:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to link patient');
    } finally {
      setLinking(false);
    }
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
    // Prefer the new profile-level vitals as requested by user, fallback to latestVitals
    const displayVitals = {
      temperature: item.profile?.currentTemperature || item.latestVitals?.temperature,
      heartRate: item.profile?.currentHeartRate || item.latestVitals?.heartRate,
      spO2: item.latestVitals?.spO2
    };

    const hasData = displayVitals.temperature || displayVitals.heartRate || displayVitals.spO2;
    const statusColor = getStatusColor(hasData ? displayVitals : null, item.recentAlerts);
    
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.patientInfo}>
            <User color="#374151" size={20} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.relationText}>Relation: {item.relation}</Text>
            </View>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        </View>

        {hasData ? (
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Heart color="#ef4444" size={16} />
              <Text style={styles.vitalValue}>{displayVitals.heartRate ? displayVitals.heartRate + ' bpm' : '--'}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Thermometer color="#f59e0b" size={16} />
              <Text style={styles.vitalValue}>{displayVitals.temperature ? displayVitals.temperature + '°C' : '--'}</Text>
            </View>
            <View style={styles.vitalItem}>
              <Wind color="#3b82f6" size={16} />
              <Text style={styles.vitalValue}>{displayVitals.spO2 ? displayVitals.spO2 + '%' : '--'}</Text>
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
          <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0]}</Text>
          <Text style={styles.subtitle}>Family Monitoring</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut color="#ef4444" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search color="#9ca3af" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Link Patient by Name..."
            value={searchName}
            onChangeText={setSearchName}
            autoCapitalize="words"
          />
        </View>
        <TouchableOpacity 
          style={[styles.linkBtn, (!searchName.trim() || linking) && styles.linkBtnDisabled]}
          onPress={handleLinkPatient}
          disabled={!searchName.trim() || linking}
        >
          {linking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.linkBtnText}>Link</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : patients.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No family members linked to you yet.</Text>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1f2937',
  },
  linkBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  linkBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  linkBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  relationText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    textTransform: 'capitalize'
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
