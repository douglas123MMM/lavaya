import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DEMO_PROFILE, DEMO_SERVICES, DEMO_ORDERS } from '../../lib/demo';

export default function HomeScreen() {
  const profile = DEMO_PROFILE;
  const services = DEMO_SERVICES;
  const nextOrder = DEMO_ORDERS[0];
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  const statusLabel: Record<string, string> = {
    pending: 'Solicitud recibida', pickup_assigned: 'Repartidor asignado', en_route_pickup: 'En camino a recoger',
    picked_up: 'Ropa recogida', received_laundry: 'Recibida en lavanderia', washing: 'Lavando',
    drying: 'Secando', ironing: 'Planchando', ready: 'Lista', en_route_delivery: 'En camino al cliente',
    delivered: 'Entregada', cancelled: 'Cancelado',
  };

  const getStatusColor = (s: string) => {
    const c: Record<string, string> = { pending: '#D69E2E', pickup_assigned: '#3182CE', en_route_pickup: '#3182CE', picked_up: '#3182CE', received_laundry: '#805AD5', washing: '#805AD5', drying: '#805AD5', ironing: '#805AD5', ready: '#18A56A', en_route_delivery: '#18A56A', delivered: '#18A56A', cancelled: '#E53E3E' };
    return c[s] || '#718096';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControlMock />} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {profile.full_name.split(' ')[0]} 👋</Text>
            <Text style={styles.headerSubtitle}>Que necesitas hoy?</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Servicios</Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard} onPress={() => router.push({ pathname: '/checkout/service', params: { serviceId: service.id } })}>
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>${service.base_price.toFixed(2)}/{service.unit}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.promoCard}>
          <Text style={styles.promoIcon}>🚀</Text>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Lavamos, planchamos{'\n'}y lo llevamos por ti.</Text>
            <TouchableOpacity style={styles.promoButton} onPress={() => router.push('/checkout/service')}>
              <Text style={styles.promoButtonText}>Agendar servicio</Text>
            </TouchableOpacity>
          </View>
        </View>

        {nextOrder && (
          <View style={styles.nextOrderSection}>
            <Text style={styles.sectionTitle}>Tu proximo pedido</Text>
            <TouchableOpacity style={styles.nextOrderCard} onPress={() => router.push(`/tracking/${nextOrder.id}`)}>
              <View style={styles.nextOrderHeader}>
                <Text style={styles.nextOrderNumber}>Pedido #{nextOrder.order_number}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(nextOrder.status) }]}>
                  <Text style={styles.statusText}>{statusLabel[nextOrder.status]}</Text>
                </View>
              </View>
              <Text style={styles.nextOrderTotal}>${nextOrder.total.toFixed(2)}</Text>
              <TouchableOpacity style={styles.trackButton} onPress={() => router.push(`/tracking/${nextOrder.id}`)}>
                <Text style={styles.trackButtonText}>Ver seguimiento</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function RefreshControlMock() { return null; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  greeting: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  headerSubtitle: { fontSize: 16, color: '#718096', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#17365D', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  servicesGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12 },
  serviceCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: '#E4ECF5' },
  serviceIcon: { fontSize: 32, marginBottom: 8 },
  serviceName: { fontSize: 15, fontWeight: '600', color: '#17365D' },
  servicePrice: { fontSize: 13, color: '#146BDB', fontWeight: '500', marginTop: 4 },
  promoCard: { flexDirection: 'row', backgroundColor: '#146BDB', borderRadius: 16, marginHorizontal: 20, marginTop: 24, padding: 20, alignItems: 'center' },
  promoIcon: { fontSize: 40, marginRight: 16 },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', lineHeight: 22 },
  promoButton: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start', marginTop: 12 },
  promoButtonText: { color: '#146BDB', fontSize: 14, fontWeight: '600' },
  nextOrderSection: { marginTop: 24, paddingBottom: 24 },
  nextOrderCard: { backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 20, padding: 16, borderWidth: 1, borderColor: '#E4ECF5' },
  nextOrderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nextOrderNumber: { fontSize: 15, fontWeight: '600', color: '#17365D' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  nextOrderTotal: { fontSize: 22, fontWeight: '700', color: '#17365D', marginTop: 8 },
  trackButton: { backgroundColor: '#E4ECF5', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginTop: 12 },
  trackButtonText: { fontSize: 14, fontWeight: '600', color: '#146BDB' },
});
