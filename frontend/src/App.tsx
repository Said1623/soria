import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import KitHome from './pages/KitHome';
import Diagnostic from './pages/Diagnostic';
import Analyseur from './pages/Analyseur';
import Generateur from './pages/Generateur';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

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
        <span className="text-xs text-gray-400 hidden sm:block">
          Système d'action guidée pour la classe
        </span>
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            ← Retour
          </button>
        )}
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="pt-14 min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kit/:kitCode" element={<KitHome />} />
          <Route path="/kit/:kitCode/diagnostic" element={<Diagnostic />} />
          <Route path="/kit/:kitCode/analyseur" element={<Analyseur />} />
          <Route path="/kit/:kitCode/generateur" element={<Generateur />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;