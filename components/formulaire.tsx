"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CheckCircle2, ChevronRight, User, Wrench, MapPin, Phone } from 'lucide-react';

export default function ArtisanSignup() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const onSubmit = (data) => console.log("Données envoyées à Supabase :", data);

  const steps = [
    { id: 1, title: 'Identité', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'Métier', icon: <Wrench className="w-5 h-5" /> },
    { id: 3, title: 'Contact', icon: <Phone className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Barre de progression */}
      <div className="flex bg-gray-50 p-6 justify-between border-b border-gray-100">
        {steps.map((s) => (
          <div key={s.id} className={`flex items-center gap-2 ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className={`p-2 rounded-lg ${step >= s.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {s.icon}
            </span>
            <span className="hidden sm:inline font-medium">{s.title}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8">
        <AnimatePresence mode="wait">
          {/* ÉTAPE 1 : IDENTITÉ */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">Parlez-nous de vous</h2>
              <div>
                <label className="block text-sm font-semibold mb-2">Nom Complet</label>
                <input {...register("full_name")} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all" placeholder="Ex: Ahmed Benali" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Nom de votre entreprise (Optionnel)</label>
                <input {...register("business_name")} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 2 : MÉTIER ET ZONE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">Votre expertise</h2>
              <div>
                <label className="block text-sm font-semibold mb-2">Votre métier</label>
                <select {...register("category")} className="w-full p-4 rounded-xl border border-gray-200 bg-white outline-none">
                  <option>Plomberie</option>
                  <option>Électricité</option>
                  <option>Peinture / Rénovation</option>
                  <option>Chauffage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Ville d'intervention</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-400" />
                  <input {...register("city")} className="w-full p-4 pl-12 rounded-xl border border-gray-200 outline-none" placeholder="Ex: Vichy, Moulins..." />
                </div>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 3 : CONTACT */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">Dernière étape !</h2>
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex gap-3">
                <CheckCircle2 className="text-green-600 w-6 h-6 flex-shrink-0" />
                <p className="text-sm text-green-800 italic">Vos coordonnées seront utilisées uniquement pour vous envoyer vos futurs clients.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Numéro WhatsApp</label>
                <input {...register("whatsapp")} className="w-full p-4 rounded-xl border border-gray-200 outline-none" placeholder="06 00 00 00 00" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOUTONS DE NAVIGATION */}
        <div className="mt-10 flex justify-between gap-4">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="px-6 py-3 text-gray-500 font-semibold hover:text-gray-800 transition">
              Retour
            </button>
          )}
          <div className="ml-auto">
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                Suivant <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button type="submit" className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200">
                Valider mon inscription
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}