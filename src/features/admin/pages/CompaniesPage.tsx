import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/shared/types';

interface CompaniesPageProps {
  companies: Company[];
}

const CompaniesPage: React.FC<CompaniesPageProps> = ({ companies }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Empresas</h1>
      
      {companies.length === 0 ? (
        <p className="text-gray-600">Nenhuma empresa cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => navigate(`/empresas/${company.id}`)}
              className="border border-gray-300 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:border-blue-500 transition"
            >
              {company.logo_url && (
                <img src={company.logo_url} alt={company.name} className="h-16 w-16 object-cover rounded mb-4" />
              )}
              <h2 className="text-lg font-semibold text-gray-800">{company.name}</h2>
              <p className="text-sm text-blue-600 mt-3">Ver unidades →</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;

