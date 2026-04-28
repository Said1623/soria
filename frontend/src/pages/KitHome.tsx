import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { kitsApi } from '../api';

const MODULES = [
  {
    code: 'diagnostic',
    titre: 'Diagnostic',
    icon: '🔍',
    sous_titre: 'Tester la clarté de mes consignes',
    description: 'En moins d\'1 minute, identifiez si vos consignes posent problème.',
    color: 'violet',
  },
  {
    code: 'analyseur',
    titre: 'Analyseur',
    icon: '🔬',
    sous_titre: 'Analyser une consigne existante',
    description: 'Évaluez votre consigne selon les 4 critères C1/C2/C3/C4.',
    color: 'blue',
  },
  {
    code: 'generateur',
    titre: 'Générateur',
    icon: '✨',
    sous_titre: 'Créer une consigne claire',
    description: 'Construisez une consigne structurée en 4 étapes guidées.',
    color: 'amber',
  },
];

const COLOR_MAP: Record<string, { accent: string; bg: string; pill: string }> = {
  violet: { accent: 'text-violet-700', bg: 'bg-violet-50 hover:border-violet-300', pill: 'bg-violet-100 text-violet-700' },
  blue:   { accent: 'text-blue-600',   bg: 'bg-blue-50 hover:border-blue-300',     pill: 'bg-blue-100 text-blue-600' },
  amber:  { accent: 'text-amber-600',  bg: 'bg-amber-50 hover:border-amber-300',   pill: 'bg-amber-100 text-amber-600' },
};

export default function KitHome() {
  const { kitCode } = useParams<{ kitCode: string }>();
  const navigate = useNavigate();
  const [kit, setKit] = useState<any>(null);

  useEffect(() => {
    if (!kitCode) return;
    kitsApi.getByCode(kitCode).then(setKit);
  }, [kitCode]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <div className="mb-10">
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block mb-2">Kit</span>
        <h1 className="text-2xl font-semibold text-stone-800">
          {kit?.nom || kitCode}
        </h1>
        {kit?.sous_titre && (
          <p className="text-sm text-stone-500 mt-1">{kit.sous_titre}</p>
        )}
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs text-stone-400 font-medium">Choisissez un module</span>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {MODULES.map(mod => {
          const c = COLOR_MAP[mod.color];
          return (
            <button
              key={mod.code}
              onClick={() => navigate(`/kit/${kitCode}/${mod.code}`)}
              className={`group text-left rounded-2xl p-6 border border-stone-200
                          transition-all duration-150 hover:shadow-md ${c.bg}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${c.pill}`}>
                  <span style={{ fontSize: '16px' }}>{mod.icon}</span>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${c.accent}`}>{mod.titre}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{mod.sous_titre}</p>
                </div>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed mb-5">
                {mod.description}
              </p>

              <div className={`text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all ${c.accent}`}>
                Accéder <span>→</span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
