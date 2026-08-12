import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function AddressScreen() {
  const params = useLocalSearchParams<{ serviceId: string; weight: string }>();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Casa', address_line: '', instructions: '' });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('addresses').select('*').eq('customer_id', user.id);
        setAddresses(data || []);
        if (data && data.length > 0) setSelectedId(data.find((a: any) => a.is_default)?.id || data[0].id);
      }
    })();
  }, []);

  const saveAddress = async () => {
    if (!newAddress.address_line) { Alert.alert('Error', 'Ingresa la direccion'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('addresses').insert({
      customer_id: user.id,
      label: newAddress.label,
      address_line: newAddress.address_line,
      instructions: newAddress.instructions || null,
    }).select().single();
    if (error) { Alert.alert('Error', 'No se pudo guardar la direccion'); return; }
    setAddresses([...addresses, data]);
    setSelectedId(data.id);
    setShowNew(false);
    setNewAddress({ label: 'Casa', address_line: '', instructions: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.step}>Paso 2 de 4</Text>
        <Text style={styles.title}>Direccion de recogida</Text>

        {addresses.map((addr) => (
          <TouchableOpacity
            key={addr.id}
            style={[styles.card, selectedId === addr.id && styles.cardSelected]}
            onPress={() => setSelectedId(addr.id)}
          >
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>{addr.label}</Text>
              {addr.is_default && <Text style={styles.defaultBadge}>Principal</Text>}
            </View>
            <Text style={styles.cardAddress}>{addr.address_line}</Text>
            {addr.instructions && <Text style={styles.cardInstructions}>📝 {addr.instructions}</Text>}
          </TouchableOpacity>
        ))}

        {!showNew ? (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowNew(true)}>
            <Text style={styles.addButtonText}>+ Agregar nueva direccion</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.newForm}>
            <Text style={styles.label}>Etiqueta</Text>
            <View style={styles.labelRow}>
              {['Casa', 'Trabajo', 'Oficina', 'Otra'].map((l) => (
                <TouchableOpacity key={l} style={[styles.labelChip, newAddress.label === l && styles.labelChipActive]} onPress={() => setNewAddress({ ...newAddress, label: l })}>
                  <Text style={[styles.labelChipText, newAddress.label === l && styles.labelChipTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Direccion</Text>
            <TextInput style={styles.input} placeholder="Av. Principal, Edificio, Piso" value={newAddress.address_line} onChangeText={(t) => setNewAddress({ ...newAddress, address_line: t })} />
            <Text style={styles.label}>Instrucciones (opcional)</Text>
            <TextInput style={styles.input} placeholder="Ej: Tocar el timbre 3B" value={newAddress.instructions} onChangeText={(t) => setNewAddress({ ...newAddress, instructions: t })} />
            <TouchableOpacity style={styles.saveButton} onPress={saveAddress}>
              <Text style={styles.saveButtonText}>Guardar direccion</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, !selectedId && styles.buttonDisabled]}
          disabled={!selectedId}
          onPress={() => router.push({ pathname: '/checkout/pickup', params: { ...params, addressId: selectedId! } })}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', marginBottom: 8 },
  backText: { fontSize: 15, color: '#146BDB', fontWeight: '500' },
  step: { fontSize: 13, color: '#718096', fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D', marginTop: 4, marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E4ECF5' },
  cardSelected: { borderColor: '#146BDB', borderWidth: 2, backgroundColor: '#EBF4FF' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 15, fontWeight: '600', color: '#17365D' },
  defaultBadge: { fontSize: 11, color: '#146BDB', backgroundColor: '#EBF4FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontWeight: '600' },
  cardAddress: { fontSize: 14, color: '#4A5568', marginTop: 4 },
  cardInstructions: { fontSize: 13, color: '#A0AEC0', marginTop: 4 },
  addButton: { borderWidth: 1, borderColor: '#146BDB', borderStyle: 'dashed', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 20 },
  addButtonText: { fontSize: 14, color: '#146BDB', fontWeight: '500' },
  newForm: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E4ECF5' },
  label: { fontSize: 14, fontWeight: '500', color: '#17365D', marginBottom: 6, marginTop: 10 },
  labelRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  labelChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5' },
  labelChipActive: { backgroundColor: '#EBF4FF', borderColor: '#146BDB' },
  labelChipText: { fontSize: 13, color: '#718096' },
  labelChipTextActive: { color: '#146BDB', fontWeight: '600' },
  input: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D' },
  saveButton: { backgroundColor: '#18A56A', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 14 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
