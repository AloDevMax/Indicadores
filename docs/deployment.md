
# guia de implantação

## configuração do supabase
1. crie um novo projeto no supabase.
2. execute os scripts sql fornecidos em `architecture.md`.
3. habilite autenticação por email ou provedores sociais.
4. configure o bucket de armazenamento para ícones de selos, se necessário.

## implantação do frontend
1. conecte o repositório ao vercel ou netlify.
2. defina as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. implante e verifique as rotas.
