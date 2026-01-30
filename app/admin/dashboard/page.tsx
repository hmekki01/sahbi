"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle, XCircle, Clock, User, MapPin, Trash2, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'verified'

  useEffect(() => {
    fetchArtisans();
  }, []);

  async function fetchArtisans() {
  try {
    console.log("Tentative de récupération des artisans...");
    setLoading(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error("Erreur Supabase détaillée :", error);
      alert("Erreur base de données : " + error.message);
    } else {
      console.log("Données reçues :", data);
      setArtisans(data || []);
    }
  } catch (err) {
    console.error("Erreur système inattendue :", err);
  } finally {
    // Ce bloc s'exécute QUOI QU'IL ARRIVE
    console.log("Fin du chargement.");
    setLoading(false); 
  }
}

  // FONCTION POUR VALIDER / ANNULER LA VALIDATION
  async function toggleValidation(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: !currentStatus })
      .eq('id', id);

    if (!error) {
      setArtisans(artisans.map(a => a.id === id ? { ...a, is_verified: !currentStatus } : a));
    }
  }

  // FONCTION POUR SUPPRIMER UN COMPTE (À utiliser avec prudence)
  async function deleteArtisan(id: string) {
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement cet artisan ?")) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) setArtisans(artisans.filter(a => a.id !== id));
    }
  }

  const filteredArtisans = artisans.filter(a => {
    if (filter === 'pending') return !a.is_verified;
    if (filter === 'verified') return a.is_verified;
    return true;
  });

  if (loading) return <div className="p-20 text-center font-bold text-slate-500">Chargement du panel de contrôle...</div>;

  return (
    
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Gestion des Artisans</h1>
            <p className="text-slate-500 mt-2">Validez ou modérez les inscriptions sur Allier Artisans</p>
          </div>

          {/* FILTRES RAPIDES */}
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-bold ${filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Tous</button>
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-xl text-sm font-bold ${filter === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>En attente</button>
            <button onClick={() => setFilter('verified')} className={`px-4 py-2 rounded-xl text-sm font-bold ${filter === 'verified' ? 'bg-green-500 text-white' : 'text-slate-500'}`}>Validés</button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredArtisans.length === 0 && (
            <div className="bg-white p-12 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-medium">
              Aucun artisan trouvé dans cette catégorie.
            </div>
          )}

          {filteredArtisans.map((artisan) => (
            <div key={artisan.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5 w-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${artisan.is_verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  <User size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-xl text-slate-900">{artisan.business_name || "En attente de nom"}</h3>
                    {artisan.is_verified ? (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <CheckCircle size={10} /> Validé
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        <Clock size={10} /> En attente
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 mt-1 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {artisan.city || 'Ville inconnue'}</span>
                    <span>•</span>
                    <span>{artisan.category || 'Métier non défini'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => toggleValidation(artisan.id, artisan.is_verified)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                    artisan.is_verified 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100'
                  }`}
                >
                  {artisan.is_verified ? "Annuler validation" : "Valider l'artisan"}
                </button>
                
                <button 
                  onClick={() => deleteArtisan(artisan.id)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Supprimer définitivement"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}