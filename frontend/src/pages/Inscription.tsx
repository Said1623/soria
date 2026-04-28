import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { invitationsApi } from '../api';

type Verification = { valid: boolean; email?: string; reason?: string };

export default function Inscription() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [verification, setVerification] = useState<Verification | null>(null);
  const [loadingVerif, setLoadingVerif] = useState(true);

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerification({ valid: false, reason: 'Token manquant dans l\'URL' });
      setLoadingVerif(false);
      return;
    }
    invitationsApi.verify(token)
      .then(data => setVerification(data))
      .catch(() => setVerification({ valid: false, reason: 'Lien invalide' }))
      .finally(() => setLoadingVerif(false));
  }, [token]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const data = await invitationsApi.accept(token, nom, prenom, password);
      localStorage.setItem('soria_token', data.access_token);
      localStorage.setItem('soria_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingVerif) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-indigo-200 animate-pulse" />
          <span className="text-sm text-gray-600">Vérification du lien...</span>
        </div>
      </div>
    );
  }

  if (!verification?.valid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-indigo-600 mb-2">SORIA</h1>
          <div className="bg-white rounded-xl border border-red-100 shadow-sm p-8 mt-6">
            <div className="text-4xl mb-4">🔗</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Lien invalide</h2>
            <p className="text-sm text-gray-600">{verification?.reason || 'Ce lien d\'invitation n\'est pas valide.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">SORIA</h1>
          <p className="text-sm text-gray-500">Créer votre compte</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Inscription</h2>
            <p className="text-sm text-gray-500">
              Compte pour <span className="font-medium text-gray-700">{verification.email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={e => setPrenom(e.target.value)}
                  required
                  autoFocus
                  placeholder="Marie"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  required
                  placeholder="Dupont"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="8 caractères minimum"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm
                           focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm
                           focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg
                         hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
