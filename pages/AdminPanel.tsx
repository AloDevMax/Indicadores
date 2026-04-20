
import React, { useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Badge, Profile, Company, ProductiveUnit, BadgeSubmission, UserBadge, BadgeLegendSettings, BadgeTone, ImportSourceConfig, ImportSourceField, ImportBindingSnapshot } from '../types';
import BadgeCard from '../components/BadgeCard';
import { ImageUpload } from '../components/ImageUpload';
import { BADGE_TONE_LABELS, getUserMonthlyBadgeMetrics } from '../utils/badgeMetrics';
import { cn } from '../utils/cn';

const IMPORT_FIELD_ALIASES: Record<ImportSourceField, string[]> = {
  company: ['empresa', 'companhia', 'organizacao', 'organização', 'company'],
  productive_unit: ['unidade_produtiva', 'unidade produtiva', 'unidade', 'setor', 'area', 'área', 'productive_unit'],
  user: ['explorador', 'colaborador', 'funcionario', 'funcionário', 'nome', 'usuario', 'usuário', 'user'],
  badge: ['selo', 'badge', 'conquista'],
  tone: ['marcacao', 'marcação', 'cor', 'tone', 'faixa'],
  award: ['premio', 'prêmio', 'autorizar', 'autorizacao', 'autorização', 'award'],
};

const IMPORT_FIELD_LABELS: Record<ImportSourceField, string> = {
  company: 'Empresa',
  productive_unit: 'Unidade produtiva',
  user: 'Colaborador',
  badge: 'Selo',
  tone: 'Marcação',
  award: 'Autorização',
};

const COMPANY_CATEGORIES = ['Indústria', 'Serviços', 'Logística', 'Construção', 'Varejo', 'Outros'];

interface AdminPanelProps {
  currentUser: Profile;
  activeMode: 'management' | 'personal';
  setActiveMode: (_mode: 'management' | 'personal') => void;
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  productiveUnits: ProductiveUnit[];
  setProductiveUnits: React.Dispatch<React.SetStateAction<ProductiveUnit[]>>;
  badgeLegends: BadgeLegendSettings;
  setBadgeLegends: React.Dispatch<React.SetStateAction<BadgeLegendSettings>>;
  importSources: ImportSourceConfig[];
  setImportSources: React.Dispatch<React.SetStateAction<ImportSourceConfig[]>>;
  setImportBindingSnapshot: React.Dispatch<React.SetStateAction<ImportBindingSnapshot | null>>;
  users: Profile[];
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>;
  userBadges: UserBadge[];
  setUserBadges: React.Dispatch<React.SetStateAction<UserBadge[]>>;
  submissions: BadgeSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<BadgeSubmission[]>>;
  onSaveBadge?: (_badge: Badge) => Promise<Badge>;
  onDeleteBadge?: (_badgeId: string) => Promise<void>;
  onSaveCompany?: (_company: Company) => Promise<Company>;
  onDeleteCompany?: (_companyId: string) => Promise<void>;
  onSaveProductiveUnit?: (_productiveUnit: ProductiveUnit) => Promise<ProductiveUnit>;
  onSaveUser?: (_user: Profile, _password?: string) => Promise<Profile>;
  onBulkInviteUsers?: (_emails: string[], _companyId?: string, _productiveUnitId?: string) => Promise<{ createdUsers: Profile[]; skippedEmails: string[] }>;
  onDeleteUser?: (_userId: string) => Promise<void>;
  onSaveImportSource?: (_importSource: ImportSourceConfig) => Promise<ImportSourceConfig>;
  onAwardBadges?: (_userIds: string[], _badgeId: string, _tone: BadgeTone) => Promise<void>;
  onRemoveUserBadge?: (_userId: string, _badgeId: string) => Promise<void>;
  onPersistImport?: (
    _sourceId: string,
    _sourceName: string,
    _matchedColumns: Partial<Record<string, string>>,
    _rows: Array<{ row: Record<string, string>; user_id?: string; badge_id?: string; tone: BadgeTone; status: 'valid' | 'invalid'; reason?: string }>,
  ) => Promise<number>;
  onReviewSubmission?: (_submissionId: string, _status: 'approved' | 'rejected') => Promise<void>;
  onOpenSolicitation?: () => void;
}

interface ImportPreviewBadge {
  columnName: string;
  badgeName: string;
  badgeValue: number;
  badge?: Badge;
}

interface ImportPreview {
  row: Record<string, string>;
  userName: string;
  companyId?: string;
  companyName: string;
  productiveUnitId?: string;
  productiveUnitName: string;
  user?: Profile;
  company?: Company;
  productiveUnit?: ProductiveUnit;
  badges: ImportPreviewBadge[];
  badgeValues?: Record<string, number>;
  numericMeta?: Record<string, number>;
  textMeta?: Record<string, string>;
  tone: BadgeTone;
  sourceName: string;
  matchedColumns: Partial<Record<ImportSourceField, string>>;
  status: 'valid' | 'invalid';
  reason?: string;
}

type ExcelSheetRow = unknown[];
type ExcelRow = Record<string, unknown>;

interface ParsedExcelData {
  rawRows: ExcelSheetRow[];
  headerRowIndex: number;
  headers: string[];
  rows: ExcelRow[];
}

