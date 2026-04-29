import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SsoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const code = searchParams.get('code');

    if (!token) {
      setError('Token manquant.');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Format invalide');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      localStorage.setItem('soria_token', token);
      localStorage.setItem('soria_user', JSON.stringify({
        id:    payload.sub ?? payload.id,
        email: payload.email,
        nom:   payload.nom,
        prenom: payload.prenom,
        role:  payload.role,
      }));

      if (code) {
        localStorage.setItem('soria_code_prescription', code);
      }

      navigate('/', { replace: true });
    } catch {
      setError('Token invalide ou expiré.');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="text-base font-semibold text-stone-800 mb-2">Connexion impossible</h2>
            <p className="text-sm text-stone-500 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-violet-700 text-white font-semibold py-2.5 rounded-xl hover:bg-violet-800 transition-colors"
            >
              Se connecter manuellement
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-violet-200 animate-pulse" />
        <span className="text-sm text-stone-500">Connexion en cours…</span>
      </div>
    </div>
  );
}
