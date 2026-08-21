import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Check, Crown } from 'lucide-react-native';
import { Screen, PrimaryButton } from '../../lib/ui';
import { C, F, shadowCard } from '../../lib/theme';
import { PLANS, BillingCycle, money } from '../../lib/catalog';

export default function PlansScreen() {
  const [cycle, setCycle] = useState<BillingCycle>('mensual');

  const setBilling = useCallback((mode: BillingCycle) => setCycle(mode), []);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={s.header}>
          <Text style={s.title}>Elige tu plan</Text>
          <Text style={s.subtitle}>Ahorra mas con nuestros planes</Text>
        </View>

        <View style={s.toggle}>
          {(['mensual', 'semanal'] as const).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setBilling(mode)}
              style={[s.toggleBtn, cycle === mode && s.toggleBtnActive]}
              accessibilityRole="button"
              accessibilityLabel={`Ciclo ${mode}`}
            >
              <Text style={[s.toggleText, cycle === mode && s.toggleTextActive]}>
                {mode === 'mensual' ? 'Mensual' : 'Semanal'}
              </Text>
            </Pressable>
          ))}
        </View>

        {PLANS.map((plan) => (
          <View key={plan.id} style={[s.planCard, plan.popular && s.planPopular]}>
            {plan.popular && (
              <View style={s.popBadge}>
                <Crown size={11} color={C.goldInk} strokeWidth={2.6} />
                <Text style={s.popText}>POPULAR</Text>
              </View>
            )}
            <View style={s.planHead}>
              <Text style={s.planName}>{plan.name}</Text>
              <Text style={s.planPrice}>
                {money(cycle === 'mensual' ? plan.monthly : plan.weekly)}
                <Text style={s.planPer}>{cycle === 'mensual' ? '/mes' : '/sem'}</Text>
              </Text>
            </View>
            <Text style={s.planDesc}>{plan.desc}</Text>

            <View style={s.feats}>
              <Feat text={`Hasta ${plan.kg} kg por mes`} />
              <Feat text={plan.pickups} />
              <Feat text="Lavar + Planchar incluido" />
              {plan.extrasOff ? <Feat text={`${plan.extrasOff}% OFF en servicios extra`} /> : null}
              {plan.support ? <Feat text={plan.support} /> : null}
            </View>

            <PrimaryButton label="Elegir plan" onPress={() => {}} style={{ marginTop: 6 }} />
          </View>
        ))}

        <Text style={s.note}>Cancela cuando quieras. Sin compromisos.</Text>
      </ScrollView>
    </Screen>
  );
}

function Feat({ text }: { text: string }) {
  return (
    <View style={s.featRow}>
      <View style={s.featCheck}>
        <Check size={11} color={C.good} strokeWidth={3.2} />
      </View>
      <Text style={s.featText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14 },
  title: { fontFamily: F.dB, fontSize: 22, color: C.navy, letterSpacing: -0.4 },
  subtitle: { fontFamily: F.bM, fontSize: 13, color: C.muted, marginTop: 3 },
  toggle: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#DFE8F7', borderRadius: 13, padding: 4, marginBottom: 18 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: C.navy },
  toggleText: { fontFamily: F.bB, fontSize: 12.5, color: C.muted },
  toggleTextActive: { color: '#FFFFFF' },
  planCard: { marginHorizontal: 20, marginBottom: 16, backgroundColor: C.card, borderRadius: 20, borderWidth: 1.5, borderColor: C.line, padding: 19 },
  planPopular: { borderColor: C.blue, ...shadowCard },
  popBadge: { position: 'absolute', top: -11, right: 16, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.gold, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 5 },
  popText: { fontFamily: F.bXb, fontSize: 9, color: C.goldInk, letterSpacing: 0.8 },
  planHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  planName: { fontFamily: F.dB, fontSize: 16, color: C.navy },
  planPrice: { fontFamily: F.dB, fontSize: 20, color: C.blue, letterSpacing: -0.4 },
  planPer: { fontFamily: F.bM, fontSize: 10.5, color: C.muted },
  planDesc: { fontFamily: F.bM, fontSize: 11.5, color: C.muted, marginTop: 4 },
  feats: { marginTop: 14, marginBottom: 14, gap: 8 },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  featCheck: { width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(47,191,113,0.12)', alignItems: 'center', justifyContent: 'center' },
  featText: { fontFamily: F.bSb, fontSize: 12.5, color: C.ink, flex: 1 },
  note: { textAlign: 'center', fontFamily: F.bM, fontSize: 11.5, color: C.muted, marginTop: 4 },
});
