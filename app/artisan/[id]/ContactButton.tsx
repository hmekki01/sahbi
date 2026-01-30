
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { MessageCircle } from "lucide-react";

export default function ContactButton({ artisanUserId }: { artisanUserId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onClick = async () => {
    setErr(null);
    setLoading(true);
    try {
      // 1) Session ?
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // ➜ visiteur non connecté : on va sur le login visiteurs
        const back = encodeURIComponent(pathname || "/");
        router.push(`/visitor/login?redirect=${back}`);
        return;
      }

      // 2) Appel RPC pour ouvrir/créer la conversation
      console.debug("[ContactButton] start_conversation with artisanUserId =", artisanUserId);
      const { data: convId, error: rpcErr } = await supabase.rpc("start_conversation", {
        artisan_user_id: artisanUserId,
      });

      if (rpcErr) {
        console.error("[ContactButton] RPC error:", rpcErr);
        setErr(rpcErr.message || "Impossible d'ouvrir la conversation");
        return;
      }

      if (!convId) {
        console.error("[ContactButton] RPC returned no convId");
        setErr("Réponse invalide (aucun ID de conversation)");
        return;
      }

      // 3) Navigation vers la messagerie
      console.debug("[ContactButton] navigate to /messages/", convId);
      router.push(`/messages/${convId}`);
    } catch (e: any) {
      console.error("[ContactButton] click error:", e);
      setErr(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-auto">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-50"
        aria-label="Contacter l’artisan via la messagerie interne"
      >
        <MessageCircle size={22} />
        {loading ? "Ouverture…" : "Contacter l’artisan"}
      </button>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
    </div>
  );
}
