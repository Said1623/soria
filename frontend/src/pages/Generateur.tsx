import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { referentielApi, moteurApi } from '../api';
import type { ReferentielItem, ConsigneResult, GenererDto } from '../types';

export default function Generateur() {
  const { kitCode } = useParams<{ kitCode: string }>();

  const [c1Items, setC1Items] = useState<ReferentielItem[]>([]);
  const [c2Items, setC2Items] = useState<ReferentielItem[]>([]);
  const [c3Items, setC3Items] = useState<ReferentielItem[]>([]);
  const [c4Items, setC4Items] = useState<ReferentielItem[]>([]);

  const [c1Selected, setC1Selected] = useState('');
  const [c1Precision, setC1Precision] = useState('');
  const [c2Selected, setC2Selected] = useState('');
  const [c2Precision, setC2Precision] = useState('');
  const [c3Selected, setC3Selected] = useState<string[]>([]);
  const [c3Precisions, setC3Precisions] = useState<Record<string, string>>({});
  const [c4Selected, setC4Selected] = useState('');
  const [c4Precision, setC4Precision] = useState('');

  const [result, setResult] = useState<ConsigneResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!kitCode) return;
    Promise.all([
      referentielApi.getCategorie(kitCode, 'C1'),
      referentielApi.getCategorie(kitCode, 'C2'),
      referentielApi.getCategorie(kitCode, 'C3'),
      referentielApi.getCategorie(kitCode, 'C4'),
    ]).then(([c1, c2, c3, c4]) => {
      setC1Items(c1);
      setC2Items(c2);
      setC3Items(c3);
      setC4Items(c4);
    });
  }, [kitCode]);

  const toggleC3 = (code: string) => {
    setC3Selected(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const canGenerate = c1Selected && c2Selected && c4Selected;

  const handleGenerer = async () => {
    if (!canGenerate || !kitCode) return;
    setLoading(true);
    try {
      const dto: GenererDto = {
        c1_code: c1Selected,
        c1_precision: c1Precision || undefined,
        c2_code: c2Selected,
        c2_precision: c2Precision || undefined,
        c3_codes: c3Selected,
        c3_precisions: c3Precisions,
        c4_code: c4Selected,
        c4_precision: c4Precision || undefined,
      };
      const res = await moteurApi.generer(kitCode, dto);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const c1Info = c1Items.find(i => i.code === c1Selected);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Clarifie</h1>
          <p className="text-gray-500">Générateur de consigne claire — Méthode 4C</p>
        </div>

        <div className="space-y-6">

          {/* C1 — COMMANDE */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-1">
              C1 — Commande <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm text-gray-400 mb-4">Que doivent faire les élèves ?</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {c1Items.map(item => (
                <button
                  key={item.code}
                  onClick={() => setC1Selected(item.code)}
                  className={`p-3 rounded-lg text-sm font-medium border transition-all text-left
                    ${c1Selected === item.code
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-300'
                    }`}
                >
                  <div>{item.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{item.famille}</div>
                </button>
              ))}
            </div>

            {c1Selected && (
              <>
                {c1Info && (
                  <div className="bg-indigo-50 rounded-lg p-3 mb-3 text-sm">
                    <p className="text-indigo-700">💡 {c1Info.definition}</p>
                    {c1Info.conseil && (
                      <p className="text-indigo-500 mt-1">👉 {c1Info.conseil}</p>
                    )}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Précision (ex: les deux personnages)"
                  value={c1Precision}
                  onChange={e => setC1Precision(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm
                             focus:outline-none focus:border-indigo-400"
                />
              </>
            )}
          </div>

          {/* C2 — CIBLE */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-1">
              C2 — Cible <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm text-gray-400 mb-4">Sur quoi travaillent les élèves ?</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {c2Items.map(item => (
                <button
                  key={item.code}
                  onClick={() => setC2Selected(item.code)}
                  className={`p-3 rounded-lg text-sm font-medium border transition-all
                    ${c2Selected === item.code
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-300'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {c2Selected && (
              <input
                type="text"
                placeholder="Précision (ex: page 12, ci-dessous…)"
                value={c2Precision}
                onChange={e => setC2Precision(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm
                           focus:outline-none focus:border-indigo-400"
              />
            )}
          </div>

          {/* C3 — CHEMIN */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-1">C3 — Chemin</h2>
            <p className="text-sm text-gray-400 mb-4">
              Comment s'y prennent-ils ? (max 4 étapes)
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {c3Items.map(item => (
                <button
                  key={item.code}
                  onClick={() => toggleC3(item.code)}
                  disabled={!c3Selected.includes(item.code) && c3Selected.length >= 4}
                  className={`p-3 rounded-lg text-sm font-medium border transition-all text-left
                    ${c3Selected.includes(item.code)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-300'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <div>{item.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{item.famille}</div>
                </button>
              ))}
            </div>

            {c3Selected.map(code => {
              const item = c3Items.find(i => i.code === code);
              if (!item) return null;
              return (
                <div key={code} className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-emerald-700 w-24">
                    {item.label}
                  </span>
                  <input
                    type="text"
                    placeholder={`Précision pour "${item.label}"`}
                    value={c3Precisions[code] || ''}
                    onChange={e =>
                      setC3Precisions(prev => ({ ...prev, [code]: e.target.value }))
                    }
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm
                               focus:outline-none focus:border-emerald-400"
                  />
                </div>
              );
            })}
          </div>

          {/* C4 — CONSTRUCTION */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-1">
              C4 — Construction <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm text-gray-400 mb-4">Que doivent-ils produire ?</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {c4Items.map(item => (
                <button
                  key={item.code}
                  onClick={() => setC4Selected(item.code)}
                  className={`p-3 rounded-lg text-sm font-medium border transition-all text-left
                    ${c4Selected === item.code
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-amber-300'
                    }`}
                >
                  <div>{item.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{item.famille}</div>
                </button>
              ))}
            </div>

            {c4Selected && c4Items.find(i => i.code === c4Selected)?.meta?.necessite_nombre && (
              <input
                type="text"
                placeholder="Nombre (ex: 2, 3…)"
                value={c4Precision}
                onChange={e => setC4Precision(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm
                           focus:outline-none focus:border-amber-400"
              />
            )}
          </div>

          {/* BOUTON GÉNÉRER */}
          <button
            onClick={handleGenerer}
            disabled={!canGenerate || loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl
                       hover:bg-indigo-700 transition-all disabled:opacity-40
                       disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Génération...' : '✨ Générer ma consigne'}
          </button>

          {/* RÉSULTAT */}
          {result && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200">
              <h2 className="font-bold text-gray-800 mb-4">📋 Consigne générée</h2>

              {/* Version élève */}
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-indigo-400 mb-2 uppercase tracking-wide">
                  Version élève
                </p>
                <p className="text-indigo-900 font-medium text-lg leading-relaxed">
                  {result.version_eleve}
                </p>
              </div>

              {/* Version structurée */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                  Version structurée (enseignant)
                </p>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">Commande :</span> {result.version_structuree.commande}</p>
                  <p><span className="font-medium">Cible :</span> {result.version_structuree.cible}</p>
                  <p><span className="font-medium">Chemin :</span> {result.version_structuree.chemin.join(' → ')}</p>
                  <p><span className="font-medium">Construction :</span> {result.version_structuree.construction}</p>
                </div>
              </div>

              {/* Version simplifiée */}
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">
                  Version simplifiée (différenciation)
                </p>
                <pre className="text-emerald-900 text-sm whitespace-pre-wrap font-sans">
                  {result.version_simplifiee}
                </pre>
              </div>

              {/* Copier */}
              <button
                onClick={() => navigator.clipboard.writeText(result.version_eleve)}
                className="mt-4 w-full border border-indigo-300 text-indigo-600
                           font-medium py-2 rounded-lg hover:bg-indigo-50 transition-all text-sm"
              >
                📋 Copier la consigne élève
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
