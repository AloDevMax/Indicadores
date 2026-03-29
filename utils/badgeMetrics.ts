import { BadgeTone, UserBadge } from '../types';

export const BADGE_TONE_WEIGHTS: Record<BadgeTone, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
  loss_1: -1,
  loss_2: -2,
};

export const BADGE_TONE_LABELS: Record<BadgeTone, string> = {
  bronze: 'Bronze',
  silver: 'Prata',
  gold: 'Ouro',
  loss_1: 'Perda 1',
  loss_2: 'Perda 2',
};

export const isSameMonth = (dateIso: string, reference = new Date()) => {
  const date = new Date(dateIso);
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
};

export const getUserMonthlyBadges = (userId: string, userBadges: UserBadge[], reference = new Date()) =>
  userBadges.filter(badge => badge.user_id === userId && isSameMonth(badge.awarded_at, reference));

export const getUserMonthlyBadgeMetrics = (userId: string, userBadges: UserBadge[], reference = new Date()) => {
  const monthlyBadges = getUserMonthlyBadges(userId, userBadges, reference);

  const counts: Record<BadgeTone, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    loss_1: 0,
    loss_2: 0,
  };

  monthlyBadges.forEach(badge => {
    counts[badge.tone] += 1;
  });

  const monthlyScore = monthlyBadges.reduce((sum, badge) => sum + BADGE_TONE_WEIGHTS[badge.tone], 0);
  const positiveCount = counts.bronze + counts.silver + counts.gold;
  const lossCount = counts.loss_1 + counts.loss_2;

  return {
    monthlyBadges,
    monthlyScore,
    positiveCount,
    lossCount,
    counts,
  };
};
