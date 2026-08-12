import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="service" />
      <Stack.Screen name="address" />
      <Stack.Screen name="pickup" />
      <Stack.Screen name="confirm" />
    </Stack>
  );
}
