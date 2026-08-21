import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Mi pedido', 'Pago', 'Recogida', 'Entrega', 'Ropa danada', 'Ropa faltante', 'Suscripcion', 'Otro'];

export default function SupportScreen() {
  const [category, setCategory] = useState('Mi pedido');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject || !message) { Alert.alert('Error', 'Completa todos los campos'); return; }
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { Alert.alert('Error', 'Debes iniciar sesion'); setSending(false); return; }
    const { error } = await supabase.from('support_tickets').insert({
      customer_id: user.id, category, subject, message,
    });
    setSending(false);
    if (error) {
      Alert.alert('Error', 'No pudimos enviar tu mensaje. Intenta nuevamente.');
    } else {
      Alert.alert('Enviado', 'Tu mensaje ha sido recibido. Te contactaremos pronto.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ayuda y soporte</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Categoria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.categoryChip, category === cat && styles.categoryChipActive]} onPress={() => setCategory(cat)}>
                <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Asunto</Text>
          <TextInput style={styles.input} placeholder="Describe el problema brevemente" value={subject} onChangeText={setSubject} />

          <Text style={styles.label}>Mensaje</Text>
          <TextInput style={styles.textArea} placeholder="Cuentanos que sucede..." value={message} onChangeText={setMessage} multiline numberOfLines={5} textAlignVertical="top" />

          <TouchableOpacity style={styles.button} onPress={handleSend} disabled={sending}>
            <Text style={styles.buttonText}>{sending ? 'Enviando...' : 'Enviar mensaje'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', marginBottom: 8, marginTop: 20 },
  backText: { fontSize: 15, color: '#146BDB', fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D', marginBottom: 20 },
  form: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#E4ECF5' },
  label: { fontSize: 14, fontWeight: '500', color: '#17365D', marginBottom: 6, marginTop: 12 },
  categoryScroll: { flexDirection: 'row', marginBottom: 4 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5', marginRight: 8 },
  categoryChipActive: { backgroundColor: '#EBF4FF', borderColor: '#146BDB' },
  categoryText: { fontSize: 13, color: '#718096' },
  categoryTextActive: { color: '#146BDB', fontWeight: '600' },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D' },
  textArea: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D', minHeight: 120 },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
