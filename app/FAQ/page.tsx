// app/faq/page.tsx
import type { Metadata } from "next";
import Faq from "@/components/FAQ"; // ou "../components/faq" si tu n'as pas d'alias @

export const metadata: Metadata = {
  title: "FAQ — TonSite",
  description: "Questions fréquentes",
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Foire aux questions</h1>
      <Faq />
    </div>
  );
}