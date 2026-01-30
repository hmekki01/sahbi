
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Save, Upload, Trash2, Loader2, User, Phone, X } from "lucide-react";

type Profile = {
  id: string;
  full_name: string;
  business_name: string | null;
  description: string | null;
  city: string | null;
  category: string | null;
  whatsapp_number: string | null;
  avatar_url: string | null;
  languages: string[] | null;
  photos: string[] | null; // URLs publiques
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, business_name, description, city, category, whatsapp_number, avatar_url, languages, photos")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erreur chargement profil:", error);
      }
      setProfile((data as Profile) ?? null);
      setLoading(false);
    })();
  }, [router]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !userId) return;

    setSaving(true);
    const payload = {
      full_name: profile.full_name?.trim() ?? "",
      business_name: profile.business_name ?? null,
      description: profile.description ?? null,
      city: profile.city ?? null,
      category: profile.category ?? null,
      whatsapp_number: profile.whatsapp_number ?? null,
      avatar_url: profile.avatar_url ?? null,
      languages: profile.languages ?? ["Français"],
      photos: profile.photos ?? [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId);

    setSaving(false);
    if (error) {
      alert("Erreur sauvegarde : " + error.message);
    } else {
      alert("Profil mis à jour !");
      router.push("/dashboard");
    }
  }

  async function onUpload(file: File) {
    if (!userId) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase
        .storage
        .from("artisan-portfolio")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from("artisan-portfolio").getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const next = [...(profile?.photos ?? []), publicUrl];
      setProfile(p => p ? ({ ...p, photos: next }) : p);

      const { error } = await supabase
        .from("profiles")
        .update({ photos: next })
        .eq("id", userId);

      if (error) throw error;
    } catch (e: any) {
      console.error("Upload error:", e);
      alert(e.message ?? "Erreur d'upload");
    } finally {
      setUploading(false);
    }
  }

  async function onDeletePhoto(urlToDelete: string) {
    if (!userId || !profile) return;
    if (!confirm("Supprimer cette photo ?")) return;

    // Suppression côté base (tu peux aussi supprimer le fichier du Storage si tu stockes le path interne)
    const next = (profile.photos ?? []).filter(u => u !== urlToDelete);
    setProfile({ ...profile, photos: next });
    const { error } = await supabase
      .from("profiles")
      .update({ photos: next })
      .eq("id", userId);
    if (error) {
      alert("Erreur suppression : " + error.message);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="font-bold text-slate-500">Chargement de l’éditeur…</div>
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

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Modifier mon profil</h1>

        <form onSubmit={onSave} className="grid md:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Nom complet</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border"
                value={profile.full_name ?? ""}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Nom de l’entreprise</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border"
                value={profile.business_name ?? ""}
                onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Ville</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border"
                value={profile.city ?? ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Métier / Catégorie</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border"
                value={profile.category ?? ""}
                onChange={(e) => setProfile({ ...profile, category: e.target.value })}
              />
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  className="w-full mt-1 px-3 py-2 pl-9 rounded-lg border"
                  placeholder="+33…"
                  value={profile.whatsapp_number ?? ""}
                  onChange={(e) => setProfile({ ...profile, whatsapp_number: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Avatar URL</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border"
                placeholder="https://…"
                value={profile.avatar_url ?? ""}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Langues (séparées par des virgules)</label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-lg border"
                placeholder="Français, Anglais"
                value={(profile.languages ?? []).join(", ")}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              className="w-full mt-1 px-3 py-2 rounded-lg border min-h-[120px]"
              value={profile.description ?? ""}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            />
          </div>

          {/* Photos chantier */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold block mb-2">Photos de chantier</label>
            <div className="flex items-center gap-3 mb-4">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer">
                <Upload className="w-4 h-4" />
                Ajouter une photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpload(f);
                  }}
                  disabled={uploading}
                />
              </label>
              {uploading && <span className="text-sm text-slate-500">Téléversement en cours…</span>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(profile.photos ?? []).map((url, idx) => (
                <div key={idx} className="relative group border rounded-xl overflow-hidden">
                  {/* <Image> impose de configurer next.config.js (images.domains). 
                      Pour éviter des erreurs, on reste sur <img>. */}
                  <img src={url} alt="photo chantier" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => onDeletePhoto(url)}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/90 hover:bg-white text-red-600 shadow transition opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(profile.photos ?? []).length === 0 && (
                <div className="col-span-2 md:col-span-4 text-slate-500 text-sm">
                  Aucune photo pour l’instant.
                </div>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white border font-bold hover:bg-gray-50 transition"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
