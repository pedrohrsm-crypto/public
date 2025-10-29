# 📁 GUIA DE NAVEGAÇÃO - Projeto Frontend

> **Última atualização**: 29 de outubro de 2025  
> **Versão**: 2.1.0  
> **Status**: Projeto Finalizado ✅

## 📍 Localização: `D:\GitHub\HTML\projeto-frontend`

### 🎯 **VISÃO GERAL**
Este documento oferece um guia completo sobre a estrutura e organização do projeto frontend ONGConnect, facilitando a navegação, desenvolvimento e manutenção do código. Ele mostra uma árvore de documentos projetada para o lançamento completo do projeto ONGConnect, porém nem todos os arquivos foram estruturados, apenas os principais para o esboço da página.

---

## 🌳 **ÁRVORE DE DIRETÓRIOS PRINCIPAL**

```
D:\GitHub\HTML\projeto-frontend\
├── 📂 docs/                          # Documentação geral e relatórios
├── 📂 Experiência Prática I/         # 🌟 PROJETO PRINCIPAL (v2.1.0)
├── 📂 ONGConnect/                     # Versão de desenvolvimento
├── 📂 scripts/                       # Scripts de automação e build
├── 📂 src/                           # Recursos compartilhados e componentes
├── 📂 tests/                         # Testes automatizados e validações
├── 📂 assets/                        # Recursos estáticos (imagens, ícones)
├── 📂 config/                        # Arquivos de configuração
├── 📄 create-backup.ps1              # Script de backup PowerShell
├── 📄 package.json                   # Dependências do projeto
├── 📄 webpack.config.js              # Configuração Webpack
├── 📄 .eslintrc.js                   # Configuração ESLint
├── 📄 .gitignore                     # Arquivos ignorados pelo Git
└── 📄 CHANGELOG.md                   # Histórico de mudanças
```

---

## 🏆 **PROJETO PRINCIPAL: `Experiência Prática I/`**

### 📋 **Descrição**
Contém a implementação completa da plataforma ONGConnect com todas as funcionalidades, páginas e recursos finalizados.

### 📁 **Estrutura Detalhada**

#### **🌐 Páginas Web (`public/pages/`)**
```
public/pages/
├── 🏠 index.html                     # Página inicial/home
├── 📝 cadastro.html                  # Cadastro voluntário (WCAG AA) ⭐
├── 👥 voluntario-portal.html         # Portal do voluntário
├── 💝 doador-portal.html             # Portal do doador
├── 🏢 ONGs.html                      # Listagem de ONGs
├── 🔍 busca.html                     # Sistema de busca avançada
├── 👤 perfil.html                    # Página de perfil do usuário
├── ℹ️ sobre.html                     # Página sobre nós
├── 📧 contato.html                   # Formulário de contato
├── ❓ FAQ.html                       # Perguntas frequentes
├── 🔐 login.html                     # Página de login
├── 📋 termos.html                    # Termos de uso
├── 🔒 privacidade.html               # Política de privacidade
└── admin/
    ├── 🛠️ dashboard.html             # Painel administrativo
    ├── 📊 relatorios.html            # Relatórios e analytics
    └── ⚙️ configuracoes.html         # Configurações do sistema
```

**🎯 Páginas Principais:**
- **`index.html`** - Landing page responsiva com call-to-actions
- **`cadastro.html`** - **⭐ DESTAQUE**: Formulário com conformidade WCAG 2.1 AA
- **`voluntario-portal.html`** - Dashboard completo para voluntários
- **`doador-portal.html`** - Interface otimizada para doadores
- **`busca.html`** - Sistema de filtros avançados para ONGs

