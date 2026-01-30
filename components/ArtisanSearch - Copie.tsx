"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, Database, RefreshCw, MapPin, User, Building2 } from 'lucide-react';

 


export default function ArtisanSearch({ initialArtisans }: { initialArtisans: Artisan[] }) {

  const [profiles, setProfiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState('');

  async function handleSearch() {
    if (!searchTerm.trim()) {
      alert("Veuillez saisir un nom ou une ville.");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    // On utilise la puissance de Supabase pour filtrer directement en base de données
    // La syntaxe .or() permet de chercher dans plusieurs colonnes à la fois
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`business_name.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);

    if (error) {
      alert("Erreur de recherche : " + error.message);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  }


  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un artisan..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full p-2 border border-gray-200 rounded-md mb-4"
      />

      
        <ul className="space-y-2">
          {profiles.map((p) => (
            <li key={p.id} className="p-4 border rounded-md shadow-sm hover:bg-gray-50">
              <p className="font-semibold">{p.business_name || p.full_name || p.category}</p>
              <p className="text-sm text-gray-600">{p.city || 'Ville inconnue'}</p>
            </li>
          ))}
        </ul>
      
    </div>
  );
}
