import { env } from '../../config/env.mjs';
import { createLocalStorage } from './localStorage.mjs';
import { createSupabaseStorageFromEnv } from './supabaseStorage.mjs';

export const createStorage = (config) =>
  config.STORAGE_DRIVER === 'supabase' ? createSupabaseStorageFromEnv(config) : createLocalStorage();

let storage;

// Criado sob demanda para que importar este módulo não abra conexões.
export const getStorage = () => {
  storage ??= createStorage(env);
  return storage;
};
