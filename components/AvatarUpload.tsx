"use client";

import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AvatarUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // Ici, tu lanceras ta fonction de téléchargement vers Supabase plus tard
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}>
     
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <div className="relative group">
        {preview ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-32 h-32"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setPreview(null); }}
              className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-inner">
            <Camera className="w-10 h-10" />
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-bold text-gray-700">
          {preview ? "Photo sélectionnée !" : "Ajoutez votre photo ou logo"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG jusqu'à 5MB
        </p>
      </div>
    </div>
  );
}
