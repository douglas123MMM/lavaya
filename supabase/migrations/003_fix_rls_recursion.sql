-- LavaYa - Fix de recursion RLS (HTTP 500) por politicas que consultan profiles
-- Proyecto: henmnuckpbjywlzhawwg
-- Fecha: 20 ago 2026
-- Problema: las politicas hacian `EXISTS (SELECT 1 FROM profiles ...)` dentro
-- de politicas de la propia tabla profiles (recursion infinita) y en varias otras.
-- Solucion: funciones SECURITY DEFINER que consultan profiles saltando RLS,
-- y nuevas politicas que usan esas funciones.
-- EJECUTAR EN: Supabase Dashboard > SQL Editor (o `supabase db push --linked`)

-- ============================================
-- FUNCIONES DE ROL (SECURITY DEFINER, sin recursion)
-- ============================================
-- is_admin(): true si el usuario autenticado tiene rol 'admin' en profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND rol = 'admin'
  );
$$;

-- is_staff(): true si el usuario autenticado tiene rol laundry/driver/admin
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND rol IN ('laundry', 'driver', 'admin')
  );
$$;

-- is_laundry_admin(): true si el usuario autenticado tiene rol laundry o admin
CREATE OR REPLACE FUNCTION public.is_laundry_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND rol IN ('laundry', 'admin')
  );
$$;

-- ============================================
-- REESCRIBIR POLITICAS (sin recursion)
-- ============================================

-- profiles: usuario ve/edita su perfil, admin ve todo
DROP POLICY IF EXISTS "admin_all_profiles_select" ON profiles;
CREATE POLICY "admin_all_profiles_select" ON profiles
  FOR SELECT USING (public.is_admin());

-- coupons: lectura publica, admin gestiona
DROP POLICY IF EXISTS "coupons_admin_all" ON coupons;
CREATE POLICY "coupons_admin_all" ON coupons
  FOR ALL USING (public.is_admin());

-- order_items: cliente ve items de sus pedidos, admin ve todo
DROP POLICY IF EXISTS "order_items_admin_all" ON order_items;
CREATE POLICY "order_items_admin_all" ON order_items
  FOR ALL USING (public.is_admin());

-- service_addons: lectura publica, admin gestiona
DROP POLICY IF EXISTS "addons_admin_all" ON service_addons;
CREATE POLICY "addons_admin_all" ON service_addons
  FOR ALL USING (public.is_admin());

-- order_events: staff y admin ven, staff crea
DROP POLICY IF EXISTS "order_events_staff_select" ON order_events;
CREATE POLICY "order_events_staff_select" ON order_events
  FOR SELECT USING (public.is_staff());
DROP POLICY IF EXISTS "order_events_staff_insert" ON order_events;
CREATE POLICY "order_events_staff_insert" ON order_events
  FOR INSERT WITH CHECK (public.is_staff());

-- driver_locations: repartidor actualiza la suya, admin ve todo
DROP POLICY IF EXISTS "driver_locations_admin_select" ON driver_locations;
CREATE POLICY "driver_locations_admin_select" ON driver_locations
  FOR SELECT USING (public.is_admin());

-- incidents: staff ve/crea
DROP POLICY IF EXISTS "incidents_staff_select" ON incidents;
CREATE POLICY "incidents_staff_select" ON incidents
  FOR SELECT USING (public.is_laundry_admin());
DROP POLICY IF EXISTS "incidents_staff_insert" ON incidents;
CREATE POLICY "incidents_staff_insert" ON incidents
  FOR INSERT WITH CHECK (public.is_laundry_admin());

-- support_tickets: admin ve todo
DROP POLICY IF EXISTS "support_admin_select" ON support_tickets;
CREATE POLICY "support_admin_select" ON support_tickets
  FOR SELECT USING (public.is_admin());

-- business_accounts: solo admin
DROP POLICY IF EXISTS "business_admin_all" ON business_accounts;
CREATE POLICY "business_admin_all" ON business_accounts
  FOR ALL USING (public.is_admin());

-- ============================================
-- OTORGAR USO de las funciones (para que funcionen con la key anon/autenticado)
-- ============================================
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_staff() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_laundry_admin() TO anon, authenticated, service_role;