import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#146BDB',
      tabBarInactiveTintColor: '#718096',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E4ECF5',
        paddingBottom: 6,
        paddingTop: 6,
        height: 60,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Inicio',
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
      }} />
      <Tabs.Screen name="orders" options={{
        title: 'Pedidos',
        tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} />,
      }} />
      <Tabs.Screen name="plans" options={{
        title: 'Planes',
        tabBarIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Perfil',
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
