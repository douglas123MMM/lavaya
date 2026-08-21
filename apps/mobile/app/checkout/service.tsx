import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { WashingMachine, Flame, Sparkles, Shirt, Check, Minus, Plus } from 'lucide-react-native';
import { Screen, ScreenHeader, PrimaryButton } from '../../lib/ui';
import { C, F } from '../../lib/theme';
import { SERVICES, DELIVERY_FEE, money } from '../../lib/catalog';

const ICONS = { wash: WashingMachine, iron: Flame, duo: Sparkles, delicate: Shirt } as const;

export default function ServiceSelectionScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId?: string }>();
  const [selected, setSelected] = useState<string>(serviceId || 'duo');
  const [weight, setWeight] = useState('5');

  const service = SERVICES.find((s) => s.id === selected) || SERVICES[2];
  const w = parseFloat(weight) || 0;
  const estimate = w * service.pricePerKg + DELIVERY_FEE.standard;

  const adjustWeight = (delta: number) => {
    const next = Math.max(1, Math.min(50, (parseFloat(weight) || 0) + delta));
    setWeight(String(next));
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <ScreenHeader title="Agendar servicio" sub="Paso 1 de 4 · Elige tu servicio" onBack={() => router.back()} />

        <View style={s.list}>
          {SERVICES.map((svc) => {
            const Icon = ICONS[svc.id as keyof typeof ICONS];
            const active = selected === svc.id;
            return (
              <Pressable
                key={svc.id}
                onPress={() => setSelected(svc.id)}
                style={[s.option, active && s.optionActive]}
                accessibilityRole="button"
                accessibility-label={svc.name}
              >
                <View style={[s.optionIcon, active && s.optionIconActive]}>
                  <Icon size={20} color={active ? '#FFFFFF' : C.blue} strokeWidth={2.1} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.optionName, active && { color: C.navy }]}>{svc.name}</Text>
                  <Text style={s.optionDesc}>{svc.desc}</Text>
                  <Text style={s.optionPrice}>{money(svc.pricePerKg)}/kg</Text>
                </View>
                <View style={[s.radio, active && s.radioActive]}>
                  {active && <Check size={12} color="#FFFFFF" strokeWidth={3.4} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={s.label}>Peso estimado</Text>
        <View style={s.stepper}>
          <Pressable style={s.stepBtn} onPress={() => adjustWeight(-1)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Menos peso">
            <Minus size={17} color={C.navy} strokeWidth={2.6} />
          </Pressable>
          <TextInput
            style={s.stepInput}
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            accessibilityLabel="Peso en kilogramos"
          />
          <Text style={s.stepUnit}>kg</Text>
          <Pressable style={s.stepBtn} onPress={() => adjustWeight(1)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Mas peso">
            <Plus size={17} color={C.navy} strokeWidth={2.6} />
          </Pressable>
        </View>
        <View style={s.presets}>
          {[3, 5, 8, 12].map((p) => (
            <Pressable key={p} onPress={() => setWeight(String(p))} style={[s.preset, parseFloat(weight) === p && s.presetActive]}>
              <Text style={[s.presetText, parseFloat(weight) === p && { color: '#FFFFFF' }]}>{p} kg</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.estimate}>
          <View style={s.estimateRow}>
            <Text style={s.estimateLbl}>Servicio ({w} kg)</Text>
            <Text style={s.estimateVal}>{money(w * service.pricePerKg)}</Text>
          </View>
          <View style={s.estimateRow}>
            <Text style={s.estimateLbl}>Retiro y entrega</Text>
            <Text style={s.estimateVal}>{money(DELIVERY_FEE.standard)}</Text>
          </View>
          <View style={[s.estimateRow, { marginTop: 4, paddingTop: 12, borderTopWidth: 1.5, borderTopColor: C.line, borderStyle: 'dashed' as never }]}>
            <Text style={s.estimateTotalLbl}>Estimado</Text>
            <Text style={s.estimateTotalVal}>{money(estimate)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 22 }}>
          <PrimaryButton
            label={`Continuar · ${money(estimate)}`}
            disabled={w < 1}
            onPress={() => router.push({
              pathname: '/checkout/address',
              params: { serviceId: selected, weight },
            })}
          />
        </View>
        <Text style={s.note}>Precio estimado. El total final se confirma al pesar tu ropa.</Text>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  list: { paddingHorizontal: 20, gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: C.card, borderRadius: 18, borderWidth: 1.5, borderColor: C.line, padding: 15 },
  optionActive: { borderColor: C.blue, backgroundColor: C.blueSoft },
  optionIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: C.blueSoft, alignItems: 'center', justifyContent: 'center' },
  optionIconActive: { backgroundColor: C.blue },
  optionName: { fontFamily: F.dSb, fontSize: 14.5, color: C.navy },
  optionDesc: { fontFamily: F.bM, fontSize: 11.5, color: C.muted, marginTop: 2 },
  optionPrice: { fontFamily: F.bB, fontSize: 11.5, color: C.blue, marginTop: 4 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C7D4E6', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: C.blue, backgroundColor: C.blue },
  label: { fontFamily: F.bB, fontSize: 12.5, color: C.navy, marginTop: 24, marginBottom: 10, paddingHorizontal: 20 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  stepBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  stepInput: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, fontFamily: F.dB, fontSize: 17, color: C.navy, textAlign: 'center' },
  stepUnit: { fontFamily: F.bB, fontSize: 13, color: C.muted },
  presets: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 10 },
  preset: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  presetActive: { backgroundColor: C.navy, borderColor: C.navy },
  presetText: { fontFamily: F.bB, fontSize: 11.5, color: C.muted },
  estimate: { marginTop: 24, marginHorizontal: 20, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 17 },
  estimateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  estimateLbl: { fontFamily: F.bM, fontSize: 12.5, color: C.muted },
  estimateVal: { fontFamily: F.bB, fontSize: 12.5, color: C.ink },
  estimateTotalLbl: { fontFamily: F.bB, fontSize: 14, color: C.navy },
  estimateTotalVal: { fontFamily: F.dB, fontSize: 19, color: C.blue, letterSpacing: -0.3 },
  note: { textAlign: 'center', fontFamily: F.bM, fontSize: 11, color: C.muted, marginTop: 12, paddingHorizontal: 20 },
});
