import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import KitHome from './pages/KitHome';
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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b-2 border-indigo-50 shadow-md h-14"
      style={{ boxShadow: '0 2px 12px rgba(79,70,229,0.10)' }}
    >
      <div className="max-w-6xl mx-auto px-8 h-full flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-xl font-bold text-indigo-600 tracking-wide hover:text-indigo-700 transition-colors"
        >
          SORIA
        </button>
        <span className="text-sm text-gray-600 hidden sm:block">
          Système d'action guidée pour la classe
        </span>
        <div className="flex items-center gap-4">
          {!isHome && !isPublic && (
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
            >
              ← Retour
            </button>
          )}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">
                {user?.prenom || user?.firstName || user?.email}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="pt-14 min-h-screen bg-slate-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/kit/:kitCode" element={<ProtectedRoute><KitHome /></ProtectedRoute>} />
          <Route path="/kit/:kitCode/diagnostic" element={<ProtectedRoute><Diagnostic /></ProtectedRoute>} />
          <Route path="/kit/:kitCode/analyseur" element={<ProtectedRoute><Analyseur /></ProtectedRoute>} />
          <Route path="/kit/:kitCode/generateur" element={<ProtectedRoute><Generateur /></ProtectedRoute>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
