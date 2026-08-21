import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CalendarDays, Clock3, Zap, Truck, Check } from 'lucide-react-native';
import { Screen, ScreenHeader, PrimaryButton } from '../../lib/ui';
import { C, F } from '../../lib/theme';
import { DELIVERY_FEE, money } from '../../lib/catalog';

const TIME_SLOTS = [
  { label: '8:00 – 10:00 AM', start: '08:00', end: '10:00' },
  { label: '10:00 AM – 12:00 PM', start: '10:00', end: '12:00' },
  { label: '2:00 – 4:00 PM', start: '14:00', end: '16:00' },
  { label: '4:00 – 6:00 PM', start: '16:00', end: '18:00' },
];

export default function PickupScreen() {
  const params = useLocalSearchParams<{ serviceId: string; weight: string; addressId: string }>();
  const [selectedDay, setSelectedDay] = useState(0);
  const [slot, setSlot] = useState<typeof TIME_SLOTS[0] | null>(null);
  const [deliveryType, setDeliveryType] = useState<'standard' | 'priority'>('standard');
  const [instructions, setInstructions] = useState('');

  const date = new Date();
  date.setDate(date.getDate() + selectedDay);

  const days = [
    { label: 'Hoy', value: 0 },
    { label: 'Manana', value: 1 },
    { label: 'En 2 dias', value: 2 },
  ].map((d) => {
    const dt = new Date();
    dt.setDate(dt.getDate() + d.value);
    return { ...d, dateLabel: dt.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' }) };
  });

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <ScreenHeader title="Fecha y horario" sub="Paso 3 de 4 · Cuando pasamos" onBack={() => router.back()} />

        <Text style={s.label}><CalendarDays size={13} color={C.navy} strokeWidth={2.4} />  Dia de recogida</Text>
        <View style={s.dayRow}>
          {days.map((d) => {
            const active = selectedDay === d.value;
            return (
              <Pressable key={d.value} onPress={() => setSelectedDay(d.value)} style={[s.dayChip, active && s.dayChipActive]} accessibilityRole="button" accessibilityLabel={d.label}>
                <Text style={[s.dayLabel, active && { color: '#FFFFFF' }]}>{d.label}</Text>
                <Text style={[s.dayDate, active && { color: 'rgba(255,255,255,0.75)' }]}>{d.dateLabel}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={s.label}><Clock3 size={13} color={C.navy} strokeWidth={2.4} />  Horario</Text>
        <View style={s.slots}>
          {TIME_SLOTS.map((t) => {
            const active = slot?.start === t.start;
            return (
              <Pressable key={t.start} onPress={() => setSlot(t)} style={[s.slot, active && s.slotActive]} accessibilityRole="button" accessibilityLabel={t.label}>
                <Text style={[s.slotText, active && { color: C.navy }]}>{t.label}</Text>
                <View style={[s.radio, active && s.radioActive]}>
                  {active && <Check size={11} color="#FFFFFF" strokeWidth={3.4} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={s.label}><Truck size={13} color={C.navy} strokeWidth={2.4} />  Tipo de entrega</Text>
        <View style={s.deliveryRow}>
          <Pressable onPress={() => setDeliveryType('standard')} style={[s.deliveryCard, deliveryType === 'standard' && s.deliveryActive]}>
            <Truck size={17} color={deliveryType === 'standard' ? '#FFFFFF' : C.blue} strokeWidth={2.1} />
            <Text style={[s.deliveryName, deliveryType === 'standard' && { color: '#FFFFFF' }]}>Estandar</Text>
            <Text style={[s.deliveryPrice, deliveryType === 'standard' && { color: 'rgba(255,255,255,0.8)' }]}>{money(DELIVERY_FEE.standard)}</Text>
          </Pressable>
          <Pressable onPress={() => setDeliveryType('priority')} style={[s.deliveryCard, deliveryType === 'priority' && s.deliveryActive]}>
            <Zap size={17} color={deliveryType === 'priority' ? '#FFFFFF' : C.blue} strokeWidth={2.1} />
            <Text style={[s.deliveryName, deliveryType === 'priority' && { color: '#FFFFFF' }]}>Prioritario</Text>
            <Text style={[s.deliveryPrice, deliveryType === 'priority' && { color: 'rgba(255,255,255,0.8)' }]}>{money(DELIVERY_FEE.priority)}</Text>
          </Pressable>
        </View>

        <Text style={s.label}>Notas adicionales (opcional)</Text>
        <TextInput
          style={s.notes}
          placeholder="Ej: ropa delicada, colores claros..."
          placeholderTextColor="#A8B6CB"
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        <View style={{ marginTop: 24 }}>
          <PrimaryButton
            label="Continuar"
            disabled={!slot}
            onPress={() => router.push({
              pathname: '/checkout/confirm',
              params: { ...params, pickupDate: date.toISOString().split('T')[0], timeStart: slot!.start, timeEnd: slot!.end, deliveryType, instructions },
            })}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  label: { flexDirection: 'row', alignItems: 'center', fontFamily: F.bB, fontSize: 12, color: C.navy, marginTop: 22, marginBottom: 10, paddingHorizontal: 20 },
  dayRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  dayChip: { flex: 1, backgroundColor: C.card, borderRadius: 15, borderWidth: 1.5, borderColor: C.line, paddingVertical: 12, alignItems: 'center' },
  dayChipActive: { backgroundColor: C.navy, borderColor: C.navy },
  dayLabel: { fontFamily: F.bB, fontSize: 12.5, color: C.muted },
  dayDate: { fontFamily: F.bM, fontSize: 10, color: C.muted, marginTop: 3 },
  slots: { paddingHorizontal: 20, gap: 9 },
  slot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, borderRadius: 15, borderWidth: 1.5, borderColor: C.line, paddingVertical: 14, paddingHorizontal: 15 },
  slotActive: { borderColor: C.blue, backgroundColor: C.blueSoft },
  slotText: { fontFamily: F.bSb, fontSize: 13, color: C.muted },
  radio: { width: 21, height: 21, borderRadius: 11, borderWidth: 2, borderColor: '#C7D4E6', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: C.blue, backgroundColor: C.blue },
  deliveryRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  deliveryCard: { flex: 1, backgroundColor: C.card, borderRadius: 16, borderWidth: 1.5, borderColor: C.line, paddingVertical: 15, alignItems: 'center', gap: 6 },
  deliveryActive: { backgroundColor: C.blue, borderColor: C.blue },
  deliveryName: { fontFamily: F.dSb, fontSize: 13, color: C.navy },
  deliveryPrice: { fontFamily: F.bB, fontSize: 11.5, color: C.muted },
  notes: { marginHorizontal: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 13, fontFamily: F.bM, fontSize: 13, color: C.ink, height: 80, textAlignVertical: 'top' },
});
