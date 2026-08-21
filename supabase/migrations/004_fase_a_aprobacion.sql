-- LavaYa - FASE A: Aprobacion de usuarios + datos completos de registro
-- Proyecto: henmnuckpbjywlzhawwg
-- Fecha: 20 ago 2026
-- Contexto: agrega a `profiles` los campos de cedula, y el flujo de aprobacion
-- (estatus_aprobacion). El trigger crea el perfil automaticamente al registrarse.
-- EJECUTAR EN: Supabase Dashboard > SQL Editor (o `supabase db push --linked`)

-- ============================================
-- 1) Columnas nuevas en profiles
-- ============================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS cedula TEXT,
  ADD COLUMN IF NOT EXISTS estatus_aprobacion TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (estatus_aprobacion IN ('pendiente', 'aprobado', 'rechazado')),
  ADD COLUMN IF NOT EXISTS rechazo_motivo TEXT;

-- Indices utiles para el buscador del admin
CREATE INDEX IF NOT EXISTS idx_profiles_nombre ON profiles (nombre);
CREATE INDEX IF NOT EXISTS idx_profiles_cedula ON profiles (cedula);
CREATE INDEX IF NOT EXISTS idx_profiles_estatus ON profiles (estatus_aprobacion);

-- ============================================
-- 2) Trigger: crear perfil automaticamente al registrarse (signup)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, rol, nombre, telefono, cedula, estatus_aprobacion)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    'customer',
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'cedula', NULL),
    'pendiente'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nombre = EXCLUDED.nombre;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();