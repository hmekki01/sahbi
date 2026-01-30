
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSend = async () => {
    setErr(null);
    if (!email) {
      setErr("Entrez un email valide.");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/visitor/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}`,
      },
    });
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2">Vérifie ta boîte mail</h1>
          <p>Nous t’avons envoyé un lien de connexion à :</p>
          <p className="font-semibold mt-1">{email}</p>
          <p className="text-sm text-gray-500 mt-4">Pense à vérifier tes indésirables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button
          onClick={onSend}
          className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700"
        >
          Envoyer un lien magique
        </button>

        {/* (Optionnel) Déjà connecté ? Bouton continuer */}
        <button
          onClick={async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) router.replace(redirect);
          }}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700"
        >
          J’ai déjà cliqué sur le lien
        </button>
      </div>
    </div>
  );
}
