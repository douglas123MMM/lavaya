import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { supabase } from './supabase';

// Configuración global: mostrar notificación mientras la app está en foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** Solicita permiso y registra el token Expo push del dispositivo en profiles.push_token */
export async function registerForPushNotificationsAsync(userId: string) {
  // Android 13+ requiere permiso POST_NOTIFICATIONS
  if (Platform.OS === 'android' && !(await Notifications.getPermissionsAsync()).granted) {
    const status = await Notifications.requestPermissionsAsync();
    if (!status.granted) return null;
  } else {
    const existing = await Notifications.getPermissionsAsync();
    if (!existing.granted) {
      const requested = await Notifications.requestPermissionsAsync();
      if (!requested.granted) return null;
    }
  }

  const projectId = process.env.EXPO_PUBLIC_EXPO_PROJECT_ID;
  if (!projectId) {
    console.warn('EXPO_PUBLIC_EXPO_PROJECT_ID no definido. Pon tu projectId de expo.dev para recibir push.');
    return null;
  }
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  const pushToken = token.data;

  await supabase
    .from('profiles')
    .update({ push_token: pushToken })
    .eq('id', userId);

  return pushToken;
}

export type PushHandler = (data: { orderId?: string; type?: string }) => void;

/** Escucha notificaciones entrantes (tap o en primer plano) y llama al handler con los datos del pedido */
export function setupNotificationListener(onNotification: PushHandler) {
  const subForeground = Notifications.addNotificationReceivedListener((notification) => {
    const data = notification.request.content.data ?? {};
    onNotification({ orderId: data.orderId as string | undefined, type: data.type as string | undefined });
  });

  const subResponse = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data ?? {};
    onNotification({ orderId: data.orderId as string | undefined, type: data.type as string | undefined });
  });

  return () => {
    subForeground.remove();
    subResponse.remove();
  };
}

/** Envía una notificación push vía Expo Push Service (no requiere Firebase) */
export async function sendPushNotification(expoPushToken: string, title: string, body: string, data?: Record<string, unknown>) {
  if (!expoPushToken) return;
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: expoPushToken,
      title,
      body,
      data,
      sound: 'default',
    }),
  });
}