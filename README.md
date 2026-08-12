# LavaYa - "Tu tiempo vale mas"

Plataforma tecnologica de lavanderia bajo demanda.

## Estructura

```
lavaya/
├── apps/
│   ├── mobile/      # App cliente (Expo + React Native)
│   ├── driver/      # App repartidor (Expo + React Native)
│   ├── admin/       # Panel administrativo (Next.js)
│   └── laundry/     # Panel lavanderia (Next.js)
├── packages/
│   ├── types/       # Tipos TypeScript compartidos
│   ├── shared/      # Cliente Supabase compartido
│   └── config/      # Configuracion global
└── supabase/
    ├── migrations/  # Esquema SQL inicial
    └── seed.sql     # Datos de demostracion
```

## Requisitos

- Node.js >= 18
- Cuenta Supabase (https://supabase.com)
- Expo CLI (`npm install -g expo-cli`)

## Instalacion

```bash
cd lavaya

# Variables de entorno
cp .env.example apps/mobile/.env.local
cp .env.example apps/driver/.env.local
cp .env.example apps/admin/.env.local
cp .env.example apps/laundry/.env.local
```

## Configurar Supabase

1. Crear proyecto en https://supabase.com
2. Ejecutar migraciones:
   - Copiar contenido de `supabase/migrations/001_initial_schema.sql`
   - Pegar en SQL Editor de Supabase y ejecutar
3. Ejecutar seed: copiar `supabase/seed.sql` en SQL Editor
4. Configurar `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`

## Ejecutar

```bash
# App cliente
cd apps/mobile && npm install && npx expo start

# App repartidor
cd apps/driver && npm install && npx expo start

# Panel administrativo
cd apps/admin && npm install && npm run dev

# Panel lavanderia
cd apps/laundry && npm install && npm run dev
```

## Usuarios de prueba

Crear usuarios en Supabase Auth > Users con los metadatos correspondientes:

- **Cliente:** `{ "role": "customer", "full_name": "Maria Garcia" }`
- **Repartidor:** `{ "role": "driver", "full_name": "Carlos Lopez" }`
- **Lavanderia:** `{ "role": "laundry", "full_name": "Ana Martinez" }`
- **Admin:** `{ "role": "admin", "full_name": "Admin LavaYa" }`

## Pagos (Stripe)

Para habilitar pagos:
1. Crear cuenta en https://stripe.com
2. Configurar `STRIPE_SECRET_KEY` y `STRIPE_PUBLISHABLE_KEY` en `.env.local`
3. La app funciona sin Stripe para desarrollo local

## Checklist de produccion

- [ ] Configurar dominio personalizado en Supabase
- [ ] Habilitar RLS en todas las tablas
- [ ] Configurar Stripe webhook
- [ ] Configurar notificaciones push (Expo/Firebase)
- [ ] Configurar Google Maps / Mapbox API key
- [ ] Activar autenticacion por email en Supabase
- [ ] Configurar rate limiting
- [ ] Auditoria de seguridad
- [ ] Tests automatizados
- [ ] CI/CD pipeline
