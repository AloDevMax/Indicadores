import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductiveUnitsByCompanyId } from '../utils/api';
import { ProductiveUnit, Company, Profile } from '../types';

interface CompanyUnitsPageProps {
  companies: Company[];
  users: Profile[];
  currentUser: Profile;
}

const CompanyUnitsPage: React.FC<CompanyUnitsPageProps> = ({ companies, users, currentUser }) => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [units, setUnits] = useState<ProductiveUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const company = companies.find(c => c.id === companyId);
  const visibleUsers = useMemo(() => {
    if (!companyId) return [];
    return users.filter((user) => user.company_id === companyId);
  }, [companyId, users]);

  useEffect(() => {
    if (!companyId) return;

    const loadUnits = async () => {
      try {
        setLoading(true);
        const data = await fetchProductiveUnitsByCompanyId(companyId);
        setUnits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar unidades');
      } finally {
        setLoading(false);
      }
    };

    loadUnits();
  }, [companyId]);

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Empresa não encontrada</h1>
        <button
          onClick={() => navigate('/empresas')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/empresas')}
        className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">{company.name}</h1>
      <h2 className="text-xl text-gray-600 mb-6">Unidades Produtivas</h2>
      {currentUser.role === 'admin' && currentUser.company_id === companyId && (
        <p className="text-sm text-gray-500 mb-6">Visão restrita aos colaboradores e unidades da sua empresa.</p>
      )}

      {loading && <p className="text-gray-600">Carregando unidades...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && units.length === 0 && (
        <p className="text-gray-600">Nenhuma unidade produtiva encontrada para esta empresa.</p>
      )}

      {!loading && units.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <div key={unit.id} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{unit.name}</h3>
              <p className="text-sm text-gray-600">ID: {unit.id}</p>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-xs font-bold uppercase text-gray-400 mb-3">Colaboradores da unidade</p>
                <div className="space-y-2">
                  {visibleUsers
                    .filter((user) => user.productive_unit_id === unit.id)
                    .map((user) => (
                      <div key={user.id} className="rounded-md bg-gray-50 px-3 py-2">
                        <div className="text-sm font-semibold text-gray-800">{user.full_name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    ))}
                  {visibleUsers.filter((user) => user.productive_unit_id === unit.id).length === 0 && (
                    <p className="text-sm text-gray-500">Nenhum colaborador visível nesta unidade.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyUnitsPage;
