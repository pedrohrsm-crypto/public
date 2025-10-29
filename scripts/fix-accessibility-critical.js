#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WCAG 2.1 AA compliant color fixes based on pa11y recommendations
const colorFixes = [
    {
        // Fix navigation contrast issue - pa11y recommended #1a2c3e
        oldColor: 'background-color: #2563eb', // current insufficient contrast
        newColor: 'background-color: #1a2c3e', // WCAG compliant
        description: 'Navigation background for better contrast'
    },
    {
        // Fix button contrast issue - pa11y recommended #177bbe  
        oldColor: 'background-color: #3b82f6', // current insufficient contrast
        newColor: 'background-color: #177bbe', // WCAG compliant
        description: 'Button background for better contrast'
    },
    {
        // Alternative blue for better contrast
        oldColor: 'color: #2563eb',
        newColor: 'color: #1a365d', // darker blue
        description: 'Text color for better contrast'
    }
];

function fixCSSContrast() {
    const cssFile = path.join(__dirname, '../src/styles/globals.css');
    
    try {
        let cssContent = fs.readFileSync(cssFile, 'utf8');
        let changesMade = 0;

        console.log('🎨 Aplicando correções de contraste WCAG 2.1 AA...\n');

        colorFixes.forEach((fix, index) => {
            if (cssContent.includes(fix.oldColor)) {
                cssContent = cssContent.replace(new RegExp(fix.oldColor, 'g'), fix.newColor);
                console.log(`✅ Fix ${index + 1}: ${fix.description}`);
                console.log(`   ${fix.oldColor} → ${fix.newColor}`);
                changesMade++;
            }
        });

        // Add missing accessibility statement anchor styles
        if (!cssContent.includes('.accessibility-statement')) {
            const accessibilityCSS = `
/* Accessibility Statement Section */
.accessibility-statement {
    padding: 2rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    margin: 2rem 0;
}

.accessibility-statement h2 {
    color: #1a365d;
    margin-bottom: 1rem;
}

.accessibility-statement p {
    color: #2d3748;
    line-height: 1.6;
}

/* Ensure high contrast for interactive elements */
.button-primary:hover {
    background-color: #155799; /* Even darker on hover */
}

.nav-menu a:hover {
    background-color: #1a252f; /* Darker navigation hover */
}

/* Focus indicators with high contrast */
*:focus {
    outline: 2px solid #1a365d;
    outline-offset: 2px;
}
`;
            cssContent += accessibilityCSS;
            console.log('✅ Adicionado: Estilos para seção de acessibilidade');
            changesMade++;
        }

        if (changesMade > 0) {
            // Create backup
            fs.writeFileSync(cssFile + '.backup', fs.readFileSync(cssFile));
            
            // Write updated CSS
            fs.writeFileSync(cssFile, cssContent);
            
            console.log(`\n🎉 ${changesMade} correções aplicadas com sucesso!`);
            console.log(`📁 Backup salvo: ${path.basename(cssFile)}.backup`);
        } else {
            console.log('ℹ️  Nenhuma correção necessária encontrada no CSS.');
        }

    } catch (error) {
        console.error('❌ Erro ao processar CSS:', error.message);
    }
}

function addAccessibilityStatement() {
    const pages = ['BookstorePro.html', 'servicos.html', 'sobre.html', 'contato.html'];
    const pagesDir = path.join(__dirname, '../public/pages');

    console.log('\n📄 Adicionando seção de acessibilidade às páginas...\n');

    const accessibilityHTML = `
    <!-- Seção de Acessibilidade -->
    <section id="accessibility-statement" class="accessibility-statement" role="contentinfo">
        <h2>Declaração de Acessibilidade</h2>
        <p>
            Este site foi desenvolvido seguindo as diretrizes WCAG 2.1 AA (Web Content Accessibility Guidelines).
            Implementamos recursos de acessibilidade incluindo navegação por teclado, suporte a leitores de tela,
            contraste adequado de cores e estrutura semântica HTML.
        </p>
        <p>
            Para sugestões de melhorias de acessibilidade, entre em contato através do nosso 
            <a href="contato.html">formulário de contato</a>.
        </p>
    </section>`;

    pages.forEach(page => {
        const filePath = path.join(pagesDir, page);
        
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Check if accessibility statement already exists
            if (!content.includes('id="accessibility-statement"')) {
                // Add before closing </main> tag
                const mainCloseRegex = /<\/main>/;
                if (mainCloseRegex.test(content)) {
                    content = content.replace(mainCloseRegex, `${accessibilityHTML}\n</main>`);
                    
                    // Create backup
                    fs.writeFileSync(filePath + '.accessibility-backup', fs.readFileSync(filePath));
                    
                    // Write updated content
                    fs.writeFileSync(filePath, content);
                    
                    console.log(`✅ ${page}: Seção de acessibilidade adicionada`);
                } else {
                    console.log(`⚠️  ${page}: Tag </main> não encontrada`);
                }
            } else {
                console.log(`ℹ️  ${page}: Seção de acessibilidade já existe`);
            }
            
        } catch (error) {
            console.error(`❌ Erro ao processar ${page}:`, error.message);
        }
    });
}

function generateNextSteps() {
    console.log('\n🚀 PRÓXIMOS PASSOS PARA VALIDAÇÃO:\n');
    console.log('1. Testar contraste corrigido:');
    console.log('   pa11y --reporter cli public/pages/BookstorePro.html\n');
    
    console.log('2. Configurar servidor local para Lighthouse:');
    console.log('   npm install -g http-server');
    console.log('   http-server public/pages -p 8080\n');
    
    console.log('3. Executar Lighthouse:');
    console.log('   lighthouse http://localhost:8080/BookstorePro.html --only-categories=accessibility\n');
    
    console.log('4. Validar todas as páginas:');
    console.log('   npm run test:accessibility\n');
    
    console.log('✨ Meta: Atingir 0 erros pa11y e score 100/100 no Lighthouse!');
}

// Execute all fixes
console.log('🔧 CORREÇÕES CRÍTICAS DE ACESSIBILIDADE WCAG 2.1 AA');
console.log('====================================================\n');

fixCSSContrast();
addAccessibilityStatement();
generateNextSteps();