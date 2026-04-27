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
    accent: '#7c3aed',
    bg: 'hover:border-violet-200',
  },
  {
    code: 'analyseur',
    titre: 'Analyseur',
    icon: '🔬',
    sous_titre: 'Analyser une consigne existante',
    description: 'Évaluez votre consigne selon les 4 critères C1/C2/C3/C4.',
    accent: '#2563eb',
    bg: 'hover:border-blue-200',
  },
  {
    code: 'generateur',
    titre: 'Générateur',
    icon: '✨',
    sous_titre: 'Créer une consigne claire',
    description: 'Construisez une consigne structurée en 4 étapes guidées.',
    accent: '#4f46e5',
    bg: 'hover:border-indigo-200',
  },
];

export default function KitHome() {
  const { kitCode } = useParams<{ kitCode: string }>();
  const navigate = useNavigate();
  const [kit, setKit] = useState<any>(null);

  useEffect(() => {
    if (!kitCode) return;
    kitsApi.getByCode(kitCode).then(setKit);
  }, [kitCode]);

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">

      {/* Kit title */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">
            Kit
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {kit?.nom || kitCode}
        </h1>
        {kit?.sous_titre && (
          <p className="text-sm text-gray-400 mt-1">{kit.sous_titre}</p>
        )}
      </div>

      {/* Séparateur */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs text-gray-400">Choisissez un module</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Modules */}
      <div className="grid grid-cols-3 gap-4">
        {MODULES.map(mod => (
          <button
            key={mod.code}
            onClick={() => navigate(`/kit/${kitCode}/${mod.code}`)}
            className={`group text-left bg-white rounded-xl p-6 border border-gray-100
                        transition-all duration-150 hover:shadow-sm ${mod.bg}`}
          >
            {/* Icône + titre */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ backgroundColor: `${mod.accent}15` }}
              >
                <span style={{ fontSize: '16px' }}>{mod.icon}</span>
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: mod.accent }}
                >
                  {mod.titre}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{mod.sous_titre}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 leading-relaxed mb-5">
              {mod.description}
            </p>

            {/* CTA */}
            <div
              className="text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
              style={{ color: mod.accent }}
            >
              Accéder
              <span>→</span>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}