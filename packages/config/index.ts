export const APP_CONFIG = {
  name: 'LavaYa',
  slogan: 'Tu tiempo vale mas',
  colors: {
    primary: '#146BDB',
    navy: '#17365D',
    background: '#F7FAFC',
    white: '#FFFFFF',
    muted: '#718096',
    border: '#E4ECF5',
    success: '#18A56A',
    error: '#E53E3E',
    warning: '#D69E2E',
  },
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  maps: {
    apiKey: process.env.EXPO_PUBLIC_MAPS_API_KEY || process.env.NEXT_PUBLIC_MAPS_API_KEY || '',
  },
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Solicitud recibida',
  pickup_assigned: 'Repartidor asignado',
  en_route_pickup: 'En camino a recoger',
  picked_up: 'Ropa recogida',
  received_laundry: 'Recibida en lavanderia',
  washing: 'Lavando',
  drying: 'Secando',
  ironing: 'Planchando',
  ready: 'Lista',
  en_route_delivery: 'En camino al cliente',
  delivered: 'Entregada',
  cancelled: 'Cancelado',
};
