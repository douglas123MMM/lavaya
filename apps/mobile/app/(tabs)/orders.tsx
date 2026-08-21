import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, PackageOpen } from 'lucide-react-native';
import { Screen, ScreenHeader } from '../../lib/ui';
import { C, F } from '../../lib/theme';
import { DEMO_ORDERS } from '../../lib/demo';
import { STATUS_LABEL, STATUS_FLOW, money } from '../../lib/catalog';

const progressOf = (status: string) => {
  if (status === 'cancelled') return 0;
  const idx = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);
  return ((idx + 1) / STATUS_FLOW.length) * 100;
};

export default function OrdersScreen() {
  return (
    <Screen>
      <ScreenHeader title="Mis pedidos" sub={`${DEMO_ORDERS.length} pedidos`} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}>
        {DEMO_ORDERS.map((order) => {
          const pct = progressOf(order.status);
          return (
            <Pressable
              key={order.id}
              style={({ pressed }) => [s.card, pressed && { transform: [{ scale: 0.99 }] }]}
              onPress={() => router.push(`/tracking/${order.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Pedido ${order.order_number}`}
            >
              <View style={s.top}>
                <Text style={s.number}>#{order.order_number}</Text>
                <Text style={s.date}>
                  {new Date(order.created_at).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
              <Text style={s.status}>{STATUS_LABEL[order.status] || order.status}</Text>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: `${pct}%` }, order.status === 'cancelled' && { backgroundColor: '#E53E3E' }]} />
              </View>
              <View style={s.bottom}>
                <Text style={s.total}>{money(order.total)} · {order.estimated_weight} kg</Text>
                <ChevronRight size={17} color={C.blue} strokeWidth={2.4} />
              </View>
            </Pressable>
          );
        })}
        {DEMO_ORDERS.length === 0 && (
          <View style={s.empty}>
            <PackageOpen size={34} color={C.muted} strokeWidth={1.8} />
            <Text style={s.emptyText}>Aun no tienes pedidos</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 17, marginBottom: 12 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  number: { fontFamily: F.dSb, fontSize: 14, color: C.navy },
  date: { fontFamily: F.bM, fontSize: 11.5, color: C.muted },
  status: { fontFamily: F.bB, fontSize: 12, color: C.blue, marginTop: 4 },
  progressTrack: { height: 5, backgroundColor: C.line, borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: 5, backgroundColor: C.good, borderRadius: 3 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  total: { fontFamily: F.bB, fontSize: 13, color: C.ink },
  empty: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontFamily: F.bSb, fontSize: 13.5, color: C.muted },
});
