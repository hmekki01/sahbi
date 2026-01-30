export const metadata = {
title: "Mentions légales | Artisans 03",
description: "Mentions légales du site Artisans 03",
};

export default function MentionsLegalesPage() {
return (
<main className="max-w-4xl mx-auto px-6 py-16">
<h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

<section className="space-y-6 text-sm leading-relaxed">
<p>
Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans
l’économie numérique (LCEN), il est précisé aux utilisateurs du site
<strong> Artisans 03</strong> l’identité des différents intervenants.
</p>

<div>
<h2 className="font-semibold text-lg mb-2">Éditeur du site</h2>
<ul className="list-disc list-inside">
<li>Nom commercial : Artisans 03</li>
<li>Forme juridique : Entreprise</li>
<li>Raison sociale : [À compléter]</li>
<li>Siège social : [Adresse complète]</li>
<li>SIREN / SIRET : [À compléter]</li>
<li>Responsable de la publication : [Nom et prénom]</li>
<li>Email : contact@artisans03.fr</li>
</ul>
</div>

<div>
<h2 className="font-semibold text-lg mb-2">Hébergement</h2>
<ul className="list-disc list-inside">
<li>Hébergeur : [Nom de l’hébergeur]</li>
<li>Adresse : [Adresse hébergeur]</li>
<li>Données hébergées dans l’Union Européenne</li>
</ul>
</div>

<div>
<h2 className="font-semibold text-lg mb-2">Propriété intellectuelle</h2>
<p>
L’ensemble des contenus présents sur le site Artisans 03 est protégé
par le droit de la propriété intellectuelle. Toute reproduction sans
autorisation est interdite.
</p>
</div>
</section>
</main>
);
}