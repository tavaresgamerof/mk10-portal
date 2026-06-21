# Resumo do Chat - Site MK10TV

## Data: 21/06/2026

## Configuracoes do Projeto

- **Repo GitHub:** https://github.com/tavaresgamerof/mk10-portal
- **Vercel:** https://mk10tv-gold.vercel.app (projeto mk10tv-gold)
- **Stack:** Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Canal YouTube:** UCwehhoJDFXjg7bcKB22JS2g (@mk10produtora)

## Alteracoes Realizadas

### 1. Admin News - Remover Autor e Select
- Campo "Autor" removido do formulario (preenchido automaticamente como "MK10")
- Select de categoria trocado por input de texto livre
- Arquivo: `src/app/admin/news/page.tsx`

### 2. Fix Lint - Admin Layout
- Corrigido erro de lint `react-hooks/set-state-in-effect` no admin layout
- Estado `authed` inicializado com `isLoginPage`
- Arquivo: `src/app/admin/layout.tsx`

### 3. Favicon - Logo MK10
- Metadata `icons.icon` apontando para `/logo-mk10.png` direto
- Arquivo: `src/app/layout.tsx`

### 4. YouTube - RSS Feed e Deteccao de Live
- **Antes:** Scraping HTML do canal com KNOWN_VIDEO_IDS hardcoded (videos antigos)
- **Agora:** RSS Feed do YouTube (`/feeds/videos.xml`) - retorna videos na ordem cronológica correta
- **Deteccao de live separada:** Verifica `/live` do canal
- **Quando ao vivo:** Polling muda de 30s para 15s
- **Arquivos alterados:**
  - `src/lib/youtube.ts` - Reescrito com RSS feed
  - `src/app/api/youtube/route.ts` - Cache dinamico (10s quando live, 30s quando offline)
  - `src/components/LiveIndicator.tsx` - Polling adaptativo
  - `src/app/ao-vivo/page.tsx` - Polling adaptativo

## Deploy

### Git
```bash
# Remote
git remote set-url origin https://github.com/tavaresgamerof/mk10-portal.git

# Credenciais GitHub (conta: tavaresgamerof)
# Se precisar trocar credenciais:
cmdkey /delete:git:https://github.com
```

### Vercel
```bash
# Projeto: mk10tv-gold
# Deploy via CLI (pode travar no terminal, usar Start-Process)
vercel link --yes --project mk10tv-gold
vercel --prod --yes

# Deploy via push (recomendado - funciona automatico)
git add -A
git commit -m "mensagem"
git push origin master
```

### Deploy via Background (quando CLI trava)
```powershell
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'C:\Users\sirta\OneDrive\Desktop\Site MK10\mk10-portal'; vercel --prod --yes *> C:\Users\sirta\OneDrive\Desktop\deploy.log`"" -WindowStyle Minimized
```

### Verificar Deploy
```bash
vercel ls
```

## Paginas do Site

| Rota | Tipo |
|------|------|
| `/` | Home (HeroBanner, LiveIndicator, News, Videos, Patrocinadores) |
| `/ao-vivo` | Pagina ao vivo com chat YouTube |
| `/news` | Lista de noticias |
| `/news/[id]` | Noticia individual |
| `/galeria` | Galeria de videos |
| `/sobre` | Sobre o MK10 |
| `/contato` | Contato |
| `/patrocinadores` | Patrocinadores |
| `/patrocinar` | Formulario de patrocinio |
| `/propostas` | Propostas |
| `/transmita` | Transmita |
| `/vip` | Area VIP |
| `/admin` | Login admin |
| `/admin/dashboard` | Dashboard |
| `/admin/news` | Gerenciar noticias |
| `/admin/videos` | Gerenciar videos |
| `/admin/transmissoes` | Gerenciar transmissoes |
| `/admin/patrocinadores` | Gerenciar patrocinadores |
| `/admin/propostas` | Gerenciar propostas |
| `/admin/settings` | Configuracoes |

## YouTube API

- Endpoint: `/api/youtube`
- Cache: 30s (normal) / 10s (ao vivo)
- Retorna: `isLive`, `liveVideoId`, `latestVideo`, `recentVideos`

## Lint

- **0 erros** no ESLint
- Warnings apenas de `<img>` (normais, nao bloqueiam deploy)

## Build

- **Build local:** `npm run build`
- **Build Vercel:** Funciona, todas as 23 paginas compilam
- **TypeScript:** Sem erros
