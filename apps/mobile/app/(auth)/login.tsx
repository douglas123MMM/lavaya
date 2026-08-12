import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingresa tu correo y contrasena');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message === 'Invalid login credentials'
        ? 'Correo o contrasena incorrectos'
        : 'No pudimos iniciar sesion. Intenta nuevamente.');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🧺</Text>
          <Text style={styles.brand}>LavaYa</Text>
          <Text style={styles.tagline}>Tu tiempo vale mas</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Iniciar sesion</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electronico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@correo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contrasena</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu contrasena"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>

          <Link href="/(auth)/register" style={styles.link}>
            <Text style={styles.linkText}>No tienes cuenta? <Text style={styles.linkBold}>Registrate</Text></Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 48, marginBottom: 8 },
  brand: { fontSize: 32, fontWeight: '700', color: '#146BDB', letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#718096', marginTop: 4 },
  form: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 20, fontWeight: '600', color: '#17365D', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#17365D', marginBottom: 6 },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D' },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  link: { alignSelf: 'center', marginTop: 20 },
  linkText: { fontSize: 14, color: '#718096' },
  linkBold: { color: '#146BDB', fontWeight: '600' },
});
