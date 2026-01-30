import { motion } from 'framer-motion';
import { div } from 'framer-motion/client';
import { Phone, MessageCircle, MapPin, CheckCircle, Languages } from 'lucide-react';
import Link from 'next/link';


// components/ArtisanCard.tsx
interface ArtisanProps {
  artisan: {
    full_name: string;
    business_name?: string;
    category: string;
    city: string;
    languages: string[];
    avatar_url?: string;
    whatsapp_number: string;
  }
}


export default function ArtisanCard({ artisan }: { artisan: any }) {
// Sécurité : si pas d'artisan, on n'affiche rien
if (!artisan) return null;
return (
    <Link href={`/artisan/${artisan.id}`}>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider">
                        {artisan.category}
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                        {artisan.business_name}
                        </h3>
                    </div>
                </div>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{artisan.city}</span>
                    </div>
                    
                        <div className="flex flex-wrap gap-2 mt-3">
                        {artisan.languages?.map((lang: string) => (
                            <span key={lang} className="text-[10px] font-black uppercase px-2 py-1 bg-blue-50 text-blue-600 rounded-lg tracking-wider">
                            {lang === 'Arabe' ? 'Arabe (العربية)' : lang}
                            </span>
                        ))}
                        </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <a 
                    href={`tel:${artisan.whatsapp_number}`}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all text-sm"
                    >
                    <Phone className="w-4 h-4" /> Appeler
                    </a>
                    <a
                    href={`https://wa.me/${artisan.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                    </a>
                </div>
            </div>
</Link>    
);
}
