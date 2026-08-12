'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count: ordersToday } = await supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today);
      const { data: ordersData } = await supabase.from('orders').select('total').gte('created_at', today);
      const { count: pending } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: inProcess } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['washing', 'drying', 'ironing']);
      const { count: ready } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'ready');
      const { count: customers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer');
      const { count: subscriptions } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');

      const revenue = ordersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      setStats({ ordersToday, revenue, pending, inProcess, ready, customers, subscriptions });
    })();
  }, []);

  const cards = [
    { label: 'Pedidos hoy', value: stats.ordersToday || 0 },
    { label: 'Ingresos hoy', value: `$${(stats.revenue || 0).toFixed(2)}` },
    { label: 'Pendientes', value: stats.pending || 0 },
    { label: 'En proceso', value: stats.inProcess || 0 },
    { label: 'Listos', value: stats.ready || 0 },
    { label: 'Clientes', value: stats.customers || 0 },
    { label: 'Suscripciones', value: stats.subscriptions || 0 },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #E4ECF5' }}>
            <p style={{ fontSize: 14, color: '#718096' }}>{card.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#17365D', marginTop: 4 }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #E4ECF5' }}>
          <h3 style={{ marginBottom: 12 }}>Ultimos pedidos</h3>
          <RecentOrders />
        </div>
        <div style={{ background: '#FFF', borderRadius: 14, padding: 20, border: '1px solid #E4ECF5' }}>
          <h3 style={{ marginBottom: 12 }}>Servicios mas populares</h3>
          <PopularServices />
        </div>
      </div>
    </div>
  );
}

function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('orders').select('*, customer:customer_id(full_name), service:service_id(name)').order('created_at', { ascending: false }).limit(5).then(({ data }) => setOrders(data || []));
  }, []);
  return (
    <div>
      {orders.map((o) => (
        <div key={o.id} style={{ padding: '8px 0', borderBottom: '1px solid #F7FAFC', fontSize: 14 }}>
          <span style={{ fontWeight: 500 }}>#{o.order_number || o.id.slice(0, 6)}</span> — {o.customer?.full_name} — {o.service?.name} — ${o.total?.toFixed(2)}
        </div>
      ))}
    </div>
  );
}

function PopularServices() {
  const [services, setServices] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('services').select('*').eq('active', true).then(({ data }) => setServices(data || []));
  }, []);
  return (
    <div>
      {services.map((s) => (
        <div key={s.id} style={{ padding: '8px 0', borderBottom: '1px solid #F7FAFC', display: 'flex', justifyContent: 'space-between' }}>
          <span>{s.icon} {s.name}</span>
          <span style={{ fontWeight: 600, color: '#146BDB' }}>${s.base_price}/{s.unit}</span>
        </div>
      ))}
    </div>
  );
}
