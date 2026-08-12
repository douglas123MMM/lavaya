import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

export default function ServiceSelectionScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId?: string }>();
  const [estimatedWeight, setEstimatedWeight] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.step}>Paso 1 de 4</Text>
        <Text style={styles.title}>Selecciona el servicio</Text>

        <TouchableOpacity
          style={[styles.card, !serviceId && styles.cardSelected]}
          onPress={() => router.setParams({ serviceId: (serviceId ? undefined : 'wash') })}
        >
          <Text style={styles.cardIcon}>🫧</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Lavar</Text>
            <Text style={styles.cardDesc}>Lavado profesional con productos premium</Text>
            <Text style={styles.cardPrice}>$1.50/kg</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.cardIcon}>👔</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Planchar</Text>
            <Text style={styles.cardDesc}>Planchado profesional prenda por prenda</Text>
            <Text style={styles.cardPrice}>$2.00/kg</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🧺</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Lavar + Planchar</Text>
            <Text style={styles.cardDesc}>Servicio completo de lavado y planchado</Text>
            <Text style={styles.cardPrice}>$3.00/kg</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Peso estimado (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 5"
          value={estimatedWeight}
          onChangeText={setEstimatedWeight}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={[styles.button, !estimatedWeight && styles.buttonDisabled]}
          disabled={!estimatedWeight}
          onPress={() => router.push({
            pathname: '/checkout/address',
            params: { serviceId: serviceId || 'wash', weight: estimatedWeight },
          })}
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
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E4ECF5' },
  cardSelected: { borderColor: '#146BDB', borderWidth: 2, backgroundColor: '#EBF4FF' },
  cardIcon: { fontSize: 36, marginRight: 14 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#17365D' },
  cardDesc: { fontSize: 14, color: '#718096', marginTop: 2 },
  cardPrice: { fontSize: 15, fontWeight: '600', color: '#146BDB', marginTop: 4 },
  label: { fontSize: 15, fontWeight: '600', color: '#17365D', marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4ECF5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#17365D' },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
