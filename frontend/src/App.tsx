import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Generateur from './pages/Generateur';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kit/:kitCode" element={<Generateur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
