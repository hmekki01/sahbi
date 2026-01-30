import Link from "next/link";

export default function Footer() {
return (
<footer className="bg-neutral-900 text-neutral-300">
<div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">

{/* Présentation */}
<div>
<h2 className="text-white text-lg font-semibold mb-4">
NomDuService
</h2>
<p className="text-sm leading-relaxed">
Plateforme d’aide, d’échange et de soutien entre utilisateurs,
basée sur la confiance, la bienveillance et la protection des données.
</p>
</div>

{/* Navigation */}
<div>
<h3 className="text-white font-medium mb-4">Découvrir</h3>
<ul className="space-y-2 text-sm">
<li><Link href="/a-propos">À propos</Link></li>
<li><Link href="/fonctionnement">Fonctionnement</Link></li>
<li><Link href="/charte-communaute">Charte de la communauté</Link></li>
<li><Link href="/ressources">Ressources</Link></li>
<li><Link href="/contact">Contact</Link></li>
</ul>
</div>

{/* Aide */}
<div>
<h3 className="text-white font-medium mb-4">Aide</h3>
<ul className="space-y-2 text-sm">
<li><Link href="/faq">FAQ</Link></li>
<li><Link href="/centre-aide">Centre d’aide</Link></li>
<li><Link href="/signaler">Signaler un contenu</Link></li>
<li><Link href="/securite">Sécurité</Link></li>
</ul>
</div>

{/* Légal */}
<div>
<h3 className="text-white font-medium mb-4">Légal</h3>
<ul className="space-y-2 text-sm">
<li><Link href="/mentions-legales">Mentions légales</Link></li>
<li><Link href="/confidentialite">Politique de confidentialité</Link></li>
<li><Link href="/cookies">Politique de cookies</Link></li>
<li>
<button className="underline underline-offset-2"
>
Gérer les cookies
</button>
</li>
</ul>
</div>
</div>

{/* Bas de footer */}
<div className="border-t border-neutral-800 py-6 text-sm text-center">
<p>
© {new Date().getFullYear()} NomDuService — Tous droits réservés
</p>
<p className="mt-1 text-neutral-400">
Données hébergées dans l’Union Européenne • Conforme RGPD
</p>
</div>
</footer>
);
}