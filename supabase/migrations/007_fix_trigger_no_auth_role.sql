-- 007_fix_trigger_no_auth_role.sql
-- Corrige el trigger de 006: auth.role() dentro de funcion SECURITY DEFINER
-- y con search_path sin `auth` causaba error en produccion.
-- Se reemplaza por lectura del rol JWT via current_setting('request.jwt.role')
-- y la funcion es NO SECURITY DEFINER (usa contexto del llamador para is_admin()).

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