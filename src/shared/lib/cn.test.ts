import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names with a space', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values (undefined, null, false, empty string)', () => {
    expect(cn('a', undefined, null, false, '', 'b')).toBe('a b');
  });

  it('flattens conditional object syntax', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(undefined, null, false)).toBe('');
  });
});