interface ProcessedExcelData {
  previews: ImportPreview[];
  importedBadges: UserBadge[];
  summary: {
    processed: number;
    success: number;
    failed: number;
  };
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentUser,
  activeMode, 
  setActiveMode,
  badges,
  setBadges,
  companies,
  setCompanies,
  productiveUnits,
  setProductiveUnits,
  badgeLegends,
  setBadgeLegends,
  importSources,
  setImportSources,
  setImportBindingSnapshot,
  users,
  setUsers,
  userBadges,
  setUserBadges,
  submissions,
  setSubmissions,
  onSaveBadge,
  onDeleteBadge,
  onSaveCompany,
  onDeleteCompany,
  onSaveProductiveUnit,
  onSaveUser,
  onBulkInviteUsers,
  onDeleteUser,
  onSaveImportSource,
  onAwardBadges,
  onRemoveUserBadge,
  onPersistImport,
  onReviewSubmission,
  onOpenSolicitation
}) => {
  const location = useLocation();
  const isDeveloper = currentUser.role === 'developer';
  const canManageGlobalCatalog = isDeveloper;
  const canConfigureImportSource = isDeveloper;
  const allowedViews = isDeveloper
    ? new Set(['overview', 'submissions', 'users', 'award', 'badges', 'companies'])
    : new Set(['overview', 'submissions', 'users', 'award', 'companies']);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const view = useMemo(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin' || !path) return 'overview';
    return allowedViews.has(path)
      ? path as 'overview' | 'submissions' | 'users' | 'award' | 'badges' | 'companies'
      : 'overview';
  }, [allowedViews, location.pathname]);

  // UI State
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedAwardBadge, setSelectedAwardBadge] = useState<string>('');
  const [selectedAwardTone, setSelectedAwardTone] = useState<BadgeTone>('bronze');
  
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isDeleteBadgeModalOpen, setIsDeleteBadgeModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [badgeToDelete, setBadgeToDelete] = useState<Badge | null>(null);

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isDeleteCompanyModalOpen, setIsDeleteCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isProductiveUnitModalOpen, setIsProductiveUnitModalOpen] = useState(false);
  const [editingProductiveUnit, setEditingProductiveUnit] = useState<ProductiveUnit | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setIsBulkInviteModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [sendEmailOnAward, setSendEmailOnAward] = useState(false);

  const sendEmailNotification = (to: string, subject: string, message: string) => {
    /* no mock local, log + toast */
    console.log('ENVIANDO EMAIL PARA', to, subject, message);
    // Em backend real, chamar API de envio de e-mail aqui.
    return true;
  };

  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [isAwardingBadges, setIsAwardingBadges] = useState(false);

  const [bulkInviteEmails, setBulkInviteEmails] = useState('');
  const [bulkInviteCompanyId, setBulkInviteCompanyId] = useState('');
  const [bulkInviteProductiveUnitId, setBulkInviteProductiveUnitId] = useState('');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportMappingModalOpen, setIsImportMappingModalOpen] = useState(false);
  const [isImportSourceModalOpen, setIsImportSourceModalOpen] = useState(false);
  const [viewingUserBadges, setViewingUserBadges] = useState<Profile | null>(null);
  const [importPreviews, setImportPreviews] = useState<ImportPreview[]>([]);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(true);
  const [selectedImportSourceId, setSelectedImportSourceId] = useState<string>(importSources[0]?.id || '');
  const [editingImportSource, setEditingImportSource] = useState<ImportSourceConfig | null>(null);
  const [importSheetMatrix, setImportSheetMatrix] = useState<ExcelSheetRow[]>([]);
  const [importSheetRows, setImportSheetRows] = useState<Record<string, unknown>[]>([]);
  const [importSheetHeaders, setImportSheetHeaders] = useState<string[]>([]);
  const [importHeaderRowIndex, setImportHeaderRowIndex] = useState(0);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [assistedImportColumns, setAssistedImportColumns] = useState<Record<ImportSourceField, string>>({
    company: '',
    productive_unit: '',
    user: '',
    badge: '',
    tone: '',
    award: '',
  });
  const [assistedImportBadgeColumns, setAssistedImportBadgeColumns] = useState<string[]>([]);
  
  const [userSearch, setUserSearch] = useState('');

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('');
  const [selectedProductiveUnitFilter, setSelectedProductiveUnitFilter] = useState<string>('');

  // Image upload states
  const [tempBadgeImageUrl, setTempBadgeImageUrl] = useState<string | undefined>();
  const [tempCompanyLogoUrl, setTempCompanyLogoUrl] = useState<string | undefined>();
  const [tempUserAvatarUrl, setTempUserAvatarUrl] = useState<string | undefined>();

  // Helper functions to open modals and clear image states
  const openBadgeModal = (badge?: Badge) => {
    setEditingBadge(badge || null);
    setTempBadgeImageUrl(badge?.image_url);
    setIsBadgeModalOpen(true);
  };

  const closeBadgeModal = () => {
    setIsBadgeModalOpen(false);
    setEditingBadge(null);
    setTempBadgeImageUrl(undefined);
  };

  const openCompanyModal = (company?: Company) => {
    setEditingCompany(company || null);
    setTempCompanyLogoUrl(company?.logo_url);
    setIsCompanyModalOpen(true);
  };

  const closeCompanyModal = () => {
    setIsCompanyModalOpen(false);
    setEditingCompany(null);
    setTempCompanyLogoUrl(undefined);
  };

  const openUserModal = (user?: Profile) => {
    setEditingUser(user || null);
    setTempUserAvatarUrl(user?.avatar_url);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setTempUserAvatarUrl(undefined);
  };

  React.useEffect(() => {
    if (!selectedImportSourceId && importSources[0]) {
      setSelectedImportSourceId(importSources[0].id);
    }
  }, [importSources, selectedImportSourceId]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const adminProfile = users.find(u => u.role === 'admin' || u.role === 'developer') || users[0] || null;
  const safeAdminProfile: Profile = adminProfile || {
    id: 'admin-local',
    email: 'admin@local',
    full_name: 'Administrador',
    role: 'admin',
    level: 0,
    xp: 0,
    created_at: new Date().toISOString(),
    email_verified: true,
  };
  const categories = ['Qualidade', 'Segurança', 'Eficiência', 'Processos', 'Serviço'];
  const getUnitsByCompany = (companyId?: string) => productiveUnits.filter(unit => unit.company_id === companyId);
  const adminMonthlyMetrics = getUserMonthlyBadgeMetrics(safeAdminProfile.id, userBadges);
  const fallbackImportSource: ImportSourceConfig = {
    id: 'default-import-source',
    name: 'Fonte sem nome',
    description: 'Fonte padrão de importação',
    columns: {
      company: 'empresa',
      productive_unit: 'unidade_produtiva',
      user: 'explorador',
      badge: 'selo',
      tone: 'marcacao',
      award: 'premio',
    },
  };
  const activeImportSource = importSources.find(source => source.id === selectedImportSourceId) || importSources[0] || fallbackImportSource;

  const normalizeCell = (value: unknown) => value?.toString().trim() || '';
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const normalizeCompare = (value: unknown) => normalize(normalizeCell(value));
  const allHeaderAliases = Object.values(IMPORT_FIELD_ALIASES).flat();
  const badgeNegativeValues = new Set(['', '0', 'nao', 'não', 'n', 'false', '-', '--']);
  const positiveBadgeTokens = new Set(['1', 'x', '✓', '✔', 'true', 'sim', 's', 'ok']);

  const parseTone = (value: unknown): BadgeTone => {
    const normalized = normalizeCompare(value);
    if (normalized.includes('ouro') || normalized === 'gold') return 'gold';
    if (normalized.includes('prata') || normalized === 'silver') return 'silver';
    if (normalized.includes('bronze')) return 'bronze';
    if (normalized.includes('loss_2') || normalized.includes('perda 2') || normalized.includes('perda2') || normalized.includes('vermelho intenso')) return 'loss_2';
    if (normalized.includes('loss_1') || normalized.includes('perda 1') || normalized.includes('perda1') || normalized.includes('vermelho')) return 'loss_1';
    return 'bronze';
  };

  const findMatchingRowKey = (row: ExcelRow, candidates: string[]) => {
    const normalizedCandidates = candidates.map(normalizeCompare).filter(Boolean);
    return Object.keys(row).find((key) =>
      normalizedCandidates.some((candidate) => normalizeCompare(key) === candidate),
    );
  };

  const getFieldValue = (row: ExcelRow, field: ImportSourceField, source: ImportSourceConfig): string => {
    const columnName = source.columns[field];
    const candidates = [columnName, ...IMPORT_FIELD_ALIASES[field]].filter(Boolean);
    const matchedKey = findMatchingRowKey(row, candidates);
    return matchedKey ? normalizeCell(row[matchedKey]) : '';
  };

  const getMatchedColumnName = (row: ExcelRow, field: ImportSourceField, source: ImportSourceConfig) => {
    const columnName = source.columns[field];
    const candidates = [columnName, ...IMPORT_FIELD_ALIASES[field]].filter(Boolean);
    return findMatchingRowKey(row, candidates);
  };

  const renderSquareImage = (src: string, alt: string) => (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain p-2 bg-white"
    />
  );

  const suggestColumnForField = (headers: string[], field: ImportSourceField, source: ImportSourceConfig) => {
    const candidates = [source.columns[field], ...IMPORT_FIELD_ALIASES[field]].map(normalizeCompare);

    const exactMatch = headers.find(header => candidates.includes(normalizeCompare(header)));
    if (exactMatch) return exactMatch;

    const partialMatch = headers.find(header => candidates.some(candidate => normalizeCompare(header).includes(candidate) || candidate.includes(normalizeCompare(header))));
    return partialMatch || '';
  };

  const normalizeHeaderCells = (headers: ExcelSheetRow): Array<string | null> => {
    const usedHeaders = new Map<string, number>();

    return headers.map((headerCell, index) => {
      const rawHeader = normalizeCell(headerCell).replace(/^__EMPTY(?:_\d+)?$/i, '');
      if (!rawHeader) {
        return null;
      }

      const fallbackHeader = rawHeader || `Coluna ${index + 1}`;
      const occurrences = usedHeaders.get(normalizeCompare(fallbackHeader)) || 0;
      usedHeaders.set(normalizeCompare(fallbackHeader), occurrences + 1);

      return occurrences === 0 ? fallbackHeader : `${fallbackHeader} (${occurrences + 1})`;
    });
  };

  const normalizeHeaders = (headers: ExcelSheetRow): string[] => {
    return normalizeHeaderCells(headers).filter((header): header is string => Boolean(header));
  };

  const extractHeaders = (rows: ExcelSheetRow[]) => {
    const evaluateRowScore = (row: ExcelSheetRow) => {
      const values = row.map(normalizeCell).filter(Boolean);
      if (values.length === 0) return -1;

      const aliasMatches = values.filter((value) =>
        allHeaderAliases.some((alias) =>
          normalizeCompare(value) === normalizeCompare(alias) ||
          normalizeCompare(value).includes(normalizeCompare(alias)),
        ),
      ).length;
      const textualValues = values.filter((value) => /[a-zA-ZÀ-ÿ]/.test(value)).length;

      return aliasMatches * 5 + textualValues + (values.length >= 2 ? 2 : 0);
    };

    let bestRowIndex = rows.findIndex((row) => row.some((cell) => normalizeCell(cell)));
    let bestScore = bestRowIndex >= 0 ? evaluateRowScore(rows[bestRowIndex]) : -1;

    rows.slice(0, 10).forEach((row, index) => {
      const score = evaluateRowScore(row);
      if (score > bestScore) {
        bestScore = score;
        bestRowIndex = index;
      }
    });

    const headerRowIndex = bestRowIndex >= 0 ? bestRowIndex : 0;
    return {
      headerRowIndex,
      headers: normalizeHeaders(rows[headerRowIndex] || []),
    };
  };

  const buildExcelRows = (rawRows: ExcelSheetRow[], headerRowIndex: number): ExcelRow[] => {
    const headerRow = rawRows[headerRowIndex] || [];
    const normalizedHeaderNames = normalizeHeaderCells(headerRow);

    return rawRows
      .slice(headerRowIndex + 1)
      .map((row) => {
        const nextRowEntries = headerRow.reduce<Array<[string, unknown]>>((entries, _headerCell, columnIndex) => {
          const headerName = normalizedHeaderNames[columnIndex];
          if (!headerName) {
            return entries;
          }

          entries.push([headerName, row[columnIndex] ?? '']);
          return entries;
        }, []);

        return Object.fromEntries(nextRowEntries);
      })
      .filter((row) => Object.values(row).some((value) => normalizeCell(value)));
  };

  const getHeaderRowOptions = (rawRows: ExcelSheetRow[]) => (
    rawRows
      .map((row, index) => ({
        index,
        preview: row.map(normalizeCell).filter(Boolean).slice(0, 4).join(' | '),
      }))
      .filter((row) => row.preview)
      .slice(0, 12)
  );

  const isNegativeBadgeValue = (value: string) => badgeNegativeValues.has(normalizeCompare(value));

  const findBadgeByName = (value: string) => (
    badges.find((badge) => normalizeCompare(badge?.name || '') === normalizeCompare(value))
  );

  const classifyColumn = (header: string): 'badge' | 'numeric_meta' | 'text_meta' => {
    const normalizedHeader = normalizeCompare(header);

    if (
      normalizedHeader.includes('total') ||
      normalizedHeader.includes('bonificação') ||
      normalizedHeader.includes('bonificacao') ||
      normalizedHeader.includes('bonus')
    ) {
      return 'numeric_meta';
    }

    if (
      normalizedHeader.includes('observação') ||
      normalizedHeader.includes('observacao') ||
      normalizedHeader.includes('nota') ||
      normalizedHeader.includes('comentário') ||
      normalizedHeader.includes('comentario')
    ) {
      return 'text_meta';
    }

    return 'badge';
  };

  const getDefaultIndicatorColumns = (headers: string[], source: ImportSourceConfig) => {
    const fixedColumns = new Set(
      (['company', 'productive_unit', 'user', 'tone', 'award'] as ImportSourceField[])
        .map((field) => suggestColumnForField(headers, field, source))
        .filter(Boolean)
        .map(normalizeCompare),
    );

    return headers.filter((header) => !fixedColumns.has(normalizeCompare(header)) && classifyColumn(header) === 'badge');
  };

  const getSelectedBadgeColumns = (source: ImportSourceConfig) => {
    if (assistedImportBadgeColumns.length > 0) {
      return assistedImportBadgeColumns;
    }

    return getDefaultIndicatorColumns(importSheetHeaders, source);
  };

  const parseIndicatorValue = (value: unknown) => {
    const normalizedValue = normalizeCell(value);
    if (isNegativeBadgeValue(normalizedValue)) {
      return null;
    }

    if (positiveBadgeTokens.has(normalizeCompare(normalizedValue))) {
      return 1;
    }

    const numericValue = Number(normalizedValue.replace(',', '.'));
    if (Number.isFinite(numericValue) && numericValue > 0) {
      return numericValue;
    }

    return null;
  };

  const getBadgeCandidatesFromRow = (row: ExcelRow, source: ImportSourceConfig): ImportPreviewBadge[] => {
    const badgeColumns = getSelectedBadgeColumns(source);
    const resolvedBadges: ImportPreviewBadge[] = [];

    badgeColumns.forEach((selectedColumnName) => {
      const columnName = findMatchingRowKey(row, [selectedColumnName]) || selectedColumnName;
      const badgeValue = parseIndicatorValue(row[columnName]);

      if (badgeValue !== null) {
        resolvedBadges.push({
          columnName,
          badgeName: columnName,
          badgeValue,
          badge: findBadgeByName(columnName),
        });
      }
    });

    return resolvedBadges;
  };

  const getNumericMetaFromRow = (row: ExcelRow, source: ImportSourceConfig) => {
    return Object.fromEntries(
      Object.keys(row)
        .filter((header) => classifyColumn(header) === 'numeric_meta')
        .map((header) => [header, parseIndicatorValue(row[findMatchingRowKey(row, [header]) || header])])
        .filter((entry): entry is [string, number] => entry[1] !== null),
    );
  };

  const getTextMetaFromRow = (row: ExcelRow) => {
    return Object.fromEntries(
      Object.keys(row)
        .filter((header) => classifyColumn(header) === 'text_meta')
        .map((header) => [header, normalizeCell(row[header])])
        .filter((entry) => entry[1]),
    );
  };

  const parseExcel = (file: File): Promise<ParsedExcelData> => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binary = event.target?.result;
        const workbook = XLSX.read(binary, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = firstSheetName ? workbook.Sheets[firstSheetName] : undefined;
        if (!worksheet) {
          throw new Error('Nenhuma planilha encontrada no arquivo.');
        }
        const rawRows = XLSX.utils.sheet_to_json<ExcelSheetRow>(worksheet, { header: 1, defval: '' });
        const { headerRowIndex, headers } = extractHeaders(rawRows);
        const rows = buildExcelRows(rawRows, headerRowIndex);

        resolve({ rawRows, headerRowIndex, rows, headers });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Falha ao ler o arquivo Excel.'));
    reader.readAsBinaryString(file);
  });

  const mapRow = (row: ExcelRow, source: ImportSourceConfig): ImportPreview => {
    const selectedBadgeColumns = getSelectedBadgeColumns(source);
    const userValue = getFieldValue(row, 'user', source);
    const toneValue = getFieldValue(row, 'tone', source);
    const awardValue = getFieldValue(row, 'award', source).toUpperCase();
    const badgeCandidates = getBadgeCandidatesFromRow(row, source);
    const numericMeta = getNumericMetaFromRow(row, source);
    const textMeta = getTextMetaFromRow(row);
    const productiveUnitFound = productiveUnits.find((unit) => unit.id === selectedUnitId) || undefined;
    const inferredCompanyId = currentUser.company_id || productiveUnitFound?.company_id;
    const companyFound = companies.find((company) => company.id === inferredCompanyId);
    const inferredCompanyName = companyFound?.name || 'Empresa vinculada';
    const userFound = users.find(user =>
      normalizeCompare(user.full_name) === normalizeCompare(userValue) &&
      (!inferredCompanyId || user.company_id === inferredCompanyId) &&
      (!selectedUnitId || user.productive_unit_id === selectedUnitId)
    );
    const tone = parseTone(toneValue);

    let status: 'valid' | 'invalid' = 'valid';
    let reason = '';

    if (!selectedUnitId || !productiveUnitFound) { status = 'invalid'; reason = 'unidade nao selecionada'; }
    else if (!userFound) { status = 'invalid'; reason = 'colaborador nao encontrado'; }
    else if (badgeCandidates.length === 0) { status = 'invalid'; reason = 'nenhum indicador ativo encontrado'; }
      else if (badgeCandidates.some((badge) => !badge.badge)) {
        const missingBadges = badgeCandidates.filter((badge) => !badge.badge).map((badge) => badge.badgeName);
        missingBadges.forEach((badgeName) => console.log('[excel-import] Badge nao encontrado:', badgeName));
        status = 'invalid';
        reason = 'selo nao encontrado';
      }
    else if (awardValue && awardValue !== 'S' && awardValue !== 'SIM') { status = 'invalid'; reason = 'premiacao nao autorizada'; }

    return {
      row: {
        ...Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizeCell(value)])),
        explorador: userValue,
        empresa: inferredCompanyName,
        unidade_produtiva: productiveUnitFound?.name || 'Unidade nao selecionada',
        selos: badgeCandidates.map((badge) => badge.badgeName).join(', '),
        premio: awardValue,
        marcacao: toneValue || tone,
      },
      userName: userValue,
      companyId: inferredCompanyId,
      companyName: inferredCompanyName,
      productiveUnitId: productiveUnitFound?.id,
      productiveUnitName: productiveUnitFound?.name || 'Unidade nao selecionada',
      user: userFound,
      company: companyFound,
      productiveUnit: productiveUnitFound,
      badges: badgeCandidates,
      badgeValues: Object.fromEntries(badgeCandidates.map((badge) => [badge.badgeName, badge.badgeValue])),
      numericMeta,
      textMeta,
      tone,
      sourceName: source?.name || 'Fonte sem nome',
      matchedColumns: {
        company: 'empresa inferida do contexto',
        productive_unit: productiveUnitFound?.name || 'unidade selecionada',
        user: getMatchedColumnName(row, 'user', source),
        badge: selectedBadgeColumns.join(', '),
        tone: getMatchedColumnName(row, 'tone', source),
          award: getMatchedColumnName(row, 'award', source),
        },
        status,
        reason,
      };
  };

  const processExcelData = (rows: ExcelRow[], source: ImportSourceConfig): ProcessedExcelData => {
    const previews = rows.map((row) => mapRow(row, source));
    const todayKey = new Date().toISOString().slice(0, 10);
    const existingKeys = new Set(
      userBadges
        .filter((badge) => badge.awarded_at.slice(0, 10) === todayKey)
        .map((badge) => `${badge.user_id}:${badge.badge_id}:${todayKey}`),
    );
    const importedKeys = new Set<string>();
    const importedBadges: UserBadge[] = [];
    let foundUsers = 0;

    previews.forEach((preview, index) => {
      if (preview.user?.id) {
        foundUsers += 1;
      }
      if (preview.status !== 'valid' || !preview.user?.id) {
        if (preview.reason?.includes('colaborador')) {
          console.log(`[excel-import] linha ${index + 1}: usuario nao encontrado`, preview.row);
        }
        if (preview.reason?.includes('selo')) {
          console.log(`[excel-import] linha ${index + 1}: selo nao encontrado`, preview.row);
        }
        return;
      }

      const nextBadges = preview.badges.reduce<UserBadge[]>((awards, badge) => {
        if (!badge.badge?.id) {
          return awards;
        }

        const duplicateKey = `${preview.user?.id}:${badge.badge.id}:${todayKey}`;
        if (existingKeys.has(duplicateKey) || importedKeys.has(duplicateKey)) {
          return awards;
        }

        importedKeys.add(duplicateKey);
        awards.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11),
          user_id: preview.user!.id,
          badge_id: badge.badge.id,
          awarded_at: new Date().toISOString(),
          awarded_by: safeAdminProfile.id,
          tone: preview.tone,
          company_id: preview.companyId,
          productive_unit_id: preview.productiveUnitId,
        });
        return awards;
      }, []);

      if (preview.badges.length > 0 && nextBadges.length === 0) {
        preview.status = 'invalid';
        preview.reason = 'selos duplicados no mesmo dia';
      }

      importedBadges.push(...nextBadges);
    });

    const summary = {
      processed: rows.length,
      success: importedBadges.length,
      failed: previews.filter((preview) => preview.status === 'invalid').length,
    };

    console.log('[excel-import] total de linhas processadas:', summary.processed);
    console.log('[excel-import] total de colaboradores encontrados:', foundUsers);
    console.log('[excel-import] total de sucessos:', summary.success);
    console.log('[excel-import] total de falhas:', summary.failed);

    return {
      previews,
      importedBadges,
      summary,
    };
  };

  const applyHeaderRowSelection = (rawRows: ExcelSheetRow[], headerRowIndex: number, source: ImportSourceConfig) => {
    const rows = buildExcelRows(rawRows, headerRowIndex);
    const headers = extractHeaders([rawRows[headerRowIndex] || []]).headers;
    const suggestedColumns: Record<ImportSourceField, string> = {
      company: suggestColumnForField(headers, 'company', source),
      productive_unit: suggestColumnForField(headers, 'productive_unit', source),
      user: suggestColumnForField(headers, 'user', source),
      badge: suggestColumnForField(headers, 'badge', source),
      tone: suggestColumnForField(headers, 'tone', source),
      award: suggestColumnForField(headers, 'award', source),
    };
    const suggestedBadgeColumns = getDefaultIndicatorColumns(headers, source);

    setImportHeaderRowIndex(headerRowIndex);
    setImportSheetRows(rows);
    setImportSheetHeaders(headers);
    setAssistedImportColumns(suggestedColumns);
    setAssistedImportBadgeColumns(
      suggestedBadgeColumns.length > 0
        ? suggestedBadgeColumns
        : (suggestedColumns.badge ? [suggestedColumns.badge] : []),
    );
  };

  const buildImportSourceWithMapping = (): ImportSourceConfig => ({
    ...(activeImportSource || fallbackImportSource),
    columns: {
      ...assistedImportColumns,
      badge: assistedImportBadgeColumns[0] || assistedImportColumns.badge,
    },
  });

  const upsertUserBadge = (targetUserId: string, badgeId: string, tone: BadgeTone) => {
    console.log('Awarding badge:', { userId: targetUserId, badgeId });
    const targetUser = users.find((user) => user.id === targetUserId);
    const badge = badges.find((entry) => entry.id === badgeId);
    if (!targetUser || !badge) {
      console.log('[badge-award] concessao ignorada por dados invalidos', { targetUserId, badgeId });
      return;
    }
    const existingAward = userBadges.find(ub => ub.user_id === targetUserId && ub.badge_id === badgeId);

    if (existingAward) {
      setUserBadges(prev => prev.map(ub => ub.id === existingAward.id ? {
        ...ub,
        tone,
        awarded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        awarded_by: safeAdminProfile.id,
        company_id: targetUser.company_id,
        productive_unit_id: targetUser.productive_unit_id,
      } : ub));
      return;
    }

    const newAward: UserBadge = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: targetUserId,
      badge_id: badgeId,
      awarded_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      awarded_by: safeAdminProfile.id,
      tone,
      company_id: targetUser.company_id,
      productive_unit_id: targetUser.productive_unit_id,
    };

    setUserBadges(prev => [...prev, newAward]);
  };

  const handleLegendChange = (tone: BadgeTone, value: string) => {
    setBadgeLegends(prev => ({ ...prev, [tone]: value }));
  };

  const handleReviewSubmission = async (submissionId: string, status: 'approved' | 'rejected') => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    if (onReviewSubmission) {
      try {
        await onReviewSubmission(submissionId, status);
        setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status } : s));
        alert(`Solicitação ${status === 'approved' ? 'aprovada e selo concedido' : 'rejeitada'}.`);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Falha ao revisar solicitação.');
      }
      return;
    }

    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status } : s));

    if (status === 'approved') {
      upsertUserBadge(submission.user_id, submission.badge_id, 'bronze');
    }
    
    alert(`Solicitação ${status === 'approved' ? 'aprovada e selo concedido' : 'rejeitada'}.`);
  };

  const handleSaveBadge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canManageGlobalCatalog) {
      alert('Somente o desenvolvedor pode manter a biblioteca global de selos.');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const badgeData: Badge = {
      id: editingBadge?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || '',
      points: Number(formData.get('points')),
      category: (formData.get('category') as string) || 'Qualidade',
      icon_name: (formData.get('icon_name') as string) || '✨',
      image_url: tempBadgeImageUrl || editingBadge?.image_url,
    };
    try {
      const savedBadge = onSaveBadge ? await onSaveBadge(badgeData) : badgeData;
      setBadges(prev => editingBadge ? prev.map(b => b.id === editingBadge.id ? savedBadge : b) : [...prev, savedBadge]);
      setIsBadgeModalOpen(false);
      setEditingBadge(null);
      setTempBadgeImageUrl(undefined);
    } catch (error) {
      console.error('Error saving badge:', error);
      alert('Erro ao salvar selo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleDeleteBadge = async () => {
    if (!canManageGlobalCatalog) {
      alert('Somente o desenvolvedor pode remover selos da biblioteca global.');
      return;
    }
    if (badgeToDelete) {
      if (onDeleteBadge) {
        await onDeleteBadge(badgeToDelete.id);
      }
      setBadges(prev => prev.filter(b => b.id !== badgeToDelete.id));
      setIsDeleteBadgeModalOpen(false);
      setBadgeToDelete(null);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyData: Company = {
      id: editingCompany?.id || Math.random().toString(36).substr(2, 9),
      name: (formData.get('name') as string) || '',
      category: formData.get('category') as string,
      logo_url: tempCompanyLogoUrl || editingCompany?.logo_url,
    };
    try {
      const savedCompany = onSaveCompany ? await onSaveCompany(companyData) : companyData;
      setCompanies(prev => editingCompany ? prev.map(c => c.id === editingCompany.id ? savedCompany : c) : [...prev, savedCompany]);
      setIsCompanyModalOpen(false);
      setTempCompanyLogoUrl(undefined);
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Erro ao salvar empresa: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleSaveProductiveUnit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyId = formData.get('company_id') as string;

    if (!companyId) {
      alert('Selecione a empresa da unidade produtiva.');
      return;
    }

    const productiveUnitData: ProductiveUnit = {
      id: editingProductiveUnit?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      company_id: companyId,
    };

    try {
      const savedProductiveUnit = onSaveProductiveUnit ? await onSaveProductiveUnit(productiveUnitData) : productiveUnitData;
      setProductiveUnits(prev => editingProductiveUnit ? prev.map(unit => unit.id === editingProductiveUnit.id ? savedProductiveUnit : unit) : [...prev, savedProductiveUnit]);
      setIsProductiveUnitModalOpen(false);
      setEditingProductiveUnit(null);
    } catch (error) {
      console.error('Error saving productive unit:', error);
      alert('Erro ao salvar unidade produtiva: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleSaveImportSource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canConfigureImportSource) {
      alert('Somente o desenvolvedor pode editar fontes globais de importação.');
      return;
    }
    const formData = new FormData(e.currentTarget);

    const importSourceData: ImportSourceConfig = {
      id: editingImportSource?.id || Math.random().toString(36).substr(2, 9),
      name: normalizeCell(formData.get('name')),
      description: normalizeCell(formData.get('description')),
      columns: {
        company: normalizeCell(formData.get('company_column')),
        productive_unit: normalizeCell(formData.get('productive_unit_column')),
        user: normalizeCell(formData.get('user_column')),
        badge: normalizeCell(formData.get('badge_column')),
        tone: normalizeCell(formData.get('tone_column')) || 'marcacao',
        award: normalizeCell(formData.get('award_column')) || 'premio',
      },
    };

    try {
      const savedImportSource = onSaveImportSource ? await onSaveImportSource(importSourceData) : importSourceData;
      setImportSources(prev => editingImportSource ? prev.map(source => source.id === editingImportSource.id ? savedImportSource : source) : [...prev, savedImportSource]);
      setSelectedImportSourceId(savedImportSource.id);
      setIsImportSourceModalOpen(false);
      setEditingImportSource(null);
    } catch (error) {
      console.error('Error saving import source:', error);
      alert('Erro ao salvar fonte de importação: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyId = (formData.get('company_id') as string) || undefined;
    const productiveUnitId = (formData.get('productive_unit_id') as string) || undefined;
    const validProductiveUnitId = (productiveUnitId && productiveUnits.some(unit => unit.id === productiveUnitId && unit.company_id === companyId))
      ? productiveUnitId
      : undefined;

    const userData: Profile = {
      id: editingUser?.id || '',
      email: formData.get('email') as string,
      full_name: formData.get('full_name') as string,
      avatar_url: tempUserAvatarUrl || editingUser?.avatar_url || '',
      role: formData.get('role') as 'admin' | 'user',
      company_id: companyId,
      productive_unit_id: validProductiveUnitId,
      level: editingUser?.level || 1,
      xp: editingUser?.xp || 0,
      created_at: editingUser?.created_at || new Date().toISOString(),
    };

    const password = (formData.get('password') as string)?.trim();

    try {
      const savedUser = onSaveUser ? await onSaveUser(userData, password) : userData;
      setUsers(prev => editingUser ? prev.map(u => u.id === editingUser.id ? savedUser : u) : [...prev, savedUser]);
      setIsUserModalOpen(false);
      setEditingUser(null);
      setTempUserAvatarUrl(undefined);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erro ao salvar usuário: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleBulkInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const emails = bulkInviteEmails
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (emails.length === 0) {
      alert('Por favor, insira e-mails válidos para o convite.');
      return;
    }

    const validProductiveUnitId = bulkInviteProductiveUnitId && productiveUnits.some(unit => unit.id === bulkInviteProductiveUnitId && unit.company_id === bulkInviteCompanyId)
      ? bulkInviteProductiveUnitId
      : undefined;

    if (onBulkInviteUsers) {
      const result = await onBulkInviteUsers(emails, bulkInviteCompanyId || undefined, validProductiveUnitId);
      setUsers(prev => [...prev, ...result.createdUsers]);
      alert(
        result.skippedEmails.length > 0
          ? `${result.createdUsers.length} convites persistidos. ${result.skippedEmails.length} e-mail(s) ja existiam e foram ignorados.`
          : `${result.createdUsers.length} convites persistidos com sucesso para os novos colaboradores!`,
      );
    } else {
      const newUsers: Profile[] = emails.map(email => ({
        id: Math.random().toString(36).substr(2, 9),
        email,
        full_name: email.split('@')[0],
        role: 'user',
        company_id: bulkInviteCompanyId || undefined,
        productive_unit_id: validProductiveUnitId,
        level: 1,
        xp: 0,
        created_at: new Date().toISOString(),
      }));

      setUsers(prev => [...prev, ...newUsers]);
      alert(`${emails.length} convites enviados com sucesso para os novos colaboradores!`);
    }

    setIsBulkInviteModalOpen(false);
    setBulkInviteEmails('');
    setBulkInviteCompanyId('');
    setBulkInviteProductiveUnitId('');
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      if (userToDelete.id === adminProfile.id) {
        alert("Você não pode excluir seu próprio perfil administrativo.");
        setIsDeleteUserModalOpen(false);
        return;
      }
      try {
        if (onDeleteUser) {
          await onDeleteUser(userToDelete.id);
        }
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setIsDeleteUserModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        alert('Erro ao excluir colaborador: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      }
    }
  };

  const handleDeleteCompany = async () => {
    if (companyToDelete) {
      try {
        if (onDeleteCompany) {
          await onDeleteCompany(companyToDelete.id);
        }
        setCompanies(prev => prev.filter(c => c.id !== companyToDelete.id));
        setIsDeleteCompanyModalOpen(false);
        setCompanyToDelete(null);
      } catch (error) {
        alert('Erro ao excluir empresa: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      }
    }
  };

  const handleAwardBadges = async () => {
    if (selectedUsers.length === 0 || !selectedAwardBadge) return;
    const badge = badges.find(b => b.id === selectedAwardBadge);
    if (!badge) {
      console.log('[badge-award] badge_id nao encontrado', { badgeId: selectedAwardBadge });
      return;
    }

    try {
      setIsAwardingBadges(true);
      if (onAwardBadges) {
        await onAwardBadges(selectedUsers, selectedAwardBadge, selectedAwardTone);
      } else {
        selectedUsers.forEach(userId => upsertUserBadge(userId, selectedAwardBadge, selectedAwardTone));
      }

      if (badge) {
        setUsers(prev => prev.map(u => {
          if (!selectedUsers.includes(u.id)) return u;

          const updatedUser = {
            ...u,
            notifications: [
              ...(u.notifications || []),
              {
                id: Math.random().toString(36).slice(2, 10),
                title: 'Selo concedido',
                message: `Parabens ${u.full_name}, voce recebeu o selo ${badge?.name || 'Badge'} com marcacao ${BADGE_TONE_LABELS[selectedAwardTone]}.`,
                sent_at: new Date().toISOString(),
                read: false,
              }
            ]
          };

          if (sendEmailOnAward && u.email_verified) {
            sendEmailNotification(u.email, 'Selo concedido', `Ola ${u.full_name}, voce recebeu o selo ${badge?.name || 'Badge'} com marcacao ${BADGE_TONE_LABELS[selectedAwardTone]}.`);
          }

          return updatedUser;
        }));
      }

      alert(`${selectedUsers.length} colaboradores foram premiados!`);
      setSelectedUsers([]);
      setSelectedAwardBadge('');
    } catch (error) {
      alert('Erro ao premiar colaboradores: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsAwardingBadges(false);
    }
  };

  const handleAssignBadgeToUser = async (targetUserId: string, badgeId: string, tone: BadgeTone) => {
    try {
      if (onAwardBadges) {
        await onAwardBadges([targetUserId], badgeId, tone);
        return;
      }
      upsertUserBadge(targetUserId, badgeId, tone);
    } catch (error) {
      alert('Erro ao atribuir selo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleRemoveBadgeFromUser = async (targetUserId: string, badgeId: string) => {
    const badgeAward = userBadges.find(ub => ub.user_id === targetUserId && ub.badge_id === badgeId);
    if (!badgeAward) return;

    try {
      if (onRemoveUserBadge) {
        await onRemoveUserBadge(targetUserId, badgeId);
        return;
      }
      setUserBadges(prev => prev.filter(ub => ub.id !== badgeAward.id));
    } catch (error) {
      alert('Erro ao remover selo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeImportSource) return;
    if (!selectedUnitId) {
      alert('Selecione a unidade antes de importar a planilha.');
      return;
    }

    try {
      const { rawRows, headerRowIndex } = await parseExcel(file);
      setImportSheetMatrix(rawRows);
      applyHeaderRowSelection(rawRows, headerRowIndex, activeImportSource);
      setIsImportMappingModalOpen(true);
    } catch (error) {
      console.error('[excel-import] falha ao ler arquivo:', error);
    }
  };

  const handleConfirmImportMapping = () => {
    if (!activeImportSource || importSheetRows.length === 0 || !selectedUnitId) return;

    const mappedSource = buildImportSourceWithMapping();

    const processedData = processExcelData(importSheetRows, mappedSource);
    setImportPreviews(processedData.previews);

    const firstPreview = processedData.previews[0];
    if (firstPreview) {
      setImportBindingSnapshot({
        sourceId: mappedSource?.id || fallbackImportSource.id,
        sourceName: mappedSource?.name || fallbackImportSource.name,
        matchedColumns: {
          ...firstPreview.matchedColumns,
          badge: assistedImportBadgeColumns.join(', '),
        },
        importedAt: new Date().toISOString(),
      });
    }

    setIsImportMappingModalOpen(false);
    setIsImportModalOpen(true);
  };

  const finalizeImport = async () => {
    if (importSheetRows.length === 0 || !selectedUnitId) {
      alert('Selecione a unidade antes de concluir a importação.');
      return;
    }

    const mappedSource = buildImportSourceWithMapping();
    const processedData = processExcelData(importSheetRows, mappedSource);
    setImportPreviews(processedData.previews);

    if (processedData.summary.success === 0) return;

    if (onPersistImport) {
      const importRows = processedData.previews.flatMap((preview) => (
        preview.badges.map((badge) => ({
          row: {
            ...preview.row,
            selo: badge.badgeName,
            valor_indicador: badge.badgeValue.toString(),
          },
          user_id: preview.user?.id,
          badge_id: badge.badge?.id,
          tone: preview.tone,
          status: preview.status,
          reason: preview.reason,
        }))
      ));

      const importedCount = await onPersistImport(
        mappedSource.id || fallbackImportSource.id,
        mappedSource?.name || fallbackImportSource.name,
        {
          ...(processedData.previews[0]?.matchedColumns || {}),
          badge: assistedImportBadgeColumns.join(', '),
        },
        importRows,
      );
      const foundUsers = processedData.previews.filter((preview) => preview.user?.id).length;
      alert(`${foundUsers} colaboradores encontrados, ${importedCount} selos atribuidos e ${processedData.summary.failed} erros.`);
    } else {
      setUserBadges(prev => {
        const existingKeys = new Set(prev.map((badge) => `${badge.user_id}:${badge.badge_id}:${badge.awarded_at.slice(0, 10)}`));
        const nextBadges = processedData.importedBadges.filter((badge) => !existingKeys.has(`${badge.user_id}:${badge.badge_id}:${badge.awarded_at.slice(0, 10)}`));
        return [...prev, ...nextBadges];
      });
      const foundUsers = processedData.previews.filter((preview) => preview.user?.id).length;
      alert(`${foundUsers} colaboradores encontrados, ${processedData.summary.success} selos atribuidos e ${processedData.summary.failed} erros.`);
    }

    setIsImportModalOpen(false);
  };

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) &&
      (selectedCompanyFilter === '' || u.company_id === selectedCompanyFilter) &&
      (selectedProductiveUnitFilter === '' || u.productive_unit_id === selectedProductiveUnitFilter)
    );
  }, [users, userSearch, selectedCompanyFilter, selectedProductiveUnitFilter]);

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeBadges: badges.length,
    pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
    totalCompanies: companies.length,
    totalProductiveUnits: productiveUnits.length
  }), [users, badges, submissions, companies, productiveUnits]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Switcher */}
      {view === 'overview' && (
        <div className="flex justify-center mb-10">
          <div className="bg-slate-200/50 p-1.5 rounded-[24px] flex gap-1 shadow-inner">
            <button onClick={() => setActiveMode('management')} className={`px-8 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'management' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>📊 Gestão Operacional</button>
            <button onClick={() => setActiveMode('personal')} className={`px-8 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'personal' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>👤 Minha Jornada</button>
          </div>
        </div>
      )}

      {activeMode === 'management' ? (
        <div className="space-y-10 pb-20">
          {view === 'overview' && (
            <div className="space-y-10">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Centro de Comando</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Hierarquia e Performance Operacional</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { label: 'Colaboradores', val: stats.totalUsers, icon: '👥' },
                  { label: 'Selos Ativos', val: stats.activeBadges, icon: '🛡️' },
                  { label: 'Pendências', val: stats.pendingSubmissions, icon: '📨', color: 'text-amber-600' },
                  { label: 'Empresas', val: stats.totalCompanies, icon: '🏢', color: 'text-emerald-600' },
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className={cn("text-3xl font-black leading-none", kpi.color || "text-slate-900")}>{kpi.val}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{kpi.label}</div>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] text-6xl opacity-[0.03] group-hover:rotate-12 transition-transform">{kpi.icon || ''}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><span>🏢</span> Empresas no Ecossistema</h3>
                  <div className="space-y-4">
                    {companies.map(c => (
                  <div key={c.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg space-y-5 group hover:border-indigo-200 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                          {c.logo_url ? (
                            renderSquareImage(c.logo_url, c.name)
                          ) : (
                            '🏢'
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm tracking-tight">{c?.name || 'Empresa sem nome'}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {c.category || 'Sem categoria'} • {users.filter(u => u.company_id === c.id).length} colaboradores • {getUnitsByCompany(c.id).length} unidades
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(isDeveloper || (currentUser.role === 'admin' && c.id === currentUser.company_id)) && (
                          <button onClick={() => openCompanyModal(c)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                        )}
                        {isDeveloper && (
                          <button onClick={() => { setCompanyToDelete(c); setIsDeleteCompanyModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {getUnitsByCompany(c.id).length > 0 ? getUnitsByCompany(c.id).map(unit => (
                        <div key={unit.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{unit?.name || 'Unidade sem nome'}</div>
                            <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">{users.filter(user => user.productive_unit_id === unit.id).length} colaboradores</div>
                          </div>
                          <button onClick={() => { setEditingProductiveUnit(unit); setIsProductiveUnitModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-cyan-600 hover:bg-white rounded-xl transition-all">✏️</button>
                        </div>
                      )) : <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-400 font-bold">Nenhuma unidade produtiva cadastrada.</div>}
                    </div>
                  </div>
                ))}
                  </div>
                </div>
                <div className="bg-indigo-900 p-8 rounded-[40px] shadow-2xl text-white">
                  <h3 className="text-sm font-black text-indigo-200 uppercase tracking-widest mb-6">📡 Atividade de Rede</h3>
                  <div className="space-y-4">
                    {submissions.slice(0, 3).map(sub => (
                      <div key={sub.id} className="bg-white/10 p-4 rounded-xl border border-white/5 text-xs">
                        <span className="font-black text-indigo-300">{sub.user_name}</span> solicitou <span className="font-black text-white">{sub.badge_name}</span>
                      </div>
                    ))}
                    {submissions.length === 0 && <p className="text-xs text-indigo-300">Nenhuma atividade recente.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'submissions' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pedidos de Validação</h2>
              <div className="space-y-4">
                {submissions.filter(s => s.status === 'pending').map(sub => {
                  const user = users.find(u => u.id === sub.user_id);
                  const company = companies.find(c => c.id === user?.company_id);
                  return (
                    <div key={sub.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{sub.badge_name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {sub.user_name} • {company?.name || 'Independente'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl italic">"{sub.description}"</p>
                      </div>
                      <div className="flex md:flex-col gap-2 min-w-[140px]">
                        <button onClick={() => handleReviewSubmission(sub.id, 'approved')} className="bg-emerald-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">Validar & Premiar</button>
                        <button onClick={() => handleReviewSubmission(sub.id, 'rejected')} className="bg-white text-rose-500 border border-rose-100 px-6 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-rose-50 transition-all">Recusar</button>
                      </div>
                    </div>
                  );
                })}
                {submissions.filter(s => s.status === 'pending').length === 0 && (
                  <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                    <span className="text-5xl block mb-4">✅</span>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Fila de Solicitações Vazia</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Colaboradores da Rede</h2>
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={selectedCompanyFilter}
                    onChange={(e) => {
                      setSelectedCompanyFilter(e.target.value);
                      setSelectedProductiveUnitFilter('');
                    }}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    <option value="">Todas as Empresas</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c?.name || 'Empresa sem nome'}</option>)}
                  </select>
                  <select 
                    value={selectedProductiveUnitFilter}
                    onChange={(e) => setSelectedProductiveUnitFilter(e.target.value)}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    <option value="">Todas as Unidades</option>
                    {(selectedCompanyFilter ? getUnitsByCompany(selectedCompanyFilter) : productiveUnits).map(unit => <option key={unit.id} value={unit.id}>{unit?.name || 'Unidade sem nome'}</option>)}
                  </select>
                  <button onClick={() => setIsBulkInviteModalOpen(true)} className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"><span>📨</span> Convites em Lote</button>
                  <button onClick={() => openUserModal()} className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Novo Colaborador</button>
                </div>
              </div>
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-6">Nome / Empresa / Unidade</th>
                      <th className="px-10 py-6">Resumo do Mês</th>
                      <th className="px-10 py-6 text-right">Opções</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map(u => {
                      const comp = companies.find(c => c.id === u.company_id);
                      const unit = productiveUnits.find(item => item.id === u.productive_unit_id);
                      const metrics = getUserMonthlyBadgeMetrics(u.id, userBadges);
                      return (
                        <tr key={u.id} className="group hover:bg-slate-50/50">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {u.avatar_url ? (
                                  <img src={u.avatar_url} alt={u.full_name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-lg">👤</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-900 text-sm">{u.full_name}</div>
                                <div className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{comp?.name || 'Independente'}</div>
                                <div className="text-[10px] text-cyan-600 font-black uppercase tracking-widest">{unit?.name || 'Sem unidade produtiva'}</div>
                                <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Saldo {metrics.monthlyScore}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase">{metrics.positiveCount} selos</span>
                              <span className="text-[10px] font-black text-rose-500 uppercase">{metrics.lossCount} perdas</span>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewingUserBadges(u)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl">ver conquistas</button>
                              <button onClick={() => openUserModal(u)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                              <button onClick={() => { setUserToDelete(u); setIsDeleteUserModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'award' && (
            <div className="space-y-8 animate-in fade-in">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Premiar Colaboradores</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Recompense ações excepcionais em lote</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={selectedUnitId || ''}
                    onChange={(e) => setSelectedUnitId(e.target.value || null)}
                    className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    <option value="">Selecionar unidade</option>
                    {productiveUnits.map((unit) => <option key={unit.id} value={unit.id}>{unit?.name || 'Unidade sem nome'}</option>)}
                  </select>
                  <select
                    value={selectedImportSourceId ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedImportSourceId(e.target.value)
                    }
                    className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    {importSources.filter(Boolean).map(source => <option key={source.id} value={source.id}>{source?.name || 'Fonte sem nome'}</option>)}
                  </select>
                  {canConfigureImportSource && (
                    <button onClick={() => { setEditingImportSource(activeImportSource || null); setIsImportSourceModalOpen(true); }} className="bg-white text-indigo-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-indigo-100 shadow-sm">
                      Configurar fonte
                    </button>
                  )}
                  <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleExcelImport} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={!selectedUnitId} className="bg-emerald-600 disabled:bg-slate-300 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3"><span>Arquivo</span> Importar Excel</button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex flex-col min-h-[500px]">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">1. selecione colaboradores</h3>
                    <div className="bg-slate-50 px-3 py-1 rounded-lg text-[10px] font-black text-indigo-600">{selectedUsers.length} selecionados</div>
                  </div>
                  <input type="text" placeholder="Buscar colaborador..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm mb-6 outline-none focus:ring-2 focus:ring-indigo-600" />
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {filteredUsers.map(u => (
                      <button key={u.id} onClick={() => toggleUserSelection(u.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedUsers.includes(u.id) ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${selectedUsers.includes(u.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>👤</div>
                          <div className="text-left">
                            <div className="font-bold text-sm text-slate-900">{u.full_name}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nv {u.level} • {companies.find(c => c.id === u.company_id)?.name}</div>
                          </div>
                        </div>
                        {selectedUsers.includes(u.id) && <span className="text-xl">✅</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  {activeImportSource && (
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Fonte vinculada</h3>
                          <p className="text-sm font-bold text-slate-900 mt-2">{activeImportSource?.name || 'Fonte sem nome'}</p>
                          <p className="text-xs text-cyan-600 font-bold mt-2">Unidade selecionada: {productiveUnits.find((unit) => unit.id === selectedUnitId)?.name || 'Nenhuma unidade selecionada'}</p>
                        </div>
                        {canConfigureImportSource && (
                          <button onClick={() => { setEditingImportSource(activeImportSource); setIsImportSourceModalOpen(true); }} className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest">
                            editar mapeamento
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{activeImportSource.description || 'Sem descrição cadastrada.'}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {(Object.entries(activeImportSource.columns) as [ImportSourceField, string][]).map(([field, column]) => (
                          <div key={field} className="rounded-2xl bg-slate-50 px-4 py-3">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{IMPORT_FIELD_LABELS[field]}</div>
                            <div className="text-sm font-bold text-slate-900 mt-1">{column}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">2. Escolha a Recompensa</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {badges.map(badge => (
                        <button key={badge.id} onClick={() => setSelectedAwardBadge(badge.id)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selectedAwardBadge === badge.id ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden bg-slate-100">
                            {badge.image_url ? (
                              renderSquareImage(badge.image_url, badge.name)
                            ) : (
                              <span>{badge.icon_name}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 leading-none mb-1">{badge?.name || 'Badge sem nome'}</div>
                            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{badge.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">3. Escolha a marcação do mês</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                        <button
                          key={tone}
                          onClick={() => setSelectedAwardTone(tone)}
                          className={cn("px-4 py-4 rounded-2xl border-2 text-left transition-all", selectedAwardTone === tone ? "border-indigo-600 bg-indigo-50 shadow-lg" : "border-slate-100 bg-slate-50 hover:border-slate-200")}
                        >
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{BADGE_TONE_LABELS[tone]}</div>
                          <div className="text-sm font-bold text-slate-900 mt-2">{badgeLegends[tone]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 mb-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={sendEmailOnAward} onChange={(e) => setSendEmailOnAward(e.target.checked)} className="h-4 w-4" />
                      Enviar notificação por e-mail aos colaboradores ao premiar
                    </label>
                  </div>
                  <div className="bg-indigo-900 p-10 rounded-[40px] shadow-2xl text-white text-center space-y-6">
                    <h3 className="text-sm font-black text-indigo-200 uppercase tracking-widest">4. Confirmar premiação</h3>
                    <button onClick={handleAwardBadges} className="w-full py-6 bg-white text-indigo-900 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all disabled:opacity-50" disabled={selectedUsers.length === 0 || !selectedAwardBadge || isAwardingBadges}>{isAwardingBadges ? 'Premiando...' : 'Conceder selos agora'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'badges' && canManageGlobalCatalog && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Biblioteca de Selos</h2>
                <button onClick={() => openBadgeModal()} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Novo Selo</button>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setIsLegendCollapsed(prev => !prev)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legenda das Cores</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">Bronze, prata, ouro e perdas em vermelho</div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600">{isLegendCollapsed ? 'Expandir' : 'Minimizar'}</span>
                </button>
                {!isLegendCollapsed && (
                  <div className="border-t border-slate-100 px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                      <label key={tone} className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{BADGE_TONE_LABELS[tone]}</span>
                        <input
                          value={badgeLegends[tone]}
                          onChange={(e) => handleLegendChange(tone, e.target.value)}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                        {badge.image_url ? (
                          renderSquareImage(badge.image_url, badge.name)
                        ) : (
                          <span>{badge.icon_name}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{badge?.name || 'Badge sem nome'}</div>
                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{badge.category}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openBadgeModal(badge)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                      <button onClick={() => { setBadgeToDelete(badge); setIsDeleteBadgeModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'companies' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ecossistema Corporativo</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingProductiveUnit(null); setIsProductiveUnitModalOpen(true); }} className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Nova Unidade</button>
                  {isDeveloper && <button onClick={() => openCompanyModal()} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Nova Empresa</button>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companies.map(c => (
                  <div key={c.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg flex items-center justify-between group hover:border-indigo-200 transition-all flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0 overflow-hidden">
                        {c.logo_url ? (
                          renderSquareImage(c.logo_url, c.name)
                        ) : (
                          '🏢'
                        )}
                      </div>
                      <div className="font-bold text-slate-900 text-sm tracking-tight">{c?.name || 'Empresa sem nome'}</div>
                      <div className="ml-auto bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500 uppercase">{c.category || 'Geral'}</div>
                    </div>
                    <div className="flex gap-2">
                      {(isDeveloper || (currentUser.role === 'admin' && c.id === currentUser.company_id)) && (
                        <button onClick={() => openCompanyModal(c)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                      )}
                      {isDeveloper && (
                        <button onClick={() => { setCompanyToDelete(c); setIsDeleteCompanyModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Olá, Gestor {adminProfile.full_name.split(' ')[0]}</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Sua Própria Jornada de Qualidade</p>
            </div>
            <button onClick={onOpenSolicitation} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl flex items-center gap-3 transition-all active:scale-95">✨ Solicitar Meu Selo</button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl shadow-2xl shadow-indigo-200">🛡️</div>
                <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-slate-900 min-w-[56px] h-12 px-3 rounded-2xl flex items-center justify-center font-black border-4 border-white text-sm">{adminMonthlyMetrics.monthlyScore || 0}</div>
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black text-slate-900">Saldo do Mês</h3>
                  <div className="text-sm font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">{adminMonthlyMetrics.positiveCount} selos / {adminMonthlyMetrics.lossCount} perdas</div>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white"><div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, Math.max(0, (adminMonthlyMetrics.positiveCount / 3) * 100))}%` }}></div></div>
              </div>
            </div>
            <div className="bg-indigo-600 p-10 rounded-[40px] shadow-xl shadow-indigo-200 text-white flex flex-col justify-center items-center text-center space-y-2">
              <div className="text-5xl font-black">{userBadges.filter(ub => ub.user_id === adminProfile.id).length}</div>
              <div className="font-black uppercase text-[10px] tracking-[0.3em] opacity-80">Selos Conquistados</div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Minha Galeria</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {badges.map(badge => {
                const badgeAward = userBadges.find(ub => ub.user_id === adminProfile.id && ub.badge_id === badge.id);
                return <BadgeCard key={badge.id} badge={badge} unlocked={Boolean(badgeAward)} tone={badgeAward?.tone} date={badgeAward?.awarded_at} />;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Invite Modal */}
      {isBulkInviteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Convites em Lote</h2>
            <form onSubmit={handleBulkInvite} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Empresa de Destino</label>
                <select 
                  value={bulkInviteCompanyId}
                  onChange={(e) => {
                    setBulkInviteCompanyId(e.target.value);
                    setBulkInviteProductiveUnitId('');
                  }}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                  required
                >
                  <option value="">Selecionar empresa...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c?.name || 'Empresa sem nome'}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unidade Produtiva</label>
                <select
                  value={bulkInviteProductiveUnitId}
                  onChange={(e) => setBulkInviteProductiveUnitId(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                >
                  <option value="">Selecionar unidade...</option>
                  {getUnitsByCompany(bulkInviteCompanyId).map(unit => <option key={unit.id} value={unit.id}>{unit?.name || 'Unidade sem nome'}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lista de E-mails</label>
                <textarea 
                  value={bulkInviteEmails}
                  onChange={(e) => setBulkInviteEmails(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 min-h-[160px] outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="Insira um e-mail por linha ou separados por vírgula..."
                  required
                ></textarea>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 px-1 tracking-widest">E-mails inválidos serão ignorados automaticamente.</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsBulkInviteModalOpen(false)} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-all">Enviar Convites 📨</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingUser ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
            <form onSubmit={handleSaveUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                <input name="full_name" defaultValue={editingUser?.full_name} style={{ textTransform: 'none' }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" placeholder="Ex: João Silva" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail Corporativo</label>
                <input name="email" type="email" defaultValue={editingUser?.email} style={{ textTransform: 'none' }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" placeholder="Ex: joao@empresa.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha de Acesso {!editingUser && '(Opcional - padrão: changeme123)'}</label>
                <input name="password" type="password" style={{ textTransform: 'none' }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" placeholder={editingUser ? "Deixe vazio para manter atual" : "Digite uma senha"} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Função</label>
                  <select name="role" defaultValue={editingUser?.role || 'user'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                    <option value="user">Colaborador</option>
                    <option value="admin">Gestor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa</label>
                  <select name="company_id" defaultValue={editingUser?.company_id || ''} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                    <option value="">Nenhuma (Independente)</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c?.name || 'Empresa sem nome'}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Produtiva</label>
                  <select name="productive_unit_id" defaultValue={editingUser?.productive_unit_id || ''} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                    <option value="">Nenhuma</option>
                    {productiveUnits.map(unit => <option key={unit.id} value={unit.id}>{unit?.name || 'Unidade sem nome'}</option>)}
                  </select>
                </div>
              </div>
              <ImageUpload
                label="Avatar do Perfil (Opcional)"
                currentImageUrl={tempUserAvatarUrl || editingUser?.avatar_url}
                onImageUpload={setTempUserAvatarUrl}
                uploadEndpoint="user-avatar"
                fieldName="avatar"
              />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeUserModal} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">{editingUser ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteUserModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="text-5xl mb-6">⚠️</div>
            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Excluir Explorador?</h2>
            <p className="text-slate-500 text-sm mb-8">Esta ação removerá <b>{userToDelete?.full_name}</b> e todo seu histórico de conquistas permanentemente.</p>
            <div className="flex gap-4">
              <button onClick={() => { setIsDeleteUserModalOpen(false); setUserToDelete(null); }} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
              <button onClick={handleDeleteUser} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Modal */}
      {isBadgeModalOpen && canManageGlobalCatalog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">{editingBadge ? 'Editar Selo' : 'Novo Selo'}</h2>
            <form onSubmit={handleSaveBadge} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Conquista</label>
                <input name="name" defaultValue={editingBadge?.name} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição da Missão</label>
                <textarea name="description" defaultValue={editingBadge?.description} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 min-h-[100px] text-slate-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legenda de apoio</label>
                <input name="points" type="number" defaultValue={editingBadge?.points} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-center text-slate-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Operacional</label>
                <select name="category" defaultValue={editingBadge?.category} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <ImageUpload
                label="Imagem do Selo (Opcional)"
                currentImageUrl={tempBadgeImageUrl || editingBadge?.image_url}
                onImageUpload={setTempBadgeImageUrl}
                uploadEndpoint="badge-image"
                fieldName="image"
              />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeBadgeModal} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">{editingBadge ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Badge Confirmation Modal */}
      {isDeleteBadgeModalOpen && canManageGlobalCatalog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="text-5xl mb-6">⚠️</div>
            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Excluir Selo?</h2>
            <p className="text-slate-500 text-sm mb-8">O selo <b>{badgeToDelete?.name}</b> será removido permanentemente da biblioteca.</p>
            <div className="flex gap-4">
              <button onClick={() => { setIsDeleteBadgeModalOpen(false); setBadgeToDelete(null); }} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
              <button onClick={handleDeleteBadge} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingCompany ? 'editar empresa' : 'nova empresa'}</h2>
            <form onSubmit={handleSaveCompany} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">nome da organização</label>
                <input name="name" defaultValue={editingCompany?.name} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">categoria do setor</label>
                <select name="category" defaultValue={editingCompany?.category} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required>
                  <option value="">Selecionar categoria...</option>
                  {COMPANY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <ImageUpload
                label="Logo da Empresa (Opcional)"
                currentImageUrl={tempCompanyLogoUrl || editingCompany?.logo_url}
                onImageUpload={setTempCompanyLogoUrl}
                uploadEndpoint="company-logo"
                fieldName="logo"
              />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeCompanyModal} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
                <button type="submit" className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700">{editingCompany ? 'atualizar' : 'cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteCompanyModalOpen && companyToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">deletar empresa?</h2>
            <p className="text-sm text-slate-600 mb-8">Tem certeza que deseja deletar <strong>{companyToDelete.name}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-4">
              <button type="button" onClick={() => { setIsDeleteCompanyModalOpen(false); setCompanyToDelete(null); }} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-colors">cancelar</button>
              <button type="button" onClick={handleDeleteCompany} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-colors">deletar</button>
            </div>
          </div>
        </div>
      )}

      {isProductiveUnitModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingProductiveUnit ? 'editar unidade produtiva' : 'nova unidade produtiva'}</h2>
            <form onSubmit={handleSaveProductiveUnit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">empresa</label>
                <select name="company_id" defaultValue={editingProductiveUnit?.company_id || ''} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required>
                  <option value="">Selecionar empresa...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c?.name || 'Empresa sem nome'}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">nome da unidade</label>
                <input name="name" defaultValue={editingProductiveUnit?.name} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setIsProductiveUnitModalOpen(false); setEditingProductiveUnit(null); }} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
                <button type="submit" className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-cyan-600 text-white rounded-2xl shadow-xl hover:bg-cyan-700">{editingProductiveUnit ? 'atualizar' : 'cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportSourceModalOpen && canConfigureImportSource && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingImportSource ? 'Editar fonte Excel' : 'Nova fonte Excel'}</h2>
            <form onSubmit={handleSaveImportSource} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Fonte</label>
                  <input name="name" defaultValue={editingImportSource?.name} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DescriÃ§Ã£o</label>
                  <input name="description" defaultValue={editingImportSource?.description} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Empresa</label>
                  <input name="company_column" defaultValue={editingImportSource?.columns.company || 'empresa'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Unidade</label>
                  <input name="productive_unit_column" defaultValue={editingImportSource?.columns.productive_unit || 'unidade_produtiva'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Colaborador</label>
                  <input name="user_column" defaultValue={editingImportSource?.columns.user || 'explorador'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Selo</label>
                  <input name="badge_column" defaultValue={editingImportSource?.columns.badge || 'selo'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Marcação</label>
                  <input name="tone_column" defaultValue={editingImportSource?.columns.tone || 'marcacao'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Autorização</label>
                  <input name="award_column" defaultValue={editingImportSource?.columns.award || 'premio'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setIsImportSourceModalOpen(false); setEditingImportSource(null); }} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">Salvar Fonte</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportMappingModalOpen && activeImportSource && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Mapeamento assistido do Excel</h2>
            <p className="text-sm text-slate-500 mb-8">Revise os cabeçalhos detectados antes de gerar a pré-visualização dos selos.</p>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 flex-1 overflow-hidden">
              <div className="rounded-[32px] border border-slate-100 bg-slate-50/70 p-6 overflow-y-auto">
                <div className="mb-6">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Linha de cabeçalho</div>
                  <select
                    value={importHeaderRowIndex}
                    onChange={(e) => applyHeaderRowSelection(importSheetMatrix, Number(e.target.value), activeImportSource)}
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                  >
                    {getHeaderRowOptions(importSheetMatrix).map((option) => (
                      <option key={option.index} value={option.index}>
                        {`Linha ${option.index + 1}: ${option.preview}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Cabeçalhos detectados</div>
                <div className="flex flex-wrap gap-3">
                  {importSheetHeaders.map(header => (
                    <span key={header} className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700">
                      {header}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-100 bg-white p-6 overflow-y-auto space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mapeamento sugerido</div>
                {(['company', 'productive_unit', 'user', 'tone', 'award'] as ImportSourceField[]).map(field => (
                  <label key={field} className="space-y-2 block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{IMPORT_FIELD_LABELS[field]}</span>
                    <select
                      value={assistedImportColumns[field]}
                      onChange={(e) => setAssistedImportColumns(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                    >
                      <option value="">Nao mapear</option>
                      {importSheetHeaders.map(header => <option key={header} value={header}>{header}</option>)}
                    </select>
                  </label>
                ))}
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{IMPORT_FIELD_LABELS.badge}</div>
                  <div className="rounded-2xl bg-slate-50 p-4 space-y-2 max-h-56 overflow-y-auto">
                    {importSheetHeaders.map((header) => {
                      const checked = assistedImportBadgeColumns.includes(header);
                      return (
                        <label key={header} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setAssistedImportBadgeColumns((prev) => (
                              checked ? prev.filter((column) => column !== header) : [...prev, header]
                            ))}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <span>{header}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    Selecione uma ou mais colunas de selo. Colunas com o nome do selo no cabeçalho também funcionam.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button type="button" onClick={() => setIsImportMappingModalOpen(false)} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
              <button type="button" onClick={handleConfirmImportMapping} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">Gerar pré-visualização</button>
            </div>
          </div>
        </div>
      )}

      {/* Global Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">pré-visualização da importação</h2>
            <div className="flex-1 overflow-y-auto pr-2 border border-slate-100 rounded-3xl">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr><th className="px-6 py-4">explorador</th><th className="px-6 py-4">empresa</th><th className="px-6 py-4">unidade</th><th className="px-6 py-4">selos</th><th className="px-6 py-4">totais</th><th className="px-6 py-4">observações</th><th className="px-6 py-4">status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {importPreviews.map((p, idx) => (
                    <tr key={idx} className={`text-xs ${p.status === 'invalid' ? 'bg-rose-50/30' : ''}`}>
                      <td className="px-6 py-4"><div className="font-bold text-slate-900">{p.userName}</div>{p.user && <div className="text-[9px] text-emerald-600 font-black uppercase">vincular: {p.user.full_name}</div>}</td>
                      <td className="px-6 py-4 text-slate-500 font-bold">{p.companyName}</td>
                      <td className="px-6 py-4 text-slate-500 font-bold">{p.productiveUnitName}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {p.badges.map((badge) => (
                            <span key={`${p.userName}-${badge.columnName}`} className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold">
                              {badge.badgeName} ({badge.badgeValue})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-bold">
                        {Object.keys(p.numericMeta || {}).length > 0 ? Object.entries(p.numericMeta || {}).map(([key, value]) => `${key}: ${value}`).join(' | ') : '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-bold">
                        {Object.keys(p.textMeta || {}).length > 0 ? Object.entries(p.textMeta || {}).map(([key, value]) => `${key}: ${value}`).join(' | ') : '-'}
                      </td>
                      <td className="px-6 py-4">{p.status === 'valid' ? <span className="text-emerald-700 font-black uppercase">válido</span> : <span className="text-rose-700 font-black uppercase">{p.reason}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-8 flex gap-4">
              <button onClick={() => setIsImportModalOpen(false)} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
              <button onClick={finalizeImport} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700">processar importações</button>
            </div>
          </div>
        </div>
      )}

      {/* User Badges Viewing Modal */}
      {viewingUserBadges && (() => {
        const companyName = companies.find(c => c.id === viewingUserBadges.company_id)?.name || 'Independente';
        const unitName = productiveUnits.find(unit => unit.id === viewingUserBadges.productive_unit_id)?.name || 'Sem unidade produtiva';
        const metrics = getUserMonthlyBadgeMetrics(viewingUserBadges.id, userBadges);

        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-6xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cartela de selos de {viewingUserBadges.full_name}</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
                    {companyName} - {unitName}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-indigo-50 text-indigo-600 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.monthlyScore}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">saldo do mes</div>
                  </div>
                  <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.positiveCount}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">selos ativos</div>
                  </div>
                  <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.lossCount}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">perdas</div>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {badges.map(badge => {
                  const badgeAward = userBadges.find(ub => ub.user_id === viewingUserBadges.id && ub.badge_id === badge.id);
                  const isAssigned = Boolean(badgeAward);

                  return (
                    <div key={badge.id} className="p-6 rounded-[32px] border border-slate-100 bg-slate-50/70">
                      <BadgeCard badge={badge} unlocked={isAssigned} tone={badgeAward?.tone} date={badgeAward?.awarded_at} />
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                            <button
                              key={tone}
                              onClick={() => handleAssignBadgeToUser(viewingUserBadges.id, badge.id, tone)}
                              className={`px-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${badgeAward?.tone === tone ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                            >
                              {BADGE_TONE_LABELS[tone]}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {badgeLegends[badgeAward?.tone || 'bronze']}
                        </p>
                        {isAssigned && (
                          <button onClick={() => handleRemoveBadgeFromUser(viewingUserBadges.id, badge.id)} className="w-full py-3 rounded-2xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all">
                            limpar da cartela
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setViewingUserBadges(null)} className="mt-10 w-full py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">fechar</button>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default AdminPanel;
