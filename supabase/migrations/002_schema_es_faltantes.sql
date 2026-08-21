-- LavaYa - Tablas faltantes adaptadas al SCHEMA REAL de produccion (espanol)
-- Proyecto: henmnuckpbjywlzhawwg
-- Fecha: 20 ago 2026
-- Contexto: el schema real usa IDs TEXT en orders/plans/addresses. Las tablas auxiliares
-- usan columnas TEXT para esas FKs (PostgREST resuelve las relaciones por nombre).
-- Las FKs de base de datos se omiten para evitar incompatibilidad de tipos (orders.id=TEXT).
-- EJECUTAR EN: Supabase Dashboard > SQL Editor (o `supabase db push --linked`)

-- ============================================
-- EXTENSIONES (idempotente)
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS (si no existen)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer', 'driver', 'laundry', 'admin');
  END IF;
END $$;

-- ============================================
-- profiles (perfiles de usuario, extiende auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  rol user_role NOT NULL DEFAULT 'customer',
  nombre TEXT NOT NULL DEFAULT '',
  telefono TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- coupons (cupones)
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  tipo_descuento TEXT NOT NULL DEFAULT 'percentage',
  valor_descuento DECIMAL(10,2) NOT NULL,
  pedido_minimo DECIMAL(10,2) NOT NULL DEFAULT 0,
  descuento_maximo DECIMAL(10,2),
  expira_en TIMESTAMPTZ,
  limite_uso INTEGER NOT NULL DEFAULT 100,
  veces_usado INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- order_items (items de un pedido) - order_id TEXT (orders.id es TEXT)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  servicio TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  cantidad DECIMAL(10,2) NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- service_addons (extras por servicio)
-- ============================================
CREATE TABLE IF NOT EXISTS service_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servicio TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  precio DECIMAL(10,2) NOT NULL,
  unidad TEXT NOT NULL DEFAULT 'kg',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- coupon_redemptions (usos de cupones)
-- ============================================
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  order_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  monto_descuento DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- reviews (resenas de pedidos)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- order_events (historial de cambios de estado)
-- ============================================
CREATE TABLE IF NOT EXISTS order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  status TEXT NOT NULL,
  worker_id TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- driver_locations (ubicacion repartidores)
-- ============================================
CREATE TABLE IF NOT EXISTS driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL UNIQUE REFERENCES profiles(id),
  lat DOUBLE PRECISION NOT NULL DEFAULT 0,
  lng DOUBLE PRECISION NOT NULL DEFAULT 0,
  disponible BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- notifications (notificaciones)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'info',
  order_id TEXT,
  leida BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- incidents (incidencias)
-- ============================================
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  reportado_por TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'other',
  descripcion TEXT NOT NULL,
  resuelto BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- support_tickets (soporte)
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  order_id TEXT,
  categoria TEXT NOT NULL DEFAULT 'other',
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- business_accounts (cuentas de negocio)
-- ============================================
CREATE TABLE IF NOT EXISTS business_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tax_id TEXT,
  contacto_nombre TEXT NOT NULL,
  contacto_email TEXT NOT NULL,
  contacto_telefono TEXT,
  limite_credito DECIMAL(10,2) NOT NULL DEFAULT 0,
  pricing_personalizado BOOLEAN NOT NULL DEFAULT false,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FUNCIONES y TRIGGERS (idempotente)
-- ============================================

-- auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, rol, nombre)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'rol', 'customer')::user_role,
    COALESCE(NEW.raw_user_meta_data->>'nombre', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- registro de eventos al cambiar estado de orden
CREATE OR REPLACE FUNCTION handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_events (order_id, status, worker_id)
    VALUES (NEW.id::text, NEW.status, auth.uid()::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_status_change ON orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION handle_order_status_change();

-- actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS coupons_updated_at ON coupons;
CREATE TRIGGER coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS service_addons_updated_at ON service_addons;
CREATE TRIGGER service_addons_updated_at BEFORE UPDATE ON service_addons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS support_tickets_updated_at ON support_tickets;
CREATE TRIGGER support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_accounts ENABLE ROW LEVEL SECURITY;

-- POLITICAS
-- profiles: usuario ve/edita su perfil, admin ve todo
DROP POLICY IF EXISTS "users_own_profile_select" ON profiles;
CREATE POLICY "users_own_profile_select" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "users_own_profile_update" ON profiles;
CREATE POLICY "users_own_profile_update" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "admin_all_profiles_select" ON profiles;
CREATE POLICY "admin_all_profiles_select" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

-- coupons: lectura publica, admin gestiona
DROP POLICY IF EXISTS "coupons_public_select" ON coupons;
CREATE POLICY "coupons_public_select" ON coupons FOR SELECT USING (true);
DROP POLICY IF EXISTS "coupons_admin_all" ON coupons;
CREATE POLICY "coupons_admin_all" ON coupons FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

-- order_items: cliente ve items de sus pedidos, admin ve todo
DROP POLICY IF EXISTS "order_items_customer_select" ON order_items;
CREATE POLICY "order_items_customer_select" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()::text));
DROP POLICY IF EXISTS "order_items_admin_all" ON order_items;
CREATE POLICY "order_items_admin_all" ON order_items FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

