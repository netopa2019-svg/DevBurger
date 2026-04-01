# 🍔 DevBurger — Sistema Completo

Sistema completo de hamburgueria com Frontend React + Backend Node.js + PostgreSQL.

---

## 📁 Estrutura do Projeto

```
devburger/
├── backend/          ← API Node.js
└── frontend/         ← Interface React
```

---

## 🚀 INSTALAÇÃO COMPLETA — Passo a Passo

### PRÉ-REQUISITOS

Instale antes de começar:
- **Node.js** → https://nodejs.org (versão 18+)
- **PostgreSQL** → https://www.postgresql.org/download
- **Git** → https://git-scm.com (opcional)

---

## ⚙️ CONFIGURAR O BACKEND

### 1. Instalar dependências

Abre o CMD, vai para a pasta backend e roda:

```bash
cd devburger/backend
npm install
```

### 2. Criar o banco de dados

Abre o **pgAdmin** (instala junto com o PostgreSQL) ou o terminal do PostgreSQL e roda:

```sql
CREATE DATABASE devburger;
```

### 3. Configurar variáveis de ambiente

Copia o arquivo `.env.example` e renomeia para `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devburger
DB_USER=postgres
DB_PASS=sua_senha_do_postgres

JWT_SECRET=devburger_super_secret_key_2024

STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
FRONTEND_URL=http://localhost:3000

PORT=3001
```

### 4. Rodar as migrations (criar tabelas)

```bash
npm run migrate
```

### 5. Criar usuário Admin

Abre o pgAdmin ou terminal PostgreSQL e roda:

```sql
-- Primeiro registre um usuário normal pela tela de cadastro
-- Depois promova para admin com:
UPDATE users SET admin = true WHERE email = 'seu@email.com';
```

Ou via Node diretamente no CMD (com servidor rodando):

```bash
node -e "
const axios = require('axios');
axios.post('http://localhost:3001/users', {
  name: 'Admin DevBurger',
  email: 'admin@devburger.com',
  password: 'admin123'
}).then(async () => {
  const pg = require('pg');
  const client = new pg.Client({ database: 'devburger', user: 'postgres', password: 'sua_senha' });
  await client.connect();
  await client.query(\"UPDATE users SET admin = true WHERE email = 'admin@devburger.com'\");
  await client.end();
  console.log('Admin criado!');
});
"
```

### 6. Iniciar o servidor backend

```bash
npm run dev
```

✅ API rodando em: **http://localhost:3001**

---

## 🎨 CONFIGURAR O FRONTEND

### 1. Instalar dependências

```bash
cd devburger/frontend
npm install
```

### 2. Configurar variáveis de ambiente

Cria o arquivo `.env` na pasta frontend:

```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_stripe
```

### 3. Iniciar o frontend

```bash
npm start
```

✅ Site rodando em: **http://localhost:3000**

---

## 💳 CONFIGURAR O STRIPE (Pagamentos)

### 1. Criar conta gratuita
Acesse: https://stripe.com e crie uma conta

### 2. Pegar as chaves de teste
No Dashboard do Stripe → Developers → API Keys:
- **Publishable key** → começa com `pk_test_...` → coloca no `.env` do frontend
- **Secret key** → começa com `sk_test_...` → coloca no `.env` do backend

### 3. Para testar pagamentos use o cartão:
```
Número: 4242 4242 4242 4242
Validade: qualquer data futura
CVV: qualquer 3 dígitos
```

---

## 📋 FUNCIONALIDADES

### 👤 Cliente
- ✅ Cadastro e Login
- ✅ Ver cardápio por categorias
- ✅ Adicionar ao carrinho
- ✅ Checkout com endereço
- ✅ Pagamento via Stripe (cartão) ou PIX
- ✅ Acompanhar pedidos em tempo real
- ✅ Histórico de pedidos

### 🛡️ Admin
- ✅ Painel administrativo completo
- ✅ Criar/editar/deletar produtos
- ✅ Upload de imagens dos produtos
- ✅ Gerenciar categorias
- ✅ Ver todos os pedidos
- ✅ Atualizar status dos pedidos
- ✅ Marcar produtos em oferta

---

## 🔗 ROTAS DA API

### Públicas
```
POST /users          → Cadastrar
POST /sessions       → Login
```

### Autenticadas (precisa do token JWT)
```
GET  /products       → Listar produtos
GET  /categories     → Listar categorias
POST /orders         → Criar pedido
GET  /orders         → Meus pedidos
POST /create-checkout-session → Stripe
```

### Admin (precisa ser admin)
```
POST   /products        → Criar produto
PUT    /products/:id    → Editar produto
DELETE /products/:id    → Deletar produto
POST   /categories      → Criar categoria
DELETE /categories/:id  → Deletar categoria
GET    /admin/orders    → Ver todos pedidos
PUT    /orders/:id/status → Atualizar status
```

---

## 🐛 PROBLEMAS COMUNS

**Erro: "connect ECONNREFUSED" no backend**
→ PostgreSQL não está rodando. Inicia o serviço do PostgreSQL.

**Erro: "database devburger does not exist"**
→ Cria o banco: `CREATE DATABASE devburger;` no pgAdmin.

**Erro de CORS no frontend**
→ Verifica se o backend está rodando na porta 3001.

**Stripe não funciona**
→ Verifica se as chaves estão corretas no `.env`.

---

## 📞 COMANDOS ÚTEIS

```bash
# Backend
npm run dev          # Rodar em desenvolvimento
npm run migrate      # Rodar migrations
npm start            # Rodar em produção

# Frontend
npm start            # Rodar em desenvolvimento
npm run build        # Gerar build de produção
```

---

Feito com ❤️ por DevBurger 🍔
