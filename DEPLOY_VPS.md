# Deploy na VPS (IP agora, domínio depois)

Este projeto é um **frontend Vite/React**. O deploy recomendado é:

- **Buildar** o projeto (gera a pasta `dist/`)
- Servir o `dist/` com **Nginx**
- Fazer **proxy** da API do bot em `/api` → `http://127.0.0.1:3000` (evita CORS)

## 1) Configurar o `.env` para produção

Crie um `.env` com:

```env
VITE_API_BASE_URL=/api
```

> Isso faz o navegador chamar `http://SEU-SITE/api/...` e o Nginx repassa para o backend local.

## 2) Build do frontend

### Opção A — build local e enviar o `dist/` (mais simples)

No seu PC:

```bash
npm install
npm run build
```

Isso vai gerar `dist/`.

Envie para a VPS (PowerShell):

```powershell
# Crie a pasta no servidor antes (ver seção Nginx)
scp -r .\dist\* root@31.97.90.13:/var/www/gabbis-panel/
```

Se você usa um usuário diferente de `root`, troque no comando.

### Opção B — build direto na VPS (bom se você usa git lá)

Na VPS (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install -y nginx
```

Instale Node.js (recomendado via NodeSource) **ou** use o Node já existente no servidor.

Depois:

```bash
git clone <SEU_REPO_AQUI> gabbis-web
cd gabbis-web

# crie/ajuste o .env
printf "VITE_API_BASE_URL=/api\n" > .env

npm ci
npm run build

sudo mkdir -p /var/www/gabbis-panel
sudo rm -rf /var/www/gabbis-panel/*
sudo cp -r dist/* /var/www/gabbis-panel/
```

## 3) Nginx (IP agora)

Copie o vhost pronto:

```bash
sudo cp deploy/nginx-gabbis-panel.conf /etc/nginx/sites-available/gabbis-panel
sudo ln -s /etc/nginx/sites-available/gabbis-panel /etc/nginx/sites-enabled/gabbis-panel

# (opcional) desabilitar o default
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl reload nginx
```

Agora o site deve abrir em:

- `http://31.97.90.13`

## 4) Backend/API do bot

O Nginx está configurado para mandar `/api/*` para:

- `http://127.0.0.1:3000`

Então o backend precisa estar rodando **na VPS** nessa porta (de preferência bindado em localhost).

## 5) Quando o domínio ficar livre (deixar “pronto”)

1. Aponte o DNS:
   - `A` → `31.97.90.13` (raiz)
   - `A` → `31.97.90.13` (www)

2. No arquivo do Nginx (`/etc/nginx/sites-available/gabbis-panel`), troque:

```
server_name 31.97.90.13;
```

por:

```
server_name seu-dominio.com www.seu-dominio.com;
```

3. Recarregue:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

4. (recomendado) HTTPS grátis com Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## Troubleshooting rápido

- **Abre o HTML, mas rotas tipo `/guilds` dão 404**: o Nginx precisa do `try_files ... /index.html` (já está no vhost).
- **Erro de CORS**: confirme que você buildou com `VITE_API_BASE_URL=/api` e que o proxy `/api/` está ativo.
- **API não responde**: confirme que o backend está rodando em `127.0.0.1:3000` na VPS.

