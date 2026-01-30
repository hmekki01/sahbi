
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
  const [profile, setProfile] = useState<any>(null);

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
           
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                <AlertCircle className="w-4 h-4" /> Non vérifié
              </span>
           
          </div>

        </div>

       
      </div>
    </main>
  );
}
