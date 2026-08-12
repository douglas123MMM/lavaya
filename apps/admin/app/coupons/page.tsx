'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', minimum_order: '0', maximum_discount: '', usage_limit: '100' });

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => { const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false }); setCoupons(data || []); };

  const handleSave = async () => {
    if (!form.code || !form.discount_value) return;
    await supabase.from('coupons').insert({
      code: form.code.toUpperCase(), discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value), minimum_order: parseFloat(form.minimum_order),
      maximum_discount: form.maximum_discount ? parseFloat(form.maximum_discount) : null,
      usage_limit: parseInt(form.usage_limit),
    });
    setShowForm(false);
    setForm({ code: '', discount_type: 'percentage', discount_value: '', minimum_order: '0', maximum_discount: '', usage_limit: '100' });
    loadCoupons();
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from('coupons').update({ active: !active }).eq('id', id);
    loadCoupons();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Cupones</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 20px', background: '#146BDB', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>+ Nuevo cupon</button>
      </div>

      {showForm && (
        <div style={{ background: '#FFF', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #E4ECF5' }}>
          <h3 style={{ marginBottom: 12 }}>Nuevo cupon</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input style={inputStyle} placeholder="Codigo (ej: WELCOME10)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            <select style={inputStyle} value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
              <option value="percentage">Porcentaje</option>
              <option value="fixed">Monto fijo</option>
            </select>
            <input style={inputStyle} placeholder="Valor" type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} />
            <input style={inputStyle} placeholder="Pedido minimo" type="number" value={form.minimum_order} onChange={(e) => setForm({ ...form, minimum_order: e.target.value })} />
            <input style={inputStyle} placeholder="Descuento maximo (opcional)" type="number" value={form.maximum_discount} onChange={(e) => setForm({ ...form, maximum_discount: e.target.value })} />
            <input style={inputStyle} placeholder="Limite de usos" type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={handleSave} style={{ padding: '8px 20px', background: '#146BDB', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Guardar</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 20px', background: '#E4ECF5', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {coupons.map((c) => (
          <div key={c.id} style={{ background: '#FFF', borderRadius: 12, padding: 16, border: '1px solid #E4ECF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 16 }}>{c.code}</span>
              <span style={{ marginLeft: 12, color: '#146BDB', fontWeight: 600 }}>{c.discount_type === 'percentage' ? `${c.discount_value}%` : `$${c.discount_value}`}</span>
              <span style={{ marginLeft: 12, fontSize: 13, color: '#718096' }}>Usado: {c.times_used}/{c.usage_limit}</span>
              {!c.active && <span style={{ marginLeft: 8, color: '#E53E3E', fontSize: 12 }}>(Inactivo)</span>}
            </div>
            <button onClick={() => handleToggle(c.id, c.active)} style={{ padding: '6px 12px', border: '1px solid #E4ECF5', borderRadius: 6, background: '#FFF', cursor: 'pointer', color: c.active ? '#E53E3E' : '#18A56A' }}>
              {c.active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { padding: '10px 14px', border: '1px solid #E4ECF5', borderRadius: 8, fontSize: 15, outline: 'none' };
