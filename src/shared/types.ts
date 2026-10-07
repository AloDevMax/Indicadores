
export type Role = 'admin' | 'user' | 'developer' | 'supervisor';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type BadgeTone = 'bronze' | 'silver' | 'gold' | 'loss_1' | 'loss_2';

export interface Notification {
  id: string;
  title: string;
  message: string;
  sent_at: string;
  read: boolean;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: Role;
  productive_unit_id?: string;
  created_at: string;
  email_verified?: boolean;
  is_active?: boolean;
  notifications?: Notification[];
}

export interface ProductiveUnit {
  id: string;
  name: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  icon_name: string;
  image_url?: string;
  points: number;
  color?: string;
  tone?: BadgeTone;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  awarded_by: string | null;
  tone: BadgeTone;
  productive_unit_id?: string;
  created_at?: string;
}

export interface BadgeLegendSettings {
  bronze: string;
  silver: string;
  gold: string;
  loss_1: string;
  loss_2: string;
}

export const DEFAULT_BADGE_LEGENDS: BadgeLegendSettings = {
  bronze: 'Bronze - Boa performance',
  silver: 'Prata - Excelente performance',
  gold: 'Ouro - Desempenho excepcional',
  loss_1: 'Perda 1 - Expectativa não atendida',
  loss_2: 'Perda 2 - Falha grave',
};

export interface IndicatorRow {
  excelName: string;
  indicators: Record<string, number>; // badgeId → value (-2 to 3)
}

export interface UserMatchResult {
  excelName: string;
  matchedUserId: string | null;
  matchedUserName: string | null;
  confidence: 'auto' | 'manual' | 'ignored';
}

export interface BadgeSubmission {
  id: string;
  user_id: string;
  badge_id: string;
  proof_url?: string;
  description?: string;
  status: SubmissionStatus;
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  feedback?: string;
  // extras para UI
  user_name?: string;
  badge_name?: string;
}
