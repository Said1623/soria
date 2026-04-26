import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { domainesApi } from '../api';

export default function Home() {
  const [kits, setKits] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    domainesApi.getKits('CONSIGNES').then(setKits);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">SORIA</h1>
        <p className="text-gray-500 mb-8">Système d'action guidée pour la classe</p>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📋 Consignes
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {kits.map(kit => (
            <div
              key={kit.code}
              onClick={() => navigate(`/kit/${kit.code}`)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100
                         cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-bold text-indigo-600">{kit.nom}</h3>
              <p className="text-sm text-gray-500 mt-1">{kit.sous_titre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
