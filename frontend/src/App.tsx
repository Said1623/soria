import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import KitHome from './pages/KitHome';
import DomaineHome from './pages/DomaineHome';
import Diagnostic from './pages/Diagnostic';
import Analyseur from './pages/Analyseur';
import Generateur from './pages/Generateur';
import Login from './pages/Login';
import Inscription from './pages/Inscription';
import { useAuth } from './hooks/useAuth';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const isHome = location.pathname === '/';
  const isPublic = ['/login', '/inscription'].some(p => location.pathname.startsWith(p));

  const initials = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || '?';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-100 h-16">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-700 flex items-center justify-center flex-shrink-0
                          group-hover:bg-violet-800 transition-colors">
            <span className="text-white font-bold text-sm leading-none">S</span>
          </div>
          <span className="text-sm font-semibold text-stone-700 hidden sm:block tracking-wide">
            SORIA
          </span>
        </button>

        <div className="flex items-center gap-4">
          {!isHome && !isPublic && (
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-1"
            >
              ← Retour
            </button>
          )}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors"
              >
                Déconnexion
              </button>
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-700 text-xs font-bold">{initials}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-700 mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
            <div className="text-3xl mb-3">🔒</div>
            <h2 className="text-base font-semibold text-stone-800 mb-2">Accès restreint</h2>
            <p className="text-sm text-stone-500 mb-6">
              Connectez-vous pour accéder à cet outil.
            </p>
            <button
              onClick={() => {
                localStorage.setItem('soria_redirect', location.pathname);
                navigate('/login');
              }}
              className="w-full bg-violet-700 text-white font-semibold py-2.5 rounded-xl
                         hover:bg-violet-800 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="pt-16 min-h-screen bg-stone-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/domaine/:code" element={<DomaineHome />} />
          <Route path="/kit/:kitCode" element={<KitHome />} />
          <Route path="/kit/:kitCode/diagnostic" element={<ProtectedRoute><Diagnostic /></ProtectedRoute>} />
          <Route path="/kit/:kitCode/analyseur" element={<ProtectedRoute><Analyseur /></ProtectedRoute>} />
          <Route path="/kit/:kitCode/generateur" element={<ProtectedRoute><Generateur /></ProtectedRoute>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
