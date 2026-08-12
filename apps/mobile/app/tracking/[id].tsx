import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DEMO_ORDERS } from '../../lib/demo';

const STATUS_FLOW = [
  { key: 'pending', label: 'Solicitud recibida' },
  { key: 'pickup_assigned', label: 'Repartidor asignado' },
  { key: 'en_route_pickup', label: 'En camino a recoger' },
  { key: 'picked_up', label: 'Ropa recogida' },
  { key: 'received_laundry', label: 'Recibida en lavanderia' },
  { key: 'washing', label: 'Lavando' },
  { key: 'drying', label: 'Secando' },
  { key: 'ironing', label: 'Planchando' },
  { key: 'ready', label: 'Lista' },
  { key: 'en_route_delivery', label: 'En camino al cliente' },
  { key: 'delivered', label: 'Entregada' },
];

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = DEMO_ORDERS.find((o) => o.id === id) || DEMO_ORDERS[0];
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentStepIndex = STATUS_FLOW.findIndex((s) => s.key === order.status);
  const serviceNames: Record<string, string> = { 'svc-wash': 'Lavar', 'svc-iron': 'Planchar', 'svc-full': 'Lavar + Planchar' };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Seguimiento</Text>
        <Text style={styles.orderNumber}>Pedido #{order.order_number}</Text>

        <View style={styles.infoCard}>
          <InfoRow label="Servicio" value={serviceNames[order.service_id] || 'Servicio'} />
          <InfoRow label="Peso estimado" value={`${order.estimated_weight} kg`} />
          <InfoRow label="Total" value={`$${order.total.toFixed(2)}`} />
          <InfoRow label="Fecha de recogida" value={order.pickup_date} />
        </View>

        <Text style={styles.sectionTitle}>Estado del pedido</Text>
        <View style={styles.timeline}>
          {STATUS_FLOW.map((step, index) => {
            const isComplete = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            return (
              <View key={step.key} style={styles.timelineItem}>
                <View style={[styles.dot, isComplete && styles.dotComplete, isCurrent && styles.dotCurrent]} />
                {index < STATUS_FLOW.length - 1 && <View style={[styles.line, isComplete && styles.lineComplete]} />}
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, isComplete && styles.timelineLabelComplete]}>{step.label}</Text>
                  {isCurrent && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Actual</Text></View>}
                </View>
              </View>
            );
          })}
        </View>

        {order.status === 'delivered' && !submitted && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Como fue tu experiencia?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Ionicons name={s <= rating ? 'star' : 'star-outline'} size={36} color={s <= rating ? '#D69E2E' : '#A0AEC0'} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.reviewButton} onPress={() => { setSubmitted(true); Alert.alert('Gracias!', 'Calificacion enviada (demo)'); }}>
              <Text style={styles.reviewButtonText}>Enviar calificacion</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}><Text style={{ fontSize: 14, color: '#718096' }}>{label}</Text><Text style={{ fontSize: 14, fontWeight: '500', color: '#17365D' }}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', marginBottom: 8 },
  backText: { fontSize: 15, color: '#146BDB', fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  orderNumber: { fontSize: 14, color: '#718096', marginTop: 4 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginTop: 20, borderWidth: 1, borderColor: '#E4ECF5' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#17365D', marginTop: 24, marginBottom: 16 },
  timeline: { paddingLeft: 4 },
  timelineItem: { flexDirection: 'row', marginBottom: 24, minHeight: 40 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E4ECF5', marginTop: 4, marginRight: 3 },
  dotComplete: { backgroundColor: '#18A56A' },
  dotCurrent: { backgroundColor: '#146BDB', width: 14, height: 14, borderRadius: 7 },
  line: { position: 'absolute', left: 5, top: 20, width: 2, height: 48, backgroundColor: '#E4ECF5' },
  lineComplete: { backgroundColor: '#18A56A' },
  timelineContent: { marginLeft: 16, flex: 1 },
  timelineLabel: { fontSize: 15, color: '#A0AEC0' },
  timelineLabelComplete: { color: '#17365D', fontWeight: '500' },
  currentBadge: { alignSelf: 'flex-start', backgroundColor: '#EBF4FF', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  currentBadgeText: { fontSize: 12, color: '#146BDB', fontWeight: '600' },
  reviewSection: { marginTop: 24, backgroundColor: '#FFF', borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#E4ECF5' },
  reviewTitle: { fontSize: 18, fontWeight: '600', color: '#17365D', marginBottom: 16 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  reviewButton: { backgroundColor: '#146BDB', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 },
  reviewButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});
