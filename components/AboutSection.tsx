export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">
          Pourquoi avoir créé cette plateforme ?
        </h2>
       
        <div className="prose prose-lg text-gray-600 mx-auto">
          <p className="mb-6">
            L'idée est née d'un constat simple dans nos villes de <strong>Vichy, Moulins et Montluçon</strong> :
            le talent est présent, mais il est parfois difficile à trouver au bon moment.
          </p>
         
          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-blue-50 p-6 rounded-3xl">
              <h4 className="text-blue-900 font-bold mb-2">Notre Mission</h4>
              <p className="text-sm">Faciliter la rencontre entre les familles de la communauté et les artisans locaux qui partagent les mêmes valeurs de sérieux et de bienveillance.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-3xl">
              <h4 className="text-green-900 font-bold mb-2">Notre Vision</h4>
              <p className="text-sm">Devenir le réflexe numéro 1 dans l'Allier pour tous les besoins du quotidien : travaux, services, traiteurs ou soins.</p>
            </div>
          </div>

          <p className="italic border-l-4 border-blue-600 pl-6 my-8 text-slate-800 font-medium">
            "Nous croyons que la barrière de la langue ou de la culture ne doit jamais être un frein à la qualité.
            C'est pourquoi nous mettons en avant la maîtrise du français et de l'arabe."
          </p>
        </div>
      </div>
    </section>
  );
}