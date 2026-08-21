import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '../lib/supabase';
import { useBiometricLogin } from '../lib/useBiometricLogin';
import { registerForPushNotificationsAsync, setupNotificationListener } from '../lib/notifications';
import {
  Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold,
} from '@expo-google-fonts/sora';
import {
  Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold,
  Manrope_700Bold, Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold,
    Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold,
    Manrope_700Bold, Manrope_800ExtraBold,
  });

  // Login biometrico "estilo Cashea": si hay sesion activa, pedir huella
  const { attempt } = useBiometricLogin();

  // Notificaciones push (Expo Push): registrar token del dispositivo activo
  useEffect(() => {
    let unsubListener: (() => void) | undefined;

    (async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (userId) {
        unsubListener = setupNotificationListener(({ orderId }) => {
          if (orderId) router.push(`/tracking/${orderId}`);
        });
        registerForPushNotificationsAsync(userId).catch(() => {});
      }
    })();

    return () => unsubListener?.();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
      attempt();
    }
  }, [loaded, error]);

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="tracking/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="profile/addresses" options={{ headerShown: false }} />
        <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
        <Stack.Screen name="support" options={{ headerShown: false }} />
        <Stack.Screen name="aprobacion" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
