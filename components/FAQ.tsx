"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
{
question: "Comment garantissez-vous la qualité des artisans ?",
answer: "Chaque professionnel doit fournir ses informations professionnelles lors de l'inscription. Nous vérifions manuellement la cohérence de leur profil et leur présence locale dans l'Allier avant toute validation."
},
{
question: "Le service est-il gratuit pour les particuliers ?",
answer: "Oui, l'accès à l'annuaire et la mise en relation sont 100% gratuits pour les particuliers. Nous ne prenons aucune commission sur vos travaux."
},
{
question: "Pourquoi un annuaire bilingue (Français/Arabe) ?",
answer: "La clarté des échanges est primordiale pour éviter les malentendus sur un chantier. Notre plateforme permet aux habitants de l'Allier de trouver des experts qui maîtrisent parfaitement les deux langues pour une communication fluide."
},
{
question: "Comment contacter un artisan ?",
answer: "C'est très simple : une fois que vous avez trouvé l'artisan qui vous convient, vous pouvez l'appeler directement ou lui envoyer un message WhatsApp via les boutons dédiés sur sa fiche."
}
];

export default function FAQ() {
const [activeIndex, setActiveIndex] = useState<number | null>(null);

return (
<section className="py-24 bg-white">
<div className="max-w-3xl mx-auto px-6">
<div className="text-center mb-16">
<div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4">
<HelpCircle className="w-6 h-6" />
</div>
<h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
Questions fréquentes
</h2>
<p className="text-slate-500 mt-4 text-lg">
Tout ce qu'il faut savoir sur votre réseau local d'artisans dans le 03.
</p>
</div>

<div className="space-y-4">
{faqs.map((faq, index) => (
<div
key={index}
className="group border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5"
>
<button
onClick={() => setActiveIndex(activeIndex === index ? null : index)}
className="w-full flex items-center justify-between p-6 text-left transition-colors bg-white"
>
<span className="font-bold text-slate-800 text-lg pr-4">{faq.question}</span>
<div className={`p-2 rounded-xl transition-all ${activeIndex === index ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
<ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} />
</div>
</button>

<AnimatePresence>
{activeIndex === index && (
<motion.div
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.3, ease: "easeInOut" }}
>
<div className="p-6 pt-0 text-slate-600 leading-relaxed text-base border-t border-slate-50 bg-slate-50/30">
{faq.answer}
</div>
</motion.div>
)}
</AnimatePresence>
</div>
))}
</div>
</div>
</section>
);
}