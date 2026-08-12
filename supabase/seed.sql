-- LavaYa - Datos semilla (seed)

-- Servicios
INSERT INTO services (name, description, icon, base_price, unit) VALUES
  ('Lavar', 'Lavado profesional con productos premium', '🫧', 1.50, 'kg'),
  ('Planchar', 'Planchado profesional prenda por prenda', '👔', 2.00, 'kg'),
  ('Lavar + Planchar', 'Servicio completo de lavado y planchado', '🧺', 3.00, 'kg');

-- Service addons
INSERT INTO service_addons (service_id, name, description, price) VALUES
  ((SELECT id FROM services WHERE name = 'Lavar'), 'Secado Premium', 'Secado con aroma y suavizante premium', 1.00),
  ((SELECT id FROM services WHERE name = 'Lavar + Planchar'), 'Doblado Premium', 'Doblado profesional al estilo boutique', 1.50),
  ((SELECT id FROM services WHERE name = 'Lavar'), 'Ropa Delicada', 'Tratamiento especial para ropa delicada', 2.00);

-- Planes
INSERT INTO plans (name, description, price, max_weight_kg, pickups_per_month, includes_wash, includes_iron, delivery_type, discount_percent, is_popular) VALUES
  ('Basico', 'Ideal para uso personal ligero', 9.99, 10, 2, true, false, 'standard', 0, false),
  ('Estandar', 'Perfecto para familias pequenas', 17.99, 20, 4, true, true, 'standard', 10, true),
  ('Premium', 'La mejor experiencia LavaYa', 29.99, 40, 8, true, true, 'priority', 15, false);

-- Cupones de demostracion
INSERT INTO coupons (code, discount_type, discount_value, minimum_order, maximum_discount) VALUES
  ('WELCOME10', 'percentage', 10, 0, 5.00),
  ('FIRSTORDER', 'fixed', 3.00, 0, 3.00),
  ('LAVAYA20', 'percentage', 20, 20, 10.00);
