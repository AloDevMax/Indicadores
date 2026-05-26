
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { BarChart3, User, Users, Shield, Inbox, Pencil, Trash2, CheckCircle, Award } from 'lucide-react';
import { Badge, Profile, Role, ProductiveUnit, BadgeSubmission, UserBadge, BadgeLegendSettings, BadgeTone, IndicatorRow, UserMatchResult } from '@/shared/types';
import BadgeCard from '@/features/badges/components/BadgeCard';
import { ImageUpload } from '@/shared/components/ImageUpload';
import { BADGE_TONE_LABELS, getUserMonthlyBadgeMetrics } from '@/features/badges/badgeMetrics';
import { cn } from '@/shared/lib/cn';
import { importMonthlyBadgesWithApi, seedIndicatorBadgesWithApi } from '@/shared/api';
import { toast } from '@/shared/lib/toast';

const MONTH_NAMES_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Maps normalized Excel column header keywords → badge ID (more specific keys must come first)
const EXCEL_COLUMN_TO_BADGE_ID: Record<string, string> = {
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

const TONE_FROM_VALUE: Record<number, BadgeTone | null> = { 3: 'gold', 2: 'silver', 1: 'bronze', 0: null, [-1]: 'loss_1', [-2]: 'loss_2' };

const normalizeStr = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const stringSimilarity = (a: string, b: string): number => {
  const na = normalizeStr(a);
  const nb = normalizeStr(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  const longer = na.length > nb.length ? na : nb;
  const shorter = na.length > nb.length ? nb : na;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length;
};

interface AdminPanelProps {
  currentUser: Profile;
  activeMode: 'management' | 'personal';
  setActiveMode: (_mode: 'management' | 'personal') => void;
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  productiveUnits: ProductiveUnit[];
  setProductiveUnits: React.Dispatch<React.SetStateAction<ProductiveUnit[]>>;
  badgeLegends: BadgeLegendSettings;
  setBadgeLegends: React.Dispatch<React.SetStateAction<BadgeLegendSettings>>;
  users: Profile[];
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>;
  userBadges: UserBadge[];
  setUserBadges: React.Dispatch<React.SetStateAction<UserBadge[]>>;
  submissions: BadgeSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<BadgeSubmission[]>>;
  onSaveBadge?: (_badge: Badge) => Promise<Badge>;
  onDeleteBadge?: (_badgeId: string) => Promise<void>;
  onSaveProductiveUnit?: (_productiveUnit: ProductiveUnit) => Promise<ProductiveUnit>;
  onSaveUser?: (_user: Profile, _password?: string) => Promise<Profile>;
  onBulkInviteUsers?: (_emails: string[], _productiveUnitId?: string) => Promise<{ createdUsers: Profile[]; skippedEmails: string[] }>;
  onDeleteUser?: (_userId: string) => Promise<void>;
  onAwardBadges?: (_userIds: string[], _badgeId: string, _tone: BadgeTone) => Promise<void>;
  onRemoveUserBadge?: (_userId: string, _badgeId: string) => Promise<void>;
  onReviewSubmission?: (_submissionId: string, _status: 'approved' | 'rejected') => Promise<void>;
  onOpenSolicitation?: () => void;
}


const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  activeMode,
  setActiveMode,
  badges,
  setBadges,
  productiveUnits,
  setProductiveUnits,
  badgeLegends,
  setBadgeLegends,
  users,
  setUsers,
  userBadges,
  setUserBadges,
  submissions,
  setSubmissions,
  onSaveBadge,
  onDeleteBadge,
  onSaveProductiveUnit,
  onSaveUser,
  onBulkInviteUsers,
  onDeleteUser,
  onAwardBadges,
  onRemoveUserBadge,
  onReviewSubmission,
  onOpenSolicitation
}) => {
  const location = useLocation();
  const isDeveloper = currentUser.role === 'developer';
  const isSupervisor = currentUser.role === 'supervisor';
  const canManageGlobalCatalog = isDeveloper;
  const allowedViews = isDeveloper
    ? new Set(['overview', 'submissions', 'users', 'award', 'badges'])
    : isSupervisor
      ? new Set(['overview', 'submissions', 'users', 'award'])
      : new Set(['overview', 'submissions', 'users', 'award']);

  const view = useMemo(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin' || !path) return 'overview';
    return allowedViews.has(path)
      ? path as 'overview' | 'submissions' | 'users' | 'award' | 'badges'
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

  const [isProductiveUnitModalOpen, setIsProductiveUnitModalOpen] = useState(false);
  const [editingProductiveUnit, setEditingProductiveUnit] = useState<ProductiveUnit | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setIsBulkInviteModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [isAwardingBadges, setIsAwardingBadges] = useState(false);

  const [bulkInviteEmails, setBulkInviteEmails] = useState('');
  const [bulkInviteProductiveUnitId, setBulkInviteProductiveUnitId] = useState('');

  const [viewingUserBadges, setViewingUserBadges] = useState<Profile | null>(null);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(true);

  // Excel monthly import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isImportModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isImportModalOpen]);

  useEffect(() => {
    document.body.style.overflow = isUserModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isUserModalOpen]);
  type ImportStep = 'select' | 'matching' | 'preview' | 'done';
  const [importStep, setImportStep] = useState<ImportStep>('select');
  const [importMonth, setImportMonth] = useState<number>(new Date().getMonth() + 1);
  const [importYear, setImportYear] = useState<number>(new Date().getFullYear());
  const [importRows, setImportRows] = useState<IndicatorRow[]>([]);
  const [importColumnIds, setImportColumnIds] = useState<string[]>([]);
  const [userMatches, setUserMatches] = useState<UserMatchResult[]>([]);
  const [importError, setImportError] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ awardedCount: number } | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const [userSearch, setUserSearch] = useState('');

  const [selectedProductiveUnitFilter, setSelectedProductiveUnitFilter] = useState<string>('');

  // Image upload states
  const [tempBadgeImageUrl, setTempBadgeImageUrl] = useState<string | undefined>();
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
    created_at: new Date().toISOString(),
    email_verified: true,
  };
  const categories = ['Qualidade', 'Segurança', 'Eficiência', 'Processos', 'Serviço'];
  const adminMonthlyMetrics = getUserMonthlyBadgeMetrics(safeAdminProfile.id, userBadges);
  const renderSquareImage = (src: string, alt: string) => (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain p-2 bg-white"
    />
  );

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
        toast.success(`Solicitação ${status === 'approved' ? 'aprovada e selo concedido' : 'rejeitada'}.`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Falha ao revisar solicitação.');
      }
      return;
    }

    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status } : s));

    if (status === 'approved') {
      upsertUserBadge(submission.user_id, submission.badge_id, 'bronze');
    }
    
    toast.success(`Solicitação ${status === 'approved' ? 'aprovada e selo concedido' : 'rejeitada'}.`);
  };

  const handleSaveBadge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canManageGlobalCatalog) {
      toast.error('Somente o desenvolvedor pode manter a biblioteca global de selos.');
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
      toast.error('Erro ao salvar selo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleDeleteBadge = async () => {
    if (!canManageGlobalCatalog) {
      toast.error('Somente o desenvolvedor pode remover selos da biblioteca global.');
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

  const handleSaveProductiveUnit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productiveUnitData: ProductiveUnit = {
      id: editingProductiveUnit?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
    };

    try {
      const savedProductiveUnit = onSaveProductiveUnit ? await onSaveProductiveUnit(productiveUnitData) : productiveUnitData;
      setProductiveUnits(prev => editingProductiveUnit ? prev.map(unit => unit.id === editingProductiveUnit.id ? savedProductiveUnit : unit) : [...prev, savedProductiveUnit]);
      setIsProductiveUnitModalOpen(false);
      setEditingProductiveUnit(null);
    } catch (error) {
      console.error('Error saving productive unit:', error);
      toast.error('Erro ao salvar unidade produtiva: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productiveUnitId = (formData.get('productive_unit_id') as string) || undefined;
    const validProductiveUnitId = (productiveUnitId && productiveUnits.some(unit => unit.id === productiveUnitId))
      ? productiveUnitId
      : undefined;

    const userData: Profile = {
      id: editingUser?.id || '',
      email: formData.get('email') as string,
      full_name: formData.get('full_name') as string,
      avatar_url: tempUserAvatarUrl || editingUser?.avatar_url || '',
      role: formData.get('role') as Role,
      productive_unit_id: validProductiveUnitId,
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
      toast.error('Erro ao salvar usuário: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleBulkInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const emails = bulkInviteEmails
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (emails.length === 0) {
      toast.error('Por favor, insira e-mails válidos para o convite.');
      return;
    }

    const validProductiveUnitId = bulkInviteProductiveUnitId && productiveUnits.some(unit => unit.id === bulkInviteProductiveUnitId)
      ? bulkInviteProductiveUnitId
      : undefined;

    if (onBulkInviteUsers) {
      const result = await onBulkInviteUsers(emails, validProductiveUnitId);
      setUsers(prev => [...prev, ...result.createdUsers]);
      toast.success(
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
        productive_unit_id: validProductiveUnitId,
        created_at: new Date().toISOString(),
      }));

      setUsers(prev => [...prev, ...newUsers]);
      toast.success(`${emails.length} convites enviados com sucesso para os novos colaboradores!`);
    }

    setIsBulkInviteModalOpen(false);
    setBulkInviteEmails('');
    setBulkInviteProductiveUnitId('');
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      if (userToDelete.id === adminProfile.id) {
        toast.error('Você não pode excluir seu próprio perfil administrativo.');
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
        toast.error('Erro ao excluir colaborador: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
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

          return updatedUser;
        }));
      }

      toast.success(`${selectedUsers.length} colaboradores foram premiados!`);
      setSelectedUsers([]);
      setSelectedAwardBadge('');
    } catch (error) {
      toast.error('Erro ao premiar colaboradores: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
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
      toast.error('Erro ao atribuir selo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
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
      toast.error('Erro ao remover selo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) &&
      (selectedProductiveUnitFilter === '' || u.productive_unit_id === selectedProductiveUnitFilter) &&
      (!isSupervisor || u.productive_unit_id === currentUser.productive_unit_id)
    );
  }, [users, userSearch, selectedProductiveUnitFilter, isSupervisor, currentUser.productive_unit_id]);

  const stats = useMemo(() => ({
    totalUsers: isSupervisor
      ? users.filter(u => u.productive_unit_id === currentUser.productive_unit_id).length
      : users.length,
    activeBadges: badges.length,
    pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
    totalProductiveUnits: productiveUnits.length
  }), [users, badges, submissions, productiveUnits, isSupervisor, currentUser.productive_unit_id]);

  const handleExcelUpload = useCallback((file: File) => {
    setImportError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const targetSheetName = normalizeStr(MONTH_NAMES_PT[importMonth - 1]);
        const matchedSheet = workbook.SheetNames.find(
          n => normalizeStr(n) === targetSheetName || normalizeStr(n).startsWith(targetSheetName.slice(0, 3)),
        );

        if (!matchedSheet) {
          setImportError(`Aba "${MONTH_NAMES_PT[importMonth - 1].toUpperCase()}" não encontrada no arquivo. Abas disponíveis: ${workbook.SheetNames.join(', ')}`);
          return;
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
          setImportError('Não foi possível identificar a linha de cabeçalho. Verifique se a planilha contém uma coluna "Nome do Colaborador" e colunas de indicadores como NPS, Recoletas, etc.');
          return;
        }

        const detectedBadgeIds = [...new Set(columnBadgeIds.filter(Boolean) as string[])];
        setImportColumnIds(detectedBadgeIds);

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
          setImportError('Nenhuma linha de dados encontrada após o cabeçalho.');
          return;
        }

        // Auto-match users
        const companyUsers = users;

        const matches: UserMatchResult[] = dataRows.map(row => {
          let bestUser: Profile | null = null;
          let bestScore = 0;
          for (const u of companyUsers) {
            const score = stringSimilarity(row.excelName, u.full_name);
            if (score > bestScore) { bestScore = score; bestUser = u; }
          }
          return {
            excelName: row.excelName,
            matchedUserId: bestScore === 1 ? bestUser?.id ?? null : null,
            matchedUserName: bestScore === 1 ? bestUser?.full_name ?? null : null,
            confidence: bestScore === 1 ? 'auto' : 'manual',
          };
        });

        setImportRows(dataRows);
        setUserMatches(matches);
        setImportStep('matching');
      } catch (err) {
        setImportError('Erro ao processar o arquivo: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
      }
    };
    reader.readAsArrayBuffer(file);
  }, [importMonth, users]);

  const handleConfirmImport = async () => {
    setIsImporting(true);
    setImportError('');
    try {
      const awards: Array<{ userId: string; badgeId: string; tone: BadgeTone }> = [];
      importRows.forEach((row, idx) => {
        const match = userMatches[idx];
        if (!match.matchedUserId || match.confidence === 'ignored') return;
        Object.entries(row.indicators).forEach(([badgeId, value]) => {
          const tone = TONE_FROM_VALUE[value];
          if (tone) awards.push({ userId: match.matchedUserId!, badgeId, tone });
        });
      });

      if (awards.length === 0) {
        setImportError('Nenhum selo a importar após filtragem.');
        return;
      }

      const result = await importMonthlyBadgesWithApi(awards, importMonth, importYear);
      if (result.awardedBadges?.length) {
        const ids = new Set(result.awardedBadges.map(b => `${b.user_id}:${b.badge_id}`));
        setUserBadges(prev => [
          ...prev.filter(ub => !ids.has(`${ub.user_id}:${ub.badge_id}`)),
          ...result.awardedBadges!,
        ]);
      }
      setImportResult({ awardedCount: result.awardedCount });
      setImportStep('done');
    } catch (err) {
      setImportError('Erro na importação: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setImportStep('select');
    setImportRows([]);
    setImportColumnIds([]);
    setUserMatches([]);
    setImportError('');
    setImportResult(null);
    if (importFileRef.current) importFileRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Switcher */}
      {view === 'overview' && (
        <div className="flex justify-center mb-10">
          <div className="bg-slate-200/50 p-1.5 rounded-xl flex gap-1 shadow-inner">
            <button onClick={() => setActiveMode('management')} className={`px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMode === 'management' ? 'bg-white text-brand-primary shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}><BarChart3 size={16} /> Gestão Operacional</button>
            <button onClick={() => setActiveMode('personal')} className={`px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMode === 'personal' ? 'bg-white text-brand-primary shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}><User size={16} /> Painel Pessoal</button>
          </div>
        </div>
      )}

      {activeMode === 'management' ? (
        <div className="space-y-10 pb-20">
          {view === 'overview' && (
            <div className="space-y-10">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h2 className="text-3xl font-bold font-heading text-slate-900 tracking-tight">Centro de Comando</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Hierarquia e Performance Operacional</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Colaboradores', val: stats.totalUsers, icon: Users },
                  { label: 'Selos Ativos', val: stats.activeBadges, icon: Shield },
                  { label: 'Pendências', val: stats.pendingSubmissions, icon: Inbox, color: 'text-amber-600' },
                ].map((kpi, idx) => {
                  const IconComponent = kpi.icon;
                  return (
                  <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className={cn("text-3xl font-black leading-none", kpi.color || "text-slate-900")}>{kpi.val}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{kpi.label}</div>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:rotate-12 transition-transform"><IconComponent size={96} /></div>
                  </div>
                );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><Users size={16} /> Unidades Produtivas</h3>
                  <div className="space-y-4">
                    {productiveUnits.map(unit => (
                      <div key={unit.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{unit?.name || 'Unidade sem nome'}</div>
                          <div className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{users.filter(u => u.productive_unit_id === unit.id).length} colaboradores</div>
                        </div>
                        {!isSupervisor && (
                          <button onClick={() => { setEditingProductiveUnit(unit); setIsProductiveUnitModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-brand-accent hover:bg-white rounded-xl transition-all"><Pencil size={16} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-brand-dark p-8 rounded-2xl shadow-2xl text-white">
                  <h3 className="text-sm font-black text-brand-primary-light uppercase tracking-widest mb-6 flex items-center gap-2"><Inbox size={16} /> Atividade de Rede</h3>
                  <div className="space-y-4">
                    {submissions.slice(0, 3).map(sub => (
                      <div key={sub.id} className="bg-white/10 p-4 rounded-lg border border-white/5 text-xs">
                        <span className="font-black text-brand-secondary">{sub.user_name}</span> solicitou <span className="font-black text-white">{sub.badge_name}</span>
                      </div>
                    ))}
                    {submissions.length === 0 && <p className="text-xs text-brand-secondary">Nenhuma atividade recente.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'submissions' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-3xl font-bold font-heading text-slate-900 tracking-tight">Pedidos de Validação</h2>
              <div className="space-y-4">
                {submissions.filter(s => {
                  if (s.status !== 'pending') return false;
                  if (isSupervisor) {
                    const submitter = users.find(u => u.id === s.user_id);
                    return submitter?.productive_unit_id === currentUser.productive_unit_id;
                  }
                  return true;
                }).map(sub => {
                  return (
                    <div key={sub.id} className="bg-white p-8 rounded-xl border border-slate-100 shadow-lg flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-brand-primary text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{sub.badge_name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {sub.user_name}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl italic">"{sub.description}"</p>
                      </div>
                      <div className="flex md:flex-col gap-2 min-w-[140px]">
                        <button onClick={() => handleReviewSubmission(sub.id, 'approved')} className="bg-emerald-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100 hover:bg-brand-accent transition-all">Validar & Premiar</button>
                        <button onClick={() => handleReviewSubmission(sub.id, 'rejected')} className="bg-white text-rose-500 border border-rose-100 px-6 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-rose-50 transition-all">Recusar</button>
                      </div>
                    </div>
                  );
                })}
                {submissions.filter(s => {
                  if (s.status !== 'pending') return false;
                  if (isSupervisor) {
                    const submitter = users.find(u => u.id === s.user_id);
                    return submitter?.productive_unit_id === currentUser.productive_unit_id;
                  }
                  return true;
                }).length === 0 && (
                  <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <CheckCircle size={48} className="mx-auto mb-4 text-emerald-600" />
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Fila de Solicitações Vazia</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-bold font-heading text-slate-900 tracking-tight">Colaboradores da Rede</h2>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedProductiveUnitFilter}
                    onChange={(e) => setSelectedProductiveUnitFilter(e.target.value)}
                    className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 outline-none"
                  >
                    <option value="">Todas as Unidades</option>
                    {productiveUnits.map(unit => <option key={unit.id} value={unit.id}>{unit?.name || 'Unidade sem nome'}</option>)}
                  </select>
                  <button onClick={() => openUserModal()} className="bg-brand-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Novo Colaborador</button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
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
                                  <User size={18} className="text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-900 text-sm">{u.full_name}</div>
                                <div className="text-[10px] text-brand-accent font-black uppercase tracking-widest">{unit?.name || 'Sem unidade produtiva'}</div>
                                <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="bg-brand-primary-light text-brand-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase">Saldo {metrics.monthlyScore}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase">{metrics.positiveCount} selos</span>
                              <span className="text-[10px] font-black text-rose-500 uppercase">{metrics.lossCount} perdas</span>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewingUserBadges(u)} className="text-[10px] font-black text-brand-primary uppercase tracking-widest bg-brand-primary-light hover:bg-brand-primary-light px-4 py-2 rounded-xl">Ver Selos</button>
                              <button onClick={() => openUserModal(u)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-brand-primary hover:bg-brand-primary-light rounded-xl transition-all"><Pencil size={16} /></button>
                              <button onClick={() => { setUserToDelete(u); setIsDeleteUserModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
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
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold font-heading text-slate-900 tracking-tight">Premiar Colaboradores</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Recompense ações excepcionais em lote</p>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-brand-primary-dark transition-all active:scale-95 whitespace-nowrap"
                >
                  Importar Planilha Mensal
                </button>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl flex flex-col min-h-[500px]">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">1. Selecione colaboradores</h3>
                    <div className="bg-slate-50 px-3 py-1 rounded-lg text-[10px] font-black text-brand-primary">{selectedUsers.length} selecionados</div>
                  </div>
                  <input type="text" placeholder="Buscar colaborador..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm mb-6 outline-none focus:ring-2 focus:ring-brand-primary" />
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {filteredUsers.map(u => (
                      <button key={u.id} onClick={() => toggleUserSelection(u.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedUsers.includes(u.id) ? 'bg-brand-primary-light border-brand-primary shadow-lg' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${selectedUsers.includes(u.id) ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'}`}><User size={18} /></div>
                          <div className="text-left">
                            <div className="font-bold text-sm text-slate-900">{u.full_name}</div>
                          </div>
                        </div>
                        {selectedUsers.includes(u.id) && <CheckCircle size={20} className="text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">2. Escolha a Recompensa</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {badges.map(badge => (
                        <button key={badge.id} onClick={() => setSelectedAwardBadge(badge.id)} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedAwardBadge === badge.id ? 'bg-brand-primary-light border-brand-primary shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden bg-slate-100">
                            {badge.image_url ? (
                              renderSquareImage(badge.image_url, badge.name)
                            ) : (
                              <span>{badge.icon_name}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 leading-none mb-1">{badge?.name || 'Badge sem nome'}</div>
                            <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{badge.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">3. Escolha a marcação do mês</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                        <button
                          key={tone}
                          onClick={() => setSelectedAwardTone(tone)}
                          className={cn("px-4 py-4 rounded-xl border-2 text-left transition-all", selectedAwardTone === tone ? "border-brand-primary bg-brand-primary-light shadow-lg" : "border-slate-100 bg-slate-50 hover:border-slate-200")}
                        >
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{BADGE_TONE_LABELS[tone]}</div>
                          <div className="text-sm font-bold text-slate-900 mt-2">{badgeLegends[tone]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-brand-dark p-10 rounded-2xl shadow-2xl text-white text-center space-y-6">
                    <h3 className="text-sm font-black text-brand-primary-light uppercase tracking-widest">4. Confirmar Premiação</h3>
                    <button onClick={handleAwardBadges} className="w-full py-6 bg-white text-brand-dark rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-brand-primary-light transition-all disabled:opacity-50" disabled={selectedUsers.length === 0 || !selectedAwardBadge || isAwardingBadges}>{isAwardingBadges ? 'Premiando...' : 'Conceder selos agora'}</button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Import Modal */}
          {isImportModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <div className="bg-white w-full max-w-4xl rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Importar Planilha Mensal</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">Importe os selos do mês diretamente da planilha de indicadores</p>
                  </div>
                  <button
                    onClick={() => { setIsImportModalOpen(false); resetImport(); }}
                    className="text-slate-400 hover:text-slate-700 font-black text-xl leading-none ml-4"
                  >
                    ✕
                  </button>
                </div>

                {importError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-4 py-3 rounded-2xl mb-4">
                    {importError}
                  </div>
                )}

                {importStep === 'select' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Mês</label>
                        <select value={importMonth} onChange={e => setImportMonth(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-brand-primary">
                          {MONTH_NAMES_PT.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ano</label>
                        <select value={importYear} onChange={e => setImportYear(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-brand-primary">
                          {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Arquivo .xlsx</label>
                      <input
                        ref={importFileRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={e => { if (e.target.files?.[0]) handleExcelUpload(e.target.files[0]); }}
                        className="w-full px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-brand-primary file:text-white"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const seeded = await seedIndicatorBadgesWithApi();
                          setBadges(prev => {
                            const existingIds = new Set(prev.map(b => b.id));
                            const newOnes = seeded.filter(b => !existingIds.has(b.id));
                            return newOnes.length ? [...prev, ...newOnes] : prev.map(b => seeded.find(s => s.id === b.id) || b);
                          });
                          toast.success('Selos de indicadores criados/atualizados com sucesso!');
                        }
                        catch (err) { toast.error('Erro ao criar selos: ' + (err instanceof Error ? err.message : 'Erro')); }
                      }}
                      className="text-xs font-black text-brand-primary underline"
                    >
                      Criar selos de indicadores (executar uma vez)
                    </button>
                  </div>
                )}

                {importStep === 'matching' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{importRows.length} colaboradores encontrados</span>
                      <button onClick={resetImport} className="text-xs font-black text-slate-400 hover:text-slate-700">← Voltar</button>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Indicadores detectados: {importColumnIds.map(id => badges.find(b => b.id === id)?.name || id).join(', ')}</div>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {importRows.map((row, idx) => {
                        const match = userMatches[idx];
                        const companyUsers = users;
                        return (
                          <div key={idx} className={cn("flex items-center gap-3 p-3 rounded-xl border-2", match.confidence === 'ignored' ? 'border-slate-100 bg-slate-50 opacity-50' : match.matchedUserId ? 'border-emerald-100 bg-emerald-50' : 'border-amber-100 bg-amber-50')}>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm text-slate-900 truncate">{row.excelName}</div>
                              <div className="text-[10px] text-slate-400 font-bold">{Object.keys(row.indicators).length} indicadores</div>
                            </div>
                            <select
                              value={match.matchedUserId || ''}
                              onChange={e => {
                                const uid = e.target.value;
                                setUserMatches(prev => prev.map((m, i) => i === idx ? {
                                  ...m,
                                  matchedUserId: uid || null,
                                  matchedUserName: companyUsers.find(u => u.id === uid)?.full_name || null,
                                  confidence: uid ? 'manual' : 'ignored',
                                } : m));
                              }}
                              className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-2 py-1 max-w-[180px]"
                            >
                              <option value="">— Ignorar —</option>
                              {companyUsers.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                            </select>
                            <span className="text-lg">{match.confidence === 'ignored' ? '❌' : match.matchedUserId ? <CheckCircle size={20} className="text-emerald-600" /> : '⚠️'}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => setImportStep('preview')} className="w-full py-4 bg-brand-primary text-white rounded-xl font-black text-sm uppercase tracking-widest">Ver preview →</button>
                  </div>
                )}

                {importStep === 'preview' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Preview — {MONTH_NAMES_PT[importMonth - 1]} {importYear}</span>
                      <button onClick={() => setImportStep('matching')} className="text-xs font-black text-slate-400 hover:text-slate-700">← Ajustar matching</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left font-black text-slate-400 uppercase tracking-widest pb-2 pr-3">Colaborador</th>
                            {importColumnIds.map(id => (
                              <th key={id} className="text-center font-black text-slate-400 uppercase tracking-widest pb-2 px-2">{badges.find(b => b.id === id)?.name || id}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {importRows.map((row, idx) => {
                            const match = userMatches[idx];
                            const ignored = match.confidence === 'ignored' || !match.matchedUserId;
                            return (
                              <tr key={idx} className={cn("border-b border-slate-50", ignored && "opacity-40")}>
                                <td className="py-2 pr-3 font-bold text-slate-700">{match.matchedUserName || row.excelName}</td>
                                {importColumnIds.map(id => {
                                  const val = row.indicators[id];
                                  const tone = val !== undefined ? TONE_FROM_VALUE[val] : null;
                                  const colors: Record<string, string> = { gold: 'bg-yellow-100 text-yellow-800', silver: 'bg-slate-100 text-slate-700', bronze: 'bg-orange-100 text-orange-800', loss_1: 'bg-red-100 text-red-700', loss_2: 'bg-red-200 text-red-900' };
                                  return (
                                    <td key={id} className="text-center py-2 px-2">
                                      {tone ? <span className={cn('px-2 py-0.5 rounded-lg font-black', colors[tone])}>{val}</span> : <span className="text-slate-200">—</span>}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <button
                      onClick={handleConfirmImport}
                      disabled={isImporting}
                      className="w-full py-4 bg-brand-dark text-white rounded-xl font-black text-sm uppercase tracking-widest disabled:opacity-50"
                    >
                      {isImporting ? 'Importando...' : 'Confirmar importação'}
                    </button>
                  </div>
                )}

                {importStep === 'done' && importResult && (
                  <div className="text-center py-8 space-y-4">
                    <Award size={48} className="mx-auto text-amber-500" />
                    <div className="text-2xl font-black text-slate-900">{importResult.awardedCount} selos importados</div>
                    <div className="text-sm text-slate-400 font-bold">{MONTH_NAMES_PT[importMonth - 1]} {importYear}</div>
                    <button onClick={() => { resetImport(); setIsImportModalOpen(false); }} className="px-8 py-3 bg-brand-primary text-white rounded-xl font-black text-xs uppercase tracking-widest">Fechar</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'badges' && canManageGlobalCatalog && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Biblioteca de Selos</h2>
                <button onClick={() => openBadgeModal()} className="bg-brand-primary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">+ Novo Selo</button>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setIsLegendCollapsed(prev => !prev)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legenda das Cores</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">Bronze, prata, ouro e perdas em vermelho</div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-brand-primary">{isLegendCollapsed ? 'Expandir' : 'Minimizar'}</span>
                </button>
                {!isLegendCollapsed && (
                  <div className="border-t border-slate-100 px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                      <label key={tone} className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{BADGE_TONE_LABELS[tone]}</span>
                        <input
                          value={badgeLegends[tone]}
                          onChange={(e) => handleLegendChange(tone, e.target.value)}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-brand-primary-light transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                        {badge.image_url ? (
                          renderSquareImage(badge.image_url, badge.name)
                        ) : (
                          <span>{badge.icon_name}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{badge?.name || 'Badge sem nome'}</div>
                        <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{badge.category}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openBadgeModal(badge)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-brand-primary hover:bg-brand-primary-light rounded-xl transition-all"><Pencil size={16} /></button>
                      <button onClick={() => { setBadgeToDelete(badge); setIsDeleteBadgeModalOpen(true); }} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
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
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Olá, {adminProfile.full_name.split(' ')[0]}</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Seu Painel de Progresso</p>
            </div>
            <button onClick={onOpenSolicitation} className="bg-brand-primary text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-brand-primary-dark shadow-xl flex items-center gap-3 transition-all active:scale-95"><Award size={18} /> Solicitar Meu Selo</button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-5xl shadow-2xl shadow-brand-primary-light"><Shield size={64} className="text-white" /></div>
              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black text-slate-900">Saldo do Mês</h3>
                  <div className="text-sm font-black text-brand-primary bg-brand-primary-light px-4 py-2 rounded-xl">{adminMonthlyMetrics.positiveCount} selos / {adminMonthlyMetrics.lossCount} perdas</div>
                </div>
                <div className="text-4xl font-black text-slate-900">{adminMonthlyMetrics.monthlyScore || 0}</div>
              </div>
            </div>
            <div className="bg-brand-primary p-10 rounded-2xl shadow-xl shadow-brand-primary-light text-white flex flex-col justify-center items-center text-center space-y-2">
              <div className="text-5xl font-black">{userBadges.filter(ub => ub.user_id === adminProfile.id).length}</div>
              <div className="font-black uppercase text-[10px] tracking-[0.3em] opacity-80">Selos Obtidos</div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Minha Galeria de Selos</h3>
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
          <div className="bg-white w-full max-w-lg rounded-2xl p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Convites em Lote</h2>
            <form onSubmit={handleBulkInvite} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unidade Produtiva</label>
                <select
                  value={bulkInviteProductiveUnitId}
                  onChange={(e) => setBulkInviteProductiveUnitId(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 outline-none focus:ring-2 focus:ring-brand-primary transition-all appearance-none"
                >
                  <option value="">Selecionar unidade...</option>
                  {productiveUnits.map(unit => <option key={unit.id} value={unit.id}>{unit?.name || 'Unidade sem nome'}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lista de E-mails</label>
                <textarea 
                  value={bulkInviteEmails}
                  onChange={(e) => setBulkInviteEmails(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-800 min-h-[160px] outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  placeholder="Insira um e-mail por linha ou separados por vírgula..."
                  required
                ></textarea>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 px-1 tracking-widest">E-mails inválidos serão ignorados automaticamente.</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsBulkInviteModalOpen(false)} className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-brand-accent text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-all">Enviar Convites</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingUser ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
            <form onSubmit={handleSaveUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                <input name="full_name" defaultValue={editingUser?.full_name} style={{ textTransform: 'none' }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900" placeholder="Ex: João Silva" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail Corporativo</label>
                <input name="email" type="email" defaultValue={editingUser?.email} style={{ textTransform: 'none' }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900" placeholder="Ex: joao@empresa.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha de Acesso {!editingUser && '(Opcional - padrão: changeme123)'}</label>
                <input name="password" type="password" style={{ textTransform: 'none' }} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900" placeholder={editingUser ? "Deixe vazio para manter atual" : "Digite uma senha"} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Função</label>
                  <select name="role" defaultValue={editingUser?.role || 'user'} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900">
                    <option value="user">Colaborador</option>
                    {!isSupervisor && <option value="supervisor">Supervisor</option>}
                    {!isSupervisor && <option value="admin">Gestor</option>}
                    {isDeveloper && <option value="developer">Desenvolvedor</option>}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Produtiva</label>
                  <select name="productive_unit_id" defaultValue={editingUser?.productive_unit_id || ''} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900">
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
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-brand-primary text-white rounded-2xl shadow-xl hover:bg-brand-primary-dark transition-all">{editingUser ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteUserModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="text-5xl mb-6">⚠️</div>
            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Excluir Colaborador?</h2>
            <p className="text-slate-500 text-sm mb-8">Esta ação removerá <b>{userToDelete?.full_name}</b> e todo seu histórico de selos permanentemente.</p>
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
          <div className="bg-white w-full max-w-lg rounded-2xl p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">{editingBadge ? 'Editar Selo' : 'Novo Selo'}</h2>
            <form onSubmit={handleSaveBadge} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Selo</label>
                <input name="name" defaultValue={editingBadge?.name} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição do Selo</label>
                <textarea name="description" defaultValue={editingBadge?.description} className="w-full px-6 py-4 rounded-xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary min-h-[100px] text-slate-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legenda de Apoio</label>
                <input name="points" type="number" defaultValue={editingBadge?.points} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-center text-slate-900" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Operacional</label>
                <select name="category" defaultValue={editingBadge?.category} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900">
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
                <button type="submit" className="flex-1 py-5 font-black uppercase text-[10px] tracking-widest bg-brand-primary text-white rounded-2xl shadow-xl hover:bg-brand-primary-dark transition-all">{editingBadge ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Badge Confirmation Modal */}
      {isDeleteBadgeModalOpen && canManageGlobalCatalog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 text-center">
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

      {isProductiveUnitModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-2xl p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{editingProductiveUnit ? 'Editar Unidade Produtiva' : 'Nova Unidade Produtiva'}</h2>
            <form onSubmit={handleSaveProductiveUnit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Unidade</label>
                <input name="name" defaultValue={editingProductiveUnit?.name} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-brand-primary text-slate-900" required />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setIsProductiveUnitModalOpen(false); setEditingProductiveUnit(null); }} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-2xl text-slate-600">Cancelar</button>
                <button type="submit" className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest bg-cyan-600 text-white rounded-2xl shadow-xl hover:bg-cyan-700">{editingProductiveUnit ? 'Atualizar' : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Badges Viewing Modal */}
      {viewingUserBadges && (() => {
        const unitName = productiveUnits.find(unit => unit.id === viewingUserBadges.productive_unit_id)?.name || 'Sem unidade produtiva';
        const metrics = getUserMonthlyBadgeMetrics(viewingUserBadges.id, userBadges);

        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-6xl rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cartela de selos de {viewingUserBadges.full_name}</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
                    {unitName}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-brand-primary-light text-brand-primary px-4 py-3 rounded-xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.monthlyScore}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Saldo do Mês</div>
                  </div>
                  <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.positiveCount}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Selos Ativos</div>
                  </div>
                  <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl text-center min-w-[120px]">
                    <div className="text-xl font-black">{metrics.lossCount}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Perdas</div>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {badges.map(badge => {
                  const badgeAward = userBadges.find(ub => ub.user_id === viewingUserBadges.id && ub.badge_id === badge.id);
                  const isAssigned = Boolean(badgeAward);

                  return (
                    <div key={badge.id} className="p-6 rounded-xl border border-slate-100 bg-slate-50/70">
                      <BadgeCard badge={badge} unlocked={isAssigned} tone={badgeAward?.tone} date={badgeAward?.awarded_at} />
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {(['bronze', 'silver', 'gold', 'loss_1', 'loss_2'] as BadgeTone[]).map(tone => (
                            <button
                              key={tone}
                              onClick={() => handleAssignBadgeToUser(viewingUserBadges.id, badge.id, tone)}
                              className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${badgeAward?.tone === tone ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                            >
                              {BADGE_TONE_LABELS[tone]}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {badgeLegends[badgeAward?.tone || 'bronze']}
                        </p>
                        {isAssigned && (
                          <button onClick={() => handleRemoveBadgeFromUser(viewingUserBadges.id, badge.id)} className="w-full py-3 rounded-xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all">
                            limpar da cartela
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setViewingUserBadges(null)} className="mt-10 w-full py-5 font-black uppercase text-[10px] tracking-widest bg-slate-100 rounded-xl text-slate-600">Fechar</button>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default AdminPanel;
