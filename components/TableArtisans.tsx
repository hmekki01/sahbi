"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, Languages, Check, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import ArtisanCard from './ArtisanCard';

export default function ArtisanSearch() {
  const [query, setQuery] = useState('');
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [allArtisans, setAllArtisans] = useState<any[]>([]);
  const [filteredArtisans, setFilteredArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Chargement initial des données
  useEffect(() => {
    async function fetchArtisans() {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error("Erreur de récupération:", error.message);
      } else {
        setAllArtisans(data || []);
        setFilteredArtisans(data || []);
      }
      setLoading(false);
    }
    fetchArtisans();
  }, []);

  const toggleLanguage = (lang: string) => {
    setSelectedLangs(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  // 2. Logique de filtrage au clic sur le bouton
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const results = allArtisans.filter((artisan: any) => {
      // Nettoyage de la saisie
      const q = query.toLowerCase().trim();
      const name = (artisan.business_name || "").toLowerCase();
      const city = (artisan.city || "").toLowerCase();
      const cat = (artisan.category || "").toLowerCase();
      
      // Gestion des langues (Supporte tableau [] ou format Postgres {})
      let artisanLangs = artisan.languages || [];
      if (typeof artisanLangs === 'string') {
        artisanLangs = artisanLangs.replace(/{|}/g, '').split(',');
      }

      // Match Texte : Nom, Ville ou Métier
      const matchText = q === "" || name.includes(q) || city.includes(q) || cat.includes(q);
      
      // Match Langues : L'artisan parle AU MOINS UNE des langues cochées
      const matchLang = selectedLangs.length === 0 || 
                         selectedLangs.some(l => artisanLangs.includes(l));

      return matchText && matchLang;
    });

    setFilteredArtisans(results);
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedLangs([]);
    setFilteredArtisans(allArtisans);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold">Recherche des artisans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto px-4">
      
      {/* SECTION FORMULAIRE COMPACTE */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-6 md:p-8 relative">
        <form onSubmit={handleSearch} className="space-y-6">
          
          {/* Ligne des langues (Checkboxes stylisées) */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Languages size={14} className="text-blue-500" /> Langues parlées :
            </span>
            <div className="flex gap-2">
              {['Français', 'Arabe'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`flex items-center gap-3 px-5 py-2 rounded-full border-2 transition-all font-bold text-sm ${
                    selectedLangs.includes(lang)
                      ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                      : "border-slate-50 bg-slate-50 text-slate-500 hover:border-blue-200 hover:bg-white"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${selectedLangs.includes(lang) ? "bg-white animate-pulse" : "bg-slate-300"}`} />
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Champ de recherche principal */}
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={22} />
            <input
              type="text"
              placeholder="Métier, ville ou nom d'entreprise..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none font-semibold text-slate-700 placeholder:text-slate-300 transition-all text-lg shadow-inner"
            />
          </div>

          {/* Bouton de validation centré */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              type="submit"
              className="relative group overflow-hidden bg-slate-900 text-white px-12 py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-slate-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                Trouver un artisan <Sparkles size={20} className="text-yellow-400" />
              </span>
            </button>

            {(query || selectedLangs.length > 0) && (
              <button 
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors underline decoration-dotted"
              >
                <RotateCcw size={12} /> Réinitialiser les filtres
              </button>
            )}
          </div>
        </form>
      </div>

      {/* GRILLE DES RÉSULTATS */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-800 px-2">
          {filteredArtisans.length} résultat(s) correspondant(s)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtisans.length > 0 ? (
            filteredArtisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))
          ) : (
            <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
              <p className="text-slate-400 font-bold italic">Aucun artisan ne parle ces langues ou n'est dans cette ville.</p>
              <button onClick={resetFilters} className="mt-4 text-blue-600 font-black hover:underline">Voir tous les artisans</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}