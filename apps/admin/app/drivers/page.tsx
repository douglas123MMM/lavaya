'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'driver').order('created_at', { ascending: false }).then(({ data }) => setDrivers(data || []));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Repartidores ({drivers.length})</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {drivers.map((d) => (
          <div key={d.id} style={{ background: '#FFF', borderRadius: 12, padding: 16, border: '1px solid #E4ECF5', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 600 }}>{d.full_name}</p>
              <p style={{ fontSize: 14, color: '#718096' }}>{d.email} | {d.phone || 'Sin telefono'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
