'use client';

import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Pedidos', path: '/orders', icon: '📦' },
  { label: 'Clientes', path: '/customers', icon: '👥' },
  { label: 'Repartidores', path: '/drivers', icon: '🚚' },
  { label: 'Servicios', path: '/services', icon: '🧺' },
  { label: 'Planes', path: '/plans', icon: '✨' },
  { label: 'Cupones', path: '/coupons', icon: '🎟️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/'); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data?.role !== 'admin') { router.push('/'); return; }
      setProfile(data);
    })();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, background: '#17365D', color: '#FFF', padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>🧺 LavaYa Admin</h2>
          <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{profile?.full_name}</p>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <a key={item.path} href={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', fontSize: 15,
              background: pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: pathname === item.path ? '#FFF' : 'rgba(255,255,255,0.7)',
              fontWeight: pathname === item.path ? 600 : 400,
            }}>
              <span>{item.icon}</span> {item.label}
            </a>
          ))}
        </nav>
        <button onClick={handleLogout} style={{ margin: 20, padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#FFF', cursor: 'pointer' }}>
          Cerrar sesion
        </button>
      </aside>
      <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
