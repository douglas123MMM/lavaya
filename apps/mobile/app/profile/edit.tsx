import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', user.id);
    if (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    } else {
      Alert.alert('Guardado', 'Tu perfil ha sido actualizado', [{ text: 'OK', onPress: () => router.back() }]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}><ActivityIndicator size="large" color="#146BDB" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar perfil</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{fullName?.charAt(0)?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        <Text style={styles.label}>Telefono</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+1 234 567 890" />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 12 },
  backText: { fontSize: 15, color: '#146BDB', fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D', marginTop: 8 },
  form: { paddingHorizontal: 20, marginTop: 20, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#146BDB', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
  label: { fontSize: 14, fontWeight: '500', color: '#17365D', alignSelf: 'flex-start', marginBottom: 6, marginTop: 14 },
  input: { width: '100%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D' },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%', marginTop: 24 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
