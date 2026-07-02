import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductiveUnitsWithApi } from '@/shared/api';
import { ProductiveUnit, Profile } from '@/shared/types';

interface UnitsPageProps {
  users?: Profile[];
}

const UnitsPage: React.FC<UnitsPageProps> = ({ users = [] }) => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<ProductiveUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductiveUnitsWithApi()
      .then(setUnits)
      .catch(err => setError(err instanceof Error ? err.message : 'Erro ao buscar unidades'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/admin')}
        className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Unidades Produtivas</h1>

      {loading && <p className="text-gray-600">Carregando unidades...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && units.length === 0 && (
        <p className="text-gray-600">Nenhuma unidade produtiva encontrada.</p>
      )}

      {!loading && units.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => {
            const unitUsers = users.filter(user => user.productive_unit_id === unit.id);
            return (
              <div key={unit.id} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{unit.name}</h3>
                <p className="text-sm text-gray-600">ID: {unit.id}</p>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-xs font-bold uppercase text-gray-400 mb-3">Colaboradores da unidade</p>
                  <div className="space-y-2">
                    {unitUsers.length > 0 ? (
                      unitUsers.map(user => (
                        <div key={user.id} className="rounded-md bg-gray-50 px-3 py-2">
                          <div className="text-sm font-semibold text-gray-800">{user.full_name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum colaborador nesta unidade.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UnitsPage;
