import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { kitsApi } from '../api';

export default function KitHome() {
  const { kitCode } = useParams<{ kitCode: string }>();
  const navigate = useNavigate();
  const [kit, setKit] = useState<any>(null);

  useEffect(() => {
    if (!kitCode) return;
    kitsApi.getByCode(kitCode).then(setKit);
  }, [kitCode]);

  const modules = [
    {
      code: 'diagnostic',
      titre: '🔍 Diagnostic',
      sous_titre: 'Tester la clarté de mes consignes',
      description: 'En moins d\'1 minute, identifiez si vos consignes posent problème.',
      couleur: 'bg-violet-50 border-violet-200 hover:border-violet-400',
      bouton: 'bg-violet-600 hover:bg-violet-700',
      disponible: true,
    },
    {
      code: 'analyseur',
      titre: '🔬 Analyseur',
      sous_titre: 'Analyser une consigne existante',
      description: 'Évaluez votre consigne selon les 4 critères C1/C2/C3/C4.',
      couleur: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      bouton: 'bg-blue-600 hover:bg-blue-700',
      disponible: true,
    },
    {
      code: 'generateur',
      titre: '✨ Générateur',
      sous_titre: 'Créer une consigne claire',
      description: 'Construisez une consigne structurée en 4 étapes guidées.',
      couleur: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
      bouton: 'bg-indigo-600 hover:bg-indigo-700',
      disponible: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-indigo-600">
            {kit?.nom || kitCode}
          </h1>
          <p className="text-gray-500 mt-1">{kit?.sous_titre}</p>
        </div>
      </div>

      {/* MODULES */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <p className="text-gray-500 mb-6">
          Choisissez un module selon votre besoin :
        </p>

        <div className="grid grid-cols-3 gap-6">
          {modules.map(mod => (
            <div
              key={mod.code}
              className={`rounded-xl p-6 border-2 transition-all cursor-pointer ${mod.couleur}`}
              onClick={() => navigate(`/kit/${kitCode}/${mod.code}`)}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {mod.titre}
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-3">
                {mod.sous_titre}
              </p>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {mod.description}
              </p>
              <button
                className={`w-full text-white text-sm font-medium py-2 rounded-lg transition-all ${mod.bouton}`}
              >
                Accéder →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
