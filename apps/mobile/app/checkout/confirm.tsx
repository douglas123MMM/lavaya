import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { DEMO_SERVICES } from '../../lib/demo';

export default function ConfirmScreen() {
  const params = useLocalSearchParams<{ serviceId: string; weight: string; addressId: string; pickupDate: string; timeStart: string; timeEnd: string; deliveryType: string }>();
  const [loading, setLoading] = useState(false);

  const service = DEMO_SERVICES.find((s) => s.id === params.serviceId) || DEMO_SERVICES[2];
  const weight = parseFloat(params.weight || '5');
  const deliveryFee = params.deliveryType === 'priority' ? 5.0 : 3.0;
  const subtotal = weight * service.base_price;
  const total = subtotal + deliveryFee;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Pedido creado', 'Tu pedido ha sido registrado (demo). Te notificaremos cuando sea asignado.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.step}>Paso 4 de 4</Text>
        <Text style={styles.title}>Confirmar pedido</Text>

        <View style={styles.summaryCard}>
          <Row label="Servicio" value={service.name} />
          <Row label="Peso estimado" value={`${weight} kg`} />
          <Row label="Fecha" value={params.pickupDate || 'Hoy'} />
          <Row label="Horario" value={`${params.timeStart || '14:00'} - ${params.timeEnd || '16:00'}`} />
          <Row label="Entrega" value={params.deliveryType === 'priority' ? 'Prioritaria' : 'Estandar'} />
          <View style={styles.divider} />
          <Row label={`Servicio (${weight}kg x $${service.base_price})`} value={`$${subtotal.toFixed(2)}`} />
          <Row label="Delivery" value={`$${deliveryFee.toFixed(2)}`} />
          <View style={styles.divider} />
          <Row label="Total" value={`$${total.toFixed(2)}`} bold />
        </View>

        <Text style={styles.disclaimer}>* Precio estimado. El total final se confirmara despues de pesar tu ropa.</Text>

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleConfirm} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creando...' : `Confirmar pedido - $${total.toFixed(2)}`}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}><Text style={{ fontSize: 15, color: '#4A5568' }}>{label}</Text><Text style={{ fontSize: 15, fontWeight: bold ? '700' : '500', color: bold ? '#146BDB' : '#17365D' }}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', marginBottom: 8 },
  backText: { fontSize: 15, color: '#146BDB', fontWeight: '500' },
  step: { fontSize: 13, color: '#718096', fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D', marginTop: 4, marginBottom: 20 },
  summaryCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#E4ECF5' },
  divider: { height: 1, backgroundColor: '#E4ECF5', marginVertical: 8 },
  disclaimer: { fontSize: 13, color: '#A0AEC0', marginTop: 10, fontStyle: 'italic' },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
