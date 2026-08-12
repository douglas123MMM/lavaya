import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function DriverOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('orders').select('*, service:service_id(name), address:address_id(*)').eq('driver_id', user.id).order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { loadOrders(); }, []);

  if (loading) {
    return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#17365D" style={{ marginTop: 100 }} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Pedidos asignados</Text></View>
      <FlatList data={orders} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrders(); }} />} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No tienes pedidos aun</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderNumber}>#{item.order_number || item.id.slice(0, 8)}</Text>
            <Text style={styles.orderService}>{item.service?.name}</Text>
            <Text style={styles.orderAddress}>{item.address?.address_line}</Text>
            <Text style={styles.orderDate}>Recogida: {item.pickup_date}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  list: { paddingHorizontal: 20 },
  empty: { textAlign: 'center', color: '#718096', marginTop: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E4ECF5' },
  orderNumber: { fontSize: 13, color: '#A0AEC0' },
  orderService: { fontSize: 16, fontWeight: '600', color: '#17365D', marginTop: 4 },
  orderAddress: { fontSize: 14, color: '#4A5568', marginTop: 4 },
  orderDate: { fontSize: 12, color: '#718096', marginTop: 6 },
});
