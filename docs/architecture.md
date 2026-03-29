
# arquitetura do sistema

a aplicação utiliza uma stack moderna:
- frontend: react 18 + typescript + tailwind css.
- backend: supabase (auth, postgres, edge functions).
- design: fonte poppins, estilo lowercase, ui gamificada.

## esquema do banco de dados (sql)

```sql
-- criar tabela de empresas
create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- criar tabela de perfis (extensão de auth.users)
create table profiles (
  id uuid primary key references auth.users(id),
  email text not null,
  full_name text,
  role text check (role in ('admin', 'user')) default 'user',
  company_id uuid references companies(id),
  level integer default 1,
  xp integer default 0,
  created_at timestamp with time zone default now()
);

-- criar tabela de selos
create table badges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category text,
  icon_name text, -- referência a ícones lucide ou svg
  points integer default 10,
  created_at timestamp with time zone default now()
);

-- criar tabela de configurações do sistema
create table system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default now()
);

-- selos conquistados por usuários
create table user_badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  awarded_at timestamp with time zone default now(),
  awarded_by uuid references profiles(id),
  unique(user_id, badge_id)
);

-- solicitações de selos (comprovantes)
create table badge_submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  proof_url text,
  description text,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  submitted_at timestamp with time zone default now(),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamp with time zone,
  feedback text
);

-- segurança: row level security (rls)
alter table profiles enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table badge_submissions enable row level security;
alter table system_settings enable row level security;

-- políticas
create policy "admin gerencia tudo" on system_settings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
```

## atualizações de funcionalidade (crud e gestão)
- [badges] implementação de create, read, update e delete via painel administrativo.
- [badges] filtros por categoria e busca textual em tempo real.
- [users] visualização detalhada de selos conquistados por explorador (modal de conquistas).
- [companies] gestão completa de organizações parceiras.
```