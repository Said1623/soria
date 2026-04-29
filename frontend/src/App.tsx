import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import KitHome from './pages/KitHome';
import DomaineHome from './pages/DomaineHome';
import Diagnostic from './pages/Diagnostic';
import Analyseur from './pages/Analyseur';
import Generateur from './pages/Generateur';
import Login from './pages/Login';
import Inscription from './pages/Inscription';
import { useAuth } from './hooks/useAuth';

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
      <Routes>
        {/* Pages publiques sans sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* Pages avec sidebar (Layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/domaine/:code" element={<DomaineHome />} />
          <Route path="/kit/:kitCode" element={<KitHome />} />
          <Route path="/kit/:kitCode/diagnostic" element={<ProtectedRoute><Diagnostic /></ProtectedRoute>} />
          <Route path="/kit/:kitCode/analyseur" element={<ProtectedRoute><Analyseur /></ProtectedRoute>} />
          <Route path="/kit/:kitCode/generateur" element={<ProtectedRoute><Generateur /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
