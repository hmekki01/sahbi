"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Accès refusé : " + error.message);
      setLoading(false);
      return;
    }

    // PETITE PAUSE pour laisser le temps au cookie de s'installer
    await new Promise(resolve => setTimeout(resolve, 500));

    // Vérification si l'utilisateur est admin
    const { data: admin, error: adminError } = await supabase
        .from('site_admins')
        .select('*')
        .eq('id', data.user.id)
        .single();

        if (admin) {
        // On utilise window.location pour forcer un rafraîchissement complet
        // C'est radical pour corriger les problèmes de cookies
        window.location.assign('/admin/dashboard');
        } else {
        await supabase.auth.signOut();
        alert("Accès admin refusé.");
        setLoading(false);
        }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <form onSubmit={handleAdminLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
        <ShieldCheck className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-black mb-6">Panel Administration</h1>
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email Admin" required
            className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Mot de passe" required
            className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button disabled={loading} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Accéder au contrôle"}
          </button>
        </div>
      </form>
    </div>
  );
}