#### **🎨 Estilos CSS (`public/styles/` + `src/styles/`)**
```
public/styles/                        # Estilos específicos de páginas
├── 🎨 ong-color-palette.css          # Paleta de cores e variáveis CSS
├── 🏠 inicio-custom.css              # Estilos da página inicial
├── 🏢 ongs-custom.css                # Estilos para listagem ONGs
├── 👥 volunteer-portal.css           # Estilos portal voluntário
├── 💝 donor-portal.css               # Estilos portal doador
├── 🔍 busca-avancada.css             # Estilos sistema de busca
├── 👤 perfil-usuario.css             # Estilos página de perfil
├── 🔐 auth-pages.css                 # Estilos páginas autenticação
└── 🛠️ admin-dashboard.css            # Estilos painel admin

src/styles/                           # Estilos de componentes e base
├── 🌐 globals.css                    # Reset CSS e estilos globais
├── 🔧 cross-browser.css              # Compatibilidade browsers
├── 📱 responsive.css                 # Media queries responsivas
├── 🌙 dark-mode.css                  # Tema escuro
├── 🎭 animations.css                 # Animações e transições
└── components/                       # Componentes reutilizáveis
    ├── 📋 forms.css                  # Formulários e inputs
    ├── � buttons.css                # Botões e CTAs
    ├── �📐 layout.css                 # Grid e layout
    ├── 🎛️ ui-components.css          # Componentes UI gerais
    ├── 🏢 ong-cards.css              # Cards de ONGs
    ├── 📄 ong-pagination.css         # Sistema de paginação
    ├── 🍞 toast-notifications.css    # Notificações toast
    ├── 🎪 modals.css                 # Modais e overlays
    └── 📊 charts.css                 # Gráficos e visualizações
```

#### **📜 Scripts JavaScript (`public/scripts/` + `src/`)**
```
public/scripts/                       # Scripts específicos por página
├── 🏢 ongs-page.js                   # Funcionalidades página ONGs
├── 🎥 video-player.js                # Player de vídeo customizado
├── 👥 volunteer-portal.js            # Lógica portal voluntário
├── 💝 donor-portal.js                # Funcionalidades portal doador
├── 🔍 busca-avancada.js              # Sistema de busca e filtros
├── 👤 perfil-usuario.js              # Gestão de perfil
├── 🔐 auth.js                        # Autenticação e autorização
└── 🛠️ admin-dashboard.js             # Painel administrativo

src/js/                              # Scripts organizados por função
├── 📊 analytics/                     # Google Analytics e tracking
│   ├── ga-config.js                 # Configuração Analytics
│   ├── event-tracking.js            # Rastreamento de eventos
│   └── conversion-tracking.js       # Tracking de conversões
├── ⚡ performance/                   # Otimizações de performance
│   ├── lazy-loading.js              # Carregamento sob demanda
│   ├── image-optimization.js        # Otimização de imagens
│   └── cache-strategy.js            # Estratégias de cache
├── 🔒 privacy/                       # Gestão de cookies/LGPD
│   ├── cookie-consent.js            # Consentimento de cookies
│   ├── gdpr-compliance.js           # Conformidade GDPR
│   └── data-protection.js           # Proteção de dados
├── 🛡️ security/                      # Medidas de segurança
│   ├── csrf-protection.js           # Proteção CSRF
│   ├── xss-prevention.js            # Prevenção XSS
│   └── input-validation.js          # Validação de inputs
├── 🔄 api/                          # Comunicação com APIs
│   ├── api-client.js                # Cliente HTTP genérico
│   ├── ong-service.js               # Serviços de ONGs
│   └── user-service.js              # Serviços de usuário
└── 🎯 utils/                        # Utilitários gerais
    ├── date-utils.js                # Manipulação de datas
    ├── form-validation.js           # Validação de formulários
    ├── local-storage.js             # Gerenciamento localStorage
    └── notification-system.js       # Sistema de notificações
```

#### **⚙️ Configurações e PWA**
```
public/
├── 📱 manifest.json                  # PWA manifest com ícones e config
├── 🔧 sw.js                         # Service Worker (cache e offline sync)
├── 🔒 .htaccess                     # Headers de segurança Apache
├── 🧪 test-offline-sync.html        # Página de teste funcionalidade offline
├── 🤖 robots.txt                    # Configuração SEO para crawlers
├── 🗺️ sitemap.xml                   # Mapa do site para SEO
├── 🎨 favicon.ico                   # Ícone principal do site
└── icons/                           # Ícones PWA em diferentes tamanhos
    ├── icon-192x192.png
    ├── icon-512x512.png
    └── apple-touch-icon.png
```

