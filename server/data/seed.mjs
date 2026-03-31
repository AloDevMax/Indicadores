export const seedData = {
  badges: [
    {
      id: '1',
      name: 'Mestre de Processos',
      description: 'Documentou 10 processos sem erros',
      icon_name: '📋',
      category: 'Qualidade',
      points: 50,
    },
    {
      id: '2',
      name: 'Segurança em Primeiro Lugar',
      description: 'Zero incidentes por 30 dias consecutivos',
      icon_name: '🦺',
      category: 'Segurança',
      points: 30,
    },
    {
      id: '3',
      name: 'Ninja da Eficiência',
      description: 'Reduziu desperdícios em 15% na produção',
      icon_name: '🥷',
      category: 'Eficiência',
      points: 40,
    },
    {
      id: '4',
      name: 'Herói do Cliente',
      description: 'Recebeu 5 feedbacks positivos de clientes',
      icon_name: '🦸',
      category: 'Serviço',
      points: 20,
    },
  ],
  companies: [
    { id: 'c1', name: 'Acme Corp' },
    { id: 'c2', name: 'Builders Ltda' },
  ],
  productiveUnits: [
    { id: 'pu1', name: 'Fábrica Campinas', company_id: 'c1' },
    { id: 'pu2', name: 'Centro de Distribuição SP', company_id: 'c1' },
    { id: 'pu3', name: 'Obra Matriz', company_id: 'c2' },
  ],
  badgeLegends: {
    bronze: 'Bronze: 1 selo no mês',
    silver: 'Prata: 2 selos no mês',
    gold: 'Ouro: 3 selos ou mais no mês',
    loss_1: 'Vermelho: perda de 1 selo',
    loss_2: 'Vermelho intenso: perda de 2 selos',
  },
  importSources: [
    {
      id: 'source-default',
      name: 'Planilha Operacional',
      description: 'Modelo base para importar empresa, unidade, colaborador e selo.',
      columns: {
        company: 'empresa',
        productive_unit: 'unidade_produtiva',
        user: 'explorador',
        badge: 'selo',
        tone: 'marcacao',
        award: 'premio',
      },
    },
  ],
};
