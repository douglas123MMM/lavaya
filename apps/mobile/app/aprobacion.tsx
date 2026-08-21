import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getAprobacion, AprobacionStatus } from '../lib/aprobacion';
import { supabase } from '../lib/supabase';
import * as LocalAuthentication from 'expo-local-authentication';

export default function AprobacionScreen() {
  const router = useRouter();
  const [info, setInfo] = useState<AprobacionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const r = await getAprobacion();
    setInfo(r);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRetry = () => {
    // Reintenta la huella (si el admin ya aprobó, pasa a home).
    LocalAuthentication.authenticateAsync({ promptMessage: 'Verifica tu huella' })
      .then(async (res) => {
        if (res.success) {
          const r = await getAprobacion();
          setInfo(r);
          if (r.estatus === 'aprobado') { router.replace('/(tabs)'); }
          else { Alert.alert('Aún no aprobado', 'Espera la aprobación del administrador.'); }
        }
      })
      .catch(() => {});
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color="#146BDB" /></View>;
  }

  const estatus = info?.estatus;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>{estatus === 'rechazado' ? '🚫' : '⏳'}</Text>

        {estatus === 'pendiente' && (
          <>
            <Text style={styles.title}>Cuenta en revisión</Text>
            <Text style={styles.text}>
              Tu cuenta está pendiente de aprobación por el administrador.{'\n\n'}
              Podrás hacer pedidos y adquirir planes una vez verificados tus datos (cédula, teléfono y dirección).
            </Text>
          </>
        )}

        {estatus === 'rechazado' && (
          <>
            <Text style={styles.title}>Cuenta rechazada</Text>
            <Text style={styles.text}>
              Tu solicitud fue rechazada.{info?.motivo ? `\n\nMotivo: ${info.motivo}` : ''}
            </Text>
          </>
        )}

        {(!estatus || estatus === null) && (
          <>
            <Text style={styles.title}>Sin acceso</Text>
            <Text style={styles.text}>No pudimos verificar tu cuenta. Vuelve a intentarlo.</Text>
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRetry}>
          <Text style={styles.buttonText}>Verificar de nuevo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={handleLogout}>
          <Text style={styles.linkText}>Cerrar sesión e ingresar con credenciales</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC', justifyContent: 'center', padding: 24 },
  center: { alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  icon: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#17365D', textAlign: 'center', marginBottom: 12 },
  text: { fontSize: 15, color: '#4A5568', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  button: { backgroundColor: '#146BDB', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center', width: '100%' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkBtn: { marginTop: 16, paddingVertical: 8 },
  linkText: { color: '#146BDB', fontSize: 15, fontWeight: '600', textAlign: 'center' },
});