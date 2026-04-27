import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ITEMS = [
  'Plusieurs élèves demandent de répéter la consigne',
  'Certains élèves réalisent une tâche différente de celle demandée',
  'Des élèves demandent souvent : "On doit faire quoi ?"',
  'Plusieurs élèves restent bloqués après la consigne',
  'Les mêmes erreurs apparaissent chez plusieurs élèves',
  'Certains élèves commencent sans comprendre',
  'Vous devez expliquer individuellement la tâche',
  'Certains élèves font une autre activité que celle demandée',
];

export default function Diagnostic() {
  const { kitCode } = useParams<{ kitCode: string }>();
  const navigate = useNavigate();
  const [coches, setCoches] = useState<number[]>([]);
  const [resultat, setResultat] = useState<any>(null);

  const toggle = (index: number) => {
    setCoches(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const evaluer = () => {
    const score = coches.length;
    let niveau = '';
    let message = '';
    let sousMessage = '';
    let couleur = '';

    if (score <= 2) {
      niveau = 'Stable';
      message = 'Vos consignes semblent globalement claires pour la majorité des élèves.';
      sousMessage = 'Vous pouvez néanmoins renforcer leur efficacité avec des outils simples.';
      couleur = 'green';
    } else if (score <= 5) {
      niveau = 'Fragilité';
      message = 'Certaines consignes peuvent poser difficulté à une partie des élèves.';
      sousMessage = 'Quelques ajustements peuvent faciliter l\'entrée dans l\'activité.';
      couleur = 'orange';
    } else {
      niveau = 'Obstacle majeur';
      message = 'La compréhension des consignes constitue probablement un obstacle important dans votre classe.';
      sousMessage = 'Une structuration plus explicite des consignes peut avoir un impact immédiat.';
      couleur = 'red';
    }

    setResultat({ score, niveau, message, sousMessage, couleur });
  };

  const couleurConfig: Record<string, any> = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titre: 'text-green-700',
      badge: 'bg-green-100 text-green-700',
      bouton: 'bg-green-600 hover:bg-green-700',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      titre: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-700',
      bouton: 'bg-orange-600 hover:bg-orange-700',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      titre: 'text-red-700',
      badge: 'bg-red-100 text-red-700',
      bouton: 'bg-red-600 hover:bg-red-700',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(`/kit/${kitCode}`)}
            className="text-sm text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-violet-600">🔍 Diagnostic</h1>
          <p className="text-gray-500 mt-1">Test rapide — Mes consignes sont-elles claires ?</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">

        {!resultat ? (
          <>
            <p className="text-gray-600 mb-6 font-medium">
              Dans votre classe, observez-vous régulièrement ces situations liées aux consignes ?
            </p>

            <div className="space-y-3 mb-8">
              {ITEMS.map((item, index) => (
                <div
                  key={index}
                  onClick={() => toggle(index)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${coches.includes(index)
                      ? 'bg-violet-50 border-violet-300'
                      : 'bg-white border-gray-100 hover:border-violet-200'
                    }`}
                >
                  <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all
                    ${coches.includes(index)
                      ? 'bg-violet-600 border-violet-600'
                      : 'border-gray-300'
                    }`}
                  >
                    {coches.includes(index) && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-gray-400 mb-4">
              {coches.length} situation{coches.length > 1 ? 's' : ''} cochée{coches.length > 1 ? 's' : ''} sur 8
            </div>

            <button
              onClick={evaluer}
              className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl
                         hover:bg-violet-700 transition-all text-lg"
            >
              Voir mon résultat
            </button>
          </>
        ) : (
          <>
            {/* RÉSULTAT */}
            <div className={`rounded-xl p-6 border-2 mb-6 ${couleurConfig[resultat.couleur].bg} ${couleurConfig[resultat.couleur].border}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${couleurConfig[resultat.couleur].badge}`}>
                  {resultat.niveau}
                </span>
                <span className="text-sm text-gray-500">
                  {resultat.score} situation{resultat.score > 1 ? 's' : ''} cochée{resultat.score > 1 ? 's' : ''} sur 8
                </span>
              </div>
              <p className={`font-medium mb-2 ${couleurConfig[resultat.couleur].titre}`}>
                {resultat.message}
              </p>
              <p className="text-sm text-gray-500">{resultat.sousMessage}</p>
            </div>

            {/* ACTIONS */}
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/kit/${kitCode}/analyseur`)}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl
                           hover:bg-blue-700 transition-all"
              >
                🔬 Analyser une consigne existante
              </button>
              <button
                onClick={() => navigate(`/kit/${kitCode}/generateur`)}
                className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl
                           hover:bg-indigo-700 transition-all"
              >
                ✨ Créer une consigne claire
              </button>
              <button
                onClick={() => setResultat(null)}
                className="w-full border border-gray-200 text-gray-500 font-medium py-3 rounded-xl
                           hover:bg-gray-50 transition-all"
              >
                ↺ Refaire le diagnostic
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
