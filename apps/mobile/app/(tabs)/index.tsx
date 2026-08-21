import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell, WashingMachine, Flame, Sparkles, Shirt, Truck, ShieldCheck,
  PackageCheck, ArrowRight, ChevronRight,
} from 'lucide-react-native';
import { Screen, SectionTitle, PrimaryButton } from '../../lib/ui';
import { C, F, shadowCard } from '../../lib/theme';
import { DEMO_PROFILE, DEMO_ORDERS } from '../../lib/demo';
import { SERVICES, STATUS_LABEL, money } from '../../lib/catalog';

const SERVICE_ICONS = {
  wash: WashingMachine, iron: Flame, duo: Sparkles, delicate: Shirt,
} as const;

const STEPS = [
  { icon: Truck, label: 'Retiro a domicilio' },
  { icon: WashingMachine, label: 'Lavado profesional' },
  { icon: Shirt, label: 'Planchado premium' },
  { icon: PackageCheck, label: 'Entrega segura' },
];

export default function HomeScreen() {
  const firstName = DEMO_PROFILE.full_name.split(' ')[0];
  const activeOrder = DEMO_ORDERS.find((o) => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Hola, {firstName}</Text>
            <Text style={s.greetingSub}>Que necesitas hoy?</Text>
          </View>
          <Pressable style={s.bell} accessibilityRole="button" accessibilityLabel="Notificaciones">
            <Bell size={19} color={C.navy} strokeWidth={2.2} />
            <View style={s.bellDot} />
          </Pressable>
        </View>

        <LinearGradient
          colors={[C.navy, C.navySoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          <View style={s.heroIconWrap}>
            <WashingMachine size={120} color="rgba(255,255,255,0.08)" strokeWidth={1.4} />
          </View>
          <Text style={s.heroTitle}>Nosotros nos encargamos de tu ropa</Text>
          <Text style={s.heroSub}>Retiramos, lavamos, planchamos y entregamos. Tu tiempo vale mas.</Text>
          <Pressable style={s.heroBtn} onPress={() => router.push('/checkout/service')} accessibilityRole="button">
            <Text style={s.heroBtnText}>Agendar servicio</Text>
            <ArrowRight size={15} color={C.navy} strokeWidth={2.6} />
          </Pressable>
        </LinearGradient>

        <View style={s.section}>
          <SectionTitle title="Servicios" action="Ver todos" />
          <View style={s.grid}>
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.id as keyof typeof SERVICE_ICONS];
              return (
                <Pressable
                  key={service.id}
                  style={({ pressed }) => [s.tile, pressed && { transform: [{ scale: 0.98 }] }]}
                  onPress={() => router.push({ pathname: '/checkout/service', params: { serviceId: service.id } })}
                  accessibilityRole="button"
                  accessibilityLabel={service.name}
                >
                  <View style={s.tileIcon}>
                    <Icon size={19} color={C.blue} strokeWidth={2.1} />
                  </View>
                  <Text style={s.tileName}>{service.name}</Text>
                  <Text style={s.tilePrice}>{money(service.pricePerKg)}/kg</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={s.section}>
          <SectionTitle title="Como funciona" />
          <View style={s.stepsCard}>
            {STEPS.map((step, i) => (
              <View key={step.label} style={s.step}>
                <View style={s.stepIcon}>
                  <step.icon size={18} color={C.blue} strokeWidth={2.1} />
                </View>
                <Text style={s.stepLabel}>{step.label}</Text>
                {i < STEPS.length - 1 && <View style={s.stepLine} />}
              </View>
            ))}
          </View>
        </View>

        {activeOrder && (
          <View style={s.section}>
            <SectionTitle title="Pedido activo" />
            <Pressable style={s.orderCard} onPress={() => router.push(`/tracking/${activeOrder.id}`)} accessibilityRole="button">
              <View style={s.orderTop}>
                <Text style={s.orderNumber}>Pedido #{activeOrder.order_number}</Text>
                <View style={s.orderBadge}>
                  <Text style={s.orderBadgeText}>{STATUS_LABEL[activeOrder.status]}</Text>
                </View>
              </View>
              <View style={s.orderBottom}>
                <Text style={s.orderTotal}>{money(activeOrder.total)}</Text>
                <View style={s.orderTrackRow}>
                  <Text style={s.orderTrack}>Seguir pedido</Text>
                  <ChevronRight size={16} color={C.blue} strokeWidth={2.4} />
                </View>
              </View>
            </Pressable>
          </View>
        )}

        <View style={{ paddingHorizontal: 20, marginTop: 6 }}>
          <PrimaryButton label="Agendar ahora" onPress={() => router.push('/checkout/service')} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  greeting: { fontFamily: F.dB, fontSize: 22, color: C.navy, letterSpacing: -0.4 },
  greetingSub: { fontFamily: F.bM, fontSize: 13, color: C.muted, marginTop: 3 },
  bell: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue, borderWidth: 1.5, borderColor: C.card },
  hero: { marginHorizontal: 20, borderRadius: 24, padding: 22, overflow: 'hidden', ...shadowCard },
  heroIconWrap: { position: 'absolute', right: -18, bottom: -22 },
  heroTitle: { fontFamily: F.dB, fontSize: 19, color: '#FFFFFF', lineHeight: 26, maxWidth: '78%', letterSpacing: -0.3 },
  heroSub: { fontFamily: F.bM, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 8, maxWidth: '70%', lineHeight: 17 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#FFFFFF', alignSelf: 'flex-start', marginTop: 16, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  heroBtnText: { fontFamily: F.bB, fontSize: 12.5, color: C.navy, marginRight: 2 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48.5%', backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 15 },
  tileIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: C.blueSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileName: { fontFamily: F.dSb, fontSize: 13.5, color: C.navy },
  tilePrice: { fontFamily: F.bSb, fontSize: 11.5, color: C.blue, marginTop: 3 },
  stepsCard: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 16, alignItems: 'center' },
  step: { flex: 1, alignItems: 'center' },
  stepIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.blueSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  stepLabel: { fontFamily: F.bSb, fontSize: 9.5, color: C.muted, textAlign: 'center', lineHeight: 13 },
  stepLine: { display: 'none' },
  orderCard: { backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 18 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { fontFamily: F.dSb, fontSize: 13.5, color: C.navy },
  orderBadge: { backgroundColor: C.blueSoft, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 5 },
  orderBadgeText: { fontFamily: F.bB, fontSize: 11, color: C.blue },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  orderTotal: { fontFamily: F.dB, fontSize: 22, color: C.navy, letterSpacing: -0.4 },
  orderTrackRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  orderTrack: { fontFamily: F.bB, fontSize: 13, color: C.blue },
});
