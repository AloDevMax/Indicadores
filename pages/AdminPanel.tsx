
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

interface ImportPreview {
  row: Record<string, string>;
  user?: Profile;
  badge?: Badge;
  company?: Company;
  productiveUnit?: ProductiveUnit;
  tone: BadgeTone;
  sourceName: string;
  matchedColumns: Partial<Record<ImportSourceField, string>>;
  status: 'valid' | 'invalid';
  reason?: string;
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
  const isDeveloper = ['developer'].includes(currentUser?.role);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const view = useMemo(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin' || !path) return 'overview';
    return path as 'overview' | 'submissions' | 'users' | 'award' | 'badges' | 'companies';
  }, [location.pathname]);

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
  const [importSheetRows, setImportSheetRows] = useState<Record<string, unknown>[]>([]);
  const [importSheetHeaders, setImportSheetHeaders] = useState<string[]>([]);
  const [assistedImportColumns, setAssistedImportColumns] = useState<Record<ImportSourceField, string>>({
    company: '',
    productive_unit: '',
    user: '',
    badge: '',
    tone: '',
    award: '',
  });
  
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
  const normalizeCompare = (value: unknown) => normalizeCell(value).toLowerCase();

  const parseTone = (value: unknown): BadgeTone => {
    const normalized = normalizeCompare(value);
    if (normalized.includes('ouro') || normalized === 'gold') return 'gold';
    if (normalized.includes('prata') || normalized === 'silver') return 'silver';
    if (normalized.includes('bronze')) return 'bronze';
    if (normalized.includes('loss_2') || normalized.includes('perda 2') || normalized.includes('perda2') || normalized.includes('vermelho intenso')) return 'loss_2';
    if (normalized.includes('loss_1') || normalized.includes('perda 1') || normalized.includes('perda1') || normalized.includes('vermelho')) return 'loss_1';
    return 'bronze';
  };

  const getSourceCell = (row: Record<string, unknown>, field: ImportSourceField, source: ImportSourceConfig) => {
    const columnName = source.columns[field];
    const candidates = [columnName, ...IMPORT_FIELD_ALIASES[field]];
    const matchedKey = Object.keys(row).find(key => candidates.some(candidate => normalizeCompare(key) === normalizeCompare(candidate)));
    return matchedKey ? normalizeCell(row[matchedKey]) : '';
  };

  const getMatchedColumnName = (row: Record<string, unknown>, field: ImportSourceField, source: ImportSourceConfig) => {
    const columnName = source.columns[field];
    const candidates = [columnName, ...IMPORT_FIELD_ALIASES[field]];
    return Object.keys(row).find(key => candidates.some(candidate => normalizeCompare(key) === normalizeCompare(candidate)));
  };

  const renderSquareImage = (src: string, alt: string) => (
    <img
      src={src}
      alt={alt}
      className={cn("w-full h-full object-contain p-2 bg-white"
    />
  );

  const suggestColumnForField = (headers: string[], field: ImportSourceField, source: ImportSourceConfig) => {
    const candidates = [source.columns[field], ...IMPORT_FIELD_ALIASES[field]].map(normalizeCompare);

    const exactMatch = headers.find(header => candidates.includes(normalizeCompare(header)));
    if (exactMatch) return exactMatch;

    const partialMatch = headers.find(header => candidates.some(candidate => normalizeCompare(header).includes(candidate) || candidate.includes(normalizeCompare(header))));
    return partialMatch || '';
  };

  const buildImportPreviews = (rows: Record<string, unknown>[], source: ImportSourceConfig) => {
    const previews: ImportPreview[] = rows.map(row => {
      const matchedColumns: Partial<Record<ImportSourceField, string>> = {
        company: getMatchedColumnName(row, 'company', source),
        productive_unit: getMatchedColumnName(row, 'productive_unit', source),
        user: getMatchedColumnName(row, 'user', source),
        badge: getMatchedColumnName(row, 'badge', source),
        tone: getMatchedColumnName(row, 'tone', source),
        award: getMatchedColumnName(row, 'award', source),
      };
      const companyValue = getSourceCell(row, 'company', source);
      const unitValue = getSourceCell(row, 'productive_unit', source);
      const userValue = getSourceCell(row, 'user', source);
      const badgeValue = getSourceCell(row, 'badge', source);
      const toneValue = getSourceCell(row, 'tone', source);
      const awardValue = getSourceCell(row, 'award', source).toUpperCase();

      const companyFound = companies.find(company => normalizeCompare(company?.name || '') === normalizeCompare(companyValue));
      const productiveUnitFound = productiveUnits.find(unit =>
        normalizeCompare(unit?.name || '') === normalizeCompare(unitValue) &&
        (!companyFound || unit.company_id === companyFound.id)
      );
      const userFound = users.find(user =>
        (normalizeCompare(user.full_name) === normalizeCompare(userValue) || normalizeCompare(user.email) === normalizeCompare(userValue)) &&
        (!companyFound || user.company_id === companyFound.id) &&
        (!productiveUnitFound || user.productive_unit_id === productiveUnitFound.id)
      );
      const badgeFound = badges.find(badge => normalizeCompare(badge?.name || '') === normalizeCompare(badgeValue));
      const tone = parseTone(toneValue);

      let status: 'valid' | 'invalid' = 'valid';
      let reason = '';

      if (!companyFound) { status = 'invalid'; reason = 'empresa nao encontrada'; }
      else if (!productiveUnitFound) { status = 'invalid'; reason = 'unidade produtiva nao encontrada'; }
      else if (!userFound) { status = 'invalid'; reason = 'colaborador nao encontrado na unidade'; }
      else if (!badgeFound) { status = 'invalid'; reason = 'selo nao encontrado'; }
      else if (awardValue && awardValue !== 'S' && awardValue !== 'SIM') { status = 'invalid'; reason = 'premiacao nao autorizada'; }

      return {
        row: {
          ...Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizeCell(value)])),
          explorador: userValue,
          empresa: companyValue,
          unidade_produtiva: unitValue,
          selo: badgeValue,
          premio: awardValue,
          marcacao: toneValue || tone,
        },
        user: userFound,
        badge: badgeFound,
        company: companyFound,
        productiveUnit: productiveUnitFound,
        tone,
        sourceName: source?.name || 'Fonte sem nome',
        matchedColumns,
        status,
        reason,
      };
    });

    return previews;
  };

  const upsertUserBadge = (targetUserId: string, badgeId: string, tone: BadgeTone) => {
    const existingAward = userBadges.find(ub => ub.user_id === targetUserId && ub.badge_id === badgeId);

    if (existingAward) {
      setUserBadges(prev => prev.map(ub => ub.id === existingAward.id ? { ...ub, tone, awarded_at: new Date().toISOString(), awarded_by: safeAdminProfile.id } : ub));
      return;
    }

    const newAward: UserBadge = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: targetUserId,
      badge_id: badgeId,
      awarded_at: new Date().toISOString(),
      awarded_by: safeAdminProfile.id,
      tone,
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
        alert(`SolicitaÃ§Ã£o ${status === 'approved' ? 'aprovada e selo concedido' : 'rejeitada'}.`);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Falha ao revisar solicitaÃ§Ã£o.');
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
    const formData = new FormData(e.currentTarget);
    const badgeData: Badge = {
      id: editingBadge?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      points: Number(formData.get('points')),
      category: formData.get('category') as string,
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
      name: formData.get('name') as string,
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
    const validProductiveUnitId = productiveUnitId && productiveUnits.some(unit => unit.id === productiveUnitId && unit.company_id === companyId)
      ? productiveUnitId
      : undefined;

    const userData: Profile = {
      id: editingUser?.id || '',
      email: formData.get('email') as string,
      full_name: formData.get('full_name') as string,
      avatar_url: tempUserAvatarUrl || editingUser?.avatar_url,
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
      if (onDeleteUser) {
        await onDeleteUser(userToDelete.id);
      }
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setIsDeleteUserModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCompany = async () => {
    if (companyToDelete) {
      if (onDeleteCompany) {
        await onDeleteCompany(companyToDelete.id);
      }
      setCompanies(prev => prev.filter(c => c.id !== companyToDelete.id));
      setIsDeleteCompanyModalOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleAwardBadges = async () => {
    if (selectedUsers.length === 0 || !selectedAwardBadge) return;
    const badge = badges.find(b => b.id === selectedAwardBadge);

    if (onAwardBadges) {
      await onAwardBadges(selectedUsers, selectedAwardBadge, selectedAwardTone);
    } else {
      selectedUsers.forEach(userId => upsertUserBadge(userId, selectedAwardBadge, selectedAwardTone));
    }

    if (badge) {
      setUsers(prev => prev.map(u => {
        if (!selectedUsers.includes(u?.id)) return u;

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
  };

  const handleAssignBadgeToUser = async (targetUserId: string, badgeId: string, tone: BadgeTone) => {
    if (onAwardBadges) {
      await onAwardBadges([targetUserId], badgeId, tone);
      return;
    }
    upsertUserBadge(targetUserId, badgeId, tone);
  };

  const handleRemoveBadgeFromUser = async (targetUserId: string, badgeId: string) => {
    const badgeAward = userBadges.find(ub => ub.user_id === targetUserId && ub.badge_id === badgeId);
    if (!badgeAward) return;

    if (onRemoveUserBadge) {
      await onRemoveUserBadge(targetUserId, badgeId);
      return;
    }

    setUserBadges(prev => prev.filter(ub => ub.id !== badgeAward.id));
  };
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeImportSource) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
      const headers = Object.keys(data[0] || {});
      const suggestedColumns: Record<ImportSourceField, string> = {
        company: suggestColumnForField(headers, 'company', activeImportSource),
        productive_unit: suggestColumnForField(headers, 'productive_unit', activeImportSource),
        user: suggestColumnForField(headers, 'user', activeImportSource),
        badge: suggestColumnForField(headers, 'badge', activeImportSource),
        tone: suggestColumnForField(headers, 'tone', activeImportSource),
        award: suggestColumnForField(headers, 'award', activeImportSource),
      };

      setImportSheetRows(data);
      setImportSheetHeaders(headers);
      setAssistedImportColumns(suggestedColumns);
      setIsImportMappingModalOpen(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImportMapping = () => {
    if (!activeImportSource || importSheetRows.length === 0) return;

    const mappedSource: ImportSourceConfig = {
      ...activeImportSource,
      columns: assistedImportColumns,
    };

    const previews = buildImportPreviews(importSheetRows, mappedSource);
    setImportPreviews(previews);

    const firstPreview = previews[0];
    if (firstPreview) {
      setImportBindingSnapshot({
        sourceId: mappedSource?.id || fallbackImportSource.id,
        sourceName: mappedSource?.name || fallbackImportSource.name,
        matchedColumns: firstPreview.matchedColumns,
        importedAt: new Date().toISOString(),
      });
    }

    setIsImportMappingModalOpen(false);
    setIsImportModalOpen(true);
  };

  const finalizeImport = async () => {
    const valid = importPreviews.filter(p => p.status === 'valid');
    if (valid.length === 0) return;

    if (onPersistImport && activeImportSource) {
      const importedCount = await onPersistImport(
        activeImportSource.id || fallbackImportSource.id,
        activeImportSource?.name || fallbackImportSource.name,
        importPreviews[0]?.matchedColumns || {},
        importPreviews.map(preview => ({
          row: preview.row,
          user_id: preview.user?.id,
          badge_id: preview.badge?.id,
          tone: preview.tone,
          status: preview.status,
          reason: preview.reason,
        })),
      );
      alert(`${importedCount} importacoes concluidas.`);
    } else {
      valid.forEach(p => {
        if (p.user?.id && p.badge?.id) {
          upsertUserBadge(p.user.id, p.badge.id, p.tone);
        }
      });
      alert(`${valid.length} importacoes concluidas.`);
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
    <div className={cn("space-y-8 animate-in fade-in duration-500">
      
      {/* Switcher */}
      {view === 'overview' && (
        <div className={cn("flex justify-center mb-10">
          <div className={cn("bg-slate-200/50 p-1.5 rounded-[24px] flex gap-1 shadow-inner">
            <button onClick={() => setActiveMode('management')} className={cn(`px-8 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'management' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>📊 Gestão Operacional</button>
            <button onClick={() => setActiveMode('personal')} className={cn(`px-8 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'personal' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>👤 Minha Jornada</button>
          </div>
        </div>
      )}

      {activeMode === 'management' ? (
        <div className={cn("space-y-10 pb-20">
          {view === 'overview' && (
            <div className={cn("space-y-10">
              <header className={cn("flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h2 className={cn("text-3xl font-black text-slate-900 tracking-tight">Centro de Comando</h2>
                  <p className={cn("text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Hierarquia e Performance Operacional</p>
                </div>
              </header>

              <div className={cn("grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { label: 'Colaboradores', val: stats.totalUsers, icon: '👥' },
                  { label: 'Selos Ativos', val: stats.activeBadges, icon: '🛡️' },
                  { label: 'Pendências', val: stats.pendingSubmissions, icon: '📨', color: 'text-amber-600' },
                  { label: 'Empresas', val: stats.totalCompanies, icon: '🏢', color: 'text-emerald-600' },
                ].map((kpi, idx) => (
                  <div key={idx} className={cn("bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className={cn("relative z-10">
                      <div className={cn(={cn('text-3xl font-black leading-none', kpi.color ?? 'text-slate-900')}>{kpi.val}</div>
                      <div className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{kpi.label}</div>
                    </div>
                    <div className={cn("absolute right-[-10px] bottom-[-10px] text-6xl opacity-[0.03] group-hover:rotate-12 transition-transform">{kpi.icon}</div>
                  </div>
                ))}
              </div>

              <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={cn("bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                  <h3 className={cn("text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><span>🏢</span> Empresas no Ecossistema</h3>
                  <div className={cn("space-y-4">
                    {companies.map(c => (
                  <div key={c.id} className={cn("bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg space-y-5 group hover:border-indigo-200 transition-all">
                    <div className={cn("flex items-center justify-between gap-4">
                      <div className={cn("flex items-center gap-4">
                        <div className={cn("w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                          {c.logo_url ? (
                            renderSquareImage(c.logo_url, c.name)
                          ) : (
                            '🏢'
                          )}
                        </div>
                        <div>
                          <div className={cn("font-bold text-slate-900 text-sm tracking-tight">{c?.name || 'Empresa sem nome'}</div>
                          <div className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">{users.filter(u => u.company_id === c.id).length} colaboradores • {getUnitsByCompany(c.id).length} unidades</div>
                        </div>
                      </div>
                      {isDeveloper && <div className={cn("flex gap-2">
                        <button onClick={() => openCompanyModal(c)} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                        <button onClick={() => { setCompanyToDelete(c); setIsDeleteCompanyModalOpen(true); }} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                      </div>}
                    </div>
                    <div className={cn("space-y-3">
                      {getUnitsByCompany(c.id).length > 0 ? getUnitsByCompany(c.id).map(unit => (
                        <div key={unit.id} className={cn("flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div>
                            <div className={cn("font-bold text-slate-900 text-sm">{unit?.name || 'Unidade sem nome'}</div>
                            <div className={cn("text-[10px] font-black text-cyan-600 uppercase tracking-widest">{users.filter(user => user.productive_unit_id === unit.id).length} colaboradores</div>
                          </div>
                          <button onClick={() => { setEditingProductiveUnit(unit); setIsProductiveUnitModalOpen(true); }} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-cyan-600 hover:bg-white rounded-xl transition-all">✏️</button>
                        </div>
                      )) : <div className={cn("p-4 bg-slate-50 rounded-2xl text-sm text-slate-400 font-bold">Nenhuma unidade produtiva cadastrada.</div>}
                    </div>
                  </div>
                ))}
                  </div>
                </div>
                <div className={cn("bg-indigo-900 p-8 rounded-[40px] shadow-2xl text-white">
                  <h3 className={cn("text-sm font-black text-indigo-200 uppercase tracking-widest mb-6">📡 Atividade de Rede</h3>
                  <div className={cn("space-y-4">
                    {submissions.slice(0, 3).map(sub => (
                      <div key={sub.id} className={cn("bg-white/10 p-4 rounded-xl border border-white/5 text-xs">
                        <span className={cn("font-black text-indigo-300">{sub.user_name}</span> solicitou <span className={cn("font-black text-white">{sub.badge_name}</span>
                      </div>
                    ))}
                    {submissions.length === 0 && <p className={cn("text-xs text-indigo-300">Nenhuma atividade recente.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'submissions' && (
            <div className={cn("space-y-8 animate-in fade-in">
              <h2 className={cn("text-3xl font-black text-slate-900 tracking-tight">Pedidos de Validação</h2>
              <div className={cn("space-y-4">
                {submissions.filter(s => s.status === 'pending').map(sub => {
                  const user = users.find(u => u.id === sub.user_id);
                  const company = companies.find(c => c.id === user?.company_id);
                  return (
                    <div key={sub.id} className={cn("bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg flex flex-col md:flex-row gap-6">
                      <div className={cn("flex-1 space-y-3">
                        <div className={cn("flex flex-wrap items-center gap-3">
                          <span className={cn("bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{sub.badge_name}</span>
                          <span className={cn("text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {sub.user_name} • {company?.name || 'Independente'}
                          </span>
                        </div>
                        <p className={cn("text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl italic">"{sub.description}"</p>
                      </div>
                      <div className={cn("flex md:flex-col gap-2 min-w-[140px]">
                        <button onClick={() => handleReviewSubmission(sub.id, 'approved')} className={cn("bg-emerald-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">Validar & Premiar</button>
                        <button onClick={() => handleReviewSubmission(sub.id, 'rejected')} className={cn("bg-white text-rose-500 border border-rose-100 px-6 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-rose-50 transition-all">Recusar</button>
                      </div>
                    </div>
                  );
                })}
                {submissions.filter(s => s.status === 'pending').length === 0 && (
                  <div className={cn("py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                    <span className={cn("text-5xl block mb-4">✅</span>
                    <p className={cn("text-slate-400 font-bold text-sm uppercase tracking-widest">Fila de Solicitações Vazia</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'users' && (
            <div className={cn("space-y-6">
              <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className={cn("text-3xl font-black text-slate-900 tracking-tight">Colaboradores da Rede</h2>
                <div className={cn("flex flex-wrap gap-2">
                  <select 
                    value={selectedCompanyFilter}
                    onChange={(e) => {
                      setSelectedCompanyFilter(e.target.value);
                      setSelectedProductiveUnitFilter('');
                    }}
                    className={cn("px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    <option value="">Todas as Empresas</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c?.name || 'Empresa sem nome'}</option>)}
                  </select>
                  <select 
                    value={selectedProductiveUnitFilter}
                    onChange={(e) => setSelectedProductiveUnitFilter(e.target.value)}
                    className={cn("px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    <option value="">Todas as Unidades</option>
                    {(selectedCompanyFilter ? getUnitsByCompany(selectedCompanyFilter) : productiveUnits).map(unit => <option key={unit.id} value={unit.id}>{unit?.name || 'Unidade sem nome'}</option>)}
                  </select>
                  <button onClick={() => setIsBulkInviteModalOpen(true)} className={cn("bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"><span>📨</span> Convites em Lote</button>
                  <button onClick={() => openUserModal()} className={cn("bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Novo Colaborador</button>
                </div>
              </div>
              <div className={cn("bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                <table className={cn("w-full text-left">
                  <thead className={cn("bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className={cn("px-10 py-6">Nome / Empresa / Unidade</th>
                      <th className={cn("px-10 py-6">NíResumo do M?s</th>
                      <th className={cn("px-10 py-6 text-right">Opções</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y divide-slate-50">
                    {filteredUsers.filter(Boolean).map(u => {
                      const comp = companies.find(c => c.id === u.company_id);
                      const unit = productiveUnits.find(item => item.id === u.productive_unit_id);
                      const metrics = getUserMonthlyBadgeMetrics(u.id, userBadges);
                      return (
                        <tr key={u.id} className={cn("group hover:bg-slate-50/50">
                          <td className={cn("px-10 py-6">
                            <div className={cn("flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {u.avatar_url ? (
                                  <img src={u.avatar_url} alt={u.full_name} className={cn("w-full h-full object-cover" />
                                ) : (
                                  <span className={cn("text-lg">👤</span>
                                )}
                              </div>
                              <div className={cn("flex-1">
                                <div className={cn("font-bold text-slate-900 text-sm">{u.full_name}</div>
                                <div className={cn("text-[10px] text-indigo-600 font-black uppercase tracking-widest">{comp?.name || 'Independente'}</div>
                                <div className={cn("text-[10px] text-cyan-600 font-black uppercase tracking-widest">{unit?.name || 'Sem unidade produtiva'}</div>
                                <div className={cn("text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className={cn("px-10 py-6">
                            <div className={cn("flex items-center gap-3 flex-wrap">
                              <span className={cn("bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Saldo {metrics.monthlyScore}</span>
                              <span className={cn("text-[10px] font-black text-slate-400 uppercase">{metrics.positiveCount} selos</span>
                              <span className={cn("text-[10px] font-black text-rose-500 uppercase">{metrics.lossCount} perdas</span>
                            </div>
                          </td>
                          <td className={cn("px-10 py-6 text-right">
                            <div className={cn("flex items-center justify-end gap-2">
                              <button onClick={() => setViewingUserBadges(u)} className={cn("text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl">ver conquistas</button>
                              <button onClick={() => openUserModal(u)} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                              <button onClick={() => { setUserToDelete(u); setIsDeleteUserModalOpen(true); }} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
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
            <div className={cn("space-y-8 animate-in fade-in">
              <header className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className={cn("text-3xl font-black text-slate-900 tracking-tight">Premiar Colaboradores</h2>
                  <p className={cn("text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Recompense ações excepcionais em lote</p>
                </div>
                <div className={cn(={cn('flex gap-2 flex-wrap')}>
                  <select
                    value={selectedImportSourceId}
                    onChange={(e) => setSelectedImportSourceId(e.target.value)}
                    className={cn("px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    {importSources
                    .filter(Boolean)
                    .map(source => (
                    <option key={source.id} value={source.id}>
                       {source.name || 'Fonte sem nome'}
                         </option>
                          ))}
                  </select>
                  <button onClick={() => { setEditingImportSource(activeImportSource || null); setIsImportSourceModalOpen(true); }} className={cn("bg-white text-indigo-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-indigo-100 shadow-sm">
                    Configurar fonte
                  </button>
                  <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleExcelImport} className={cn("absolute opacity-0 pointer-events-none"/>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn("bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3"
                  >
                    <span>Arquivo</span> Importar Excel
                  </button>
                </div>
              </header>

              <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={cn("bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex flex-col min-h-[500px]">
                  <div className={cn("mb-6 flex items-center justify-between">
                    <h3 className={cn("text-sm font-black text-slate-900 uppercase tracking-widest">1. selecione colaboradores</h3>
                    <div className={cn("bg-slate-50 px-3 py-1 rounded-lg text-[10px] font-black text-indigo-600">{selectedUsers.length} selecionados</div>
                  </div>
                  <input type="text" placeholder="Buscar colaborador..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className={cn("w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm mb-6 outline-none focus:ring-2 focus:ring-indigo-600" />
                  <div className={cn("flex-1 overflow-y-auto space-y-2 pr-2">
                    {filteredUsers.filter(Boolean).map(u => (
                      <button key={u.id} onClick={() => toggleUserSelection(u.id)} className={cn(`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedUsers.includes(u?.id) ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
                        <div className={cn("flex items-center gap-4">
                          <div className={cn(`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${selectedUsers.includes(u?.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>👤</div>
                          <div className={cn("text-left">
                            <div className={cn("font-bold text-sm text-slate-900">{u.full_name}</div>
                            <div className={cn("text-[9px] font-black text-slate-400 uppercase tracking-widest">Nv {u.level} • {companies.find(c => c.id === u.company_id)?.name}</div>
                          </div>
                        </div>
                        {selectedUsers.includes(u?.id) && <span className={cn("text-xl">✅</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cn("space-y-8">
                  {activeImportSource && (
                    <div className={cn("bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-4">
                      <div className={cn("flex items-center justify-between gap-4">
                        <div>
                          <h3 className={cn("text-sm font-black text-slate-900 uppercase tracking-widest">Fonte vinculada</h3>
                          <p className={cn("text-sm font-bold text-slate-900 mt-2">{activeImportSource?.name || 'Fonte sem nome'}</p>
                        </div>
                        <button onClick={() => { setEditingImportSource(activeImportSource); setIsImportSourceModalOpen(true); }} className={cn("px-4 py-3 rounded-2xl bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest">
                          editar mapeamento
                        </button>
                      </div>
                      <p className={cn("text-xs text-slate-500">{activeImportSource.description || 'Sem descrição cadastrada.'}</p>
                      <div className={cn("grid grid-cols-2 gap-3">
                        {(Object.entries(activeImportSource.columns) as [ImportSourceField, string][]).map(([field, column]) => (
                          <div key={field} className={cn("rounded-2xl bg-slate-50 px-4 py-3">
                            <div className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400">{IMPORT_FIELD_LABELS[field]}</div>
                            <div className={cn("text-sm font-bold text-slate-900 mt-1">{column}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={cn("bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                    <h3 className={cn("text-sm font-black text-slate-900 uppercase tracking-widest mb-6">2. Escolha a Recompensa</h3>
                    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {badges.map(badge => (
                        <button key={badge.id} onClick={() => setSelectedAwardBadge(badge.id)} className={cn(`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selectedAwardBadge === badge.id ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden bg-slate-100">
                            {badge.image_url ? (
                              renderSquareImage(badge.image_url, badge.name)
                            ) : (
                              <span>{badge.icon_name}</span>
                            )}
                          </div>
                          <div>
                            <div className={cn("font-bold text-sm text-slate-900 leading-none mb-1">{badge?.name || 'Badge sem nome'}</div>
                            <div className={cn("text-[10px] font-black text-indigo-600 uppercase tracking-widest">{badge.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={cn("bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                    <h3 className={cn("text-sm font-black text-slate-900 uppercase tracking-widest mb-6">3. Escolha a marcação do mês</h3>
                    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                        <button
                          key={tone}
                          onClick={() => setSelectedAwardTone(tone)}
                          className={cn(={cn(
                            'px-4 py-4 rounded-2xl border-2 text-left transition-all',
                            selectedAwardTone === tone
                              ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                              : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                          )}
                        >
                          <div className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400">{BADGE_TONE_LABELS[tone]}</div>
                          <div className={cn("text-sm font-bold text-slate-900 mt-2">{badgeLegends[tone]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={cn("bg-white p-5 rounded-xl border border-slate-200 mb-4">
                    <label className={cn("flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={sendEmailOnAward} onChange={(e) => setSendEmailOnAward(e.target.checked)} className={cn("h-4 w-4" />
                      Enviar notificação por e-mail aos colaboradores ao premiar
                    </label>
                  </div>
                  <div className={cn("bg-indigo-900 p-10 rounded-[40px] shadow-2xl text-white text-center space-y-6">
                    <h3 className={cn("text-sm font-black text-indigo-200 uppercase tracking-widest">4. Confirmar premiação</h3>
                    <button onClick={handleAwardBadges} className={cn("w-full py-6 bg-white text-indigo-900 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all disabled:opacity-50" disabled={selectedUsers.length === 0 || !selectedAwardBadge}>Conceder selos agora</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'badges' && (
            <div className={cn("space-y-8 animate-in fade-in">
              <div className={cn("flex justify-between items-center gap-4 flex-wrap">
                <h2 className={cn("text-3xl font-black text-slate-900 tracking-tight">Biblioteca de Selos</h2>
                <button onClick={() => openBadgeModal()} className={cn("bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Novo Selo</button>
              </div>

              <div className={cn("bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setIsLegendCollapsed(prev => !prev)}
                  className={cn("w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div>
                    <div className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400">Legenda das Cores</div>
                    <div className={cn("text-sm font-bold text-slate-900 mt-1">Bronze, prata, ouro e perdas em vermelho</div>
                  </div>
                  <span className={cn("text-xs font-black uppercase tracking-widest text-indigo-600">{isLegendCollapsed ? 'Expandir' : 'Minimizar'}</span>
                </button>
                {!isLegendCollapsed && (
                  <div className={cn("border-t border-slate-100 px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                      <label key={tone} className={cn("space-y-2">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400">{BADGE_TONE_LABELS[tone]}</span>
                        <input
                          value={badgeLegends[tone]}
                          onChange={(e) => handleLegendChange(tone, e.target.value)}
                          className={cn("w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6">
                {badges.map(badge => (
                  <div key={badge.id} className={cn("bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className={cn("flex items-center gap-4">
                      <div className={cn("w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                        {badge.image_url ? (
                          renderSquareImage(badge.image_url, badge.name)
                        ) : (
                          <span>{badge.icon_name}</span>
                        )}
                      </div>
                      <div>
                        <div className={cn("font-bold text-slate-900 text-sm">{badge?.name || 'Badge sem nome'}</div>
                        <div className={cn("text-[10px] font-black text-indigo-600 uppercase tracking-widest">{badge.category}</div>
                      </div>
                    </div>
                    <div className={cn("flex gap-1">
                      <button onClick={() => openBadgeModal(badge)} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                      <button onClick={() => { setBadgeToDelete(badge); setIsDeleteBadgeModalOpen(true); }} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'companies' && (
            <div className={cn("space-y-8 animate-in fade-in">
              <div className={cn("flex justify-between items-center">
                <h2 className={cn("text-3xl font-black text-slate-900 tracking-tight">Ecossistema Corporativo</h2>
                <div className={cn("flex gap-2">
                  <button onClick={() => { setEditingProductiveUnit(null); setIsProductiveUnitModalOpen(true); }} className={cn("bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Nova Unidade</button>
                  {isDeveloper && <button onClick={() => openCompanyModal()} className={cn("bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Nova Empresa</button>}
                </div>
              </div>
              <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6">
                {companies.map(c => (
                  <div key={c.id} className={cn("bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg flex items-center justify-between group hover:border-indigo-200 transition-all flex-col md:flex-row gap-4">
                    <div className={cn("flex items-center gap-4 flex-1">
                      <div className={cn("w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0 overflow-hidden">
                        {c.logo_url ? (
                          renderSquareImage(c.logo_url, c.name)
                        ) : (
                          '🏢'
                        )}
                      </div>
                      <div className={cn("font-bold text-slate-900 text-sm tracking-tight">{c?.name || 'Empresa sem nome'}</div>
                    </div>
                    {isDeveloper && <div className={cn("flex gap-2">
                      <button onClick={() => openCompanyModal(c)} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">✏️</button>
                      <button onClick={() => { setCompanyToDelete(c); setIsDeleteCompanyModalOpen(true); }} className={cn("w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                    </div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={cn("space-y-12 animate-in fade-in duration-500">
          <header className={cn("flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
            <div>
              <h2 className={cn("text-3xl font-black text-slate-900 tracking-tight">Olá, Gestor {adminProfile.full_name.split(' ')[0]}</h2>
              <p className={cn("text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Sua Própria Jornada de Qualidade</p>
            </div>
            <button onClick={onOpenSolicitation} className={cn("bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl flex items-center gap-3 transition-all active:scale-95">✨ Solicitar Meu Selo</button>
          </header>

          <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={cn("lg:col-span-2 bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-10">
              <div className={cn("relative group">
                <div className={cn("w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl shadow-2xl shadow-indigo-200">🛡️</div>
                <div className={cn("absolute -bottom-3 -right-3 bg-yellow-400 text-slate-900 min-w-[56px] h-12 px-3 rounded-2xl flex items-center justify-center font-black border-4 border-white text-sm">{adminMonthlyMetrics.monthlyScore}</div>
              </div>
              <div className={cn("flex-1 w-full space-y-4">
                <div className={cn("flex justify-between items-end">
                  <h3 className={cn("text-2xl font-black text-slate-900">NíSaldo do m?s</h3>
                  <div className={cn("text-sm font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">{adminMonthlyMetrics.positiveCount} selos / {adminMonthlyMetrics.lossCount} perdas</div>
                </div>
                <div className={cn("w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white"><div className={cn("h-full bg-indigo-600" style={{ width: `${Math.min(100, Math.max(0, (adminMonthlyMetrics.positiveCount / 3) * 100))}%` }}></div></div>
              </div>
            </div>
            <div className={cn("bg-indigo-600 p-10 rounded-[40px] shadow-xl shadow-indigo-200 text-white flex flex-col justify-center items-center text-center space-y-2">
              <div className={cn("text-5xl font-black">{userBadges.filter(ub => ub.user_id === adminProfile.id).length}</div>
              <div className={cn("font-black uppercase text-[10px] tracking-[0.3em] opacity-80">Selos Conquistados</div>
            </div>
          </div>

          <div className={cn("space-y-8">
            <h3 className={cn("text-2xl font-black text-slate-900 tracking-tight">Minha Galeria</h3>
            <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <div className={cn("fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className={cn("text-2xl font-black text-slate-900 mb-8 tracking-tight">Convites em Lote</h2>
            <form onSubmit={handleBulkInvite} className={cn("space-y-5">
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Empresa de Destino</label>
                <select 
                  value={bulkInviteCompanyId}
                  onChange={(e) => {
                    setBulkInviteCompanyId(e.target.value);
                    setBulkInviteProductiveUnitId('');
                  }}
                  className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                  required
                >
                  <option value="">Selecionar empresa...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c?.name || 'Empresa sem nome'}</option>)}
                </select>
              </div>
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unidade Produtiva</label>
                <select
                  value={bulkInviteProductiveUnitId}
                  onChange={(e) => setBulkInviteProductiveUnitId(e.target.value)}
                  className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                >
                  <option value="">Selecionar unidade...</option>
                  {getUnitsByCompany(bulkInviteCompanyId).map(unit => <option key={unit.id} value={unit.id}>{unit?.name || 'Unidade sem nome'}</option>)}
                </select>
              </div>
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lista de E-mails</label>
                <textarea 
                  value={bulkInviteEmails}
                  onChange={(e) => setBulkInviteEmails(e.target.value)}
                  className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 min-h-[160px] outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="Insira um e-mail por linha ou separados por vírgula..."
                  required
                ></textarea>
                <p className={cn("text-[9px] text-slate-400 font-bold uppercase mt-1 px-1 tracking-widest">E-mails inválidos serão ignorados automaticamente.</p>
              </div>
              <div className={cn("flex gap-4 pt-4">
                <button type="button" onClick={() => setIsBulkInviteModalOpen(false)} className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-all">Enviar Convites 📨</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className={cn("fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className={cn("text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingUser ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
            <form onSubmit={handleSaveUser} className={cn("space-y-5">
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                <input name="full_name" defaultValue={editingUser?.full_name} style={{ textTransform: 'none' }} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" placeholder="Ex: João Silva" required />
              </div>
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail Corporativo</label>
                <input name="email" type="email" defaultValue={editingUser?.email} style={{ textTransform: 'none' }} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" placeholder="Ex: joao@empresa.com" required />
              </div>
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha de Acesso {!editingUser && '(Opcional - padrão: changeme123)'}</label>
                <input name="password" type="password" style={{ textTransform: 'none' }} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" placeholder={editingUser ? "Deixe vazio para manter atual" : "Digite uma senha"} />
              </div>
              <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Função</label>
                  <select name="role" defaultValue={editingUser?.role || 'user'} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                    <option value="user">Colaborador</option>
                    <option value="admin">Gestor</option>
                  </select>
                </div>
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa</label>
                  <select name="company_id" defaultValue={editingUser?.company_id || ''} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                    <option value="">Nenhuma (Independente)</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c?.name || 'Empresa sem nome'}</option>)}
                  </select>
                </div>
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Produtiva</label>
                  <select name="productive_unit_id" defaultValue={editingUser?.productive_unit_id || ''} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
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
              <div className={cn("flex gap-4 pt-4">
                <button type="button" onClick={closeUserModal} className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">{editingUser ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteUserModalOpen && (
        <div className={cn("fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 text-center">
            <div className={cn("text-5xl mb-6">⚠️</div>
            <h2 className={cn("text-xl font-black text-slate-900 mb-2 tracking-tight">Excluir Explorador?</h2>
            <p className={cn("text-slate-500 text-sm mb-8">Esta ação removerá <b>{userToDelete?.full_name}</b> e todo seu histórico de conquistas permanentemente.</p>
            <div className={cn("flex gap-4">
              <button onClick={() => { setIsDeleteUserModalOpen(false); setUserToDelete(null); }} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
              <button onClick={handleDeleteUser} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Modal */}
      {isBadgeModalOpen && (
        <div className={cn("fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className={cn("text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">{editingBadge ? 'Editar Selo' : 'Novo Selo'}</h2>
            <form onSubmit={handleSaveBadge} className={cn("space-y-5">
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Conquista</label>
                <input name="name" defaultValue={editingBadge?.name} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição da Missão</label>
                <textarea name="description" defaultValue={editingBadge?.description} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 min-h-[100px] text-slate-900" required />
              </div>
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Legenda de apoio</label>
                <input name="points" type="number" defaultValue={editingBadge?.points} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-center text-slate-900" required />
              </div>
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Operacional</label>
                <select name="category" defaultValue={editingBadge?.category} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
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
              <div className={cn("flex gap-4 pt-4">
                <button type="button" onClick={closeBadgeModal} className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">{editingBadge ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Badge Confirmation Modal */}
      {isDeleteBadgeModalOpen && (
        <div className={cn("fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 text-center">
            <div className={cn("text-5xl mb-6">⚠️</div>
            <h2 className={cn("text-xl font-black text-slate-900 mb-2 tracking-tight">Excluir Selo?</h2>
            <p className={cn("text-slate-500 text-sm mb-8">O selo <b>{badgeToDelete?.name}</b> será removido permanentemente da biblioteca.</p>
            <div className={cn("flex gap-4">
              <button onClick={() => { setIsDeleteBadgeModalOpen(false); setBadgeToDelete(null); }} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
              <button onClick={handleDeleteBadge} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {isCompanyModalOpen && (
        <div className={cn("fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className={cn("text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingCompany ? 'editar empresa' : 'nova empresa'}</h2>
            <form onSubmit={handleSaveCompany} className={cn("space-y-6">
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">nome da organização</label>
                <input name="name" defaultValue={editingCompany?.name} className={cn("w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <ImageUpload
                label="Logo da Empresa (Opcional)"
                currentImageUrl={tempCompanyLogoUrl || editingCompany?.logo_url}
                onImageUpload={setTempCompanyLogoUrl}
                uploadEndpoint="company-logo"
                fieldName="logo"
              />
              <div className={cn("flex gap-4 pt-4">
                <button type="button" onClick={closeCompanyModal} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
                <button type="submit" className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700">{editingCompany ? 'atualizar' : 'cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteCompanyModalOpen && companyToDelete && (
        <div className={cn("fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className={cn("text-2xl font-black text-slate-900 mb-4 tracking-tight">deletar empresa?</h2>
            <p className={cn("text-sm text-slate-600 mb-8">Tem certeza que deseja deletar <strong>{companyToDelete.name}</strong>? Esta ação não pode ser desfeita.</p>
            <div className={cn("flex gap-4">
              <button type="button" onClick={() => { setIsDeleteCompanyModalOpen(false); setCompanyToDelete(null); }} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-colors">cancelar</button>
              <button type="button" onClick={handleDeleteCompany} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 transition-colors">deletar</button>
            </div>
          </div>
        </div>
      )}

      {isProductiveUnitModalOpen && (
        <div className={cn("fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className={cn("text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingProductiveUnit ? 'editar unidade produtiva' : 'nova unidade produtiva'}</h2>
            <form onSubmit={handleSaveProductiveUnit} className={cn("space-y-6">
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">empresa</label>
                <select name="company_id" defaultValue={editingProductiveUnit?.company_id || ''} className={cn("w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required>
                  <option value="">Selecionar empresa...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c?.name || 'Empresa sem nome'}</option>)}
                </select>
              </div>
              <div className={cn("space-y-2">
                <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">nome da unidade</label>
                <input name="name" defaultValue={editingProductiveUnit?.name} className={cn("w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
              </div>
              <div className={cn("flex gap-4 pt-4">
                <button type="button" onClick={() => { setIsProductiveUnitModalOpen(false); setEditingProductiveUnit(null); }} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
                <button type="submit" className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-cyan-600 text-white rounded-2xl shadow-xl hover:bg-cyan-700">{editingProductiveUnit ? 'atualizar' : 'cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportSourceModalOpen && (
        <div className={cn("fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className={cn("text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingImportSource ? 'Editar fonte Excel' : 'Nova fonte Excel'}</h2>
            <form onSubmit={handleSaveImportSource} className={cn("space-y-5">
              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Fonte</label>
                  <input name="name" defaultValue={editingImportSource?.name} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">DescriÃ§Ã£o</label>
                  <input name="description" defaultValue={editingImportSource?.description} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" />
                </div>
              </div>
              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Empresa</label>
                  <input name="company_column" defaultValue={editingImportSource?.columns.company || 'empresa'} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Unidade</label>
                  <input name="productive_unit_column" defaultValue={editingImportSource?.columns.productive_unit || 'unidade_produtiva'} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Colaborador</label>
                  <input name="user_column" defaultValue={editingImportSource?.columns.user || 'explorador'} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna Selo</label>
                  <input name="badge_column" defaultValue={editingImportSource?.columns.badge || 'selo'} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" required />
                </div>
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna MarcaÃ§Ã£o</label>
                  <input name="tone_column" defaultValue={editingImportSource?.columns.tone || 'marcacao'} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" />
                </div>
                <div className={cn("space-y-2">
                  <label className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest">Coluna AutorizaÃ§Ã£o</label>
                  <input name="award_column" defaultValue={editingImportSource?.columns.award || 'premio'} className={cn("w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900" />
                </div>
              </div>
              <div className={cn("flex gap-4 pt-4">
                <button type="button" onClick={() => { setIsImportSourceModalOpen(false); setEditingImportSource(null); }} className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">Salvar Fonte</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportMappingModalOpen && activeImportSource && (
        <div className={cn("fixed inset-0 z-[125] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-4xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <h2 className={cn("text-2xl font-black text-slate-900 mb-3 tracking-tight">Mapeamento assistido do Excel</h2>
            <p className={cn("text-sm text-slate-500 mb-8">Revise os cabeçalhos detectados antes de gerar a pré-visualização dos selos.</p>

            <div className={cn("grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 flex-1 overflow-hidden">
              <div className={cn("rounded-[32px] border border-slate-100 bg-slate-50/70 p-6 overflow-y-auto">
                <div className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Cabeçalhos detectados</div>
                <div className={cn("flex flex-wrap gap-3">
                  {importSheetHeaders.map(header => (
                    <span key={header} className={cn("px-4 py-2 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700">
                      {header}
                    </span>
                  ))}
                </div>
              </div>

              <div className={cn("rounded-[32px] border border-slate-100 bg-white p-6 overflow-y-auto space-y-4">
                <div className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400">Mapeamento sugerido</div>
                {(['company', 'productive_unit', 'user', 'badge', 'tone', 'award'] as ImportSourceField[]).map(field => (
                  <label key={field} className={cn("space-y-2 block">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400">{field}</span>
                    <select
                      value={assistedImportColumns[field]}
                      onChange={(e) => setAssistedImportColumns(prev => ({ ...prev, [field]: e.target.value }))}
                      className={cn("w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                    >
                      <option value="">Nao mapear</option>
                      {importSheetHeaders.map(header => <option key={header} value={header}>{header}</option>)}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            <div className={cn("flex gap-4 pt-8">
              <button type="button" onClick={() => setIsImportMappingModalOpen(false)} className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
              <button type="button" onClick={handleConfirmImportMapping} className={cn("flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">Gerar pre-visualizacao</button>
            </div>
          </div>
        </div>
      )}

      {/* Global Import Modal */}
      {isImportModalOpen && (
        <div className={cn("fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className={cn("bg-white w-full max-w-4xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <h2 className={cn("text-2xl font-black text-slate-900 tracking-tight mb-8">pré-visualização da importação</h2>
            <div className={cn("flex-1 overflow-y-auto pr-2 border border-slate-100 rounded-3xl">
              <table className={cn("w-full text-left">
                <thead className={cn("sticky top-0 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr><th className={cn("px-6 py-4">explorador</th><th className={cn("px-6 py-4">empresa</th><th className={cn("px-6 py-4">selo</th><th className={cn("px-6 py-4">status</th></tr>
                </thead>
                <tbody className={cn("divide-y divide-slate-50">
                  {importPreviews.map((p, idx) => (
                    <tr key={idx} className={cn(`text-xs ${p.status === 'invalid' ? 'bg-rose-50/30' : ''}`}>
                      <td className={cn("px-6 py-4"><div className={cn("font-bold text-slate-900">{p.row.explorador}</div>{p.user && <div className={cn("text-[9px] text-emerald-600 font-black uppercase">vincular: {p.user.full_name}</div>}</td>
                      <td className={cn("px-6 py-4 text-slate-500 font-bold">{p.row.empresa}</td>
                      <td className={cn("px-6 py-4"><div className={cn("font-bold text-slate-900">{p.row.selo}</div>{p.badge && <div className={cn("text-[9px] text-indigo-600 font-black uppercase">selo: {p.badge?.name || 'Badge sem nome'}</div>}</td>
                      <td className={cn("px-6 py-4">{p.status === 'valid' ? <span className={cn("text-emerald-700 font-black uppercase">válido</span> : <span className={cn("text-rose-700 font-black uppercase">{p.reason}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={cn("pt-8 flex gap-4">
              <button onClick={() => setIsImportModalOpen(false)} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">cancelar</button>
              <button onClick={finalizeImport} className={cn("flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700">processar importações</button>
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
          <div className={cn("fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className={cn("bg-white w-full max-w-6xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
              <div className={cn("flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <h2 className={cn("text-2xl font-black text-slate-900 tracking-tight">Cartela de selos de {viewingUserBadges.full_name}</h2>
                  <p className={cn("text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
                    {companyName} - {unitName}
                  </p>
                </div>
                <div className={cn("flex items-center gap-3 flex-wrap">
                  <div className={cn("bg-indigo-50 text-indigo-600 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className={cn("text-xl font-black">{metrics.monthlyScore}</div>
                    <div className={cn("text-[10px] font-black uppercase tracking-widest">saldo do mes</div>
                  </div>
                  <div className={cn("bg-amber-50 text-amber-700 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className={cn("text-xl font-black">{metrics.positiveCount}</div>
                    <div className={cn("text-[10px] font-black uppercase tracking-widest">selos ativos</div>
                  </div>
                  <div className={cn("bg-rose-50 text-rose-700 px-4 py-3 rounded-2xl text-center min-w-[120px]">
                    <div className={cn("text-xl font-black">{metrics.lossCount}</div>
                    <div className={cn("text-[10px] font-black uppercase tracking-widest">perdas</div>
                  </div>
                </div>
              </div>
              <div className={cn("overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {badges.map(badge => {
                  const badgeAward = userBadges.find(ub => ub.user_id === viewingUserBadges.id && ub.badge_id === badge.id);
                  const isAssigned = Boolean(badgeAward);

                  return (
                    <div key={badge.id} className={cn("p-6 rounded-[32px] border border-slate-100 bg-slate-50/70">
                      <BadgeCard badge={badge} unlocked={isAssigned} tone={badgeAward?.tone} date={badgeAward?.awarded_at} />
                      <div className={cn("mt-4 space-y-3">
                        <div className={cn("grid grid-cols-2 gap-2">
                          {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                            <button
                              key={tone}
                              onClick={() => handleAssignBadgeToUser(viewingUserBadges.id, badge.id, tone)}
                              className={cn(`px-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${badgeAward?.tone === tone ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                            >
                              {BADGE_TONE_LABELS[tone]}
                            </button>
                          ))}
                        </div>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {badgeLegends[badgeAward?.tone || 'bronze']}
                        </p>
                        {isAssigned && (
                          <button onClick={() => handleRemoveBadgeFromUser(viewingUserBadges.id, badge.id)} className={cn("w-full py-3 rounded-2xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all">
                            limpar da cartela
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setViewingUserBadges(null)} className={cn("mt-10 w-full py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">fechar</button>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default AdminPanel;
