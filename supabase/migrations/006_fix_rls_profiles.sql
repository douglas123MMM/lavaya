-- 006_fix_rls_profiles.sql
-- Corrige RLS de profiles para soportar el flujo de aprobacion (Fase A) y push notifications.
-- El cliente debe poder LEER su propio perfil (estatus aprobacion) y ACTUALIZAR su push_token.
-- El admin debe poder actualizar estatus/motivo_rechazo/cedula/telefono.
-- Sin recursion: se usa is_admin() (SECURITY DEFINER) para el rol admin.
-- ADEMAS: trigger que impide que un cliente modifique su estatus_aprobacion/rol/cedula
-- (evita auto-aprobarse o escalar permisos).

-- ============================================
-- LIMPIAR politicas viejas (002) que causan recursion o son redundantes
-- ============================================
DROP POLICY IF EXISTS "users_own_profile_select" ON profiles;
DROP POLICY IF EXISTS "users_own_profile_update" ON profiles;
DROP POLICY IF EXISTS "admin_all_profiles_select" ON profiles;

-- ============================================
-- TRIGGER: impedir que un cliente (no-admin) modifique campos sensibles
-- NOTA: no es SECURITY DEFINER para que auth.uid()/auth.role() usen el
-- contexto real del llamador. El rol JWT se lee via current_setting()
-- (sin ambiguedad ni necesidad de schema auth en search_path).
-- ============================================
CREATE OR REPLACE FUNCTION public.prevent_customer_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  jwt_role TEXT;
BEGIN
  -- Rol del JWT del llamador: 'anon', 'authenticated' o 'service_role'.
  jwt_role := current_setting('request.jwt.role', true);

  -- service_role bypassa RLS y es usado por el panel admin/dashboard
  -- (via service_role key) para aprobar/actualizar usuarios. Se permite.
  IF jwt_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Solo aplica a usuarios autenticados que NO son admin.
  -- public.is_admin() es SECURITY DEFINER y resuelve auth.uid() correctamente.
  IF NOT public.is_admin() THEN
    IF NEW.rol IS DISTINCT FROM OLD.rol
       OR NEW.estatus_aprobacion IS DISTINCT FROM OLD.estatus_aprobacion
       OR NEW.cedula IS DISTINCT FROM OLD.cedula
       OR NEW.rechazo_motivo IS DISTINCT FROM OLD.rechazo_motivo
       OR NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'No tienes permiso para modificar estos campos del perfil.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_customer_privilege_escalation ON profiles;
CREATE TRIGGER prevent_customer_privilege_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_customer_privilege_escalation();

GRANT EXECUTE ON FUNCTION public.prevent_customer_privilege_escalation() TO anon, authenticated, service_role;

-- ============================================
-- NUEVAS politicas (sin recursion, con WITH CHECK en UPDATE)
-- ============================================

-- SELECT: el usuario lee su propio perfil; el admin ve todos
DROP POLICY IF EXISTS "profiles_self_select" ON profiles;
CREATE POLICY "profiles_self_select" ON profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- UPDATE: el usuario actualiza su perfil; el admin todo.
-- El WITH CHECK restringe a que la fila nueva pertenezca al usuario o sea admin.
-- El trigger anterior se encarga de impedir cambios de estatus/rol/cedula por cliente.
DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- INSERT: un usuario autenticado crea su propio profile al registrarse
DROP POLICY IF EXISTS "profiles_self_insert" ON profiles;
CREATE POLICY "profiles_self_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- Garantizar permisos de SELECT/UPDATE para authenticated
-- (sin esto, aunque exista politica, puede fallar por falta de GRANT)
-- ============================================
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT, UPDATE ON TABLE public.profiles TO service_role;