
export type Role = 'admin' | 'user';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type BadgeTone = 'bronze' | 'silver' | 'gold' | 'loss_1' | 'loss_2';
export type ImportSourceField = 'company' | 'productive_unit' | 'user' | 'badge' | 'tone' | 'award';

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
  company_id?: string;
  productive_unit_id?: string;
  level: number;
  xp: number;
  created_at: string;
  email_verified?: boolean;
  notifications?: Notification[];
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
}

export interface ProductiveUnit {
  id: string;
  name: string;
  company_id: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  icon_name: string;
  image_url?: string;
  points: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  awarded_by: string;
  tone: BadgeTone;
}

export interface BadgeLegendSettings {
  bronze: string;
  silver: string;
  gold: string;
  loss_1: string;
  loss_2: string;
}

export interface ImportSourceConfig {
  id: string;
  name: string;
  description?: string;
  columns: Record<ImportSourceField, string>;
}

export interface ImportBindingSnapshot {
  sourceId: string;
  sourceName: string;
  matchedColumns: Partial<Record<ImportSourceField, string>>;
  importedAt: string;
}

export interface AppBootstrapPayload {
  source: 'seed' | 'database';
  badges: Badge[];
  companies: Company[];
  productiveUnits: ProductiveUnit[];
  badgeLegends: BadgeLegendSettings;
  importSources: ImportSourceConfig[];
  users: Profile[];
  userBadges: UserBadge[];
  submissions: BadgeSubmission[];
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