#### **📚 Documentação**
```
Experiência Prática I/
├── 📖 README.md                      # Documentação principal do projeto
├── ♿ WCAG_SECURITY_COMPLIANCE_REPORT.md  # Relatório de acessibilidade
├── 📱 OFFLINE_FORM_IMPLEMENTATION.md # Documentação sincronização offline
├── 🧪 TESTING_GUIDELINES.md         # Guias de teste e validação
├── 🚀 DEPLOYMENT.md                 # Instruções de deploy
├── 📋 CHANGELOG.md                  # Histórico de versões e mudanças
├── 🤝 CONTRIBUTING.md               # Guia para colaboradores
├── � LICENSE.md                    # Licença do projeto
├── �📦 package.json                   # Dependências e scripts Node.js
├── ⚡ vite.config.js                # Configuração Vite para build
├── 🔧 webpack.config.js             # Configuração alternativa Webpack
├── 🎯 .eslintrc.js                  # Configuração ESLint
├── 💅 .prettierrc.js                # Configuração Prettier
└── 🧭 tsconfig.json                 # Configuração TypeScript (se usado)
```

---

## 📂 **OUTROS DIRETÓRIOS**

### **`docs/`** - Documentação Geral
```
docs/
└── accessibility/
    ├── 📋 RELATORIO_ACESSIBILIDADE.md     # Relatório detalhado
    └── ✅ PROJETO_FINALIZADO.md          # Status de finalização
```

### **`ONGConnect/`** - Versão de Desenvolvimento
```
ONGConnect/
└── public/pages/
    └── 📝 cadastro.html              # Versão de desenvolvimento
```

### **`scripts/`** - Automação e Build
```
scripts/
├── 🔧 build-optimizer.js            # Otimizador de build e performance
├── ♿ fix-accessibility-critical.js  # Correções automáticas acessibilidade
├── 🛠️ fix-remaining-issues.js       # Correções gerais de bugs
├── ✅ fix-validation-issues.js      # Validação automática HTML/CSS
├── 📦 deploy-production.js          # Script de deploy para produção
├── 🧹 clean-build.js                # Limpeza de arquivos de build
├── 🎯 seo-optimizer.js              # Otimizações SEO automáticas
└── 📊 performance-audit.js          # Auditoria de performance
```

### **`tests/`** - Testes e Validação
```
tests/
├── a11y/                            # Testes de acessibilidade
│   ├── .htmlvalidate.json          # Configurações validação HTML
│   ├── axe-tests.js                # Testes automatizados axe-core
│   └── wcag-compliance.test.js     # Testes conformidade WCAG
├── unit/                            # Testes unitários
│   ├── utils.test.js               # Testes funções utilitárias
│   ├── forms.test.js               # Testes validação formulários
│   └── api-client.test.js          # Testes cliente API
├── integration/                     # Testes de integração
│   ├── user-flow.test.js           # Testes fluxo do usuário
│   └── pwa-offline.test.js         # Testes funcionalidade offline
├── e2e/                            # Testes end-to-end
│   ├── cypress/                    # Configuração Cypress
│   └── playwright/                 # Configuração Playwright
└── performance/                     # Testes de performance
    ├── lighthouse-ci.js            # Configuração Lighthouse CI
    └── load-testing.js             # Testes de carga
```

### **`assets/`** - Recursos Estáticos
```
assets/
├── images/                          # Imagens otimizadas
│   ├── logos/                      # Logos e identidade visual
│   ├── hero/                       # Imagens hero da homepage
│   ├── ongs/                       # Imagens das ONGs
│   └── placeholders/               # Imagens placeholder
├── icons/                           # Ícones SVG
│   ├── social/                     # Ícones redes sociais
│   ├── ui/                         # Ícones interface
│   └── categories/                 # Ícones categorias ONGs
├── fonts/                           # Fontes customizadas
│   ├── roboto/                     # Família Roboto
│   └── inter/                      # Família Inter
└── videos/                          # Vídeos promocionais
    ├── hero-video.mp4              # Vídeo hero homepage
    └── tutorials/                  # Vídeos tutoriais
```

