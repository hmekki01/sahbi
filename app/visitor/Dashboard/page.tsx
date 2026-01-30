
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  User, ExternalLink, Settings, LayoutDashboard,
  CheckCircle2, AlertCircle, Eye, MessageCircle, MessageSquare
} from "lucide-react";

type site_users = {
  id: string;
  email: string | null;
  name: string | null;
  language: string | null;
  city: string | null;
  role: string | null;  
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/visitor/login");
        return;
      }
      const { data, error } = await supabase
        .from("site_users")
        .select("id, email, name, language, city, role")
        .eq("id", user.id)
        .single();

      if (error) console.error("Erreur chargement visiteur:", error);
      setProfile((data as site_users) ?? null);
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="font-bold text-slate-500">Chargement du tableau de bord…</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="font-bold">Profil introuvable.</div>
      </main>
    );
  }

  // const isVerified = !!profile.is_verified;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* =========================
            HEADER (avec badge statut en haut à droite)
           ========================= */}
        <div className="relative mb-8">
          {/* Badge statut en haut à droite */}
          <div className="absolute right-0 top-0">
            {isVerified ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" /> Profil visible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                <AlertCircle className="w-4 h-4" /> Non vérifié
              </span>
            )}
          </div>

          {/* Titre & sous-titre */}
          <div className="flex items-center gap-4 pr-28">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isVerified ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bonjour, {profile.full_name || "Artisan"}
              </h1>
              <p className="text-gray-500">
                {profile.business_name || "Nom d’entreprise non défini"} • {profile.city || "Ville"} • {profile.category || "Métier"}
              </p>
            </div>
          </div>
        </div>

        {/* STATS RAPIDES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vues du profil (30j)</p>
                <p className="text-2xl font-bold text-gray-900">
                {profile.views_count ?? 0}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                {profile.whatsapp_clicks_count ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            ACTIONS (descendues sous les KPI et centrées)
           ========================= */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Modifier profil */}
            <Link
              href="/dashboard/edit"
              className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-md transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white grid place-items-center group-hover:scale-105 transition">
                <Settings className="w-5 h-5" />
              </div>
              <div className="mt-3 text-sm font-bold text-slate-900">Modifier mon profil</div>
              <div className="text-xs text-slate-400">Photos, infos, langues…</div>
            </Link>

            {/* Voir ma fiche */}
            <Link
              href={`/artisans/${profile.id}`}
              className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 grid place-items-center">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div className="mt-3 text-sm font-bold">Voir ma fiche</div>
              <div className="text-xs text-blue-100">Aperçu public</div>
            </Link>

            {/* Abonnements */}
            <Link
              href="/dashboard/billing"
              className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-md transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white grid place-items-center group-hover:scale-105 transition">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div className="mt-3 text-sm font-bold text-slate-900">Abonnements</div>
              <div className="text-xs text-slate-400">Visibilité, options</div>
            </Link>
          </div>
        </div>

        {/* =========================
            AIDE (inchangé, en bas)
           ========================= */}
        <div className="bg-slate-900 p-6 rounded-3xl text-white">
          <MessageSquare className="w-8 h-8 text-blue-400 mb-4" />
          <h4 className="font-bold mb-2">Besoin d’aide ?</h4>
          <p className="text-slate-400 text-sm mb-4">
            Un problème avec votre profil ou votre abonnement ?
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition"
          >
            Contacter le support
          </Link>
        </div>
      </div>
    </main>
  );
}
