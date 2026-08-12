export const DEMO_MODE = true;

export const DEMO_PROFILE = {
  id: 'demo-customer-1',
  email: 'maria@demo.com',
  role: 'customer',
  full_name: 'Maria Garcia',
  phone: '+1 555 0123',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_SERVICES = [
  { id: 'svc-wash', name: 'Lavar', description: 'Lavado profesional con productos premium', icon: '🫧', base_price: 1.5, unit: 'kg', min_weight: 1, max_weight: 50, active: true },
  { id: 'svc-iron', name: 'Planchar', description: 'Planchado profesional prenda por prenda', icon: '👔', base_price: 2.0, unit: 'kg', min_weight: 1, max_weight: 50, active: true },
  { id: 'svc-full', name: 'Lavar + Planchar', description: 'Servicio completo de lavado y planchado', icon: '🧺', base_price: 3.0, unit: 'kg', min_weight: 1, max_weight: 50, active: true },
];

export const DEMO_ORDERS = [
  {
    id: 'ord-1001', order_number: 1001, customer_id: 'demo-customer-1', service_id: 'svc-full',
    status: 'washing', estimated_weight: 8, actual_weight: 7.4, service_price: 24, delivery_fee: 3,
    addons_total: 0, discount: 0, subscription_discount: 0, total: 27, delivery_type: 'standard',
    pickup_date: '2026-08-12', pickup_time_start: '14:00', pickup_time_end: '16:00',
    special_instructions: 'Tocar timbre 3B', is_recurring: false, created_at: new Date().toISOString(),
  },
  {
    id: 'ord-1002', order_number: 1002, customer_id: 'demo-customer-1', service_id: 'svc-wash',
    status: 'delivered', estimated_weight: 5, actual_weight: 4.8, service_price: 7.5, delivery_fee: 3,
    addons_total: 0, discount: 0, subscription_discount: 0, total: 10.5, delivery_type: 'standard',
    pickup_date: '2026-08-05', pickup_time_start: '10:00', pickup_time_end: '12:00',
    special_instructions: null, is_recurring: false, created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'ord-1003', order_number: 1003, customer_id: 'demo-customer-1', service_id: 'svc-iron',
    status: 'ready', estimated_weight: 3, actual_weight: null, service_price: 6, delivery_fee: 3,
    addons_total: 0, discount: 0, subscription_discount: 0, total: 9, delivery_type: 'standard',
    pickup_date: '2026-08-13', pickup_time_start: '08:00', pickup_time_end: '10:00',
    special_instructions: null, is_recurring: false, created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const DEMO_ADDRESSES = [
  { id: 'addr-1', customer_id: 'demo-customer-1', label: 'Casa', address_line: 'Av. Bolivar 123, Apt 4B', city: 'Caracas', state: 'DC', country: 'VE', latitude: null, longitude: null, instructions: 'Tocar timbre 3B', is_default: true },
  { id: 'addr-2', customer_id: 'demo-customer-1', label: 'Trabajo', address_line: 'Torre Empresarial, Piso 5', city: 'Caracas', state: 'DC', country: 'VE', latitude: null, longitude: null, instructions: 'Dejar en recepcion', is_default: false },
];

export const DEMO_PLANS = [
  { id: 'plan-basic', name: 'Basico', description: 'Ideal para uso personal ligero', price: 9.99, max_weight_kg: 10, pickups_per_month: 2, includes_wash: true, includes_iron: false, delivery_type: 'standard', discount_percent: 0, is_popular: false, is_enterprise: false, active: true },
  { id: 'plan-standard', name: 'Estandar', description: 'Perfecto para familias pequenas', price: 17.99, max_weight_kg: 20, pickups_per_month: 4, includes_wash: true, includes_iron: true, delivery_type: 'standard', discount_percent: 10, is_popular: true, is_enterprise: false, active: true },
  { id: 'plan-premium', name: 'Premium', description: 'La mejor experiencia LavaYa', price: 29.99, max_weight_kg: 40, pickups_per_month: 8, includes_wash: true, includes_iron: true, delivery_type: 'priority', discount_percent: 15, is_popular: false, is_enterprise: false, active: true },
];

export const DEMO_SUBSCRIPTION = {
  id: 'sub-1', customer_id: 'demo-customer-1', plan_id: 'plan-standard',
  plan: { id: 'plan-standard', name: 'Estandar' },
  start_date: '2026-07-12', renewal_date: '2026-09-12', status: 'active',
  monthly_limit_kg: 20, used_kg: 12, remaining_kg: 8,
};
