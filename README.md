## Gabbis Workspace - Painel Web

Painel web em React para controlar o bot Gabbis (proteções, blacklist, narrador, soundboard e logs) via API HTTP.

### 📦 Tecnologias

- React 18
- React Router 6
- Vite

### 🔧 Configuração

1. Crie um `.env` baseado em `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Normalmente você vai deixar o bot + API rodando em `http://localhost:3000` no mesmo VPS/PC.

2. Instale as dependências:

```bash
cd WorkspaceWEB
npm install
```

3. Rode em modo desenvolvimento:

```bash
npm run dev
```

Abra o navegador em `http://localhost:5173`.

> **Importante:** o backend precisa estar rodando (`npm start` no projeto do bot) e com `PANEL_TOKEN` configurado.

### 🔐 Login

- Na tela de login, informe o mesmo valor de `PANEL_TOKEN` configurado no `.env` do bot.
- O painel salva esse token no `localStorage` e o envia em todas as requisições para a API.

### ✨ Funcionalidades atuais

- **Login por token do painel**
- **Lista de servidores** em que o bot está (`/guilds`)
- **Tela de detalhes da guild**:
  - Resumo das **proteções** e estatísticas
  - Resumo de **blacklist**
  - Configuração de **narrador** (falar ou não o nome do usuário)
  - Configuração de **soundboard** (duração máxima e volume)
  - Visualização da configuração de **logs**

O painel é apenas um cliente da API; qualquer regra de permissão/validação continua sendo feita no backend.

