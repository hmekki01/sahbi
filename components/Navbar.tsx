"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('getSession error:', error);
      }
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('signOut error:', error);
    }
    setUser(null);
    router.replace('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Artisans<span className="text-blue-600">03</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
              Accueil
            </Link>

            {/* Corrigé : lien vers la section About */}
            <Link href="/#about" className="text-gray-600 hover:text-blue-600 font-medium transition">
              À propos
            </Link>

            {user ? (
              <div className="flex items-center gap-4 border-l pl-8 border-gray-100">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Nouveau : Espace visiteur */}
                <Link
                  href="/visitor/login"
                  className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition shadow-lg shadow-slate-100"
                >
                  Espace visiteur
                </Link>

                {/* Espace Artisan (existant) */}
                <Link
                  href="/login"
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                >
                  Espace Artisan
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Ouvrir/fermer le menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-6 space-y-4">
          <Link href="/" className="block text-gray-600 font-medium">Accueil</Link>

          {/* Corrigé : lien vers la section About */}
          <Link href="/#about" className="block text-gray-600 font-medium">À propos</Link>

          <hr className="border-gray-50" />
          {user ? (
            <>
              <Link href="/dashboard" className="block text-blue-600 font-bold">Mon Dashboard</Link>
              <button onClick={handleLogout} className="block text-red-500 font-medium">Déconnexion</button>
            </>
          ) : (
            <div className="space-y-3">
              {/* Nouveau : Espace visiteur */}
              <Link
                href="/visitor/login"
                className="block w-full py-4 bg-white text-slate-900 text-center rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition"
              >
                Espace visiteur
              </Link>

              {/* Espace Artisan */}
              <Link
                href="/login"
                className="block w-full py-4 bg-slate-900 text-white text-center rounded-2xl font-bold hover:bg-slate-800 transition"
              >
                Espace Artisan
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
