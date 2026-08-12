'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false }).then(({ data }) => setCustomers(data || []));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Clientes ({customers.length})</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {customers.map((c) => (
          <div key={c.id} style={{ background: '#FFF', borderRadius: 12, padding: 16, border: '1px solid #E4ECF5', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 600 }}>{c.full_name}</p>
              <p style={{ fontSize: 14, color: '#718096' }}>{c.email} | {c.phone || 'Sin telefono'}</p>
            </div>
            <span style={{ fontSize: 12, color: '#A0AEC0' }}>{new Date(c.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
