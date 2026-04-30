import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const LoginScreen = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const { login } = useAuth();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('PATIENT');
  const [regPatientName, setRegPatientName] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPassword || !regRole) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (regRole === 'RELATIVE' && !regPatientName.trim()) {
      Alert.alert('Error', 'Please enter the name of the patient you are related to');
      return;
    }

    setRegLoading(true);
    try {
      const payload = {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole
      };
      if (regRole === 'RELATIVE') {
        payload.patientName = regPatientName.trim();
      }

      await authAPI.register(payload);
      Alert.alert('Success', 'Account created! You can now log in.', [
        { text: 'OK', onPress: () => setMode('login') }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.title}>🏥 Medico</Text>
        <Text style={styles.subtitle}>Health Monitoring System</Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'register' && styles.tabActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Login Form */}
        {mode === 'login' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={loginEmail}
              onChangeText={setLoginEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={regName}
              onChangeText={setRegName}
              autoCapitalize="words"
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={regEmail}
              onChangeText={setRegEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={regPassword}
              onChangeText={setRegPassword}
              secureTextEntry
              placeholderTextColor="#94a3b8"
            />

            {/* Role Selector */}
            <Text style={styles.label}>Register as:</Text>
            <View style={styles.roleContainer}>
              {['PATIENT', 'DOCTOR', 'RELATIVE'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, regRole === r && styles.roleBtnActive]}
                  onPress={() => setRegRole(r)}
                >
                  <Text style={[styles.roleBtnText, regRole === r && styles.roleBtnTextActive]}>
                    {r === 'PATIENT' ? '🤒 Patient' : r === 'DOCTOR' ? '👨‍⚕️ Doctor' : '👨‍👩‍👧 Relative'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Show Patient Name field ONLY when RELATIVE is selected */}
            {regRole === 'RELATIVE' && (
              <View style={styles.patientLinkBox}>
                <Text style={styles.patientLinkLabel}>👤 Patient Name</Text>
                <Text style={styles.patientLinkHint}>Enter the exact full name of the patient you are related to.</Text>
                <TextInput
                  style={[styles.input, styles.inputHighlight]}
                  placeholder="e.g. John Smith"
                  value={regPatientName}
                  onChangeText={setRegPatientName}
                  autoCapitalize="words"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={regLoading}
            >
              {regLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4f46e5',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#1e293b',
  },
  inputHighlight: {
    borderColor: '#4f46e5',
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleBtnActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  roleBtnText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  roleBtnTextActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  patientLinkBox: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  patientLinkLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3730a3',
    marginBottom: 4,
  },
  patientLinkHint: {
    fontSize: 12,
    color: '#6366f1',
    marginBottom: 10,
  },
});

export default LoginScreen;
