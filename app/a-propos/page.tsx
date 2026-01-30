// app/a-propos/page.tsx
import type { Metadata } from "next";
// Si tu as l’alias "@", garde-le. Sinon, utilise un import relatif: "../../components/AboutSection"
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "À propos — TonSite",
  description: "En savoir plus sur notre équipe, notre mission et notre produit.",
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">À propos</h1>
      <AboutSection />
    </div>
  );
}