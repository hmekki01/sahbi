import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, CheckCircle, Languages } from 'lucide-react';

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

export default function ArtisanCard({ artisan }: ArtisanProps) {
  return (
    <motion.div whileHover={{ y: -8 }}
className="group bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
>
    <div>
      <div className="p-6">
    {/* Entête : Avatar & Badge Métier */}
        <div className="flex items-start justify-between mb-5">
            <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-inner">
                <img
                src={artisan.avatar_url || "https://ui-avatars.com/api/?name=" + artisan.full_name}
                alt={artisan.full_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                </div>
                {/* Badge de vérification (Confiance) */}
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full border-4 border-white shadow-sm">
                <CheckCircle className="w-4 h-4 fill-current" />
                </div>
            </div>

            <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
            {artisan.category}
            </span>
        </div>
        </div>



   <div className="mb-6"> 
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
       
       <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{artisan.full_name}</h3>
       <p className="text-gray-400 text-sm font-medium mt-0.5">{artisan.business_name}</p>
       <p className="text-slate-500">{artisan.category}</p>
       <div className="flex items-center gap-1.5 mt-3 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-slate-500">{artisan.city}</span>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
            <Languages className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1.5">
                {artisan.languages.map((lang) => (
                <span key={lang} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-md text-gray-600 font-bold uppercase">
                {lang}
                </span>
                ))}
            </div>
        </div>
       {/* Rendu du reste de votre carte */}
    
    {/* Actions de Contact Direct */}
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
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#25D366] text-white font-bold hover:bg-[#128C7E] transition-all shadow-lg shadow-green-100 text-sm"
            >
            <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
        </div>
        </div>
  </div>
  </div>  
  </motion.div>
  );
}