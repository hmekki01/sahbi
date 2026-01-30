
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ChatClient from "./ChatClient";

type Participant = { user_id: string; role: "artisan" | "client" | null };

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // 1) Vérifier la session côté client
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Pas connecté : renvoie vers le login visiteurs avec retour direct vers la conversation
        router.replace(`/visitor/login?redirect=${encodeURIComponent(`/messages/${conversationId}`)}`);
        return;
      }
      const uid = session.user.id;

      // 2) Vérifier l'accès : l'utilisateur doit être participant de la conversation
      const { data: isParticipant, error: pErr } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("conversation_id", conversationId)
        .eq("user_id", uid)
        .maybeSingle();

      if (pErr || !isParticipant) {
        // Non autorisé : retourne à l'accueil (ou affiche un 404 si tu préfères)
        router.replace("/");
        return;
      }

      // 3) Charger la liste des participants (utile pour le typing, etc.)
      const { data: parts } = await supabase
        .from("conversation_participants")
        .select("user_id, role")
        .eq("conversation_id", conversationId);

      if (!mounted) return;
      setParticipants((parts || []) as Participant[]);
      setCurrentUserId(uid);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [conversationId, router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Chargement…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl h-[calc(100vh-120px)] flex flex-col">
      <ChatClient
        conversationId={conversationId}
        currentUserId={currentUserId!}
        participants={participants}
      />
    </div>
  );
}
