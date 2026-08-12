'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError('Credenciales invalidas'); return; }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('Acceso denegado. Solo administradores.');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, color: '#146BDB' }}>🧺 LavaYa</h1>
          <p style={{ color: '#718096', marginTop: 4 }}>Panel Administrativo</p>
        </div>
        <form onSubmit={handleLogin}>
          <input style={styles.input} type="email" placeholder="admin@lavaya.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p style={{ color: '#E53E3E', fontSize: 14, marginTop: 8 }}>{error}</p>}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7FAFC' },
  card: { background: '#FFF', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  input: { width: '100%', padding: '12px 14px', marginTop: 12, border: '1px solid #E4ECF5', borderRadius: 10, fontSize: 16, outline: 'none' },
  button: { width: '100%', marginTop: 20, padding: '14px', background: '#146BDB', color: '#FFF', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
};
