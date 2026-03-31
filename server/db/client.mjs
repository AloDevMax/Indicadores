export const createPgClient = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const { Client } = await import('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
    });
    await client.connect();
    return client;
  } catch (error) {
    console.warn('[api] PostgreSQL client unavailable, using in-memory fallback.', error);
    return null;
  }
};
