export const metadata = {
title: "Politique de cookies | Artisans 03",
};

export default function CookiesPage() {
return (
<main className="max-w-4xl mx-auto px-6 py-16">
<h1 className="text-3xl font-bold mb-8">Politique de cookies</h1>

<section className="space-y-6 text-sm leading-relaxed">
<p>
Un cookie est un petit fichier stocké sur votre appareil lors de la
navigation sur un site internet.
</p>

<div>
<h2 className="font-semibold text-lg mb-2">
Cookies strictement nécessaires
</h2>
<p>
Ces cookies sont indispensables au fonctionnement du site et ne
nécessitent pas de consentement.
</p>
</div>

<div>
<h2 className="font-semibold text-lg mb-2">
Cookies de mesure d’audience
</h2>
<p>
Utilisés uniquement après consentement pour analyser l’utilisation
du site.
</p>
</div>

<p>
Vous pouvez modifier vos préférences à tout moment via le lien
<strong> « Gérer les cookies »</strong> présent en bas de page.
</p>
</section>
</main>
);
}