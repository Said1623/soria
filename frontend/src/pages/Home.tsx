import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { domainesApi } from '../api';

const PEDAGOSPHERE_API = 'https://pedagov2-backend.onrender.com/api';

const MAPPING: Record<string, string> = {
  ATTENTION:       'CONSIGNES',
  MOTIVATION:      'MOTIVATION',
  AUTONOMIE:       'AUTONOMIE',
  COMPREHENSION:   'COMPREHENSION',
  INTERACTION:     'COMPORTEMENT',
  CADRE:           'COMPORTEMENT',
  EMOTIONS:        'EMOTIONS',
  DIFFERENCIATION: 'DIFFERENCIATION',
};

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

interface PrescriptionVerif {
  valide: boolean;
  code?: string;
  domainesIgep?: string[];
  kits?: string[];
  expireA?: string;
}

export default function Home() {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [prescInput, setPrescInput] = useState('');
  const [prescVerif, setPrescVerif] = useState<PrescriptionVerif | null>(null);
  const [prescLoading, setPrescLoading] = useState(false);
  const [prescError, setPrescError] = useState<string | null>(null);

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

    const storedCode = localStorage.getItem('soria_code_prescription');
    if (storedCode) {
      setPrescInput(storedCode);
      verifierCode(storedCode);
    }
  }, []);

  const verifierCode = async (code: string) => {
    if (!code.trim()) return;
    setPrescLoading(true);
    setPrescError(null);
    try {
      const res = await fetch(`${PEDAGOSPHERE_API}/prescription/verify/${code.trim()}`);
      const data: PrescriptionVerif = await res.json();
      if (data.valide) {
        setPrescVerif(data);
      } else {
        setPrescVerif(null);
        setPrescError('Code prescription invalide ou expiré.');
      }
    } catch {
      setPrescError('Impossible de vérifier le code. Réessayez plus tard.');
    } finally {
      setPrescLoading(false);
    }
  };

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

      {/* ── Bannière prescription ── */}
      <div className="mb-8 bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📋</span>
          <h2 className="text-sm font-semibold text-stone-700">Code prescription</h2>
          {prescVerif?.valide && (
            <span className="ml-auto text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </div>

        {prescVerif?.valide ? (
          <div>
            <p className="text-xs text-stone-500 mb-3">
              Kits recommandés pour votre classe&nbsp;:
            </p>
            <div className="flex flex-wrap gap-2">
              {prescVerif.domainesIgep?.map(domaine => {
                const soriaCode = MAPPING[domaine] ?? domaine;
                return (
                  <button
                    key={domaine}
                    onClick={() => navigate(`/domaine/${soriaCode}`)}
                    className="inline-flex items-center gap-1.5 bg-violet-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-violet-800 transition-colors"
                  >
                    {domaine} →
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('soria_code_prescription');
                setPrescVerif(null);
                setPrescInput('');
              }}
              className="mt-3 text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              Effacer le code
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-stone-500 mb-3">
              Vous avez reçu un code prescription depuis Pédagosphère ?
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={prescInput}
                onChange={e => setPrescInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verifierCode(prescInput)}
                placeholder="RX-2026-XXXXXX"
                className="flex-1 text-sm border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 font-mono"
              />
              <button
                onClick={() => verifierCode(prescInput)}
                disabled={prescLoading || !prescInput.trim()}
                className="bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-800 disabled:opacity-50 transition-colors"
              >
                {prescLoading ? '…' : 'Vérifier'}
              </button>
            </div>
            {prescError && (
              <p className="mt-2 text-xs text-red-500">{prescError}</p>
            )}
          </div>
        )}
      </div>

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
