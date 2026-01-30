// app/layout.tsx
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

import type { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Sahbi',
  description: 'Plateforme bilingue FR/AR',
};



export default function RootLayout({ children }: { children: ReactNode }) {
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



