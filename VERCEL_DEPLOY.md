# 🚀 Guia de Deploy na Vercel

## Preparação

O projeto **Mural OBPC** está totalmente preparado para ser deployado na Vercel! Siga os passos abaixo:

## ✅ Pré-requisitos

1. Conta no GitHub (já feita ✓)
2. Conta na Vercel (crie em https://vercel.com)
3. Repositório no GitHub (já feito ✓)

## 📋 Passos para Deploy

### Opção 1: Deploy via Vercel Web (Recomendado)

1. **Acesse a Vercel**
   - Vá para https://vercel.com/dashboard
   - Faça login com sua conta GitHub

2. **Importe o Repositório**
   - Clique em "Add New" → "Project"
   - Selecione "Import Git Repository"
   - Procure por `muralregional`
   - Clique "Import"

3. **Configure o Projeto**
   - **Project Name**: `mural-obpc` (ou outro nome)
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (padrão)

4. **Variáveis de Ambiente**
   - Clique em "Environment Variables"
   - Adicione (opcional, valores padrão já estão no código):
     ```
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=admin123
     ```

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde ~2-3 minutos
   - Seu site estará em: `https://mural-obpc.vercel.app`

### Opção 2: Deploy via CLI (Vercel Command Line)

```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Na pasta do projeto
cd "c:\Users\ferna\OneDrive\Documentos\APP\MURAL OBPPC\mural-obpc"

# 3. Faça login
vercel login

# 4. Deploy
vercel

# 5. Deploy em produção
vercel --prod
```

## 🔧 Configurações Importantes

### Banco de Dados
- ✅ Usa `/tmp` na Vercel (ephemeral, reconstrói a cada deploy)
- ✅ Usa `./data` em desenvolvimento local
- ⚠️ Dados serão resetados a cada novo deploy

### Para Persistência Permanente (Opcional)
Se precisar manter dados entre deploys, migre para:
- **PostgreSQL** (recomendado com Vercel Postgres)
- **MongoDB** (Atlas)
- **Supabase** (PostgreSQL gerenciado)

## 📊 Variáveis de Ambiente em Produção

Na Vercel Dashboard, vá para:
```
Project Settings → Environment Variables
```

Adicione as variáveis necessárias:
```
ADMIN_USERNAME=seu_usuario
ADMIN_PASSWORD=sua_senha_segura
```

> **🔐 IMPORTANTE**: Mude as credenciais padrão em produção!

## 🎯 URLs Após Deploy

```
Home:          https://seu-projeto.vercel.app/
Admin Login:   https://seu-projeto.vercel.app/admin
Dashboard:     https://seu-projeto.vercel.app/admin/dashboard
API:           https://seu-projeto.vercel.app/api/...
```

## ✨ Recursos que Funcionam na Vercel

- ✅ Todas as rotas Next.js
- ✅ API endpoints serverless
- ✅ Autenticação admin
- ✅ CRUD de anúncios
- ✅ PWA (install banner, offline, etc)
- ✅ Cache com headers customizados
- ✅ Service Worker (/sw.js)
- ✅ Imagens remotas

## ⚠️ Limitações (por usar SQLite em /tmp)

- Dados são **temporários** (resetam a cada deploy)
- **Não recomendado** para ambiente de produção real
- Para produção, migre para PostgreSQL ou MongoDB

## 🔄 CI/CD Automático

Após importar para Vercel:
- ✅ Cada `git push` na `main` faz deploy automático
- ✅ Preview URLs para PRs
- ✅ Rollback automático se falhar

## 🛠️ Troubleshooting

### Erro: "better-sqlite3 not found"
- Vercel já possui suporte nativo
- Verificar se `experimental.serverComponentsExternalPackages` está configurado ✓

### Erro: "Permission denied /tmp"
- Vercel concede automaticamente acesso a `/tmp`
- Não requer config adicional

### Banco de dados vazio após deploy
- É esperado com SQLite em `/tmp`
- Dados se reconstroem automaticamente
- Migrar para banco persistente se necessário

## 📞 Suporte

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

## ✅ Checklist Final

- [ ] Repositório GitHub atualizado
- [ ] `.vercelignore` criado ✓
- [ ] `.env.example` criado ✓
- [ ] `next.config.ts` com Vercel config ✓
- [ ] `src/lib/db.ts` com suporte a `/tmp` ✓
- [ ] Conta Vercel criada
- [ ] Repositório importado na Vercel
- [ ] Deploy realizado
- [ ] Site funcionando
- [ ] Credenciais admin alteradas (produção)

---

**Pronto para colocar no ar! 🚀**
