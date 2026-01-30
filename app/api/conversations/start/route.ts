
// /app/api/conversations/start/route.ts
export const runtime = "nodejs"; // ✅ évite des surprises sur Edge avec les headers
export const dynamic = "force-dynamic"; 

import { NextResponse } from "next/server";
import { createClient as createAdminClient, createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { artisanUserId } = await req.json();
    if (!artisanUserId) {
      return NextResponse.json({ error: "artisanUserId requis" }, { status: 400 });
    }

    // 1) Header Authorization -> Bearer <token>
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    if (!token) {
      return NextResponse.json({ error: "Non authentifié (token manquant)" }, { status: 401 });
    }

    // 2) Client user-scoped
    const userScoped = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // 3) getUser
    const { data: { user }, error: userErr } = await userScoped.auth.getUser();
    if (userErr) {
      return NextResponse.json({ error: `Non authentifié (getUser error): ${userErr.message}` }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: "Non authentifié (user null)" }, { status: 401 });
    }

    if (user.id === artisanUserId) {
      return NextResponse.json({ error: "Action non valide (auto-contact)" }, { status: 400 });
    }

    // 4) Chercher conversation existante
    const { data: rows, error: qErr } = await userScoped
      .from("conversation_participants")
      .select("conversation_id, user_id")
      .in("user_id", [user.id, artisanUserId]);

    if (qErr) {
      return NextResponse.json({ error: `Erreur de vérification: ${qErr.message}` }, { status: 500 });
    }

    let conversationId: string | undefined;
    if (rows?.length) {
      const byConv = rows.reduce<Record<string, Set<string>>>((acc, r) => {
        if (!acc[r.conversation_id]) acc[r.conversation_id] = new Set();
        acc[r.conversation_id].add(r.user_id);
        return acc;
      }, {});
      conversationId = Object.entries(byConv).find(([, users]) =>
        users.has(user.id) && users.has(artisanUserId)
      )?.[0];
    }

    // 5) Créer si besoin (service role)
    if (!conversationId) {
      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ serveur uniquement
      );

      const { data: conv, error: convErr } = await admin
        .from("conversations")
        .insert({})
        .select("id")
        .single();

      if (convErr || !conv) {
        return NextResponse.json({ error: `Création conversation impossible: ${convErr?.message}` }, { status: 500 });
      }

      conversationId = conv.id;

      const { error: partErr } = await admin.from("conversation_participants").insert([
        { conversation_id: conversationId, user_id: user.id, role: "client" },
        { conversation_id: conversationId, user_id: artisanUserId, role: "artisan" },
      ]);

      if (partErr) {
        return NextResponse.json({ error: `Participants non ajoutés: ${partErr.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ conversationId }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: `Erreur serveur: ${e?.message || e}` }, { status: 500 });
  }
}
