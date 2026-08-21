export type BillingCycle = 'mensual' | 'semanal';

export interface PlanDef {
  id: string;
  name: string;
  desc: string;
  monthly: number;
  weekly: number;
  kg: number;
  pickups: string;
  extrasOff?: number;
  support?: string;
  popular?: boolean;
}

export const PLANS: PlanDef[] = [
  {
    id: 'basico',
    name: 'Basico',
    desc: 'Ideal para cargas pequenas',
    monthly: 9.99,
    weekly: 2.99,
    kg: 10,
    pickups: '2 retiros y entregas',
  },
  {
    id: 'estandar',
    name: 'Estandar',
    desc: 'Para familias pequenas',
    monthly: 17.99,
    weekly: 4.99,
    kg: 20,
    pickups: '4 retiros y entregas',
    extrasOff: 10,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Maximo cuidado para tu ropa',
    monthly: 29.99,
    weekly: 7.99,
    kg: 40,
    pickups: 'Retiros ilimitados',
    extrasOff: 15,
    support: 'Atencion prioritaria 24/7',
  },
];

export interface ServiceDef {
  id: string;
  name: string;
  desc: string;
  pricePerKg: number;
}

export const SERVICES: ServiceDef[] = [
  { id: 'wash', name: 'Lavar', desc: 'Lavado profesional con productos premium', pricePerKg: 1.5 },
  { id: 'iron', name: 'Planchar', desc: 'Planchado a vapor con acabado impecable', pricePerKg: 2.0 },
  { id: 'duo', name: 'Lavar + Planchar', desc: 'El servicio completo, sin mover un dedo', pricePerKg: 3.0 },
  { id: 'delicate', name: 'Delicados', desc: 'Camisas y prendas que merecen cuidado extra', pricePerKg: 2.5 },
];

export const DELIVERY_FEE = { standard: 3.0, priority: 5.0 };

export const STATUS_FLOW = [
  'pending', 'pickup_assigned', 'en_route_pickup', 'picked_up', 'received_laundry',
  'washing', 'drying', 'ironing', 'ready', 'en_route_delivery', 'delivered',
] as const;

export const STATUS_LABEL: Record<string, string> = {
  pending: 'Solicitud recibida',
  pickup_assigned: 'Repartidor asignado',
  en_route_pickup: 'En camino a ti',
  picked_up: 'Ropa retirada',
  received_laundry: 'En lavanderia',
  washing: 'Lavando',
  drying: 'Secando',
  ironing: 'Planchando',
  ready: 'Lista para entrega',
  en_route_delivery: 'En camino a ti',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const money = (n: number) => `$${n.toFixed(2)}`;
