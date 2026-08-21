import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { supabase } from './supabase';
import { getAprobacion } from './aprobacion';

/**
 * Login biometrico "estilo Cashea".
 * Si hay sesion activa en el dispositivo (supabase.auth persistido),
 * se solicita la huella/face-id al abrir la app y, al autenticar, se
 * navega directo al home. No se pide usuario/contraseña.
 *
 * Solo si NO hay sesion activa (o el usuario cierra sesion / borra datos)
 * se mostrara la pantalla de login normal.
 */
export function useBiometricLogin() {
  const runOnce = useRef(false);
  // helper tipado flexible: expo regenera los tipos al arrancar
  const go = (dest: string) => router.replace(dest as never);

  const attempt = useCallback(async (): Promise<boolean> => {
    // Evitar disparos duplicados.
    if (runOnce.current) {
      try { router.replace('/(tabs)'); } catch {}
      return false;
    }
    runOnce.current = true;

    try {
      // 1. ¿Hay sesión activa guardada en el dispositivo?
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        runOnce.current = false; // no hay sesión -> mostrar login normal
        return false;
      }

      // 2. ¿El dispositivo soporta biometría (huella / face-id)?
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        // Sin hardware de huella: pasamos según aprobación.
        const r = await getAprobacion();
        go(r.estatus === 'aprobado' ? '/(tabs)' : '/aprobacion');
        return true;
      }

      // 3. Solicitar la huella.
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación de LavaYa',
        fallbackLabel: 'Usar contraseña',
        cancelLabel: 'Cancelar',
      });

      if (result.success) {
        const r = await getAprobacion();
        go(r.estatus === 'aprobado' ? '/(tabs)' : '/aprobacion');
        return true;
      }
      if (result.error !== 'user_cancel') {
        Alert.alert('Acceso denegado', 'No se pudo verificar tu huella.');
      }
      return false;
    } catch (e) {
      // Si falla (p. ej. en web/simulador), pero hay sesión, seguimos.
      try {
        const r = await getAprobacion();
        go(r.estatus === 'aprobado' ? '/(tabs)' : '/aprobacion');
      } catch {}
      return true;
    }
  }, []);

  return { attempt };
}