
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Camera, Upload, Trash2, Loader2, User, MapPin, Briefcase, Save, Phone, X } from 'lucide-react';
// import { Save, LogOut, ExternalLink, Loader2, User, MapPin, Eye, Settings, CreditCard, Phone, Briefcase, X} from 'lucide-react';

export default function DashboardArtisan() {
  const [profile, setProfile] = useState<any>({
    business_name: '',
    city: '',
    category: '',
    phone: '',
    description: '',
    photos: [],
    languages: [],
    views_count: 0,
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr) {
          console.error('Erreur getUser:', userErr);
          setLoading(false);
          return;
        }
        if (!user) {
          // Pas connecté : à toi de décider (rediriger, afficher un message, etc.)
          setLoading(false);
          return;
        }

        setUserId(user.id);

        // Charger le profil
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur chargement profil:', error);
        } else if (data) {
          setProfile((p: any) => ({ ...p, ...data }));
        }

        // Charger le nombre de vues (si RLS et la table existent)
        const { count: viewsCount, error: viewsErr } = await supabase
          .from('profile_views')
          .select('*', { count: 'exact', head: true })
          .eq('artisan_id', user.id);

        if (viewsErr) {
          console.warn('Erreur lecture profile_views (non bloquant) :', viewsErr);
        } else {
          setProfile((p: any) => ({ ...p, views_count: viewsCount ?? 0 }));
        }
      } catch (e) {
        console.error('Erreur inattendue loadData:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 1. Mise à jour des informations (incluant le téléphone)
  async function updateProfile() {
    if (!userId) {
      alert("Utilisateur non connecté.");
      return;
    }

    setSaving(true);
    try {
      // (Optionnel) rafraîchir le compteur de vues juste avant sauvegarde
      const { count: viewsCount, error: viewsErr } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('artisan_id', userId);

      if (!viewsErr) {
        setProfile((p: any) => ({ ...p, views_count: viewsCount ?? p.views_count ?? 0 }));
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: profile.business_name ?? '',
          city:          profile.city ?? '',
          category:      profile.category ?? '',
          phone_number:         profile.phone_number ?? '',
          description:   profile.description ?? '',
          languages:     profile.languages ?? [],
          photos:        profile.photos ?? [],
          views_count:   viewsCount ?? profile.views_count ?? 0,
        })
        .eq('id', userId);

      if (error) {
        console.error('Erreur update profiles:', error);
        alert("Erreur lors de la mise à jour");
      } else {
        alert("Profil mis à jour avec succès !");
      }
    } catch (e) {
      console.error('Erreur inattendue updateProfile:', e);
      alert("Erreur inattendue lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  }

  // 2. Gestion de l'upload
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!userId || !event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('artisan-portfolio')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('artisan-portfolio')
        .getPublicUrl(fileName);

      const newPhotos = [...(profile.photos || []), publicUrl];

      const { error } = await supabase
        .from('profiles')
        .update({ photos: newPhotos })
        .eq('id', userId);

      if (error) throw error;

      setProfile((p: any) => ({ ...p, photos: newPhotos }));
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message ?? "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  // 3. Supprimer une photo
  async function deletePhoto(urlToDelete: string) {
    if (!userId) return;
    if (!window.confirm("Voulez-vous vraiment supprimer cette photo ?")) return;

    try {
      const newPhotos = (profile.photos || []).filter((url: string) => url !== urlToDelete);
      const { error } = await supabase
        .from('profiles')
        .update({ photos: newPhotos })
        .eq('id', userId);

      if (error) throw error;

      setProfile((p: any) => ({ ...p, photos: newPhotos }));
      // Option : supprimer aussi le fichier du Storage si tu stockes le chemin interne
    } catch (error: any) {
      console.error('Delete photo error:', error);
      alert("Erreur lors de la suppression");
    }
  }

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 italic">Chargement...</div>;

  const handleLanguageChange = (lang: string) => {
    const currentLangs = profile.languages || [];
    const newLangs = currentLangs.includes(lang)
      ? currentLangs.filter((l: string) => l !== lang)
      : [...currentLangs, lang];

    setProfile((p: any) => ({ ...p, languages: newLangs }));
  };

  

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-10 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight text-center md:text-left">Mon Dashboard</h1>
        <button
          onClick={updateProfile}
          disabled={saving}
          className="hidden md:flex bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold items-center gap-2 hover:bg-slate-800 transition-all"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Enregistrer
        </button>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="text-blue-600" size={22} /> Infos Générales
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase ml-2 italic">Nom de l'entreprise</label>
              <input
                type="text"
                value={profile.business_name || ''}
                onChange={(e) => setProfile((p: any) => ({ ...p, business_name: e.target.value }))}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none mt-1 font-medium border border-transparent focus:border-blue-200 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase ml-2 italic">Téléphone / WhatsApp</label>
              <div className="relative mt-1">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  placeholder="Ex: 06 12 34 56 78"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile((p: any) => ({ ...p, phone: e.target.value }))}
                  className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none font-medium border border-transparent focus:border-blue-200 transition-all"
                />
              </div>
            </div>

            <div className="space-y-3 py-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2 italic">Langues parlées</label>
              <div className="flex gap-6 ml-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={profile.languages?.includes('Français')}
                    onChange={() => handleLanguageChange('Français')}
                  />
                  <div className="w-6 h-6 border-2 border-slate-200 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Français</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={profile.languages?.includes('Arabe')}
                    onChange={() => handleLanguageChange('Arabe')}
                  />
                  <div className="w-6 h-6 border-2 border-slate-200 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Arabe</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-2 italic">Métier</label>
                <input
                  type="text"
                  value={profile.category || ''}
                  onChange={(e) => setProfile((p: any) => ({ ...p, category: e.target.value }))}
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none mt-1 font-medium border border-transparent focus:border-blue-200 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-2 italic">Ville</label>
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => setProfile((p: any) => ({ ...p, city: e.target.value }))}
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none mt-1 font-medium border border-transparent focus:border-blue-200 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Camera className="text-blue-600" size={22} /> Présentation
          </h2>
          <textarea
            rows={7}
            value={profile.description || ''}
            onChange={(e) => setProfile((p: any) => ({ ...p, description: e.target.value }))}
            placeholder="Décrivez vos services..."
            className="w-full p-4 bg-slate-50 rounded-3xl outline-none font-medium resize-none"
          />
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Camera className="text-blue-600" size={24} /> Galerie photos
          </h2>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-2">
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />} Ajouter
            <input type="file" accept="image/*" onChange={handleUpload} hidden disabled={uploading} />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {profile.photos?.map((url: string, index: number) => (
            <div key={index} className="group relative aspect-square rounded-[2.5rem] overflow-hidden border border-slate-50">
              <img src={url} alt="Travaux" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <button
                onClick={() => deletePhoto(url)}
                className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <button onClick={updateProfile} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
