import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DEMO_PROFILE } from '../../lib/demo';

export default function ProfileScreen() {
  const profile = DEMO_PROFILE;

  const menuItems = [
    { icon: 'person-outline', label: 'Mi perfil', onPress: () => router.push('/profile/edit') },
    { icon: 'location-outline', label: 'Mis direcciones', onPress: () => router.push('/profile/addresses') },
    { icon: 'card-outline', label: 'Metodos de pago', onPress: () => Alert.alert('Demo', 'Metodos de pago') },
    { icon: 'notifications-outline', label: 'Notificaciones', onPress: () => Alert.alert('Demo', 'Notificaciones') },
    { icon: 'help-circle-outline', label: 'Ayuda y soporte', onPress: () => router.push('/support') },
  ];

  const handleLogout = () => Alert.alert('Demo', 'Sesion cerrada (demo)');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}><Text style={styles.title}>Perfil</Text></View>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{profile.full_name.charAt(0).toUpperCase()}</Text></View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.full_name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        </View>
        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress}>
              <Ionicons name={item.icon as any} size={22} color="#146BDB" />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}><Ionicons name="document-text-outline" size={22} color="#718096" /><Text style={styles.menuLabel}>Terminos y condiciones</Text><Ionicons name="chevron-forward" size={18} color="#A0AEC0" /></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><Ionicons name="shield-outline" size={22} color="#718096" /><Text style={styles.menuLabel}>Privacidad</Text><Ionicons name="chevron-forward" size={18} color="#A0AEC0" /></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
          <Text style={styles.logoutText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#17365D' },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E4ECF5' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#146BDB', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  profileInfo: { marginLeft: 14, flex: 1 },
  profileName: { fontSize: 18, fontWeight: '600', color: '#17365D' },
  profileEmail: { fontSize: 14, color: '#718096', marginTop: 2 },
  menuSection: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E4ECF5', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
  menuLabel: { flex: 1, marginLeft: 12, fontSize: 15, color: '#17365D' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 24, marginBottom: 30, paddingVertical: 14, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#FED7D7' },
  logoutText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#E53E3E' },
});
