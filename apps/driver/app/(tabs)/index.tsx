import { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function DriverHomeScreen() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [todayOrders, setTodayOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: p }, { data: loc }, { data: orders }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('driver_locations').select('*').eq('driver_id', user.id).maybeSingle(),
      supabase.from('orders').select('*, service:service_id(name)').eq('driver_id', user.id).order('created_at', { ascending: false }).limit(5),
    ]);
    setProfile(p);
    if (loc) setIsAvailable(loc.is_available);
    setTodayOrders(orders || []);
    setLoading(false);
  };

  const toggleAvailability = async (value: boolean) => {
    setIsAvailable(value);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('driver_locations').upsert({ driver_id: user.id, is_available: value, latitude: 0, longitude: 0 });
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    await supabase.from('order_events').insert({ order_id: id, status, notes: `Repartidor: ${status}` });
    loadData();
  };

  if (loading) {
    return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#17365D" style={{ marginTop: 100 }} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {profile?.full_name?.split(' ')[0] || 'Repartidor'}</Text>
          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityLabel}>Disponible para pedidos</Text>
            <Switch value={isAvailable} onValueChange={toggleAvailability} trackColor={{ false: '#E4ECF5', true: '#18A56A' }} thumbColor="#FFF" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pedidos de hoy</Text>
        {todayOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Pedido #{order.order_number || order.id.slice(0, 8)}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
              </View>
            </View>
            <Text style={styles.orderService}>{order.service?.name}</Text>
            <Text style={styles.orderWeight}>{order.estimated_weight} kg</Text>
            <View style={styles.orderActions}>
              {order.status === 'pickup_assigned' && (
                <TouchableOpacity style={styles.actionButton} onPress={() => updateOrderStatus(order.id, 'en_route_pickup')}>
                  <Text style={styles.actionButtonText}>Iniciar recogida</Text>
                </TouchableOpacity>
              )}
              {order.status === 'en_route_pickup' && (
                <TouchableOpacity style={styles.actionButton} onPress={() => updateOrderStatus(order.id, 'picked_up')}>
                  <Text style={styles.actionButtonText}>Marcar recogido</Text>
                </TouchableOpacity>
              )}
              {order.status === 'ready' && (
                <TouchableOpacity style={styles.actionButton} onPress={() => updateOrderStatus(order.id, 'en_route_delivery')}>
                  <Text style={styles.actionButtonText}>Iniciar entrega</Text>
                </TouchableOpacity>
              )}
              {order.status === 'en_route_delivery' && (
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#18A56A' }]} onPress={() => updateOrderStatus(order.id, 'delivered')}>
                  <Text style={styles.actionButtonText}>Marcar entregado</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        {todayOrders.length === 0 && <Text style={styles.emptyText}>No tienes pedidos asignados</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = { pending: '#D69E2E', pickup_assigned: '#3182CE', en_route_pickup: '#3182CE', picked_up: '#3182CE', ready: '#18A56A', en_route_delivery: '#18A56A', delivered: '#18A56A', cancelled: '#E53E3E' };
  return colors[status] || '#718096';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = { pending: 'Pendiente', pickup_assigned: 'Asignado', en_route_pickup: 'Recogiendo', picked_up: 'Recogido', ready: 'Listo', en_route_delivery: 'Entregando', delivered: 'Entregado', cancelled: 'Cancelado' };
  return labels[status] || status;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  availabilityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E4ECF5' },
  availabilityLabel: { fontSize: 15, fontWeight: '500', color: '#17365D' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#17365D', marginBottom: 12 },
  orderCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E4ECF5' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { fontSize: 15, fontWeight: '600', color: '#17365D' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  orderService: { fontSize: 14, color: '#718096', marginTop: 6 },
  orderWeight: { fontSize: 14, color: '#17365D', fontWeight: '500', marginTop: 2 },
  orderActions: { marginTop: 12, flexDirection: 'row', gap: 10 },
  actionButton: { backgroundColor: '#17365D', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  actionButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#718096', marginTop: 20 },
});
