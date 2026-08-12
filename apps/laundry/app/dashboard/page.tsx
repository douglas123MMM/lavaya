'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LaundryDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/'); return; }
      const { data } = await supabase.from('orders').select('*, service:service_id(name), customer:customer_id(full_name)').in('status', ['received_laundry', 'washing', 'drying', 'ironing', 'ready', 'picked_up', 'pending']).order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    await supabase.from('order_events').insert({ order_id: id, status, notes });
    const { data } = await supabase.from('orders').select('*, service:service_id(name), customer:customer_id(full_name)').in('status', ['received_laundry', 'washing', 'drying', 'ironing', 'ready', 'picked_up', 'pending']).order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const statusSteps = ['received_laundry', 'washing', 'drying', 'ironing', 'ready'];

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#F7FAFC' }}>
      <header style={{ background: '#FFF', padding: '16px 24px', borderBottom: '1px solid #E4ECF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#17365D' }}>🧺 LavaYa - Lavanderia</h1>
        <button onClick={() => { supabase.auth.signOut(); router.push('/'); }} style={{ padding: '8px 16px', background: '#E53E3E', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Salir</button>
      </header>

      <main style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Pedidos pendientes ({orders.length})</h2>
        {orders.map((order) => (
          <div key={order.id} style={{ background: '#FFF', borderRadius: 14, padding: 20, marginBottom: 12, border: '1px solid #E4ECF5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>Pedido #{order.order_number || order.id.slice(0, 8)}</span>
              <span style={{ background: '#EBF4FF', color: '#146BDB', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>{order.status}</span>
            </div>
            <p style={{ color: '#718096' }}>{order.service?.name} | Cliente: {order.customer?.full_name}</p>
            <p style={{ color: '#718096' }}>Peso est: {order.estimated_weight}kg | Total: ${order.total?.toFixed(2)}</p>
            {order.special_instructions && <p style={{ color: '#D69E2E', marginTop: 4 }}>📝 {order.special_instructions}</p>}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {order.status === 'picked_up' && (
                <button onClick={() => updateStatus(order.id, 'received_laundry', 'Recibida en lavanderia')} style={actionBtn}>Recibida en lavanderia</button>
              )}
              {statusSteps.map((step, i) => {
                const currentIdx = statusSteps.indexOf(order.status);
                if (i <= currentIdx && step !== order.status) return null;
                if (step === order.status && step !== 'ready') {
                  const nextIdx = statusSteps.indexOf(order.status) + 1;
                  const next = statusSteps[nextIdx];
                  if (next) return <button key={step} onClick={() => updateStatus(order.id, next, `${next}`)} style={actionBtn}>{statusLabel(next)}</button>;
                }
                return null;
              })}
              {order.status === 'ready' && <span style={{ color: '#18A56A', fontWeight: 600 }}>Listo para entrega</span>}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p style={{ textAlign: 'center', color: '#718096' }}>No hay pedidos pendientes</p>}
      </main>
    </div>
  );
}

function statusLabel(s: string): string {
  const m: Record<string, string> = { received_laundry: 'Marcar recibida', washing: 'Iniciar lavado', drying: 'Iniciar secado', ironing: 'Iniciar planchado', ready: 'Marcar lista' };
  return m[s] || s;
}

const actionBtn: React.CSSProperties = { padding: '8px 16px', background: '#146BDB', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 };
