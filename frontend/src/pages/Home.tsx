import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  kits?: Kit[];
}

export default function Home() {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAll = async () => {
      const allDomaines = await domainesApi.getAll();
      const withKits = await Promise.all(
        allDomaines.map(async (d: Domaine) => {
          const kits = await domainesApi.getKits(d.code);
          return { ...d, kits };
        })
      );
      setDomaines(withKits);
      setLoading(false);
    };
    loadAll();
  }, []);

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      <div className="mb-8">
        <p className="text-sm text-stone-500">
          Choisissez un domaine et sélectionnez le kit correspondant à votre situation.
        </p>
      </div>

      <div className="space-y-10">
        {domaines.map(domaine => (
          <section key={domaine.code}>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
              <span className="text-base">{domaine.icone}</span>
              <h2
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: domaine.couleur }}
              >
                {domaine.nom}
              </h2>
              <span className="ml-auto text-xs text-stone-400">
                {domaine.kits?.filter(k => k.actif).length}/{domaine.kits?.length} kits
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {domaine.kits?.map(kit => (
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

          </section>
        ))}
      </div>

    </div>
  );
}
