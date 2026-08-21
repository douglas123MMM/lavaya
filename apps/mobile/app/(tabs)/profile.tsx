import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ClipboardList, Crown, MapPin, CreditCard, Gift, Headphones, Settings, ChevronRight, Plus,
} from 'lucide-react-native';
import { Screen } from '../../lib/ui';
import { C, F, shadowCard } from '../../lib/theme';
import { DEMO_PROFILE } from '../../lib/demo';

const initials = (name: string) =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export default function ProfileScreen() {
  const menu = [
    { icon: ClipboardList, label: 'Mis pedidos', action: () => router.push('/(tabs)/orders') },
    { icon: Crown, label: 'Mis planes', tag: 'Estandar', action: () => router.push('/(tabs)/plans') },
    { icon: MapPin, label: 'Direcciones', action: () => router.push('/profile/addresses') },
    { icon: CreditCard, label: 'Metodos de pago', action: () => {} },
    { icon: Gift, label: 'Invitar y ganar', tag: 'Descuentos', action: () => {} },
    { icon: Headphones, label: 'Ayuda y soporte', action: () => router.push('/support') },
    { icon: Settings, label: 'Configuracion', action: () => router.push('/profile/edit') },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <LinearGradient
          colors={[C.navy, C.navySoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.profileCard}
        >
          <View style={s.profileTop}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials(DEMO_PROFILE.full_name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{DEMO_PROFILE.full_name}</Text>
              <Text style={s.email}>{DEMO_PROFILE.email}</Text>
            </View>
          </View>
          <View style={s.balanceRow}>
            <View>
              <Text style={s.balanceLabel}>Mi saldo</Text>
              <Text style={s.balanceAmt}>$15.00</Text>
            </View>
            <Pressable style={s.topUpBtn} accessibilityRole="button" accessibilityLabel="Recargar saldo">
              <Plus size={14} color={C.navy} strokeWidth={2.8} />
              <Text style={s.topUpText}>Recargar</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={s.menu}>
          {menu.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [s.menuRow, pressed && { opacity: 0.6 }]}
              onPress={item.action}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={s.menuIcon}>
                <item.icon size={16} color={C.blue} strokeWidth={2.1} />
              </View>
              <Text style={s.menuLabel}>{item.label}</Text>
              {item.tag ? <Text style={s.menuTag}>{item.tag}</Text> : null}
              <ChevronRight size={16} color="#9AAAC2" strokeWidth={2.2} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  profileCard: { marginHorizontal: 20, marginTop: 16, borderRadius: 22, padding: 20, ...shadowCard },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#C9DCFF', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.dB, fontSize: 17, color: C.navy },
  name: { fontFamily: F.bB, fontSize: 15.5, color: '#FFFFFF' },
  email: { fontFamily: F.bM, fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 14 },
  balanceLabel: { fontFamily: F.bSb, fontSize: 10.5, color: 'rgba(255,255,255,0.75)' },
  balanceAmt: { fontFamily: F.dB, fontSize: 18, color: '#FFFFFF', marginTop: 2, letterSpacing: -0.3 },
  topUpBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14 },
  topUpText: { fontFamily: F.bB, fontSize: 12, color: C.navy },
  menu: { marginTop: 20, marginHorizontal: 20, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, paddingHorizontal: 16 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line },
  menuIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.blueSoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontFamily: F.bSb, fontSize: 13.5, color: C.ink },
  menuTag: { fontFamily: F.bB, fontSize: 10.5, color: C.blue, backgroundColor: C.blueSoft, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginRight: 6 },
});
