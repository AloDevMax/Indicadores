# Troubleshooting: conexão com o banco em produção

Em produção (`NODE_ENV=production`) o servidor **não sobe** sem `DATABASE_URL`, `AUTH_SECRET` e
`DEVELOPER_INITIAL_PASSWORD` — o processo termina com `Variáveis de ambiente inválidas:` listando o que falta.
Corrija o `.env` da VPS e reinicie (`docker compose up -d`).

## Banco inacessível

Se as variáveis existem mas a conexão falha, o log de inicialização mostra
`❌ [DATABASE] Erro ao conectar` e a aplicação entra no fallback em memória
(**dados não persistem** — esse fallback será removido na próxima etapa da reestruturação).

Diagnóstico:

```bash
# Na máquina de dev (lê .env)
npm run db:check

# Dentro do container de produção
docker compose exec app node scripts/dbCheck.mjs
```

Saída esperada: `✅ Conectado: PostgreSQL 16.x` e a lista de tabelas. Em caso de falha, a mensagem do driver
(`ECONNREFUSED`, `password authentication failed`, `database "x" does not exist`, ...) indica a causa.

## Checklist

- `DATABASE_URL` no formato `postgresql://usuario:senha@host:porta/banco`, com caracteres especiais da senha URL-encoded
- `DATABASE_SSL=false` para o Postgres do próprio compose; mantenha ligado (padrão) para bancos gerenciados
- Banco com o schema aplicado: `db:check` lista as tabelas (`users`, `badges`, ...); se vier vazio, o schema não foi aplicado
