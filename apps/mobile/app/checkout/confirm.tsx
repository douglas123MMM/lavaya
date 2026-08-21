import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, Clock3, MapPin, WashingMachine } from 'lucide-react-native';
import { Screen, ScreenHeader, PrimaryButton } from '../../lib/ui';
import { C, F, shadowCard } from '../../lib/theme';
import { SERVICES, DELIVERY_FEE, money } from '../../lib/catalog';

export default function ConfirmScreen() {
  const params = useLocalSearchParams<{ serviceId: string; weight: string; addressId: string; pickupDate: string; timeStart: string; timeEnd: string; deliveryType: string }>();
  const [loading, setLoading] = useState(false);

  const service = SERVICES.find((s) => s.id === params.serviceId) || SERVICES[2];
  const weight = parseFloat(params.weight || '5');
  const fee = params.deliveryType === 'priority' ? DELIVERY_FEE.priority : DELIVERY_FEE.standard;
  const subtotal = weight * service.pricePerKg;
  const total = subtotal + fee;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Pedido creado', 'Tu pedido fue registrado. Te avisaremos cuando sea asignado.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }, 1000);
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <ScreenHeader title="Confirmar pedido" sub="Paso 4 de 4 · Revisa y confirma" onBack={() => router.back()} />

        <LinearGradient
          colors={[C.blue, '#4D8BF5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.banner}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.bannerTitle}>{service.name}</Text>
            <Text style={s.bannerSub}>Retiro {params.pickupDate || 'hoy'} · {params.timeStart || '14:00'} a {params.timeEnd || '16:00'}</Text>
          </View>
          <WashingMachine size={46} color="rgba(255,255,255,0.28)" strokeWidth={1.6} />
        </LinearGradient>

        <View style={s.card}>
          <Row icon={MapPin} label="Retiro y entrega" value="Av. Bolivar, San Juan de los Morros" />
          <Row icon={Clock3} label="Entrega estimada" value="En 48 horas posteriores al retiro" />
          <Row icon={ShieldCheck} label="Incluye" value="Retiro a domicilio y entrega segura" />
        </View>

        <View style={s.card}>
          <Text style={s.sumTitle}>Resumen de pago</Text>
          <View style={s.sumRow}>
            <Text style={s.sumLbl}>{service.name} · {weight} kg</Text>
            <Text style={s.sumVal}>{money(subtotal)}</Text>
          </View>
          <View style={s.sumRow}>
            <Text style={s.sumLbl}>Retiro y entrega</Text>
            <Text style={s.sumVal}>{money(fee)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLbl}>Total estimado</Text>
            <Text style={s.totalVal}>{money(total)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <PrimaryButton
            label={loading ? 'Creando...' : `Confirmar · ${money(total)}`}
            onPress={handleConfirm}
            disabled={loading}
          />
        </View>
        <Text style={s.note}>El peso final se verifica al recibir tu ropa. Sin sorpresas.</Text>
      </ScrollView>
    </Screen>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoIcon}>
        <Icon size={15} color={C.blue} strokeWidth={2.2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.infoLbl}>{label}</Text>
        <Text style={s.infoVal}>{value}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 20, padding: 19, gap: 12, ...shadowCard },
  bannerTitle: { fontFamily: F.dB, fontSize: 17, color: '#FFFFFF', letterSpacing: -0.2 },
  bannerSub: { fontFamily: F.bM, fontSize: 11.5, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  card: { marginTop: 14, marginHorizontal: 20, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 17 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  infoIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.blueSoft, alignItems: 'center', justifyContent: 'center' },
  infoLbl: { fontFamily: F.bM, fontSize: 11, color: C.muted },
  infoVal: { fontFamily: F.bSb, fontSize: 12.5, color: C.ink, marginTop: 2 },
  sumTitle: { fontFamily: F.dSb, fontSize: 13, color: C.navy, marginBottom: 12 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sumLbl: { fontFamily: F.bM, fontSize: 12.5, color: C.muted },
  sumVal: { fontFamily: F.bB, fontSize: 12.5, color: C.ink },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 13, borderTopWidth: 1.5, borderTopColor: C.line, borderStyle: 'dashed' as never },
  totalLbl: { fontFamily: F.bB, fontSize: 13.5, color: C.navy },
  totalVal: { fontFamily: F.dB, fontSize: 19, color: C.blue, letterSpacing: -0.3 },
  note: { textAlign: 'center', fontFamily: F.bM, fontSize: 11, color: C.muted, marginTop: 12, paddingHorizontal: 24 },
});
