import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Badge, BadgeTone } from '@/shared/types';
import BadgeCard from './BadgeCard';

const BADGE: Badge = { id: 'b1', name: 'NPS', description: 'Net Promoter Score', category: 'Qualidade', icon_name: '⭐', points: 10 };

const cardClasses = (tone: BadgeTone) =>
  (render(<BadgeCard badge={BADGE} unlocked tone={tone} />).container.firstElementChild as HTMLElement).className;

describe('BadgeCard', () => {
  // Duas utilidades de sombra no mesmo elemento dependem da ordem do CSS gerado:
  // o Tailwind do CDN deixava o brilho colorido vencer, o do build deixa o shadow-xl.
  it.each(['bronze', 'silver', 'gold'] as const)('dá ao card %s só o brilho colorido do tom', (tone) => {
    const classes = cardClasses(tone);

    expect(classes).toMatch(/shadow-\[0_20px_60px_rgba\(/);
    expect(classes).not.toMatch(/(^|\s)shadow-xl(\s|$)/);
  });

  it.each(['loss_1', 'loss_2'] as const)('mantém a sombra padrão no card %s, que não tem brilho próprio', (tone) => {
    expect(cardClasses(tone)).toMatch(/(^|\s)shadow-xl(\s|$)/);
  });
});
