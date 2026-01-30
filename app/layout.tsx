// app/layout.tsx
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

import type { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Annuaire artisans 03',
  description: 'Plateforme bilingue FR/AR',
};



export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
      </head>
      <body>
        
          <Navbar />
          {children}
          <Footer />
        
      </body>
    </html>
  );
}



