export type UserRole = 'customer' | 'driver' | 'laundry' | 'admin';

export type OrderStatus =
  | 'pending'
  | 'pickup_assigned'
  | 'en_route_pickup'
  | 'picked_up'
  | 'received_laundry'
  | 'washing'
  | 'drying'
  | 'ironing'
  | 'ready'
  | 'en_route_delivery'
  | 'delivered'
  | 'cancelled';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired' | 'payment_failed';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type AddressType = 'home' | 'work' | 'office' | 'other';

export type DeliveryType = 'standard' | 'priority';

export type ServiceUnit = 'kg' | 'piece';

export type IncidentType =
  | 'stain'
  | 'damaged_item'
  | 'missing_item'
  | 'wash_issue'
  | 'iron_issue'
  | 'delay'
  | 'other';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  label: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  instructions: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  base_price: number;
  unit: ServiceUnit;
  min_weight: number;
  max_weight: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: ServiceUnit;
  active: boolean;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  max_weight_kg: number;
  pickups_per_month: number;
  includes_wash: boolean;
  includes_iron: boolean;
  delivery_type: DeliveryType;
  discount_percent: number;
  is_popular: boolean;
  is_enterprise: boolean;
  active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  customer_id: string;
  plan_id: string;
  plan?: Plan;
  start_date: string;
  renewal_date: string;
  status: SubscriptionStatus;
  monthly_limit_kg: number;
  used_kg: number;
  remaining_kg: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  driver_id: string | null;
  service_id: string;
  address_id: string;
  subscription_id: string | null;
  status: OrderStatus;
  estimated_weight: number;
  actual_weight: number | null;
  service_price: number;
  delivery_fee: number;
  addons_total: number;
  discount: number;
  subscription_discount: number;
  total: number;
  delivery_type: DeliveryType;
  pickup_date: string;
  pickup_time_start: string;
  pickup_time_end: string;
  special_instructions: string | null;
  is_recurring: boolean;
  recurring_interval: string | null;
  coupon_id: string | null;
  created_at: string;
  updated_at: string;
  customer?: Profile;
  driver?: Profile;
  service?: Service;
  address?: Address;
  events?: OrderEvent[];
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  service_id: string;
  addon_id: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  status: OrderStatus;
  created_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  status: PaymentStatus;
  payment_method: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order: number;
  maximum_discount: number | null;
  expires_at: string;
  usage_limit: number;
  times_used: number;
  active: boolean;
  created_at: string;
}

export interface CouponRedemption {
  id: string;
  coupon_id: string;
  order_id: string;
  customer_id: string;
  discount_amount: number;
  created_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  customer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  customer_id: string;
  order_id: string | null;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  order_id: string;
  reported_by: string;
  type: IncidentType;
  description: string;
  resolved: boolean;
  created_at: string;
}

export interface DriverLocation {
  id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  is_available: boolean;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  order_id: string | null;
  read: boolean;
  created_at: string;
}

export interface BusinessAccount {
  id: string;
  name: string;
  tax_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  credit_limit: number;
  custom_pricing: boolean;
  active: boolean;
  created_at: string;
}
