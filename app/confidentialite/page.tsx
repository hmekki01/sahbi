export const metadata = {
title: "Politique de confidentialité | Artisans 03",
};

export default function ConfidentialitePage() {
return (
<main className="max-w-4xl mx-auto px-6 py-16">
<h1 className="text-3xl font-bold mb-8">
Politique de confidentialité
</h1>

<section className="space-y-6 text-sm leading-relaxed">
<p>
Artisans 03 respecte la vie privée de ses utilisateurs et s’engage à
protéger leurs données personnelles conformément au RGPD.
</p>

<div>
<h2 className="font-semibold text-lg mb-2">
Responsable du traitement
</h2>
<p>
Artisans 03 – Email : <strong>rgpd@artisans03.fr</strong>
</p>
</div>

<div>
<h2 className="font-semibold text-lg mb-2">
Données collectées
</h2>
<ul className="list-disc list-inside">
<li>Identité et informations de compte</li>
<li>Adresse email</li>
<li>Données de connexion (IP, logs)</li>
<li>Contenus échangés sur la plateforme</li>
</ul>
</div>

<div>
<h2 className="font-semibold text-lg mb-2">Finalités</h2>
<ul className="list-disc list-inside">
<li>Mise en relation utilisateurs / artisans</li>
<li>Sécurité de la plateforme</li>
<li>Amélioration du service</li>
<li>Obligations légales</li>
</ul>
</div>

<div>
<h2 className="font-semibold text-lg mb-2">
Droits des utilisateurs
</h2>
<p>
Vous disposez d’un droit d’accès, de rectification, de suppression et
de portabilité de vos données.
</p>
</div>

<p>
En cas de litige, vous pouvez saisir la CNIL : www.cnil.fr
</p>
</section>
</main>
);
}
