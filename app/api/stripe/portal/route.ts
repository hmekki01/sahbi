import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // ou la version la plus récente
});

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });

  // 1. Vérifier si l'utilisateur est connecté
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new NextResponse('Non autorisé', { status: 401 });

  // 2. Récupérer le stripe_customer_id dans ton profil Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', session.user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return new NextResponse('Aucun compte client Stripe trouvé', { status: 400 });
  }

  try {
    // 3. Créer la session du portail Stripe
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error(error);
    return new NextResponse('Erreur lors de la création du portail', { status: 500 });
  }
}