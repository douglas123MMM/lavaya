import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriverEarningsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Ganancias</Text></View>
      <View style={styles.card}>
        <Text style={styles.label}>Ganancias de hoy</Text>
        <Text style={styles.amount}>$0.00</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Ganancias de la semana</Text>
        <Text style={styles.amount}>$0.00</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Ganancias del mes</Text>
        <Text style={styles.amount}>$0.00</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 20, marginHorizontal: 20, marginBottom: 10, borderWidth: 1, borderColor: '#E4ECF5' },
  label: { fontSize: 14, color: '#718096' },
  amount: { fontSize: 28, fontWeight: '700', color: '#17365D', marginTop: 4 },
});
