# Guia de Troubleshooting - Persistência de Dados

## Problema: Dados não persistem após deploy

Se você notar que os dados adicionados no site desaparecem após um deploy, isso significa que o **fallback em memória está sendo usado em produção**.

### ✅ Como Verificar se o Banco Está Conectado

1. **Verifique os logs do Render**
   - Procure por `✅ [DATABASE] Conexão com PostgreSQL estabelecida com sucesso`
   - Se vir ❌ mensagens de erro, há um problema de conexão

2. **Teste a conexão localmente**
   ```bash
   npm run db:test
   ```

### 🔴 Erro Comum: DATABASE_URL sem Aspas no render.yaml

Se você vir o erro: `database "base_de_dados_postergress"" does not exist`

**Problema:** A URL está sem aspas no YAML, causando problemas de parsing.

**Solução:** Sempre colocar a DATABASE_URL entre aspas duplas:

```yaml
# ❌ ERRADO
- key: DATABASE_URL
  value: postgresql://user:password@host:port/database

# ✅ CORRETO  
- key: DATABASE_URL
  value: "postgresql://user:password@host:port/database"
```

### 🔧 Checklist de Resolução

#### 1️⃣ Verificar DATABASE_URL no render.yaml

Abra o arquivo `render.yaml` e confirme:
```yaml
envVars:
  - key: DATABASE_URL
    value: "postgresql://user:password@host:port/database"
  - key: DATABASE_SSL
    value: "true"
```

**Itens a verificar:**
- ✓ URL tem o formato correto: `postgresql://`
- ✓ Usuário e senha não têm caracteres especiais não escapados
- ✓ Host e porta estão corretos
- ✓ Nome do banco de dados está correto

#### 2️⃣ Usar a Internal URL do Render (Recomendado para Render)

Se você está usando **Render para ambos** (web service e database), use a **Internal Database URL**:

**No Render Dashboard:**
1. Vá para o banco PostgreSQL
2. Aba "Connections"
3. Copie a **Internal Database URL** (não a pública)
4. Atualize a variável `DATABASE_URL` no serviço web

**Formato da Internal URL:**
```
postgresql://user:password@hostname:port/database
```

**Importante:** 
- ✓ Copie exatamente como aparece no Render
- ✓ Certifique-se que inclui a **porta** (geralmente 5432)
- ✓ Coloque entre aspas no render.yaml: `value: "postgresql://..."`

#### 3️⃣ Regenerar a DATABASE_URL (Se estiver fora do Render)

**Opção 1: Usar o Script de Teste (Recomendado - sem dependências)**

```bash
npm run db:test
```

Este script irá:
- ✅ Testar a conexão com o banco
- ✅ Mostrar informações do PostgreSQL
- ✅ Listar as tabelas criadas
- ✅ Indicar se a persistência funcionará

**Opção 2: Usar psql (requer instalação)**

Se tiver o `psql` instalado:
```bash
psql "postgresql://user:password@host:port/database"
```

Se não tiver o psql instalado, use a Opção 1 (script de teste)

#### 4️⃣ Forçar Novo Deploy

Após corrigir a DATABASE_URL:
1. Faça um commit com as alterações
2. Push para o repositório
3. Trigger um novo deploy no Render (ou push novo para ativar auto-deploy)

### 📊 O que Acontece Durante o Deploy

```mermaid
graph TD
    A["Build iniciado"] --> B["npm run build"]
    B --> C["npm run db:push"]
    C --> D{Conexão OK?}
    D -->|✅ Sim| E["Schema sincronizado"]
    D -->|❌ Não| F["⚠️ BUILD FALHA"]
    E --> G["Aplicação aguarda dados do BD"]
    F --> H["❌ DADOS NÃO PERSISTEM"]
```

### 🚨 Sinais de Aviso

Você verá no log do Render:
- `❌ [DATABASE] Falha ao conectar PostgreSQL`
- `⚠️ Usando fallback em memória`
- `💥 Dados adicionados ao site NÃO serão persistidos!`

### ✅ Confirmação de Sucesso

Após corrigir, você deve ver:
- `✅ [DATABASE] Conexão com PostgreSQL estabelecida com sucesso`
- `✅ Schema do banco atualizado com sucesso!`
- Ao rodar `npm run db:test`, você verá a lista de tabelas criadas:
  - badges
  - companies
  - users
  - user_badges
  - badge_submissions
  - E outras...

Neste caso, os dados **SERÃO persistidos** ✅

---

## Scripts Úteis

### Verificar Conexão Automática
```bash
npm run db:check
```

### Testar Conexão com Detalhes (Recomendado)
```bash
npm run db:test
```

Você pode fornecer a URL interativamente, ou usar com variável de ambiente:
```bash
DATABASE_URL="postgresql://user:password@host:port/database" npm run db:test
```

### Push Manual do Schema
```bash
npm run db:push
```

---

**Dúvidas?** Verifique:
1. Logs do Render (aba "Logs")
2. Credenciais da base de dados (aba "Connections")
3. Status do banco PostgreSQL (deve estar "available")
