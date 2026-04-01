# 🚀 DevBurger — Guia de Deploy Online

Deploy gratuito: **Backend no Railway** + **Frontend na Vercel**

---

## PARTE 1 — SUBIR NO GITHUB

### 1. Criar conta no GitHub
Acesse https://github.com e crie uma conta gratuita

### 2. Criar repositório
1. Clica em **"New repository"**
2. Nome: `devburger`
3. Deixa como **Public**
4. Clica em **"Create repository"**

### 3. Subir o código pelo VS Code
No VS Code com a pasta devburger aberta:
1. Clica no ícone de **Git** na barra lateral (ou CTRL+SHIFT+G)
2. Clica em **"Initialize Repository"**
3. Digita uma mensagem: `primeiro commit`
4. Clica em **✓ Commit**
5. Clica em **"Publish Branch"**
6. Seleciona o repositório que você criou

---

## PARTE 2 — DEPLOY DO BACKEND (Railway)

### 1. Criar conta no Railway
Acesse https://railway.app e faça login com GitHub

### 2. Criar novo projeto
1. Clica em **"New Project"**
2. Seleciona **"Deploy from GitHub repo"**
3. Seleciona o repositório `devburger`
4. Quando perguntar qual pasta, seleciona **`backend`**

### 3. Adicionar PostgreSQL
1. No seu projeto Railway, clica em **"+ New"**
2. Seleciona **"Database"** → **"PostgreSQL"**
3. O Railway conecta automaticamente! ✅

### 4. Configurar variáveis de ambiente
No Railway, clica no seu serviço backend → **"Variables"** → adiciona:

```
JWT_SECRET=devburger_super_secret_mude_isso_123
STRIPE_SECRET_KEY=sk_test_sua_chave_stripe_aqui
FRONTEND_URL=https://seu-app.vercel.app
PORT=3001
```

⚠️ O `DATABASE_URL` é adicionado automaticamente pelo Railway!

### 5. Deploy automático
O Railway já faz o deploy automaticamente quando você sobe o código! 🎉

### 6. Pegar a URL do backend
Clica no serviço → **"Settings"** → **"Domains"** → gera um domínio
Vai ser algo como: `https://devburger-backend.railway.app`

**Salva essa URL! Vai precisar no próximo passo.**

---

## PARTE 3 — DEPLOY DO FRONTEND (Vercel)

### 1. Criar conta na Vercel
Acesse https://vercel.com e faça login com GitHub

### 2. Importar projeto
1. Clica em **"Add New Project"**
2. Seleciona o repositório `devburger`
3. Em **"Root Directory"** coloca: `frontend`
4. Framework: **Create React App** (detecta automaticamente)

### 3. Configurar variáveis de ambiente
Antes de fazer deploy, adiciona as variáveis:

```
REACT_APP_API_URL=https://devburger-backend.railway.app
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_stripe
```

### 4. Clica em Deploy! 🚀
Aguarda alguns minutos e pronto!

Vai gerar uma URL tipo: `https://devburger.vercel.app`

---

## PARTE 4 — CRIAR USUÁRIO ADMIN

Depois que o backend estiver rodando no Railway:

### Opção 1 — Pelo Railway Console
No Railway, clica no PostgreSQL → **"Data"** → **"Query"** e roda:

```sql
-- Primeiro crie uma conta normal pelo site
-- Depois rode:
UPDATE users SET admin = true WHERE email = 'seu@email.com';
```

### Opção 2 — Pelo pgAdmin conectando ao Railway
No Railway, clica no PostgreSQL → **"Variables"** e pegue:
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

---

## ✅ CHECKLIST FINAL

- [ ] Código no GitHub
- [ ] Backend rodando no Railway
- [ ] PostgreSQL no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Frontend na Vercel
- [ ] URL do backend configurada no frontend
- [ ] Usuário admin criado
- [ ] Teste de login funcionando
- [ ] Teste de pedido funcionando
- [ ] Stripe configurado (cartão de teste: 4242 4242 4242 4242)

---

## 🆓 LIMITES GRATUITOS

| Plataforma | Limite Grátis |
|---|---|
| Railway | $5/mês de crédito (suficiente para projetos pequenos) |
| Vercel | Ilimitado para projetos pessoais |
| PostgreSQL (Railway) | 1GB de armazenamento |

---

## ❓ PROBLEMAS COMUNS

**Frontend não conecta no backend:**
→ Verifica se `REACT_APP_API_URL` está correto na Vercel

**Erro de CORS:**
→ Verifica se `FRONTEND_URL` no Railway tem a URL exata da Vercel (sem / no final)

**Migrations não rodaram:**
→ No Railway, vai em seu serviço → "Deploy Logs" e verifica o erro

**Stripe não funciona:**
→ Usa as chaves de TESTE (`pk_test_` e `sk_test_`)
→ Cartão de teste: `4242 4242 4242 4242`
