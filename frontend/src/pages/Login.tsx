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
    const redirect = localStorage.getItem('soria_redirect');
    if (redirect) {
      localStorage.removeItem('soria_redirect');
      navigate(redirect);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Étape 1 — Pédagosphère
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
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-700 mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-1">SORIA</h1>
          <p className="text-sm text-stone-500">Système d'action guidée pour la classe</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          <h2 className="text-base font-semibold text-stone-800 mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="votre@email.fr"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                           bg-stone-50 placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                           bg-stone-50 placeholder:text-stone-400"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-700 text-white font-semibold py-2.5 rounded-xl
                         hover:bg-violet-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
