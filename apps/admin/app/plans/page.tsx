'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', max_weight_kg: '', pickups_per_month: '4', includes_wash: true, includes_iron: false, delivery_type: 'standard', discount_percent: '0', is_popular: false, is_enterprise: false });

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => { const { data } = await supabase.from('plans').select('*').order('price'); setPlans(data || []); };

  const handleSave = async () => {
    await supabase.from('plans').insert({
      name: form.name, description: form.description, price: parseFloat(form.price),
      max_weight_kg: parseFloat(form.max_weight_kg), pickups_per_month: parseInt(form.pickups_per_month),
      includes_wash: form.includes_wash, includes_iron: form.includes_iron,
      delivery_type: form.delivery_type, discount_percent: parseFloat(form.discount_percent),
      is_popular: form.is_popular, is_enterprise: form.is_enterprise,
    });
    setShowForm(false);
    setForm({ name: '', description: '', price: '', max_weight_kg: '', pickups_per_month: '4', includes_wash: true, includes_iron: false, delivery_type: 'standard', discount_percent: '0', is_popular: false, is_enterprise: false });
    loadPlans();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Planes</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 20px', background: '#146BDB', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>+ Nuevo plan</button>
      </div>

      {showForm && (
        <div style={{ background: '#FFF', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #E4ECF5' }}>
          <h3 style={{ marginBottom: 12 }}>Nuevo plan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input style={inputStyle} placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Precio ($/mes)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input style={inputStyle} placeholder="Peso max (kg)" type="number" value={form.max_weight_kg} onChange={(e) => setForm({ ...form, max_weight_kg: e.target.value })} />
            <input style={inputStyle} placeholder="Recogidas/mes" type="number" value={form.pickups_per_month} onChange={(e) => setForm({ ...form, pickups_per_month: e.target.value })} />
            <input style={inputStyle} placeholder="Descuento (%)" type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} />
            <select style={inputStyle} value={form.delivery_type} onChange={(e) => setForm({ ...form, delivery_type: e.target.value })}>
              <option value="standard">Estandar</option>
              <option value="priority">Prioritario</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={form.includes_wash} onChange={(e) => setForm({ ...form, includes_wash: e.target.checked })} /> Incluye lavado</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={form.includes_iron} onChange={(e) => setForm({ ...form, includes_iron: e.target.checked })} /> Incluye planchado</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} /> Mas popular</label>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={handleSave} style={{ padding: '8px 20px', background: '#146BDB', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Guardar</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 20px', background: '#E4ECF5', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {plans.map((p) => (
          <div key={p.id} style={{ background: '#FFF', borderRadius: 12, padding: 16, border: p.is_popular ? '2px solid #146BDB' : '1px solid #E4ECF5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>{p.name} {p.is_popular && <span style={{ fontSize: 11, background: '#146BDB', color: '#FFF', padding: '2px 8px', borderRadius: 6, marginLeft: 8 }}>POPULAR</span>}</span>
              <span style={{ fontWeight: 700, color: '#146BDB' }}>${p.price}/mes</span>
            </div>
            <p style={{ color: '#718096', fontSize: 14, marginTop: 4 }}>{p.description}</p>
            <p style={{ fontSize: 13, color: '#4A5568' }}>{p.max_weight_kg}kg | {p.pickups_per_month} recogidas | {p.delivery_type} | {p.discount_percent}% desc</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { padding: '10px 14px', border: '1px solid #E4ECF5', borderRadius: 8, fontSize: 15, outline: 'none' };
