// @vitest-environment node
import path from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { packageRelease } from './packageRelease.mjs';

const MAIN_SHA = '207bbc9122cd6058c8972e5e9f5985f917a5a3dd';
const OLD_SHA = 'ab400a33bb4a54086eae80244d30117786e383a2';

// git(args) devolve o stdout do comando; o fake responde aos rev-parse e registra as chamadas.
const makeFakeGit = ({ production = MAIN_SHA, main = MAIN_SHA, fetchError } = {}) => vi.fn(async (args) => {
  if (args[0] === 'fetch' && fetchError) throw fetchError;
  if (args[0] === 'rev-parse') return `${args[1] === 'origin/production' ? production : main}\n`;
  return '';
});

const now = new Date('2026-10-23T14:05:00Z');

describe('packageRelease', () => {
  it('gera o zip do commit da production quando ela está igual à main', async () => {
    const git = makeFakeGit();

    const result = await packageRelease({ git, outDir: '/repo/releases', now });

    const file = path.join('/repo/releases', 'labquest-2026-10-23-207bbc9.zip');
    expect(result).toEqual({ ok: true, sha: MAIN_SHA, file });
    expect(git).toHaveBeenCalledWith(['fetch', 'origin', 'main', 'production']);
    expect(git).toHaveBeenLastCalledWith(['archive', '--format=zip', '-o', file, MAIN_SHA]);
  });

  it('recusa e não gera zip quando a production ainda não alcançou a main', async () => {
    const git = makeFakeGit({ production: OLD_SHA });

    const result = await packageRelease({ git, outDir: '/repo/releases', now });

    expect(result).toEqual({
      ok: false,
      error: 'production (ab400a3) difere da main (207bbc9): espere o job "Migrate Supabase and release" do CI terminar',
    });
    expect(git.mock.calls.some(([args]) => args[0] === 'archive')).toBe(false);
  });

  it('recusa quando o fetch falha, para não empacotar uma production desatualizada', async () => {
    const git = makeFakeGit({ fetchError: new Error('Could not resolve host: github.com') });

    const result = await packageRelease({ git, outDir: '/repo/releases', now });

    expect(result).toEqual({ ok: false, error: 'git fetch falhou: Could not resolve host: github.com' });
    expect(git).toHaveBeenCalledTimes(1);
  });
});
