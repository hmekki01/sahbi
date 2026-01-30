"use client";

import { motion } from 'framer-motion';
import { Search, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HeroSafe() {
  return (
    <section className="relative bg-[#0f172a] py-20 overflow-hidden">
      {/* Effet de lumière en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center">
          {/* Badge de réassurance local */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
            <MapPin className="w-4 h-4" />
            Réseau d'artisans bilingues dans l'Allier (03)
          </motion.div>

          {/* Titre Principal (Reformulé) */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Trouvez un artisan de confiance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              parlant votre langue </span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Le premier annuaire bilingue **Français / Arabe** dédié aux habitants de Vichy, Moulins et Montluçon. Des professionnels vérifiés pour tous vos besoins du quotidien.
          </motion.p>

          {/* Arguments Clés */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-6 text-slate-300 mb-12">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-500 w-5 h-5" />
              <span>Contact direct WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-500 w-5 h-5" />
              <span>Zéro commission</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-500 w-5 h-5" />
              <span>Expertise locale 03</span>
            </div>
          </motion.div>

          {/* Modification le 21-01-26 pour activer le bouton je suis artisan */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#explorer"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-bold text-lg transition">
            🔍 Trouver un artisan
            </Link>
            <Link href="/inscription"
            className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-bold text-lg transition">
            🧑‍🔧 Je suis artisan
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
