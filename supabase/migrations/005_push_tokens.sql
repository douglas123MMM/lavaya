-- 005_push_tokens.sql
-- Agrega columna push_token a profiles para notificaciones push via Expo
alter table public.profiles
  add column if not exists push_token text;

comment on column public.profiles.push_token is 'Expo push token del dispositivo del cliente (para notificaciones push)';