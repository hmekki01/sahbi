"use client";


    
import { createClient } from '@supabase/supabase-js'

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)  // Initialize Supabase client

// ... Dans une fonction asynchrone (par ex. useEffect ou getServerSideProps selon votre contexte) :

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, Database, RefreshCw } from 'lucide-react';
// Importation du composant de la carte
import ArtisanCard from './ArtisanCard'; 

export default function TableArtisans() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);


    async function handleSearch() {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setHasSearched(true);
        
        // Recherche multi-critères via Supabase
        const { data: profils, error } = await supabase
          .from('profiles')
          .select('*')
          .overlaps('Langues', ['Français', 'Arabe'])

        if (error) {
          console.error("Erreur lors de la requête Supabase :", error.message)
        } else {
          console.log("Profils trouvés :", profiles)
        }
      }

    }
  return (
    <div className="p-4 w-full max-w-6xl mx-auto space-y-12">
      {/* BARRE DE RECHERCHE PRINCIPALE */}
      <div className="max-w-2xl mx-auto bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
          <input 
            type="text"
            placeholder="Nom, entreprise ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full p-6 pl-16 bg-transparent text-lg outline-none font-medium"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </div>

      {/* RÉSULTATS DE LA RECHERCHE UTILISANT ARTISANCARD */}
      {hasSearched && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Database size={14} /> {profiles.length} résultat(s) trouvé(s)
            </h2>
          </div>

          {/* GRILLE DE RÉSULTATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>

          {/* CAS OÙ RIEN N'EST TROUVÉ */}
          {profiles.length === 0 && !loading && (
            <div className="bg-white p-20 text-center rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-xl">Désolé, aucun artisan trouvé.</p>
              <p className="text-slate-300">Essayez d'élargir votre recherche (ex: juste le nom de la ville).</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
