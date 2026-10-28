import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { getMe } from '../../services/authService';

export default function ProfileScreen() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    getMe(token)
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((e) => {
        if (active) setError(e.message || 'Profil gagal dimuat.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, reloadKey]);

  function retryLoadProfile() {
    setProfile(null);
    setError('');
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <ActivityIndicator size="large" color="#208AEF" />
        <Text style={styles.statusText}>Memuat profil...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <Text style={styles.errorTitle}>Profil tidak dapat dimuat</Text>
        <Text style={styles.statusText}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={retryLoadProfile}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Coba lagi</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Informasi Akun</Text>
        <View style={styles.card}>
          <ProfileRow label="Nama" value={profile.nama} />
          <ProfileRow label="Email" value={profile.email} />
          <ProfileRow label="ID Pengguna" value={String(profile.id)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flexGrow: 1, padding: 24, paddingTop: 28 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  heading: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
  },
  label: { color: '#6B7280', fontSize: 14, marginBottom: 6 },
  value: { color: '#111827', fontSize: 17, fontWeight: '500' },
  statusText: { color: '#4B5563', fontSize: 16, marginTop: 12, textAlign: 'center' },
  errorTitle: { color: '#111827', fontSize: 19, fontWeight: '700' },
  retryButton: {
    backgroundColor: '#208AEF',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  retryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
