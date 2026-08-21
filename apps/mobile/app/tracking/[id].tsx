import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Headphones, Truck } from 'lucide-react-native';
import { Screen, ScreenHeader } from '../../lib/ui';
import { C, F, shadowCard } from '../../lib/theme';
import { DEMO_ORDERS } from '../../lib/demo';
import { STATUS_FLOW, STATUS_LABEL, money } from '../../lib/catalog';

const TRACK_STEPS = ['pending', 'en_route_pickup', 'picked_up', 'washing', 'ready', 'delivered'] as const;
const STEP_LABEL: Record<string, string> = {
  pending: 'Solicitud recibida',
  en_route_pickup: 'En camino a ti',
  picked_up: 'Ropa retirada',
  washing: 'En proceso de lavado',
  ready: 'Lista para entrega',
  delivered: 'Entregado',
};

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = DEMO_ORDERS.find((o) => o.id === id) || DEMO_ORDERS[0];

  const flowIdx = STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]);
  const isDone = (step: string) => {
    const stepIdx = STATUS_FLOW.indexOf(step as (typeof STATUS_FLOW)[number]);
    const spread = (idx: number) => {
      if (step === 'washing') return idx >= 5 && idx <= 8;
      if (step === 'ready') return idx >= 8;
      if (step === 'delivered') return idx >= 10;
      return idx >= stepIdx;
    };
    return spread(flowIdx);
  };
  const isCurrent = (step: string) => {
    if (step === 'washing') return flowIdx >= 5 && flowIdx <= 8;
    if (step === 'ready') return flowIdx === 8 || flowIdx === 9;
    return step === order.status;
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <ScreenHeader title="Seguimiento" sub={`Pedido #${order.order_number}`} onBack={() => router.back()} />

        <LinearGradient
          colors={[C.navy, C.navySoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          <View style={s.heroRider}>
            <Truck size={22} color="#FFFFFF" strokeWidth={2.1} />
          </View>
          <Text style={s.heroStatus}>{STATUS_LABEL[order.status] || order.status}</Text>
          <Text style={s.heroSub}>
            {order.status === 'delivered' ? 'Tu pedido fue entregado con exito' : 'Estamos cuidando cada prenda tuya'}
          </Text>
          <View style={s.heroMeta}>
            <Text style={s.heroMetaText}>{order.estimated_weight} kg · {money(order.total)}</Text>
          </View>
        </LinearGradient>

        <View style={s.timeline}>
          {TRACK_STEPS.map((step, i) => {
            const done = isDone(step);
            const current = isCurrent(step);
            const last = i === TRACK_STEPS.length - 1;
            return (
              <View key={step} style={[s.tlItem, last && { paddingBottom: 0 }]}>
                {!last && <View style={[s.tlLine, done && s.tlLineDone]} />}
                <View style={[s.tlDot, done && s.tlDotDone, current && s.tlDotCurrent]} />
                <View style={s.tlBody}>
                  <Text style={[s.tlLabel, current && s.tlLabelCurrent, !done && !current && s.tlLabelPending]}>
                    {STEP_LABEL[step]}
                  </Text>
                  <Text style={s.tlTime}>{done && !current ? 'Completado' : current ? 'En curso' : 'Pendiente'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable style={s.supportBtn} onPress={() => router.push('/support')} accessibilityRole="button">
          <Headphones size={16} color={C.navy} strokeWidth={2.2} />
          <Text style={s.supportText}>Contactar soporte</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { marginHorizontal: 20, borderRadius: 22, padding: 21, ...shadowCard },
  heroRider: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  heroStatus: { fontFamily: F.dB, fontSize: 19, color: '#FFFFFF', letterSpacing: -0.3 },
  heroSub: { fontFamily: F.bM, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 5 },
  heroMeta: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 11, paddingVertical: 6, marginTop: 14 },
  heroMetaText: { fontFamily: F.bB, fontSize: 11.5, color: '#FFFFFF' },
  timeline: { marginTop: 26, marginHorizontal: 20, backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.line, padding: 20 },
  tlItem: { flexDirection: 'row', gap: 14, paddingBottom: 26 },
  tlLine: { position: 'absolute', left: 8, top: 20, bottom: 2, width: 2, backgroundColor: C.line },
  tlLineDone: { backgroundColor: C.good },
  tlDot: { width: 17, height: 17, borderRadius: 9, borderWidth: 2.5, borderColor: '#C7D4E6', backgroundColor: C.card, marginTop: 1 },
  tlDotDone: { borderColor: C.good, backgroundColor: C.good },
  tlDotCurrent: { borderColor: C.blue, backgroundColor: C.blue },
  tlBody: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  tlLabel: { fontFamily: F.bSb, fontSize: 13, color: C.ink },
  tlLabelCurrent: { color: C.blue, fontFamily: F.bB },
  tlLabelPending: { color: C.muted },
  tlTime: { fontFamily: F.bSb, fontSize: 10.5, color: C.muted },
  supportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginHorizontal: 20, marginTop: 18, paddingVertical: 15, borderRadius: 16, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.line },
  supportText: { fontFamily: F.bB, fontSize: 13, color: C.navy },
});
