import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function DriverLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Completa todos los campos'); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { Alert.alert('Error', 'Credenciales invalidas'); return; }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    if (profile?.role !== 'driver') {
      await supabase.auth.signOut();
      Alert.alert('Acceso denegado', 'Esta app es solo para repartidores');
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🚚</Text>
          <Text style={styles.brand}>LavaYa Driver</Text>
          <Text style={styles.tagline}>Tu tiempo vale mas</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.title}>Acceso Repartidor</Text>
          <TextInput style={styles.input} placeholder="correo@lavaya.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={[styles.input, { marginTop: 12 }]} placeholder="Contrasena" value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Ingresar</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 56, marginBottom: 8 },
  brand: { fontSize: 32, fontWeight: '700', color: '#17365D', letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#718096', marginTop: 4 },
  form: { backgroundColor: '#FFF', borderRadius: 16, padding: 24 },
  title: { fontSize: 20, fontWeight: '600', color: '#17365D', marginBottom: 20 },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D' },
  button: { backgroundColor: '#17365D', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
