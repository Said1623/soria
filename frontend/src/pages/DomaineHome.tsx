import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { domainesApi } from '../api';

interface Kit {
  code: string;
  nom: string;
  sous_titre: string;
  actif: boolean;
}

interface Domaine {
  id: number;
  code: string;
  nom: string;
  icone: string;
  couleur: string;
}

export default function DomaineHome() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [domaine, setDomaine] = useState<Domaine | null>(null);
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) return;
    const init = async () => {
      try {
        const allDomaines: Domaine[] = await domainesApi.getAll();
        const found = allDomaines.find(
          d => d.code.toUpperCase() === code.toUpperCase()
        );
        if (!found) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setDomaine(found);
        const kitsData = await domainesApi.getKits(found.code);
        setKits(kitsData);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-violet-200 animate-pulse" />
          <span className="text-sm text-stone-500">Chargement...</span>
        </div>
      </div>
    );
  }

  if (notFound || !domaine) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="text-4xl mb-4">🗂</div>
        <h1 className="text-xl font-semibold text-stone-700 mb-2">Domaine introuvable</h1>
        <p className="text-sm text-stone-500 mb-6">
          Le domaine <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">{code}</code> n'existe pas.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-violet-700 hover:text-violet-800 font-medium transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      <button
        onClick={() => navigate('/')}
        className="text-sm text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1 mb-8"
      >
        ← Retour
      </button>

      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-100">
        <span className="text-2xl">{domaine.icone}</span>
        <div>
          <h1
            className="text-xl font-bold tracking-wide"
            style={{ color: domaine.couleur }}
          >
            {domaine.nom}
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            {kits.filter(k => k.actif).length}/{kits.length} kits disponibles
          </p>
        </div>
      </div>

      {kits.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-amber-700 font-medium">🚧 Aucun kit disponible pour ce domaine</p>
          <p className="text-amber-500 text-sm mt-1">Les kits seront disponibles prochainement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {kits.map(kit => (
            <button
              key={kit.code}
              onClick={() => kit.actif ? navigate(`/kit/${kit.code}`) : undefined}
              disabled={!kit.actif}
              className={`group text-left rounded-2xl p-4 border transition-all duration-150
                ${kit.actif
                  ? 'bg-white border-stone-200 hover:border-violet-200 hover:shadow-md cursor-pointer'
                  : 'bg-stone-50 border-stone-100 cursor-not-allowed opacity-50'
                }`}
            >
              <div
                className="w-1 h-7 rounded-full mb-3"
                style={{ backgroundColor: kit.actif ? domaine.couleur : '#d6d3d1' }}
              />

              <div className="flex items-start justify-between gap-2">
                <p
                  className="text-sm font-semibold mb-1 leading-snug"
                  style={{ color: kit.actif ? domaine.couleur : '#78716c' }}
                >
                  {kit.nom}
                </p>
                {!kit.actif && (
                  <span className="text-stone-400 text-xs flex-shrink-0 mt-0.5">🔒</span>
                )}
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                {kit.sous_titre}
              </p>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
