import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import KitHome from './pages/KitHome';
import Diagnostic from './pages/Diagnostic';
import Analyseur from './pages/Analyseur';
import Generateur from './pages/Generateur';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kit/:kitCode" element={<KitHome />} />
        <Route path="/kit/:kitCode/diagnostic" element={<Diagnostic />} />
        <Route path="/kit/:kitCode/analyseur" element={<Analyseur />} />
        <Route path="/kit/:kitCode/generateur" element={<Generateur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
