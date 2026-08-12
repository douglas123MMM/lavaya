import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DEMO_ORDERS } from '../../lib/demo';

const STATUS_LABEL: Record<string, string> = { pending: 'Solicitud recibida', pickup_assigned: 'Repartidor asignado', en_route_pickup: 'En camino a recoger', picked_up: 'Ropa recogida', received_laundry: 'Recibida', washing: 'Lavando', drying: 'Secando', ironing: 'Planchando', ready: 'Lista', en_route_delivery: 'En camino', delivered: 'Entregada', cancelled: 'Cancelado' };
const STATUS_COLOR: Record<string, string> = { pending: '#D69E2E', pickup_assigned: '#3182CE', en_route_pickup: '#3182CE', picked_up: '#3182CE', received_laundry: '#805AD5', washing: '#805AD5', drying: '#805AD5', ironing: '#805AD5', ready: '#18A56A', en_route_delivery: '#18A56A', delivered: '#18A56A', cancelled: '#E53E3E' };

export default function OrdersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Mis pedidos</Text></View>
      <FlatList data={DEMO_ORDERS} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/tracking/${item.id}`)}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderNumber}>Pedido #{item.order_number}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLOR[item.status] || '#718096' }]}>
                <Text style={styles.badgeText}>{STATUS_LABEL[item.status]}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardDetail}>Peso est: {item.estimated_weight}kg</Text>
              <Text style={styles.cardDetail}>Total: ${item.total.toFixed(2)}</Text>
            </View>
            <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E4ECF5' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { fontSize: 15, fontWeight: '600', color: '#17365D' },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardDetail: { fontSize: 14, color: '#718096' },
  cardDate: { fontSize: 12, color: '#A0AEC0', marginTop: 8 },
});
