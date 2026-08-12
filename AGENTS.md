# LavaYa — "Tu tiempo vale mas"

Plataforma tecnologica de lavanderia bajo demanda. App Android + iPhone + Web.

## Estado actual de la sesion (12 ago 2026)

### Lo que esta construido
- **Estructura monorepo** en `Desktop/lavaya/`
- **App Cliente** (React Native Expo): auth, home, checkout 4 pasos, tracking timeline, planes/suscripciones, perfil, direcciones, soporte
- **App Repartidor** (React Native Expo): login, disponibilidad, pedidos, cambios de estado
- **Panel Admin** (Next.js en puerto 3000): dashboard, pedidos, clientes, repartidores, servicios CRUD, planes CRUD, cupones CRUD
- **Panel Lavanderia** (Next.js en puerto 3001): login, dashboard de pedidos, flujo recogida→lavado→secado→planchado→lista

### Backend
- **SQL**: 17 tablas con RLS, triggers, funcion `calculate_order_total()`, politicas por rol
- **Seed data**: 3 servicios ($1.50-$3.00/kg), 3 planes ($9.99-$29.99), 3 cupones
- **Edge Functions**: create-payment-intent (Stripe), stripe-webhook

### Demo HTML
- `LavaYa Premium.html` — demo navegable sin servidor, modo offline
- Aplica Web Interface Guidelines de Vercel (OKLCH colors, aria labels, semantic HTML, focus-visible, reduced-motion)
- Playfair Display + system sans-serif para tipografia
- Paleta: navy oklch(0.16 0.025 260), accent oklch(0.52 0.19 270), bg warm oklch(0.975 0.004 85)

### Skills instaladas
- `vercel-react-native-skills` — 16 reglas React Native
- `find-skills` — buscador de skills
- `web-design-guidelines` — 100+ reglas Vercel UI
- `building-components` — design tokens, composition, accessibility
- `claude-design` — diseno visual profesional
- `frontend-design` — interfaces distintivas
- `feature-dev` — flujo 7 fases
- `ui-ux-pro-max` — motor de busqueda de diseno (estilos, colores, tipografia, charts)
- `design-system` — design tokens
- `ui-styling` — estilos por framework
- `code-architect`, `code-explorer`, `code-review`, `code-reviewer`, `mcp-builder`, `security-review`, `skill-creator`, `agents-md-improver`, `customize-opencode`

### Scripts ui-ux-pro-max (usar con `python`, no `python3`)
```
python "C:\Users\Optiplex 3020 i5-4ta\.agents\skills\ui-ux-pro-max\scripts\search.py" "<query>" --domain <style|color|typography|chart|landing|ux>
```
- Dominios disponibles: style, color, typography, chart, landing, ux, icons, motion, products, react-performance
- Los datos CSV estan en `~\.agents\skills\ui-ux-pro-max\data\`

### Paleta de diseno actual (TEMATICA AZUL, estilo eco/salvia)
- Primary: #2563EB (azul), Dark: #1E40AF, BG azul claro: #DBEAFE, Fondo: #f4f2ee (beige)
- Ink/texto: #1e2b2c, muted: #4d5f5e
- Tipografia: Inter (unica fuente)
- Iconos: Font Awesome (CDN cdnjs 6.0.0-beta3)
- Estilo: organico/eco, pills redondeados (60px), tarjetas 18-24px, badges azules claros
- NO usar: verde, dorado, Bodoni Moda
- El usuario pidio: estetica eco/salvia (Inter + Font Awesome + pills) pero con TEMATICA AZUL

### Archivos demo HTML (navegables offline, COMPARTEN datos via localStorage)
- `LavaYa Premium.html` — App cliente movil. Login con huella dactilar (estilo Cashea), cotizacion por prendas, planes en Bs (Estudiantil Bs15 → Premium Bs90), historial de pagos y compras, mapa Google Maps
- `LavaYa Admin.html` — Panel admin: Dashboard, Pedidos (procesar estados + cantidad real), Servicios/Precios (prenda, CRUD), Planes (CRUD), Cupones, Clientes (buscador)
- **CONEXION PANEL→APP**: ambos usan localStorage key `lavaya_db_v1`. Los cambios del panel (precios, servicios, planes) se reflejan en la app al recargar. La app lee services/plans/payments/purchaseHistory/orders desde esa key.

### Datos actuales (precios en Bs, por prenda)
- Servicios: Lavar Bs8, Planchar Bs6, Lavar+Planchar Bs12, Camisas Bs15
- Planes: Estudiantil Bs15/15 prendas, Hogar Bs35/30, Familiar Bs60/60, Premium Bs90/100
- Todos los planes incluyen: planchado + delivery ida y vuelta

### Pendiente por hacer
- Conectar Supabase real (configurar .env.local con URL + anon key)
- Probar app cliente en dispositivo via Expo Go
- Testear RLS y Edge Functions
- Mejorar UI con el script ui-ux-pro-max (buscar glassmorphism, paletas SaaS, tipografia elegante)
- Responsive final para mobile nativo
- Implementar pagos Stripe reales
- Firebase/Expo Notifications para push
- Google Maps/Mapbox para tracking de repartidores

### Comando para retomar
Abrir terminal en la carpeta del proyecto y ejecutar:

```
cd "C:\Users\Optiplex 3020 i5-4ta\Desktop\lavaya"
```

Luego decirle al agente:

> "Continua desde donde quedamos. El AGENTS.md tiene todo el contexto. Estamos construyendo LavaYa, la app de lavanderia. El demo HTML esta en LavaYa Premium.html. Quiero mejorar la UI usando los scripts de ui-ux-pro-max para buscar paletas de colores SaaS, tipografia elegante, y estilo glassmorphism. Tambien necesito conectar Supabase."

## Arquitectura completa

### Roles
- **customer**: app movil cliente
- **driver**: app movil repartidor
- **laundry**: panel web lavanderia
- **admin**: panel web administrador

### Flujo de pedido
```
pending → pickup_assigned → en_route_pickup → picked_up → received_laundry → washing → drying → ironing → ready → en_route_delivery → delivered
```

### Estructura de archivos
```
Desktop/lavaya/
├── apps/
│   ├── mobile/       # Expo + React Native (cliente)
│   ├── driver/       # Expo + React Native (repartidor)
│   ├── admin/        # Next.js (admin, puerto 3000)
│   └── laundry/      # Next.js (lavanderia, puerto 3001)
├── packages/
│   ├── types/       # Tipos TypeScript compartidos
│   ├── shared/      # Cliente Supabase
│   └── config/      # Configuracion global
├── supabase/
│   ├── migrations/  # SQL inicial
│   ├── seed.sql     # Datos demo
│   └── functions/   # Edge Functions (Stripe)
├── LavaYa Premium.html  # Demo navegable offline
├── .env.example
└── README.md
```

### Tablas principales
profiles, addresses, services, service_addons, plans, subscriptions, orders, order_items, order_events, payments, coupons, coupon_redemptions, reviews, driver_locations, incidents, support_tickets, notifications, business_accounts

### Diseño visual (Vercel Guidelines compliant)
- Colores en OKLCH
- Tipografia: Playfair Display (display) + system sans-serif (body)
- HTML semantico con aria labels
- focus-visible rings en todos los interactivos
- prefers-reduced-motion
- touch-action: manipulation en mobil
- tabular-nums para numeros
- text-wrap: balance en headings
- non-breaking spaces en numeros con unidades
