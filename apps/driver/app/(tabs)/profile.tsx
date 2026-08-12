import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function DriverProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
      setLoading(false);
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert('Cerrar sesion', 'Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: async () => { await supabase.auth.signOut(); router.replace('/login'); } },
    ]);
  };

  if (loading) {
    return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#17365D" style={{ marginTop: 100 }} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Perfil</Text></View>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{profile?.full_name?.charAt(0)?.toUpperCase() || 'R'}</Text></View>
        <View>
          <Text style={styles.name}>{profile?.full_name || 'Repartidor'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesion</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#E4ECF5' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#17365D', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  name: { fontSize: 18, fontWeight: '600', color: '#17365D' },
  email: { fontSize: 14, color: '#718096', marginTop: 2 },
  logoutButton: { marginHorizontal: 20, marginTop: 30, backgroundColor: '#FFF', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#FED7D7' },
  logoutText: { color: '#E53E3E', fontSize: 15, fontWeight: '600' },
});
