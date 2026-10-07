import { createClient } from '@supabase/supabase-js';
import { nameFromUrl } from './localStorage.mjs';

export const createSupabaseStorage = ({ client, supabaseUrl, bucket }) => {
  const publicPrefix = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${bucket}/`;
  const objects = () => client.storage.from(bucket);
  const urlFor = (name) => objects().getPublicUrl(name).data.publicUrl;

  return {
    urlFor,

    ownsUrl: (url) => nameFromUrl(url, publicPrefix) !== null,

    async exists(name) {
      const { data } = await objects().exists(name);
      return data === true;
    },

    async put(name, buffer, mimeType) {
      const { error } = await objects().upload(name, buffer, { contentType: mimeType, upsert: false });
      if (error) {
        // A mensagem original pode conter detalhes da requisição; não sai do servidor.
        console.error('Falha no upload para o Supabase Storage:', error.statusCode ?? error.name ?? 'erro');
        throw new Error('Falha ao enviar arquivo para o storage');
      }
      return urlFor(name);
    },

    async remove(url) {
      const name = nameFromUrl(url, publicPrefix);
      if (!name) return;
      const { error } = await objects().remove([name]);
      if (error) {
        console.error('Falha ao remover arquivo do Supabase Storage:', error.statusCode ?? error.name ?? 'erro');
      }
    },
  };
};

export const createSupabaseStorageFromEnv = (env) =>
  createSupabaseStorage({
    client: createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
    supabaseUrl: env.SUPABASE_URL,
    bucket: env.SUPABASE_STORAGE_BUCKET,
  });
