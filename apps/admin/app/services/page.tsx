'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: '🧺', base_price: '', unit: 'kg' });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    const { data } = await supabase.from('services').select('*').order('base_price');
    setServices(data || []);
  };

  const handleSave = async () => {
    if (!form.name || !form.base_price) return;
    if (editId) {
      await supabase.from('services').update({ name: form.name, description: form.description, icon: form.icon, base_price: parseFloat(form.base_price), unit: form.unit }).eq('id', editId);
    } else {
      await supabase.from('services').insert({ name: form.name, description: form.description, icon: form.icon, base_price: parseFloat(form.base_price), unit: form.unit });
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: '', description: '', icon: '🧺', base_price: '', unit: 'kg' });
    loadServices();
  };

  const handleEdit = (s: any) => {
    setForm({ name: s.name, description: s.description, icon: s.icon, base_price: String(s.base_price), unit: s.unit });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from('services').update({ active: !active }).eq('id', id);
    loadServices();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Servicios</h1>
        <button onClick={() => { setEditId(null); setForm({ name: '', description: '', icon: '🧺', base_price: '', unit: 'kg' }); setShowForm(true); }}
          style={{ padding: '10px 20px', background: '#146BDB', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          + Nuevo servicio
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#FFF', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #E4ECF5' }}>
          <h3 style={{ marginBottom: 12 }}>{editId ? 'Editar' : 'Nuevo'} servicio</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input style={inputStyle} placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Icono (emoji)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            <input style={inputStyle} placeholder="Descripcion" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input style={inputStyle} placeholder="Precio base" type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={handleSave} style={{ padding: '8px 20px', background: '#146BDB', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Guardar</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 20px', background: '#E4ECF5', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {services.map((s) => (
          <div key={s.id} style={{ background: '#FFF', borderRadius: 12, padding: 16, border: '1px solid #E4ECF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 20, marginRight: 8 }}>{s.icon}</span>
              <span style={{ fontWeight: 600 }}>{s.name}</span>
              <span style={{ marginLeft: 12, color: '#146BDB', fontWeight: 600 }}>${s.base_price}/{s.unit}</span>
              {!s.active && <span style={{ marginLeft: 8, color: '#E53E3E', fontSize: 12 }}>(Inactivo)</span>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => handleEdit(s)} style={{ padding: '6px 12px', border: '1px solid #E4ECF5', borderRadius: 6, background: '#FFF', cursor: 'pointer' }}>Editar</button>
              <button onClick={() => handleToggle(s.id, s.active)} style={{ padding: '6px 12px', border: '1px solid #E4ECF5', borderRadius: 6, background: '#FFF', color: s.active ? '#E53E3E' : '#18A56A', cursor: 'pointer' }}>
                {s.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { padding: '10px 14px', border: '1px solid #E4ECF5', borderRadius: 8, fontSize: 15, outline: 'none' };
