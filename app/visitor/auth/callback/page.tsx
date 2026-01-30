
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function VisitorAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Supabase v2: les liens modernes contiennent ?code=...
        const code = params.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setError(error.message);
            return;
          }
        } else {
          // Compat liens plus anciens (?access_token / token_hash)
          await supabase.auth.getSession();
        }

        router.replace(redirect);
      } catch (e: any) {
        setError(e?.message || "Erreur de callback");
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
          <h1 className="text-xl font-bold mb-2">Connexion impossible</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      Connexion en cours…
    </div>
  );
}
