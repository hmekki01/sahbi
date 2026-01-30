"use client";

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, LayoutDashboard, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function SuccessPage() {

// On peut ajouter ici un petit script pour déclencher des confettis si désiré

return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
<motion.div
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center"
>
{/* Icône de Succès avec Animation */}
<motion.div
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
>
<CheckCircle className="w-10 h-10" />
</motion.div>

<h1 className="text-3xl font-extrabold text-gray-900 mb-4">
Paiement réussi !
</h1>

<p className="text-gray-600 mb-8 leading-relaxed">
Merci pour votre confiance. Votre abonnement est désormais actif. Votre profil est en cours de mise en ligne sur la plateforme des artisans de l'Allier.
</p>

<div className="space-y-4">
<Link
href="/dashboard"
className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
>
<LayoutDashboard className="w-5 h-5" /> Accéder à mon Dashboard
</Link>

<Link
href="/"
className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition"
>
Voir le site public <ArrowRight className="w-4 h-4" />
</Link>
</div>

<div className="mt-10 pt-8 border-t border-gray-100">
<div className="flex items-center justify-center gap-2 text-sm text-gray-400">
<PartyPopper className="w-4 h-4" />
<span>Bienvenue parmi nos artisans vérifiés</span>
</div>
</div>
</motion.div>
</div>
);
}