import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !phone || !cedula) {
      Alert.alert('Error', 'Completa todos los campos (nombre, correo, cedula y telefono)');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contrasenas no coinciden');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          cedula: cedula.trim(),
          role: 'customer',
        },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message === 'User already registered'
        ? 'Este correo ya esta registrado'
        : 'No pudimos crear tu cuenta. Intenta nuevamente.');
    } else {
      Alert.alert(
        'Cuenta creada',
        'Tu cuenta esta pendiente de aprobacion por el administrador. Te notificaremos cuando sea verificada.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🧺</Text>
            <Text style={styles.brand}>LavaYa</Text>
            <Text style={styles.tagline}>Tu tiempo vale mas</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Crear cuenta</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput style={styles.input} placeholder="Tu nombre" value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cedula de identidad</Text>
              <TextInput style={styles.input} placeholder="V-12345678" value={cedula} onChangeText={setCedula} keyboardType="number-pad" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefono</Text>
              <TextInput style={styles.input} placeholder="0412-1234567" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electronico</Text>
              <TextInput style={styles.input} placeholder="tu@correo.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contrasena</Text>
              <TextInput style={styles.input} placeholder="Minimo 6 caracteres" value={password} onChangeText={setPassword} secureTextEntry />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contrasena</Text>
              <TextInput style={styles.input} placeholder="Repite tu contrasena" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            </View>

            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                Al registrarte, tu cuenta quedara en revision. El administrador la aprobara tras verificar tus datos antes de que puedas hacer pedidos.
              </Text>
            </View>

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
            </TouchableOpacity>

            <Link href="/(auth)/login" style={styles.link}>
              <Text style={styles.linkText}>Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesion</Text></Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 48, marginBottom: 8 },
  brand: { fontSize: 32, fontWeight: '700', color: '#146BDB', letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#718096', marginTop: 4 },
  form: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 20, fontWeight: '600', color: '#17365D', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#17365D', marginBottom: 6 },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D' },
  notice: { backgroundColor: '#FFF8E1', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F3D98B' },
  noticeText: { fontSize: 13, color: '#7A6200', lineHeight: 18 },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  link: { alignSelf: 'center', marginTop: 20 },
  linkText: { fontSize: 14, color: '#718096' },
  linkBold: { color: '#146BDB', fontWeight: '600' },
});