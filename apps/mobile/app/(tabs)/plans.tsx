import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEMO_PLANS, DEMO_SUBSCRIPTION } from '../../lib/demo';

export default function PlansScreen() {
  const subscription = DEMO_SUBSCRIPTION;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Planes</Text>
          <Text style={styles.subtitle}>Elige el plan perfecto para ti</Text>
        </View>

        {subscription && (
          <View style={styles.activeSub}>
            <Text style={styles.activeLabel}>Tu plan activo</Text>
            <View style={styles.activeCard}>
              <Text style={styles.activePlan}>{subscription.plan.name}</Text>
              <Text style={styles.activeDetail}>Has usado {subscription.used_kg}kg de {subscription.monthly_limit_kg}kg</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(subscription.used_kg / subscription.monthly_limit_kg) * 100}%` }]} />
              </View>
              <Text style={styles.activeRemaining}>Te quedan {subscription.monthly_limit_kg - subscription.used_kg}kg este mes</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={() => Alert.alert('Demo', 'Suscripcion cancelada (demo)')}>
                <Text style={styles.cancelText}>Cancelar suscripcion</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.plansContainer}>
          {DEMO_PLANS.map((plan) => (
            <View key={plan.id} style={[styles.planCard, plan.is_popular && styles.popularCard]}>
              {plan.is_popular && <View style={styles.popularBadge}><Text style={styles.popularText}>MAS POPULAR</Text></View>}
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>${plan.price}<Text style={styles.planPeriod}>/mes</Text></Text>
              <Text style={styles.planDesc}>{plan.description}</Text>
              <View style={styles.planFeatures}>
                <Feature text={`Hasta ${plan.max_weight_kg}kg`} />
                <Feature text={`${plan.pickups_per_month} recogidas/mes`} />
                <Feature text={`Lavado ${plan.includes_wash ? 'incluido' : 'no incluido'}`} />
                <Feature text={`Planchado ${plan.includes_iron ? 'incluido' : 'no incluido'}`} />
                <Feature text={`Entrega ${plan.delivery_type === 'priority' ? 'prioritaria' : 'estandar'}`} />
              </View>
              <TouchableOpacity style={[styles.subButton, plan.is_popular && styles.popularButton]}
                onPress={() => Alert.alert('Demo', 'Suscripcion simulada a ' + plan.name)}>
                <Text style={[styles.subButtonText, plan.is_popular && styles.popularButtonText]}>
                  {subscription?.plan_id === plan.id ? 'Activo' : 'Suscribirse'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({ text }: { text: string }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}><Text style={{ color: '#18A56A', marginRight: 8 }}>✓</Text><Text style={{ fontSize: 14, color: '#17365D' }}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  subtitle: { fontSize: 14, color: '#718096', marginTop: 4 },
  activeSub: { paddingHorizontal: 20, marginTop: 16 },
  activeLabel: { fontSize: 14, fontWeight: '600', color: '#18A56A', marginBottom: 8 },
  activeCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, borderWidth: 2, borderColor: '#18A56A' },
  activePlan: { fontSize: 18, fontWeight: '700', color: '#17365D' },
  activeDetail: { fontSize: 14, color: '#718096', marginTop: 4 },
  progressBar: { height: 6, backgroundColor: '#E4ECF5', borderRadius: 3, marginTop: 10 },
  progressFill: { height: 6, backgroundColor: '#146BDB', borderRadius: 3 },
  activeRemaining: { fontSize: 14, fontWeight: '500', color: '#146BDB', marginTop: 8 },
  cancelButton: { alignSelf: 'flex-start', marginTop: 12 },
  cancelText: { fontSize: 13, color: '#E53E3E', fontWeight: '500' },
  plansContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
  planCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: '#E4ECF5' },
  popularCard: { borderColor: '#146BDB', borderWidth: 2 },
  popularBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#146BDB', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  popularText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  planName: { fontSize: 20, fontWeight: '700', color: '#17365D' },
  planPrice: { fontSize: 32, fontWeight: '700', color: '#146BDB', marginTop: 4 },
  planPeriod: { fontSize: 14, fontWeight: '400', color: '#718096' },
  planDesc: { fontSize: 14, color: '#718096', marginTop: 4 },
  planFeatures: { marginTop: 16 },
  subButton: { backgroundColor: '#E4ECF5', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  subButtonText: { fontSize: 15, fontWeight: '600', color: '#146BDB' },
  popularButton: { backgroundColor: '#146BDB' },
  popularButtonText: { color: '#FFF' },
});
