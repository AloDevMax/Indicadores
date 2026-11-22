import * as XLSX from 'xlsx';
import { describe, expect, it } from 'vitest';
import { EXCEL_COLUMN_TO_BADGE_ID, parseMonthlyWorkbook } from './monthlyWorkbook';

const NPS = EXCEL_COLUMN_TO_BADGE_ID['nps'];
const RECOLETAS = EXCEL_COLUMN_TO_BADGE_ID['recoletas'];

const workbookBytes = (sheets: Record<string, unknown[][]>): Uint8Array => {
  const workbook = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), name);
  }
  return new Uint8Array(XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }));
};

const OCTOBER = 10;

describe('parseMonthlyWorkbook', () => {
  it('lê as linhas abaixo do cabeçalho, mesmo com títulos acima dele', () => {
    const data = workbookBytes({
      OUTUBRO: [
        ['Indicadores do mês'],
        [],
        ['Nome do Colaborador', 'NPS'],
        ['Ana Souza', 3],
        ['Bruno Lima', 1],
      ],
    });

    expect(parseMonthlyWorkbook(data, OCTOBER)).toEqual({
      ok: true,
      rows: [
        { excelName: 'Ana Souza', indicators: { [NPS]: 3 } },
        { excelName: 'Bruno Lima', indicators: { [NPS]: 1 } },
      ],
      badgeIds: [NPS],
    });
  });

  it('encontra a aba do mês pelo prefixo de três letras', () => {
    const data = workbookBytes({ Out: [['Nome', 'NPS'], ['Ana Souza', 2]] });

    expect(parseMonthlyWorkbook(data, OCTOBER)).toMatchObject({ ok: true, rows: [{ excelName: 'Ana Souza' }] });
  });

  it('avisa quando a aba do mês não existe, listando as abas', () => {
    const data = workbookBytes({ JANEIRO: [['Nome', 'NPS'], ['Ana Souza', 2]] });

    expect(parseMonthlyWorkbook(data, OCTOBER)).toEqual({
      ok: false,
      error: 'Aba "OUTUBRO" não encontrada no arquivo. Abas disponíveis: JANEIRO',
    });
  });

  it('avisa quando não acha a linha de cabeçalho', () => {
    const data = workbookBytes({ OUTUBRO: [['Colaborador', 'Pontos'], ['Ana Souza', 2]] });

    expect(parseMonthlyWorkbook(data, OCTOBER)).toEqual({
      ok: false,
      error: 'Não foi possível identificar a linha de cabeçalho. Verifique se a planilha contém uma coluna "Nome do Colaborador" e colunas de indicadores como NPS, Recoletas, etc.',
    });
  });

  it('ignora linhas de total e valores zero, vazios ou não numéricos', () => {
    const data = workbookBytes({
      OUTUBRO: [
        ['Nome do Colaborador', 'NPS', 'Recoletas'],
        ['Ana Souza', 0, 'abc'],
        ['Bruno Lima', null, -1],
        ['Total', 5, 5],
        ['TOTAL GERAL', 9, 9],
      ],
    });

    expect(parseMonthlyWorkbook(data, OCTOBER)).toEqual({
      ok: true,
      rows: [{ excelName: 'Bruno Lima', indicators: { [RECOLETAS]: -1 } }],
      badgeIds: [NPS, RECOLETAS],
    });
  });

  it('avisa quando não há nenhuma linha de dados depois do cabeçalho', () => {
    const data = workbookBytes({ OUTUBRO: [['Nome do Colaborador', 'NPS']] });

    expect(parseMonthlyWorkbook(data, OCTOBER)).toEqual({
      ok: false,
      error: 'Nenhuma linha de dados encontrada após o cabeçalho.',
    });
  });
});
