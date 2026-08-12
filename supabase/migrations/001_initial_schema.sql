-- LavaYa - Migracion inicial de base de datos

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'driver', 'laundry', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'pickup_assigned', 'en_route_pickup', 'picked_up', 'received_laundry', 'washing', 'drying', 'ironing', 'ready', 'en_route_delivery', 'delivered', 'cancelled');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled', 'expired', 'payment_failed');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE delivery_type AS ENUM ('standard', 'priority');

-- TABLA: profiles (extiende auth.users de Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Casa',
  address_line TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  instructions TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🧺',
  base_price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  min_weight DECIMAL(10,2) NOT NULL DEFAULT 1,
  max_weight DECIMAL(10,2) NOT NULL DEFAULT 50,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: service_addons
CREATE TABLE service_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: plans
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  max_weight_kg DECIMAL(10,2) NOT NULL,
  pickups_per_month INTEGER NOT NULL DEFAULT 4,
  includes_wash BOOLEAN NOT NULL DEFAULT true,
  includes_iron BOOLEAN NOT NULL DEFAULT false,
  delivery_type delivery_type NOT NULL DEFAULT 'standard',
  discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_enterprise BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  renewal_date DATE NOT NULL,
  status subscription_status NOT NULL DEFAULT 'active',
  monthly_limit_kg DECIMAL(10,2) NOT NULL,
  used_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
  remaining_kg DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  driver_id UUID REFERENCES profiles(id),
  service_id UUID NOT NULL REFERENCES services(id),
  address_id UUID NOT NULL REFERENCES addresses(id),
  subscription_id UUID REFERENCES subscriptions(id),
  status order_status NOT NULL DEFAULT 'pending',
  estimated_weight DECIMAL(10,2) NOT NULL DEFAULT 0,
  actual_weight DECIMAL(10,2),
  service_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  addons_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  subscription_discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_type delivery_type NOT NULL DEFAULT 'standard',
  pickup_date DATE NOT NULL,
  pickup_time_start TIME NOT NULL DEFAULT '14:00',
  pickup_time_end TIME NOT NULL DEFAULT '16:00',
  special_instructions TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_interval TEXT,
  coupon_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  addon_id UUID REFERENCES service_addons(id),
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: order_events (historial de estados)
CREATE TABLE order_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  created_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'card',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order DECIMAL(10,2) NOT NULL DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  expires_at TIMESTAMPTZ,
  usage_limit INTEGER NOT NULL DEFAULT 100,
  times_used INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: coupon_redemptions
CREATE TABLE coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: driver_locations
CREATE TABLE driver_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL UNIQUE REFERENCES profiles(id),
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: incidents
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  reported_by UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL DEFAULT 'other',
  description TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: support_tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  category TEXT NOT NULL DEFAULT 'other',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  order_id UUID REFERENCES orders(id),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLA: business_accounts
CREATE TABLE business_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tax_id TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  credit_limit DECIMAL(10,2) NOT NULL DEFAULT 0,
  custom_pricing BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FUNCION: auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- FUNCION: crear evento de orden automaticamente
CREATE OR REPLACE FUNCTION handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_events (order_id, status, created_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION handle_order_status_change();

-- FUNCION: actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- INDICES
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_driver ON orders(driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_pickup_date ON orders(pickup_date);
CREATE INDEX idx_addresses_customer ON addresses(customer_id);
CREATE INDEX idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX idx_order_events_order ON order_events(order_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_driver_locations_driver ON driver_locations(driver_id);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- POLITICAS RLS

-- profiles
CREATE POLICY "Usuarios ven su propio perfil" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin ve todos los perfiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Usuarios editan su propio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- addresses
CREATE POLICY "Clientes ven sus direcciones" ON addresses FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Clientes crean direcciones" ON addresses FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Clientes editan sus direcciones" ON addresses FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Clientes eliminan sus direcciones" ON addresses FOR DELETE USING (auth.uid() = customer_id);
CREATE POLICY "Admin ve todas las direcciones" ON addresses FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- orders
CREATE POLICY "Clientes ven sus pedidos" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Repartidores ven pedidos asignados" ON orders FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Laundry ve pedidos en proceso" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'laundry') AND status IN ('received_laundry','washing','drying','ironing','ready'));
CREATE POLICY "Admin ve todos los pedidos" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- payments
CREATE POLICY "Clientes ven sus pagos" ON payments FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admin ve todos los pagos" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- subscriptions
CREATE POLICY "Clientes ven sus suscripciones" ON subscriptions FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admin ve todas las suscripciones" ON subscriptions FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- reviews
CREATE POLICY "Todos ven reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Clientes crean reviews de sus pedidos" ON reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- services and plans (lectura publica, solo admin escribe)
CREATE POLICY "Lectura publica de servicios" ON services FOR SELECT USING (true);
CREATE POLICY "Admin gestiona servicios" ON services FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Lectura publica de planes" ON plans FOR SELECT USING (true);
CREATE POLICY "Admin gestiona planes" ON plans FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Lectura publica de addons" ON service_addons FOR SELECT USING (true);
CREATE POLICY "Admin gestiona addons" ON service_addons FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- notifications
CREATE POLICY "Usuarios ven sus notificaciones" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios marcan leidas" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- support_tickets
CREATE POLICY "Clientes ven sus tickets" ON support_tickets FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Clientes crean tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Admin ve todos los tickets" ON support_tickets FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- incident policies
CREATE POLICY "Staff ven incidencias" ON incidents FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('laundry', 'admin')));
CREATE POLICY "Staff crean incidencias" ON incidents FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('laundry', 'admin')));

