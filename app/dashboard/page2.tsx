"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Save, LogOut, ExternalLink, Loader2, User, MapPin, Eye, Settings, CreditCard, Phone, Briefcase, X} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    business_name: '',
    city: '',
    whatsapp_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // --- LE MOTEUR QUI CHARGE VOS DONNÉES ---
  useEffect(() => {
    async function loadUserSession() {
      console.log("Vérification de la session...");
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log("Aucun utilisateur connecté, retour au login");
        router.push('/login');
        return;
      }

      setUser(session.user);
      console.log("Utilisateur chargé :", session.user.email);

      // On récupère les infos de l'artisan dans la table profiles
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setProfile(data);
      }
      setLoading(false);
    }

    loadUserSession();
  }, [router]);

  // --- ACTION : SAUVEGARDER ---
  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

    if (error) alert("Erreur : " + error.message);
    else alert("Profil mis à jour !");
  };

  if (loading) return <div className="p-10 text-center font-bold">Chargement...</div>;

  const handleManageSubscription = () => {
        // Pour l'instant, on affiche juste un message
        alert("La gestion des abonnements sera bientôt disponible !");
      };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
       
        {/* HEADER & STATUT */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Salam, {profile?.full_name} 👋</h1>
            <p className="text-gray-500">Gérez votre visibilité dans l'Allier.</p>
          </div>
         
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${isOnline ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {isOnline ? 'Profil en ligne' : 'Profil invisible'}
          </div>
        </header>

        {/* STATS RAPIDES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vues du profil (30j)</p>
                <p className="text-2xl font-bold text-gray-900">142</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Clics WhatsApp</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setIsEditing(true)} className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-md transition group">
            <Settings className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-3" />
            <span className="font-semibold text-gray-700">Modifier Profil</span>
          </button>
         
          <button className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-md transition group">
            <CreditCard className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-3" />
            <span className="font-semibold text-gray-700">Abonnement</span>
          </button>

          <button type="button" onClick={() => window.open(`/artisan/${user?.id}`, '_blank')} className="flex flex-col items-center justify-center p-8 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            <ExternalLink className="w-8 h-8 mb-3" />
            <span className="font-semibold">Voir ma fiche</span>
          </button>

          <button onClick={handleManageSubscription} className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-md transition group">
            <CreditCard className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-3" />
            <span className="font-semibold text-gray-700">Abonnement</span>
            </button>
        </div>
        {/* --- AFFICHAGE DES INFOS (Vue simple) --- */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4">{profile.business_name || "Nom de l'entreprise"}</h2>
        <p className="text-slate-500 flex items-center gap-2"><MapPin size={16}/> {profile.city || "Ville non renseignée"}</p>
      </div>

      {/* --- FORMULAIRE MODAL (S'affiche seulement si isEditing est true) --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsEditing(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black mb-6">Modifier mes informations</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-500 ml-1">Nom de l'entreprise</label>
                <input 
                  type="text"
                  value={profile.business_name || ''}
                  onChange={(e) => setProfile({...profile, business_name: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-500 ml-1">Ville</label>
                <input 
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => setProfile({...profile, city: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-500 ml-1">WhatsApp</label>
                <input 
                  type="text"
                  value={profile.whatsapp_number || ''}
                  onChange={(e) => setProfile({...profile, whatsapp_number: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg mt-4 flex items-center justify-center gap-3 shadow-lg shadow-blue-100">
                <Save size={20} /> Enregistrer les changements
              </button>
            </div>
          </div>
        </div>
        
      )}
    </div>

        {/* MESSAGE D'ALERTE SI INACTIF */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex gap-4 items-start"
          >
            <div className="p-2 bg-amber-200 rounded-lg text-amber-700">⚠️</div>
            <div>
              <p className="font-bold text-amber-900">Votre profil n'est pas encore visible</p>
              <p className="text-amber-800 text-sm mt-1">
                Assurez-vous d'avoir complété votre profil et activé votre abonnement pour apparaître dans les recherches sur Vichy, Moulins et Montluçon.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    
  );
}
import { MessageSquare } from 'lucide-react';

