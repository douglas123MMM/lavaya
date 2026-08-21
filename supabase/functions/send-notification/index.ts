import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const authHeader = req.headers.get('authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '');

    // ===== Autorizacion =====
    // 1) Llamada con service_role (desde dashboard, triggers o edge functions
    //    internas): se permite directamente (confianza total).
    if (jwt && jwt === SERVICE_ROLE) {
      return await handleSend(req);
    }

    // 2) Llamada con JWT de un usuario autenticado: debe ser admin/staff.
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: corsHeaders(),
      });
    }

    const { data: callerProfile, error: profileErr } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single();
    if (profileErr || !callerProfile) {
      return new Response(JSON.stringify({ error: 'Perfil no encontrado' }), {
        status: 403,
        headers: corsHeaders(),
      });
    }

    const allowedRoles = ['admin', 'laundry', 'driver'];
    if (!allowedRoles.includes(callerProfile.rol)) {
      return new Response(JSON.stringify({ error: 'Solo staff/admin puede enviar notificaciones' }), {
        status: 403,
        headers: corsHeaders(),
      });
    }

    return await handleSend(req);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
});

// Envía el push una vez validada la autorización.
async function handleSend(req: Request): Promise<Response> {
  const body = await req.json();
  const { order_id, title, body: messageBody } = body;
  if (!order_id || !title || !messageBody) {
    return new Response(JSON.stringify({ error: 'order_id, title y body requeridos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('user_id, ticket')
    .eq('id', order_id)
    .single();
  if (orderError || !order) {
    return new Response(JSON.stringify({ error: 'Pedido no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('push_token')
    .eq('id', order.user_id)
    .single();
  const pushToken = profile?.push_token;
  if (profileError || !pushToken) {
    return new Response(JSON.stringify({ error: 'Cliente sin push token registrado' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  const pushBody = {
    to: pushToken,
    title,
    body: messageBody,
    sound: 'default',
    data: { orderId: order_id, type: 'order_status' },
  };
  const res = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pushBody),
  });
  const pushResult = await res.json();

  return new Response(JSON.stringify({ ok: true, push: pushResult }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}