import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CRITERES = [
  {
    code: 'C1',
    label: 'C1 — Commande',
    question: "L'action demandée est-elle claire ?",
    description: 'Le verbe utilisé est-il précis et compris des élèves ?',
    couleur: 'violet',
  },
  {
    code: 'C2',
    label: 'C2 — Cible',
    question: "L'élève sait-il sur quoi travailler ?",
    description: 'Le support de travail est-il clairement identifié ?',
    couleur: 'blue',
  },
  {
    code: 'C3',
    label: 'C3 — Chemin',
    question: 'Les étapes sont-elles explicites ?',
    description: 'La démarche à suivre est-elle visible et ordonnée ?',
    couleur: 'emerald',
  },
  {
    code: 'C4',
    label: 'C4 — Construction',
    question: "Le résultat attendu est-il clair ?",
    description: "L'élève sait-il exactement ce qu'il doit produire ?",
    couleur: 'amber',
  },
];

const REPONSES = ['Oui', 'Partiellement', 'Non'];
const SCORES: Record<string, number> = { 'Oui': 0, 'Partiellement': 1, 'Non': 2 };

const COULEURS: Record<string, any> = {
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  label: 'text-violet-700',  selected: 'bg-violet-700 text-white border-violet-700' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    label: 'text-blue-600',    selected: 'bg-blue-600 text-white border-blue-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'text-emerald-700', selected: 'bg-emerald-600 text-white border-emerald-600' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   label: 'text-amber-600',   selected: 'bg-amber-500 text-white border-amber-500' },
};

export default function Analyseur() {
  const { kitCode } = useParams<{ kitCode: string }>();
  const navigate = useNavigate();
  const [consigne, setConsigne] = useState('');
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [resultat, setResultat] = useState<any>(null);

  const tousRemplis = CRITERES.every(c => reponses[c.code]);

  const analyser = () => {
    const score = Object.values(reponses).reduce((acc, r) => acc + SCORES[r], 0);
    const problemes = CRITERES.filter(c => reponses[c.code] !== 'Oui');

    let niveau = '';
    let message = '';
    if (score <= 2) {
      niveau = 'Clair';
      message = 'Votre consigne est bien structurée.';
    } else if (score <= 5) {
      niveau = 'À améliorer';
      message = 'Quelques points peuvent être renforcés.';
    } else {
      niveau = 'À retravailler';
      message = 'Votre consigne risque de bloquer plusieurs élèves.';
    }

    setResultat({ score, niveau, message, problemes });
  };

  return (
    <div className="min-h-screen bg-stone-50">

      <div className="bg-white border-b border-stone-100 px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(`/kit/${kitCode}`)}
            className="text-sm text-stone-400 hover:text-stone-600 mb-3 flex items-center gap-1 transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-blue-600">🔬 Analyseur</h1>
          <p className="text-stone-500 mt-1 text-sm">Analyser une consigne selon les 4C</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        <div className="bg-white rounded-2xl p-5 border border-stone-200 mb-6">
          <label className="text-sm font-medium text-stone-600 block mb-2">
            Votre consigne (facultatif)
          </label>
          <textarea
            value={consigne}
            onChange={e => setConsigne(e.target.value)}
            placeholder="Collez ou tapez votre consigne ici pour vous aider à répondre aux questions..."
            rows={3}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm bg-stone-50
                       focus:outline-none focus:border-violet-400 resize-none placeholder:text-stone-400"
          />
          <p className="text-xs text-stone-400 mt-1">Ce texte n'est pas analysé automatiquement — il sert de référence.</p>
        </div>

        <div className="space-y-4 mb-6">
          {CRITERES.map(critere => {
            const c = COULEURS[critere.couleur];
            return (
              <div key={critere.code} className={`rounded-2xl p-5 border-2 ${c.bg} ${c.border}`}>
                <p className={`font-bold mb-1 text-sm ${c.label}`}>{critere.label}</p>
                <p className="font-medium text-stone-800 mb-1 text-sm">{critere.question}</p>
                <p className="text-xs text-stone-500 mb-4">{critere.description}</p>
                <div className="flex gap-2">
                  {REPONSES.map(rep => (
                    <button
                      key={rep}
                      onClick={() => setReponses(prev => ({ ...prev, [critere.code]: rep }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all
                        ${reponses[critere.code] === rep
                          ? c.selected
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                        }`}
                    >
                      {rep}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={analyser}
          disabled={!tousRemplis}
          className="w-full bg-violet-700 text-white font-bold py-4 rounded-2xl
                     hover:bg-violet-800 transition-all disabled:opacity-40
                     disabled:cursor-not-allowed text-base mb-6"
        >
          Analyser ma consigne
        </button>

        {resultat && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-bold
                ${resultat.niveau === 'Clair' ? 'bg-green-100 text-green-700' :
                  resultat.niveau === 'À améliorer' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'}`}
              >
                {resultat.niveau}
              </span>
              <span className="text-sm text-stone-500">Score : {resultat.score}/8</span>
            </div>
            <p className="text-stone-700 font-medium mb-4 text-sm">{resultat.message}</p>

            {resultat.problemes.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-stone-600 mb-2">Points à améliorer :</p>
                <div className="space-y-2">
                  {resultat.problemes.map((p: any) => (
                    <div key={p.code} className="flex items-center gap-2 text-sm text-stone-600">
                      <span className="text-amber-500">⚠</span>
                      {p.label} — {p.question}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate(`/kit/${kitCode}/generateur`)}
              className="w-full bg-violet-700 text-white font-medium py-3 rounded-2xl
                         hover:bg-violet-800 transition-all"
            >
              ✨ Créer une consigne améliorée
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
