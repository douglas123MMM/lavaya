import { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { C, F, R, shadowCard } from './theme';

export function Screen({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <SafeAreaView style={[s.screen, style]}>{children}</SafeAreaView>;
}

export function ScreenHeader({ title, sub, onBack }: { title: string; sub?: string; onBack?: () => void }) {
  return (
    <View style={s.headerRow}>
      {onBack && (
        <Pressable onPress={onBack} hitSlop={12} style={s.backBtn} accessibilityRole="button" accessibilityLabel="Volver">
          <ChevronLeft size={20} color={C.navy} strokeWidth={2.4} />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        <Text style={s.headerTitle}>{title}</Text>
        {sub ? <Text style={s.headerSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionText}>{title}</Text>
      {action ? <Text style={s.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  label, onPress, disabled, style,
}: { label: string; onPress: () => void; disabled?: boolean; style?: ViewStyle }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.btn, pressed && s.btnPressed, disabled && s.btnDisabled, style]}
      accessibilityRole="button"
    >
      <Text style={s.btnLabel}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: F.dB, fontSize: 20, color: C.navy, letterSpacing: -0.3 },
  headerSub: { fontFamily: F.bM, fontSize: 12.5, color: C.muted, marginTop: 2 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  sectionText: { fontFamily: F.dB, fontSize: 15, color: C.navy, letterSpacing: -0.2 },
  sectionAction: { fontFamily: F.bB, fontSize: 12, color: C.blue },
  btn: { backgroundColor: C.blue, borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', ...shadowCard },
  btnPressed: { backgroundColor: C.blueDark, transform: [{ scale: 0.985 }] },
  btnDisabled: { opacity: 0.45 },
  btnLabel: { fontFamily: F.bB, fontSize: 15, color: C.white, letterSpacing: 0.2 },
  card: { backgroundColor: C.card, borderRadius: R.md, borderWidth: 1, borderColor: C.line },
});

export { R, shadowCard };
