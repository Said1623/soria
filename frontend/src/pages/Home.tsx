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
            const result = { ...d, kits };
            console.log('result kits for', d.code, ':', result.kits.length);
            return result;
          })
        );
        console.log('withKits CONSIGNES kits:', withKits.find(d => d.code === 'CONSIGNES')?.kits.length);
        setDomaines(withKits);
        setLoading(false);
      };
      loadAll();
    }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-56px)]">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-indigo-200 animate-pulse" />
            <span className="text-sm text-gray-600">Chargement...</span>
          </div>
        </div>
      );
    }

    console.log('kits CONSIGNES:', domaines.find(d => d.code === 'CONSIGNES')?.kits);

    return (
      <div className="max-w-6xl mx-auto px-8 py-6">

        {/* Intro */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Choisissez un domaine et sélectionnez le kit correspondant à votre situation.
          </p>
        </div>

        {/* Domaines */}
        <div className="space-y-10">
          {domaines.map(domaine => (
            <section key={domaine.code}>

              {/* En-tête domaine */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <span className="text-base">{domaine.icone}</span>
                <h2
                  className="text-sm font-bold tracking-wide uppercase"
                  style={{ color: domaine.couleur }}
                >
                  {domaine.nom}
                </h2>
                <span className="ml-auto text-xs text-gray-400">
                  {domaine.kits?.filter(k => k.actif).length}/{domaine.kits?.length} kits
                </span>
              </div>

              {/* Grille kits */}
              <div className="grid grid-cols-4 gap-3">
                {domaine.kits?.map(kit => (
                  <button
                    key={kit.code}
                    onClick={() => kit.actif ? navigate(`/kit/${kit.code}`) : null}
                    disabled={!kit.actif}
                    className={`group text-left rounded-lg p-4 border transition-all duration-150
                      ${kit.actif
                        ? 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm cursor-pointer'
                        : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
                      }`}
                  >
                    <div
                      className="w-1 h-8 rounded-full mb-3"
                      style={{ backgroundColor: kit.actif ? domaine.couleur : '#d1d5db' }}
                    />

                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-sm font-bold mb-1"
                        style={{ color: kit.actif ? domaine.couleur : '#6b7280', fontWeight: kit.actif ? 600 : undefined }}
                      >
                        {kit.nom}
                      </p>
                      {!kit.actif && (
                        <span className="text-gray-500 text-sm flex-shrink-0 mt-0.5">🔒</span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
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