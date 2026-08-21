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

### Estado Supabase REAL verificado (20 ago 2026)
- **Proyecto**: `henmnuckpbjywlzhawwg` ("douglas123MMM's Project", org `iftslrtqpgukthxchobz`)
- **URL**: `https://henmnuckpbjywlzhawwg.supabase.co`
- **Anon key**: `sb_publishable_9SPDgOmtVfmCH0dP2d6tOA_kC0JerEu`
- **Pooler**: `postgresql://postgres.henmnuckpbjywlzhawwg@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
- **Las 4 apps (.env.local) YA apuntan a este proyecto** (admin/laundry usan NEXT_PUBLIC_, mobile/driver usan EXPO_PUBLIC_)
- **INFRA**: Supabase v17.6.1, Postgres 17.6.1, CLI ligado (`.temp/project-ref`, `linked-project.json`, `pooler-url`)

### Schema REAL de produccion (DIFIERE del local 001_initial_schema.sql - usa nombres en espanol)
- **orders**: id (TEXT), user_id, address_id, servicio, servicio_tipo, peso_estimado, fecha_retiro, hora_retiro, subtotal, descuento, costo_total, costo_delivery, comision, status, notas, worker_id, created_at, updated_at, ticket, pickup_lat, pickup_lng, delivery_lat, delivery_lng, payment_submitted_at, assigned_at
- **plans**: id (TEXT), nombre, descripcion, precio, kg_limite, retiros_mes, descuento_extra, atencion_prioritaria, delivery_incluido, activo, created_at, updated_at
- **addresses**: id, user_id (TEXT), direccion, referencia, lat, lng, tipo, es_principal, created_at
- **services**: existe, vacia (0 filas)
- **subscriptions**: existe, vacia (0 filas)
- **payments**: existe, vacia (0 filas)
- **IMPORTANTE**: orders.id y plans.id son **TEXT**, no UUID. Los IDs simplificados (cadena) en vez de uuid.
- **APLICADO (20 ago 2026)**: `002_schema_es_faltantes.sql` creado y pusheado OK (`supabase db push --linked`) con: profiles (UUID a auth.users), coupons, order_items, service_addons, coupon_redemptions, reviews, order_events, driver_locations, notifications, incidents, support_tickets, business_accounts. Las tablas auxiliares usan `order_id TEXT`/`user_id TEXT` (compatibles con orders.id/addresses.user_id TEXT). FKs de BD a orders omitidas (incompatibilidad de tipos resuelta con TEXT).
- **APLICADO (20 ago 2026)**: `003_fix_rls_recursion.sql` CORRIGE recursion RLS (HTTP 500). Funciones `is_admin()`, `is_staff()`, `is_laundry_admin()` (SECURITY DEFINER) + reescritura de politicas. Push OK, verificado: **las 12 tablas nuevas responden 200 OK con key anon**.
- **Proxima sesson**: obtener password de la base (Settings > Database) para `supabase db push` sin confirmacion y para SQL directo via node-pg, y verificar inserccion desde las apps con el service_role key.

### Datos reales existentes
- **orders**: 1 pedido (LAVAR 5kg, subtotal 10, costo_total 15, delivery 5, comision 1.5, status PENDIENTE, fecha_retiro 2026-08-20, notas "Prueba")
- **plans**: 1 plan ("Basico", precio 15, kg_limite 7, retiros_mes 1, delivery_incluido true, activo)
- **addresses**: 1 direccion

### Pendiente por hacer (conectado y configurado)
- [x] Conectar Supabase real - las 4 apps YA apuntan al proyecto hen...wg
- [x] Aplicar tablas faltantes (profiles, coupons, order_items, order_events, service_addons, reviews, coupon_redemptions, driver_locations, notifications, incidents, support_tickets, business_accounts) RESPETANDO schema real en espanol
- [x] Corregir recursion RLS (003_fix_rls_recursion.sql) - verificado 200 OK en las 12 tablas con anon key
- [ ] Docker NO instalado + psql NO instalado: para `supabase db push`/`db dump` se necesita Docker Desktop o instalar `pg` (node) y usar password de la DB desde el dashboard
- [ ] Password de la base (dashboard Settings > Database) pendiente para conexion SQL directa via node-pg y para `db push` sin confirmacion
- [ ] Migracion local 001_initial_schema.sql (ingles, customer_id/service_id) NO coincide con schema real (espanol, user_id/servicio) - adaptar antes de usar
- Probar app cliente en dispositivo via Expo Go
- Testear RLS y Edge Functions
- Mejorar UI con el script ui-ux-pro-max (buscar glassmorphism, paletas SaaS, tipografia elegante)
- Responsive final para mobile nativo
- Implementar pagos Stripe reales
- Firebase/Expo Notifications para push
- Google Maps/Mapbox para tracking de repartidores

### Reglas anti-bucle (para el agente, 20 ago 2026)
- Trabajar de a UN solo paso: 1 herramienta por turno y esperar el resultado.
- Máximo 2 reintentos por error técnico corregible (sintaxis/tipos). Si falla 2 veces: preguntar al usuario o documentar como pendiente, NO insistir.
- Nunca escribir párrafos de "analisis" o texto repetitivo sin usar herramienta. Cada mensaje = 1 acción (tool) o 1 pregunta concreta.
- Si el entorno no expone una credencial/permiso (ej. password DB): no adivinar; preguntar con opciones via ask_followup_question y seguir solo cuando responda.
- Verificar siempre el resultado real del comando antes de continuar (no asumir exito).

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

## Deploy (Vercel + Supabase)

### Configuracion creada (12 ago 2026)
- `.gitignore` raiz (node_modules, .next, .expo, .env*)
- `supabase/config.toml` (project_id placeholder, redirects Vercel)
- `packages/{config,shared,ui}/package.json` (workspace members validos)
- Fix `packages/shared/supabase.ts`: ya no rompe con `../types/database`
- Fix `packages/config/index.ts`: detecta `EXPO_PUBLIC_*` y `NEXT_PUBLIC_*`
- `apps/{admin,laundry}/next.config.js` (transpilePackages, outputFileTracingRoot monorepo)
- `.env.local` placeholder en admin, laundry, mobile, driver
- Build verificado: admin (11 rutas) y laundry (5 rutas) compilan OK
- git init + primer commit en rama `main`

### Targets de deploy
| App | Plataforma | Salida |
|---|---|---|
| `apps/admin` | Vercel (Next.js) | 2 proyectos separados, Root Directory = `apps/admin` |
| `apps/laundry` | Vercel (Next.js) | 2 proyectos separados, Root Directory = `apps/laundry` |
| `apps/mobile` | Expo (EAS Build/Update) | NO va en Vercel. QR link Expo Go |
| `apps/driver` | Expo (EAS Build/Update) | NO va en Vercel. QR link Expo Go |
| `supabase` | Supabase Cloud | db push + functions deploy |

### Pasos manuales restantes (requieren credenciales del usuario)
1. **Supabase**: pegar `project_ref` real en `supabase/config.toml` y credenciales en los 4 `.env.local`
2. **Supabase CLI**: `supabase link --project-ref <id>`, `supabase db push`, aplicar `seed.sql` en SQL Editor
3. **GitHub**: `gh auth login` (o crear remote manual), `git push -u origin main`
4. **Vercel**: importar repo GitHub, 2 proyectos con Root Directory `apps/admin` y `apps/laundry`, agregar env vars `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Edge Functions Stripe**: pendiente hasta tener cuenta Stripe (`create-payment-intent`, `stripe-webhook`)

### Env vars por app
- **Next.js (admin/laundry)**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Expo (mobile/driver)**: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### URLs canonicas (placeholders)
- Admin: `https://lavaya-admin.vercel.app`
- Laundry: `https://lavaya-laundry.vercel.app`
- Supabase auth redirects ya configurados en `supabase/config.toml`
