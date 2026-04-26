import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { domainesApi } from '../api';

interface Kit {
  code: string;
  nom: string;
  sous_titre: string;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-600">SORIA</h1>
          <p className="text-gray-500 mt-1">Système d'action guidée pour la classe</p>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-6xl mx-auto px-8 py-8">

        <p className="text-gray-500 mb-8">
          Choisissez un domaine et sélectionnez le kit correspondant à votre situation.
        </p>

        <div className="space-y-8">
          {domaines.map(domaine => (
            <div key={domaine.code}>

              {/* TITRE DOMAINE */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{domaine.icone}</span>
                <h2
                  className="text-xl font-bold"
                  style={{ color: domaine.couleur }}
                >
                  {domaine.nom}
                </h2>
              </div>

              {/* KITS */}
              <div className="grid grid-cols-4 gap-4">
                {domaine.kits?.map(kit => (
                  <div
                    key={kit.code}
                    onClick={() => navigate(`/kit/${kit.code}`)}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100
                               cursor-pointer hover:shadow-md transition-all group"
                    style={{ borderLeft: `4px solid ${domaine.couleur}` }}
                  >
                    <h3
                      className="text-base font-bold group-hover:opacity-80 transition-opacity"
                      style={{ color: domaine.couleur }}
                    >
                      {kit.nom}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {kit.sous_titre}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
