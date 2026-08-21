import { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MapPin, Plus, Check, House, Briefcase, Building2, Hash } from 'lucide-react-native';
import { Screen, ScreenHeader, PrimaryButton } from '../../lib/ui';
import { C, F } from '../../lib/theme';
import { DEMO_ADDRESSES } from '../../lib/demo';

const LABELS = [
  { name: 'Casa', icon: House },
  { name: 'Trabajo', icon: Briefcase },
  { name: 'Oficina', icon: Building2 },
  { name: 'Otra', icon: Hash },
] as const;

export default function AddressScreen() {
  const params = useLocalSearchParams<{ serviceId: string; weight: string }>();
  const [selectedId, setSelectedId] = useState<string>(DEMO_ADDRESSES[0].id);
  const [showNew, setShowNew] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Casa', address_line: '', instructions: '' });

  const saveAddress = () => {
    if (!newAddress.address_line.trim()) {
      Alert.alert('Falta la direccion', 'Escribe la direccion de retiro');
      return;
    }
    const id = `addr-${Date.now()}`;
    setShowNew(false);
    setSelectedId(id);
    setNewAddress({ label: 'Casa', address_line: '', instructions: '' });
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <ScreenHeader title="Direccion de retiro" sub="Paso 2 de 4 · A donde vamos" onBack={() => router.back()} />

        <View style={s.list}>
          {DEMO_ADDRESSES.map((addr) => {
            const active = selectedId === addr.id;
            return (
              <Pressable key={addr.id} onPress={() => setSelectedId(addr.id)} style={[s.card, active && s.cardActive]} accessibilityRole="button" accessibilityLabel={addr.label}>
                <View style={s.cardIcon}>
                  <MapPin size={18} color={active ? '#FFFFFF' : C.blue} strokeWidth={2.1} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.cardTop}>
                    <Text style={s.cardLabel}>{addr.label}</Text>
                    {addr.is_default && <View style={s.defaultBadge}><Text style={s.defaultText}>Principal</Text></View>}
                  </View>
                  <Text style={s.cardAddr}>{addr.address_line}</Text>
                  {addr.instructions ? <Text style={s.cardInstr}>{addr.instructions}</Text> : null}
                </View>
                <View style={[s.radio, active && s.radioActive]}>
                  {active && <Check size={12} color="#FFFFFF" strokeWidth={3.4} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {showNew ? (
          <View style={s.form}>
            <Text style={s.formLabel}>Etiqueta</Text>
            <View style={s.chipRow}>
              {LABELS.map((l) => {
                const active = newAddress.label === l.name;
                return (
                  <Pressable key={l.name} onPress={() => setNewAddress({ ...newAddress, label: l.name })} style={[s.chip, active && s.chipActive]}>
                    <l.icon size={13} color={active ? '#FFFFFF' : C.muted} strokeWidth={2.2} />
                    <Text style={[s.chipText, active && s.chipTextActive]}>{l.name}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={s.formLabel}>Direccion</Text>
            <TextInput style={s.input} placeholder="Av. Principal, Edificio, Piso" placeholderTextColor="#A8B6CB" value={newAddress.address_line} onChangeText={(t) => setNewAddress({ ...newAddress, address_line: t })} />
            <Text style={s.formLabel}>Instrucciones (opcional)</Text>
            <TextInput style={s.input} placeholder="Ej: Tocar el timbre 3B" placeholderTextColor="#A8B6CB" value={newAddress.instructions} onChangeText={(t) => setNewAddress({ ...newAddress, instructions: t })} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <Pressable style={s.cancelBtn} onPress={() => setShowNew(false)}>
                <Text style={s.cancelText}>Cancelar</Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="Guardar direccion" onPress={saveAddress} />
              </View>
            </View>
          </View>
        ) : (
          <Pressable style={s.addBtn} onPress={() => setShowNew(true)} accessibilityRole="button" accessibilityLabel="Agregar direccion">
            <Plus size={16} color={C.blue} strokeWidth={2.4} />
            <Text style={s.addText}>Agregar nueva direccion</Text>
          </Pressable>
        )}

        <View style={{ marginTop: 24 }}>
          <PrimaryButton
            label="Continuar"
            disabled={!selectedId}
            onPress={() => router.push({ pathname: '/checkout/pickup', params: { ...params, addressId: selectedId } })}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  list: { paddingHorizontal: 20, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: C.card, borderRadius: 18, borderWidth: 1.5, borderColor: C.line, padding: 15 },
  cardActive: { borderColor: C.blue, backgroundColor: C.blueSoft },
  cardIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: C.blueSoft, alignItems: 'center', justifyContent: 'center' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardLabel: { fontFamily: F.dSb, fontSize: 14, color: C.navy },
  defaultBadge: { backgroundColor: C.blueSoft, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 2 },
  defaultText: { fontFamily: F.bB, fontSize: 9.5, color: C.blue },
  cardAddr: { fontFamily: F.bM, fontSize: 11.5, color: C.muted, marginTop: 3 },
  cardInstr: { fontFamily: F.bM, fontSize: 10.5, color: C.muted, marginTop: 3 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#C7D4E6', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: C.blue, backgroundColor: C.blue },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 12, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: C.blue, borderStyle: 'dashed' as never },
  addText: { fontFamily: F.bB, fontSize: 13, color: C.blue },
  form: { marginHorizontal: 20, marginTop: 16, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 17 },
  formLabel: { fontFamily: F.bB, fontSize: 11.5, color: C.navy, marginTop: 12, marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 11, backgroundColor: C.bg, borderWidth: 1, borderColor: C.line },
  chipActive: { backgroundColor: C.navy, borderColor: C.navy },
  chipText: { fontFamily: F.bB, fontSize: 11.5, color: C.muted },
  chipTextActive: { color: '#FFFFFF' },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11, fontFamily: F.bSb, fontSize: 13.5, color: C.ink },
  cancelBtn: { justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.line, paddingHorizontal: 20 },
  cancelText: { fontFamily: F.bB, fontSize: 13, color: C.muted },
});
