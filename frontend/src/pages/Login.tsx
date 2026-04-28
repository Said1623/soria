import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PEDAGOSPHERE_URL = 'https://pedagov2-backend.onrender.com/api/auth/login';
const SORIA_URL        = 'https://soria-s3uo.onrender.com/api/auth/login';

export default function Login() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const store = (token: string, user: object) => {
    localStorage.setItem('soria_token', token);
    localStorage.setItem('soria_user', JSON.stringify(user));
    navigate('/');
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Étape 1 — Pédagogsphère
      const res1 = await fetch(PEDAGOSPHERE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password }),
      });

      if (res1.ok) {
        const data = await res1.json();
        if (['teacher', 'super_admin'].includes(data.enseignant?.role)) {
          store(data.access_token, data.enseignant);
          return;
        }
        // Connecté sur Pédagogsphère mais rôle non autorisé
        setError('Accès réservé aux enseignants');
        return;
      }

      // Étape 2 — SORIA local
      const res2 = await fetch(SORIA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res2.ok) {
        const data = await res2.json();
        store(data.access_token, data.user);
        return;
      }

      setError('Email ou mot de passe incorrect');
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">SORIA</h1>
          <p className="text-sm text-gray-500">Système d'action guidée pour la classe</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="votre@email.fr"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm
                           focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg
                         hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
