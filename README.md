# Mural OBPC Sorocaba - PWA

Um Progressive Web App moderno para centralizar e divulgar anúncios das 17 igrejas da OBPC Regional Sorocaba.

## 🚀 Características

- ✨ **Interface Moderna e Vibrante** - Design responsivo mobile-first com animações suaves
- 📱 **PWA Instalável** - Instale como app no celular com acesso offline
- 🏘️ **Filtro por Igreja** - Veja anúncios de uma ou todas as 17 igrejas
- 🔐 **Painel Admin Protegido** - Crie, edite e delete anúncios facilmente
- ⚡ **Ultra-Rápido** - Cache inteligente e carregamento optimizado
- 🎨 **Animações Suaves** - Transições fade-in e microinterações agradáveis
- 📊 **Banco de Dados SQLite** - Dados persistentes

## 🛠️ Tecnologias

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animações
- **SQLite** - Banco de dados
- **bcryptjs** - Autenticação
- **PWA Support** - Service Worker & Manifest

## 🏁 Instalação Rápida

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`

## 🔐 Credenciais Padrão

- **Usuário**: `admin`
- **Senha**: `admin123`

> ⚠️ Mude em produção via variáveis de ambiente!

## 📍 URLs Principais

- **Página Principal**: `/`
- **Admin Login**: `/admin`
- **Dashboard Admin**: `/admin/dashboard`

## 🎯 Como Usar

### Usuário Comum
1. Acesse a página inicial
2. Veja anúncios de todas as igrejas
3. Filtre por chiesa específica
4. Clique em um card para ver detalhes
5. Instale o app PWA quando solicitado

### Administrador
1. Acesse `/admin` e faça login
2. No dashboard, clique "Novo Anúncio"
3. Preencha título, descrição, imagem e selecione a igreja
4. Clique "Salvar"
5. Edite ou delete anúncios existentes

## 📡 API Endpoints

```
GET    /api/announcements           # Lista todos anúncios
POST   /api/announcements/create    # Cria novo anúncio
GET    /api/announcements/[id]      # Obtém anúncio por ID
PUT    /api/announcements/[id]      # Atualiza anúncio
DELETE /api/announcements/[id]      # Deleta anúncio
GET    /api/churches                # Lista igrejas
POST   /api/auth/login              # Login admin
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/                    # Endpoints API
│   ├── admin/                  # Páginas de admin
│   ├── page.tsx                # Home
│   └── layout.tsx              # Layout raiz
├── components/                 # Componentes React
├── lib/                        # Utilities
└── public/                     # Assets e SW
```

## 🎨 Paleta de Cores

- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Accent**: `#f59e0b` (Amber)

## 📦 Build e Deploy

```bash
npm run build
npm run start
```

Para Vercel:
```bash
vercel
```

## 🚀 Próximos Passos (v2)

- [ ] Notificações push
- [ ] Categorias avançadas
- [ ] Login para membros
- [ ] Comentários e curtidas
- [ ] Busca e filtros avançados
- [ ] Dashboard com analytics

## ✅ Status

Pronto para produção v1.0.0

---

Desenvolvido para OBPC Regional Sorocaba 📢
