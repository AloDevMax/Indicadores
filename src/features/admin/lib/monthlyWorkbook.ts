import * as XLSX from 'xlsx';
import type { IndicatorRow } from '@/shared/types';

export const MONTH_NAMES_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Teto do arquivo lido no navegador: planilhas maiores travam a aba antes de qualquer validação.
export const MAX_WORKBOOK_BYTES = 10 * 1024 * 1024;

// Maps normalized Excel column header keywords → badge ID (more specific keys must come first)
export const EXCEL_COLUMN_TO_BADGE_ID: Record<string, string> = {
  'vol nps': 'ind-vol-nps',
  'volume nps': 'ind-vol-nps',
  'qtd nps': 'ind-vol-nps',
  'quantidade nps': 'ind-vol-nps',
  'avaliacoes nps': 'ind-vol-nps',
  'avaliacao nps': 'ind-vol-nps',
  'qtd. avaliacao': 'ind-vol-nps',
  'nps': 'ind-nps',
  'recoleta': 'ind-recoletas',
  'recoletas': 'ind-recoletas',
  '5s': 'ind-5s',
  'auditoria': 'ind-5s',
  'leitura': 'ind-docs',
  'documento': 'ind-docs',
  'documentos': 'ind-docs',
  'nc': 'ind-nc',
  'nao conformidade': 'ind-nc',
  'nao conformidades': 'ind-nc',
  'nao conformid': 'ind-nc',
  'ponto': 'ind-ponto',
  'ajuste de ponto': 'ind-ponto',
  'assiduidade': 'ind-ponto',
  'absenteismo': 'ind-ponto',
  'iapp': 'ind-iapp',
  'curso': 'ind-curso',
  'cursos': 'ind-curso',
  'aceleradoras': 'ind-aceleradoras',
  'atitudes': 'ind-aceleradoras',
  'faturamento': 'ind-faturamento',
  'guia': 'ind-faturamento',
  'advertencia': 'ind-advertencia',
  'advertencias': 'ind-advertencia',
  'reincidente': 'ind-reincidente',
  'criterio reincidente': 'ind-reincidente',
};

export const normalizeStr = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

export type MonthlyWorkbookResult =
  | { ok: true; rows: IndicatorRow[]; badgeIds: string[] }
  | { ok: false; error: string };

/** Lê a aba do mês (1–12) e devolve uma linha por colaborador com os indicadores diferentes de zero. */
export const parseMonthlyWorkbook = (data: Uint8Array, month: number): MonthlyWorkbookResult => {
  const workbook = XLSX.read(data, { type: 'array' });

  const targetSheetName = normalizeStr(MONTH_NAMES_PT[month - 1]);
  const matchedSheet = workbook.SheetNames.find(
    n => normalizeStr(n) === targetSheetName || normalizeStr(n).startsWith(targetSheetName.slice(0, 3)),
  );

  if (!matchedSheet) {
    return { ok: false, error: `Aba "${MONTH_NAMES_PT[month - 1].toUpperCase()}" não encontrada no arquivo. Abas disponíveis: ${workbook.SheetNames.join(', ')}` };
  }

  const ws = workbook.Sheets[matchedSheet];
  const rawRows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  // Find header row — search up to 20 rows for a row containing "nome" and at least 1 indicator keyword
  let headerRowIndex = -1;
  let nameColIndex = -1;
  const columnBadgeIds: (string | null)[] = [];

  for (let ri = 0; ri < Math.min(rawRows.length, 20); ri++) {
    const row = rawRows[ri] as unknown[];
    let nameIdx = -1;
    const candidate: (string | null)[] = row.map((cell, ci) => {
      if (!cell) return null;
      const normalized = normalizeStr(String(cell));
      if (normalized.includes('nome') && nameIdx === -1) { nameIdx = ci; return null; }
      for (const [key, badgeId] of Object.entries(EXCEL_COLUMN_TO_BADGE_ID)) {
        if (normalized.includes(key)) return badgeId;
      }
      return null;
    });
    const hits = candidate.filter(Boolean).length;
    if (nameIdx !== -1 && hits >= 1) {
      headerRowIndex = ri;
      nameColIndex = nameIdx;
      columnBadgeIds.push(...candidate);
      break;
    }
  }

  if (headerRowIndex === -1) {
    return { ok: false, error: 'Não foi possível identificar a linha de cabeçalho. Verifique se a planilha contém uma coluna "Nome do Colaborador" e colunas de indicadores como NPS, Recoletas, etc.' };
  }

  const badgeIds = [...new Set(columnBadgeIds.filter(Boolean) as string[])];

  const dataRows: IndicatorRow[] = [];
  for (let ri = headerRowIndex + 1; ri < rawRows.length; ri++) {
    const row = rawRows[ri] as unknown[];
    const nameCell = row[nameColIndex];
    if (!nameCell || typeof nameCell !== 'string') continue;
    const name = nameCell.trim();
    if (!name || normalizeStr(name) === 'total' || normalizeStr(name).startsWith('total')) continue;

    const indicators: Record<string, number> = {};
    columnBadgeIds.forEach((badgeId, colIdx) => {
      if (!badgeId) return;
      const val = row[colIdx];
      const num = val !== null && val !== undefined ? Number(val) : 0;
      if (!isNaN(num) && num !== 0) {
        indicators[badgeId] = num;
      }
    });

    if (Object.keys(indicators).length > 0) {
      dataRows.push({ excelName: name, indicators });
    }
  }

  if (dataRows.length === 0) {
    return { ok: false, error: 'Nenhuma linha de dados encontrada após o cabeçalho.' };
  }

  return { ok: true, rows: dataRows, badgeIds };
};
