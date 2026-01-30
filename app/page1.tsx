import TableArtisans from '@/components/TableLang';
import TableLang from '@/components/TableLang';
import ArtisanSearch from '@/components/ArtisanSearch';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-black mb-8">Test de connexion Base de Données</h1>
      
      {/* Ton nouveau bouton magique */}
      <ArtisanSearch  />
      
    </main>
  );
}