### **`config/`** - Configurações
```
config/
├── 🌐 environment/                  # Configurações por ambiente
│   ├── development.json            # Config desenvolvimento
│   ├── staging.json                # Config staging
│   └── production.json             # Config produção
├── 🔐 security/                     # Configurações segurança
│   ├── csp-headers.json            # Content Security Policy
│   └── cors-config.json            # Configuração CORS
├── 📊 analytics/                    # Configurações analytics
│   ├── gtm-config.json             # Google Tag Manager
│   └── fb-pixel-config.json        # Facebook Pixel
└── 🎯 seo/                          # Configurações SEO
    ├── meta-tags.json              # Meta tags por página
    └── structured-data.json        # Dados estruturados
```

---

## 🚀 **COMO USAR ESTE DIRETÓRIO**

### **1. 🎯 Para Desenvolvimento Ativo**
```bash
# Navegue para o projeto principal
cd "D:\GitHub\HTML\projeto-frontend\Experiência Prática I"

# Instale dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### **2. 🌐 Para Visualizar Páginas**
```bash
# Servidor simples
cd "Experiência Prática I/public"
python -m http.server 8000

# Acesse: http://localhost:8000/pages/
```

### **3. 📝 Para Editar Conteúdo**
- **Páginas HTML**: `Experiência Prática I/public/pages/`
- **Estilos**: `Experiência Prática I/public/styles/` ou `src/styles/`
- **Scripts**: `Experiência Prática I/public/scripts/`

### **4. 📚 Para Consultar Documentação**
- **Geral**: `docs/accessibility/`
- **Técnica**: `Experiência Prática I/README.md`
- **Acessibilidade**: `WCAG_SECURITY_COMPLIANCE_REPORT.md`

---

## 🎖️ **CARACTERÍSTICAS ESPECIAIS**

### **🌟 Página de Destaque: `cadastro.html`**
- ✅ **WCAG 2.1 AA Compliant** - Acessibilidade total
- 🔒 **HTTPS Security** - 9 headers de segurança
- 📱 **PWA Ready** - Funciona offline
- ♿ **Screen Reader** - Compatível com tecnologias assistivas
- ⌨️ **Keyboard Navigation** - 100% navegável por teclado

### **🔧 Funcionalidades Avançadas**
- **Background Sync** - Formulários funcionam offline
- **Service Worker** - Cache inteligente
- **IndexedDB** - Armazenamento local
- **Responsive Design** - Mobile-first
- **Cross-browser** - Compatibilidade máxima

---

## 📊 **ESTATÍSTICAS DO PROJETO**

| Categoria | Quantidade | Localização |
|-----------|------------|-------------|
| **Páginas HTML** | 9 principais | `public/pages/` |
| **Arquivos CSS** | 15+ estilos | `public/styles/` + `src/styles/` |
| **Scripts JS** | 10+ arquivos | `public/scripts/` + `src/js/` |
| **Documentação** | 5 arquivos MD | Raiz + `docs/` |
| **Configurações** | 4 arquivos | PWA + Build |

---

## 🔄 **FLUXO DE TRABALHO RECOMENDADO**

### **Para Novos Desenvolvedores:**
1. 📖 Ler `README.md` do projeto principal
2. 🌐 Executar `index.html` para ver resultado
3. 📝 Explorar `cadastro.html` como exemplo de qualidade
4. 📚 Consultar documentação em `docs/`

### **Para Manutenção:**
1. 🔍 Identificar arquivo relevante na estrutura
2. 📝 Editar usando estrutura de pastas lógica
3. 🧪 Testar usando `test-offline-sync.html`
4. 📋 Documentar mudanças

### **Para Deploy:**
1. 📦 Usar `npm run build` (se disponível)
2. 🔧 Executar scripts de otimização em `scripts/`
3. ✅ Validar com ferramentas em `tests/`
4. 🚀 Deploy da pasta `public/`

---

## 📞 **SUPORTE**

### **Documentação Principal**
- `Experiência Prática I/README.md`
- `docs/accessibility/RELATORIO_ACESSIBILIDADE.md`

### **Para Problemas Específicos**
- **Acessibilidade**: Consultar `WCAG_SECURITY_COMPLIANCE_REPORT.md`
- **Funcionalidade Offline**: Ver `OFFLINE_FORM_IMPLEMENTATION.md`
- **Configuração**: Verificar `package.json` e `vite.config.js`

---

**✅ ESTRUTURA DOCUMENTADA E PRONTA PARA USO**

*Este guia facilita a navegação e uso eficiente do diretório do projeto frontend.*