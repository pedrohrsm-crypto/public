# 📁 GUIA DE NAVEGAÇÃO - Projeto Frontend

## 📍 Localização: `D:\GitHub\HTML\projeto-frontend`

### 🎯 **VISÃO GERAL**
Este documento orienta sobre a estrutura e conteúdo do diretório principal do projeto frontend, facilitando a navegação e compreensão da organização dos arquivos.

---

## 🌳 **ÁRVORE DE DIRETÓRIOS PRINCIPAL**

```
D:\GitHub\HTML\projeto-frontend\
├── 📂 docs/                          # Documentação geral
├── 📂 Experiência Prática I/         # 🌟 PROJETO PRINCIPAL
├── 📂 ONGConnect/                     # Versão alternativa/backup
├── 📂 scripts/                       # Scripts de automação
├── 📂 src/                           # Recursos compartilhados
├── 📂 tests/                         # Testes e validações
└── 📄 create-backup.ps1              # Script de backup PowerShell
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
├── 📝 cadastro.html                  # Cadastro voluntário (WCAG AA)
├── 👥 voluntario-portal.html         # Portal do voluntário
├── 💝 doador-portal.html             # Portal do doador
├── 🏢 ONGs.html                      # Listagem de ONGs
├── ℹ️ sobre.html                     # Página sobre nós
├── 📧 contato.html                   # Formulário de contato
├── ❓ FAQ.html                       # Perguntas frequentes
└── admin/
    └── 🛠️ dashboard.html             # Painel administrativo
```

**🎯 Páginas Principais:**
- **`index.html`** - Landing page com call-to-actions
- **`cadastro.html`** - **⭐ DESTAQUE**: Formulário com conformidade WCAG 2.1 AA
- **`voluntario-portal.html`** - Portal completo para voluntários
- **`doador-portal.html`** - Interface para doadores

#### **🎨 Estilos CSS (`public/styles/` + `src/styles/`)**
```
public/styles/                        # Estilos específicos de páginas
├── 🎨 ong-color-palette.css          # Paleta de cores padrão
├── 🏠 inicio-custom.css              # Estilos da página inicial
├── 🏢 ongs-custom.css                # Estilos para listagem ONGs
├── 👥 volunteer-portal.css           # Estilos portal voluntário
├── 💝 donor-portal.css               # Estilos portal doador
└── 🛠️ admin-dashboard.css            # Estilos painel admin

src/styles/                           # Estilos de componentes
├── 🌐 globals.css                    # Estilos globais
├── 🔧 cross-browser.css              # Compatibilidade browsers
└── components/                       # Componentes reutilizáveis
    ├── 📋 forms.css                  # Formulários
    ├── 📐 layout.css                 # Layout/grid
    ├── 🎛️ ui-components.css          # Componentes UI
    ├── 🏢 ong-cards.css              # Cards de ONGs
    └── 📄 ong-pagination.css         # Paginação
```

#### **📜 Scripts JavaScript (`public/scripts/` + `src/`)**
```
public/scripts/                       # Scripts específicos
├── 🏢 ongs-page.js                   # Funcionalidades página ONGs
├── 🎥 video-player.js                # Player de vídeo customizado
└── 👥 volunteer-portal.js            # Lógica portal voluntário

src/js/                              # Scripts organizados por função
├── 📊 analytics/                     # Google Analytics
├── ⚡ performance/                   # Otimizações de performance
├── 🔒 privacy/                       # Gestão de cookies/LGPD
└── 🛡️ security/                      # Medidas de segurança
```

#### **⚙️ Configurações e PWA**
```
public/
├── 📱 manifest.json                  # PWA manifest
├── 🔧 sw.js                         # Service Worker (offline sync)
├── 🔒 .htaccess                     # Configurações Apache/HTTPS
└── 🧪 test-offline-sync.html        # Teste funcionalidade offline
```

#### **📚 Documentação**
```
Experiência Prática I/
├── 📖 README.md                      # Documentação principal
├── ♿ WCAG_SECURITY_COMPLIANCE_REPORT.md  # Relatório acessibilidade
├── 📱 OFFLINE_FORM_IMPLEMENTATION.md # Documentação sync offline
├── 📦 package.json                   # Dependências Node.js
└── ⚡ vite.config.js                # Configuração Vite build
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

### **`scripts/`** - Automação
```
scripts/
├── 🔧 build-optimizer.js            # Otimizador de build
├── ♿ fix-accessibility-critical.js  # Correções acessibilidade
├── 🛠️ fix-remaining-issues.js       # Correções gerais
└── ✅ fix-validation-issues.js      # Validação HTML
```

### **`tests/`** - Testes e Validação
```
tests/
└── a11y/
    └── .htmlvalidate.json            # Configurações validação
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