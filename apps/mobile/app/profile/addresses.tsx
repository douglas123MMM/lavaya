import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DEMO_ADDRESSES } from '../../lib/demo';

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<any[]>(DEMO_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Casa', address_line: '', instructions: '' });

  const saveAddress = () => {
    if (!form.address_line) { Alert.alert('Error', 'Ingresa la direccion'); return; }
    setAddresses([...addresses, { id: `addr-${Date.now()}`, customer_id: 'demo', label: form.label, address_line: form.address_line, city: '', state: '', country: '', latitude: null, longitude: null, instructions: form.instructions || null, is_default: false }]);
    setForm({ label: 'Casa', address_line: '', instructions: '' });
    setShowForm(false);
    Alert.alert('Demo', 'Direccion guardada');
  };

  const deleteAddr = (id: string) => { setAddresses(addresses.filter((a) => a.id !== id)); };
  const setDefault = (id: string) => { setAddresses(addresses.map((a) => ({ ...a, is_default: a.id === id }))); };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← Volver</Text></TouchableOpacity>
        <Text style={styles.title}>Mis direcciones</Text>
      </View>
      <FlatList data={addresses} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              {item.is_default && <Text style={styles.defaultBadge}>Principal</Text>}
            </View>
            <Text style={styles.cardAddress}>{item.address_line}</Text>
            {item.instructions && <Text style={styles.cardInstructions}>📝 {item.instructions}</Text>}
            <View style={styles.cardActions}>
              {!item.is_default && <TouchableOpacity onPress={() => setDefault(item.id)}><Text style={styles.actionText}>Hacer principal</Text></TouchableOpacity>}
              <TouchableOpacity onPress={() => deleteAddr(item.id)}><Text style={styles.deleteText}>Eliminar</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
      {!showForm ? (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}><Text style={styles.addButtonText}>+ Agregar nueva direccion</Text></TouchableOpacity>
      ) : (
        <View style={styles.formCard}>
          <View style={styles.labelRow}>
            {['Casa', 'Trabajo', 'Oficina', 'Otra'].map((l) => (
              <TouchableOpacity key={l} style={[styles.chip, form.label === l && styles.chipActive]} onPress={() => setForm({ ...form, label: l })}>
                <Text style={[styles.chipText, form.label === l && styles.chipTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} placeholder="Direccion" value={form.address_line} onChangeText={(t) => setForm({ ...form, address_line: t })} />
          <TextInput style={styles.input} placeholder="Instrucciones (opcional)" value={form.instructions} onChangeText={(t) => setForm({ ...form, instructions: t })} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <TouchableOpacity onPress={() => setShowForm(false)}><Text style={{ fontSize: 14, color: '#718096', paddingVertical: 10 }}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#146BDB', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 }} onPress={saveAddress}><Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>Guardar</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 12 },
  backText: { fontSize: 15, color: '#146BDB', fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D', marginTop: 8 },
  list: { paddingHorizontal: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E4ECF5' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: 15, fontWeight: '600', color: '#17365D' },
  defaultBadge: { fontSize: 11, color: '#146BDB', backgroundColor: '#EBF4FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontWeight: '600' },
  cardAddress: { fontSize: 14, color: '#4A5568', marginTop: 4 },
  cardInstructions: { fontSize: 13, color: '#A0AEC0', marginTop: 4 },
  cardActions: { flexDirection: 'row', gap: 16, marginTop: 10 },
  actionText: { fontSize: 13, color: '#146BDB', fontWeight: '500' },
  deleteText: { fontSize: 13, color: '#E53E3E', fontWeight: '500' },
  addButton: { marginHorizontal: 20, marginTop: 16, marginBottom: 30, borderWidth: 1, borderColor: '#146BDB', borderStyle: 'dashed', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  addButtonText: { fontSize: 14, color: '#146BDB', fontWeight: '500' },
  formCard: { marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 30, borderWidth: 1, borderColor: '#E4ECF5' },
  labelRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5' },
  chipActive: { backgroundColor: '#EBF4FF', borderColor: '#146BDB' },
  chipText: { fontSize: 13, color: '#718096' },
  chipTextActive: { color: '#146BDB', fontWeight: '600' },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D', marginBottom: 10 },
});