-- service_addons: lectura publica, admin gestiona
DROP POLICY IF EXISTS "addons_public_select" ON service_addons;
CREATE POLICY "addons_public_select" ON service_addons FOR SELECT USING (true);
DROP POLICY IF EXISTS "addons_admin_all" ON service_addons;
CREATE POLICY "addons_admin_all" ON service_addons FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

-- reviews: lectura publica, usuarios crean reviews de sus pedidos
DROP POLICY IF EXISTS "reviews_public_select" ON reviews;
CREATE POLICY "reviews_public_select" ON reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "reviews_customer_insert" ON reviews;
CREATE POLICY "reviews_customer_insert" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- order_events: staff y admin ven, staff crea
DROP POLICY IF EXISTS "order_events_staff_select" ON order_events;
CREATE POLICY "order_events_staff_select" ON order_events FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('laundry', 'admin', 'driver')));
DROP POLICY IF EXISTS "order_events_staff_insert" ON order_events;
CREATE POLICY "order_events_staff_insert" ON order_events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('laundry', 'admin', 'driver')));

-- driver_locations: repartidor actualiza la suya, admin ve todo
DROP POLICY IF EXISTS "driver_locations_own_all" ON driver_locations;
CREATE POLICY "driver_locations_own_all" ON driver_locations FOR ALL USING (auth.uid() = worker_id);
DROP POLICY IF EXISTS "driver_locations_admin_select" ON driver_locations;
CREATE POLICY "driver_locations_admin_select" ON driver_locations FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

-- notifications: usuario ve/marca leidas las suyas
DROP POLICY IF EXISTS "notifications_own_select" ON notifications;
CREATE POLICY "notifications_own_select" ON notifications FOR SELECT USING (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "notifications_own_update" ON notifications;
CREATE POLICY "notifications_own_update" ON notifications FOR UPDATE USING (auth.uid()::text = user_id);

-- incidents: staff ve/crea
DROP POLICY IF EXISTS "incidents_staff_select" ON incidents;
CREATE POLICY "incidents_staff_select" ON incidents FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('laundry', 'admin')));
DROP POLICY IF EXISTS "incidents_staff_insert" ON incidents;
CREATE POLICY "incidents_staff_insert" ON incidents FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('laundry', 'admin')));

-- support_tickets: cliente ve/crea los suyos, admin ve todo
DROP POLICY IF EXISTS "support_own_select" ON support_tickets;
CREATE POLICY "support_own_select" ON support_tickets FOR SELECT USING (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "support_own_insert" ON support_tickets;
CREATE POLICY "support_own_insert" ON support_tickets FOR INSERT WITH CHECK (auth.uid()::text = user_id);
DROP POLICY IF EXISTS "support_admin_select" ON support_tickets;
CREATE POLICY "support_admin_select" ON support_tickets FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

-- business_accounts: solo admin
DROP POLICY IF EXISTS "business_admin_all" ON business_accounts;
CREATE POLICY "business_admin_all" ON business_accounts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

-- ============================================
-- INDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_coupons_codigo ON coupons(codigo);
CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_worker ON driver_locations(worker_id);
CREATE INDEX IF NOT EXISTS idx_support_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON coupon_redemptions(coupon_id);