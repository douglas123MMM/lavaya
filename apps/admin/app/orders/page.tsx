'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    let query = supabase.from('orders').select('*, customer:customer_id(full_name, email), service:service_id(name), driver:driver_id(full_name)').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setOrders(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    loadOrders();
  };

  const statuses = ['all', 'pending', 'pickup_assigned', 'received_laundry', 'washing', 'drying', 'ironing', 'ready', 'delivered', 'cancelled'];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Pedidos</h1>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid #E4ECF5', background: filter === s ? '#146BDB' : '#FFF',
            color: filter === s ? '#FFF' : '#17365D', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>{s === 'all' ? 'Todos' : s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders.map((order) => (
          <div key={order.id} style={{ background: '#FFF', borderRadius: 12, padding: 16, border: '1px solid #E4ECF5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 600 }}>#{order.order_number || order.id.slice(0, 8)}</span>
              <span style={{ fontSize: 13, background: '#EBF4FF', color: '#146BDB', padding: '2px 8px', borderRadius: 6 }}>{order.status}</span>
            </div>
            <p style={{ fontSize: 14, color: '#4A5568' }}>{order.customer?.full_name} | {order.service?.name} | {order.estimated_weight}kg | ${order.total?.toFixed(2)}</p>
            <p style={{ fontSize: 13, color: '#718096' }}>Repartidor: {order.driver?.full_name || 'Sin asignar'} | Fecha: {order.pickup_date}</p>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {order.status === 'pending' && <button onClick={() => updateStatus(order.id, 'cancelled')} style={{ padding: '4px 12px', background: '#E53E3E', color: '#FFF', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Cancelar</button>}
              {order.status === 'ready' && <button onClick={() => updateStatus(order.id, 'en_route_delivery')} style={{ padding: '4px 12px', background: '#18A56A', color: '#FFF', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Enviar a entrega</button>}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p style={{ color: '#718096', textAlign: 'center' }}>No hay pedidos</p>}
      </div>
    </div>
  );
}