-- coupons: lectura publica (para validar), admin gestiona
CREATE POLICY "Lectura publica de cupones" ON coupons FOR SELECT USING (true);
CREATE POLICY "Admin gestiona cupones" ON coupons FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- FUNCION: calcular precio del pedido
CREATE OR REPLACE FUNCTION calculate_order_total(
  p_service_id UUID,
  p_weight DECIMAL,
  p_delivery_type delivery_type,
  p_subscription_id UUID DEFAULT NULL,
  p_coupon_code TEXT DEFAULT NULL
)
RETURNS TABLE(
  service_price DECIMAL,
  delivery_fee DECIMAL,
  subscription_discount DECIMAL,
  coupon_discount DECIMAL,
  total DECIMAL
) AS $$
DECLARE
  v_service services%ROWTYPE;
  v_sub subscriptions%ROWTYPE;
  v_plan plans%ROWTYPE;
  v_coupon coupons%ROWTYPE;
  v_total DECIMAL;
  v_service_p DECIMAL;
  v_delivery_f DECIMAL;
  v_sub_disc DECIMAL := 0;
  v_cpn_disc DECIMAL := 0;
BEGIN
  SELECT * INTO v_service FROM services WHERE id = p_service_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Servicio no encontrado'; END IF;

  v_service_p := v_service.base_price * p_weight;

  IF p_delivery_type = 'priority' THEN
    v_delivery_f := 5.00;
  ELSE
    v_delivery_f := 3.00;
  END IF;

  IF p_subscription_id IS NOT NULL THEN
    SELECT * INTO v_sub FROM subscriptions WHERE id = p_subscription_id AND customer_id = auth.uid();
    IF FOUND AND v_sub.status = 'active' THEN
      SELECT * INTO v_plan FROM plans WHERE id = v_sub.plan_id;
      IF v_plan.discount_percent > 0 THEN
        v_sub_disc := ROUND((v_service_p * v_plan.discount_percent / 100)::numeric, 2);
      END IF;
    END IF;
  END IF;

  IF p_coupon_code IS NOT NULL THEN
    SELECT * INTO v_coupon FROM coupons WHERE code = p_coupon_code AND active = true;
    IF FOUND AND v_coupon.times_used < v_coupon.usage_limit AND (v_coupon.expires_at IS NULL OR v_coupon.expires_at > NOW()) THEN
      IF v_coupon.discount_type = 'percentage' THEN
        v_cpn_disc := ROUND((v_service_p * v_coupon.discount_value / 100)::numeric, 2);
      ELSE
        v_cpn_disc := v_coupon.discount_value;
      END IF;
      IF v_coupon.maximum_discount IS NOT NULL AND v_cpn_disc > v_coupon.maximum_discount THEN
        v_cpn_disc := v_coupon.maximum_discount;
      END IF;
    END IF;
  END IF;

  v_total := v_service_p + v_delivery_f - v_sub_disc - v_cpn_disc;
  IF v_total < 0 THEN v_total := 0; END IF;

  RETURN QUERY SELECT v_service_p, v_delivery_f, v_sub_disc, v_cpn_disc, v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
