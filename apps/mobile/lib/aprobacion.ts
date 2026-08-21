import { supabase } from './supabase';

/**
 * Devuelve el estatus de aprobacion del perfil del usuario actual.
 * - 'aprobado'   => puede hacer pedidos
 * - 'pendiente'  => admin aún no verifica
 * - 'rechazado'  => admin rechazó (con motivo)
 * - null         => sin sesión o perfil no encontrado
 */
export interface AprobacionStatus {
  estatus: 'aprobado' | 'pendiente' | 'rechazado' | null;
  motivo?: string;
  nombre?: string;
  cedula?: string;
  telefono?: string;
}

export async function getAprobacion(): Promise<AprobacionStatus> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return { estatus: null };

    const userId = sessionData.session.user.id;
    const { data, error } = await supabase
      .from('profiles')
      .select('estatus_aprobacion, rechazo_motivo, nombre, cedula, telefono')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return { estatus: null };

    return {
      estatus: data.estatus_aprobacion,
      motivo: data.rechazo_motivo,
      nombre: data.nombre,
      cedula: data.cedula,
      telefono: data.telefono,
    };
  } catch (e) {
    return { estatus: null };
  }
}