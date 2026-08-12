import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const DAYS = [
  { label: 'Hoy', value: 0 },
  { label: 'Manana', value: 1 },
  { label: 'En 2 dias', value: 2 },
];

const TIME_SLOTS = [
  { label: '8:00 AM - 10:00 AM', start: '08:00', end: '10:00' },
  { label: '10:00 AM - 12:00 PM', start: '10:00', end: '12:00' },
  { label: '2:00 PM - 4:00 PM', start: '14:00', end: '16:00' },
  { label: '4:00 PM - 6:00 PM', start: '16:00', end: '18:00' },
];

export default function PickupScreen() {
  const params = useLocalSearchParams<{ serviceId: string; weight: string; addressId: string }>();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<typeof TIME_SLOTS[0] | null>(null);
  const [deliveryType, setDeliveryType] = useState<'standard' | 'priority'>('standard');
  const [instructions, setInstructions] = useState('');

  const pickupDate = new Date();
  pickupDate.setDate(pickupDate.getDate() + selectedDay);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.step}>Paso 3 de 4</Text>
        <Text style={styles.title}>Fecha y horario</Text>

        <Text style={styles.sectionTitle}>Dia de recogida</Text>
        <View style={styles.dayRow}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[styles.dayChip, selectedDay === day.value && styles.dayChipActive]}
              onPress={() => setSelectedDay(day.value)}
            >
              <Text style={[styles.dayChipText, selectedDay === day.value && styles.dayChipTextActive]}>
                {day.label}
              </Text>
              <Text style={[styles.dayDate, selectedDay === day.value && styles.dayDateActive]}>
                {pickupDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Horario</Text>
        {TIME_SLOTS.map((slot, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.slotCard, selectedSlot?.start === slot.start && styles.slotCardActive]}
            onPress={() => setSelectedSlot(slot)}
          >
            <Text style={[styles.slotText, selectedSlot?.start === slot.start && styles.slotTextActive]}>
              {slot.label}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Tipo de entrega</Text>
        <View style={styles.deliveryRow}>
          <TouchableOpacity
            style={[styles.deliveryCard, deliveryType === 'standard' && styles.deliveryCardActive]}
            onPress={() => setDeliveryType('standard')}
          >
            <Text style={styles.deliveryType}>Estandar</Text>
            <Text style={styles.deliveryPrice}>$3.00</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deliveryCard, deliveryType === 'priority' && styles.deliveryCardActive]}
            onPress={() => setDeliveryType('priority')}
          >
            <Text style={styles.deliveryType}>Prioritario</Text>
            <Text style={styles.deliveryPrice}>$5.00</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, !selectedSlot && styles.buttonDisabled]}
          disabled={!selectedSlot}
          onPress={() => router.push({
            pathname: '/checkout/confirm',
            params: {
              ...params,
              pickupDate: pickupDate.toISOString().split('T')[0],
              timeStart: selectedSlot!.start,
              timeEnd: selectedSlot!.end,
              deliveryType,
              instructions,
            },
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
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#17365D', marginTop: 20, marginBottom: 10 },
  dayRow: { flexDirection: 'row', gap: 10 },
  dayChip: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E4ECF5' },
  dayChipActive: { borderColor: '#146BDB', backgroundColor: '#EBF4FF' },
  dayChipText: { fontSize: 14, fontWeight: '600', color: '#718096' },
  dayChipTextActive: { color: '#146BDB' },
  dayDate: { fontSize: 12, color: '#A0AEC0', marginTop: 4 },
  dayDateActive: { color: '#146BDB' },
  slotCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E4ECF5' },
  slotCardActive: { borderColor: '#146BDB', backgroundColor: '#EBF4FF' },
  slotText: { fontSize: 15, color: '#17365D' },
  slotTextActive: { color: '#146BDB', fontWeight: '600' },
  deliveryRow: { flexDirection: 'row', gap: 10 },
  deliveryCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E4ECF5' },
  deliveryCardActive: { borderColor: '#146BDB', backgroundColor: '#EBF4FF' },
  deliveryType: { fontSize: 15, fontWeight: '600', color: '#17365D' },
  deliveryPrice: { fontSize: 14, color: '#146BDB', marginTop: 4, fontWeight: '500' },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 30 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
