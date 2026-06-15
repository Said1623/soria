import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { kitsApi, kitFichesApi } from '../api';

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

function parseMarkdown(md: string): string {
  const lines = md.split('\n');
  const parts: string[] = [];
  let inUl = false;
  let inOl = false;

  const bold = (s: string) => s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  for (const line of lines) {
    const isUL = /^- /.test(line);
    const isOL = /^\d+\. /.test(line);

    if (!isUL && inUl) { parts.push('</ul>'); inUl = false; }
    if (!isOL && inOl) { parts.push('</ol>'); inOl = false; }

    if (isUL) {
      if (!inUl) { parts.push('<ul>'); inUl = true; }
      parts.push(`<li>${bold(line.replace(/^- /, ''))}</li>`);
    } else if (isOL) {
      if (!inOl) { parts.push('<ol>'); inOl = true; }
      parts.push(`<li>${bold(line.replace(/^\d+\. /, ''))}</li>`);
    } else if (line.startsWith('## ')) {
      parts.push(`<h3>${bold(line.slice(3))}</h3>`);
    } else if (line.startsWith('### ')) {
      parts.push(`<h4>${bold(line.slice(4))}</h4>`);
    } else if (line.trim() !== '') {
      parts.push(`<p>${bold(line)}</p>`);
    }
  }

  if (inUl) parts.push('</ul>');
  if (inOl) parts.push('</ol>');

  return parts.join('');
}

export default function KitHome() {
  const { kitCode } = useParams<{ kitCode: string }>();
  const navigate = useNavigate();
  const [kit, setKit] = useState<any>(null);
  const [fiche, setFiche] = useState<any>(null);

  useEffect(() => {
    if (!kitCode) return;
    kitsApi.getByCode(kitCode).then(setKit);
  }, [kitCode]);

  useEffect(() => {
    if (!kit?.id) return;
    kitFichesApi.getNiveau(kit.id, 1)
      .then((fiches: any[]) => setFiche(fiches?.[0] ?? null))
      .catch(() => setFiche(null));
  }, [kit?.id]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1 mb-8"
      >
        ← Retour
      </button>

      <div className="mb-10">
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest block mb-2">Kit</span>
        <h1 className="text-2xl font-semibold text-stone-800">
          {kit?.nom || kitCode}
        </h1>
        {kit?.sous_titre && (
          <p className="text-sm text-stone-500 mt-1">{kit.sous_titre}</p>
        )}
      </div>

      {fiche && (
        <div className="mb-10 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
              📄 Fiche de survie
            </span>
          </div>

          <h2 className="text-base font-semibold text-stone-800 mb-4">{fiche.titre}</h2>

          <div
            className="text-sm text-stone-600 leading-relaxed
              [&_h3]:font-semibold [&_h3]:text-stone-800 [&_h3]:text-sm [&_h3]:mt-4 [&_h3]:mb-1.5
              [&_h4]:font-medium [&_h4]:text-stone-500 [&_h4]:text-xs [&_h4]:uppercase [&_h4]:tracking-wider [&_h4]:mt-3 [&_h4]:mb-1
              [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1.5 [&_ul]:space-y-0.5
              [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1.5 [&_ol]:space-y-0.5
              [&_li]:text-stone-600
              [&_p]:text-stone-500 [&_p]:text-xs [&_p]:mt-1
              [&_strong]:font-semibold [&_strong]:text-stone-700"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(fiche.contenu) }}
          />

          <div className="mt-5 pt-4 border-t border-indigo-100">
            <button
              disabled
              className="text-xs text-indigo-300 flex items-center gap-1 cursor-not-allowed"
            >
              Guide complet →
            </button>
          </div>
        </div>
      )}

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
