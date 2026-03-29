
export type Role = 'admin' | 'user';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

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
  password?: string;
  full_name: string;
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
  points: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  awarded_by: string;
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
