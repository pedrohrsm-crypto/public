#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for fixes
const fixes = {
    // Remove redundant roles on semantic elements
    redundantRoles: [
        { pattern: /role="banner"/g, replacement: '' },
        { pattern: /role="navigation"/g, replacement: '' },
        { pattern: /role="main"/g, replacement: '' },
        { pattern: /role="contentinfo"/g, replacement: '' },
        { pattern: /role="article"/g, replacement: '' },
        { pattern: /role="region"/g, replacement: '' },
        { pattern: /role="list"/g, replacement: '' }
    ],

    // Fix aria-label misuse on elements that don't support it
    ariaLabelFixes: [
        { pattern: /<div([^>]*?)aria-label="([^"]*?)"([^>]*?)>/g, replacement: '<div$1$3 title="$2">' },
        { pattern: /<span([^>]*?)aria-label="([^"]*?)"([^>]*?)>/g, replacement: '<span$1$3 title="$2">' },
        { pattern: /<li([^>]*?)aria-label="([^"]*?)"([^>]*?)>/g, replacement: '<li$1$3>' }
    ],

    // Add type attributes to buttons
    buttonType: [
        { pattern: /<button([^>]*?)>/g, replacement: '<button$1 type="button">' }
    ],

    // Fix telephone number formatting
    telephoneFormat: [
        { pattern: /\(\d{2}\) \d{4}-\d{4}/g, replacement: function(match) {
            return match.replace(/ /g, '&nbsp;').replace(/-/g, '&#8209;');
        }}
    ],

    // Remove trailing whitespace
    trailingWhitespace: [
        { pattern: /[ \t]+$/gm, replacement: '' }
    ],

    // Fix prefer-native-element issues by removing unnecessary role attributes
    preferNative: [
        { pattern: /<div([^>]*?)role="(list|navigation|article|region|banner|contentinfo|main)"([^>]*?)>/g, 
          replacement: '<div$1$3>' }
    ]
};

function applyFixes(content, filename) {
    let fixedContent = content;
    let changesCount = 0;

    console.log(`\nFixing ${filename}...`);

    // Apply each category of fixes
    Object.keys(fixes).forEach(category => {
        fixes[category].forEach(fix => {
            const beforeLength = fixedContent.length;
            
            if (typeof fix.replacement === 'function') {
                fixedContent = fixedContent.replace(fix.pattern, fix.replacement);
            } else {
                fixedContent = fixedContent.replace(fix.pattern, fix.replacement);
            }
            
            const afterLength = fixedContent.length;
            if (beforeLength !== afterLength) {
                changesCount++;
                console.log(`  - Applied ${category} fix`);
            }
        });
    });

    // Clean up any double spaces that might have been created
    fixedContent = fixedContent.replace(/  +/g, ' ');
    
    // Clean up any empty attributes
    fixedContent = fixedContent.replace(/\s+(role|aria-label)=""\s*/g, ' ');
    
    // Add unique aria-labels to landmarks
    if (fixedContent.includes('<header') && !fixedContent.includes('aria-label="Site header"')) {
        fixedContent = fixedContent.replace(/<header([^>]*?)>/g, '<header$1 aria-label="Site header">');
        changesCount++;
        console.log('  - Added unique aria-label to header');
    }

    // Add missing button types
    const buttonMatches = fixedContent.match(/<button(?![^>]*type=)/g);
    if (buttonMatches) {
        fixedContent = fixedContent.replace(/<button(?![^>]*type=)([^>]*?)>/g, '<button$1 type="button">');
        changesCount++;
        console.log('  - Added type attribute to buttons');
    }

    console.log(`  Total changes: ${changesCount}`);
    return fixedContent;
}

processFiles();

function processFiles() {
    const pagesDir = path.join(__dirname, '../public/pages');
    
    console.log('Starting accessibility validation fixes...\n');
    
    try {
        const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));
        
        console.log(`Found ${files.length} HTML files to process:`);
        files.forEach(file => console.log(`  - ${file}`));

        files.forEach(filename => {
            const filePath = path.join(pagesDir, filename);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const fixedContent = applyFixes(content, filename);
                
                // Create backup
                const backupPath = filePath + '.backup';
                fs.writeFileSync(backupPath, content);
                
                // Write fixed content
                fs.writeFileSync(filePath, fixedContent);
                
                console.log(`✅ Fixed ${filename} (backup saved as ${filename}.backup)`);
                
            } catch (error) {
                console.error(`❌ Error processing ${filename}:`, error.message);
            }
        });

        console.log('\n🎉 Accessibility fixes completed!');
        console.log('\nNext steps:');
        console.log('1. Run html-validate again to check remaining issues');
        console.log('2. Run pa11y for accessibility testing');
        console.log('3. Run lighthouse for performance audit');
        
    } catch (error) {
        console.error('Error reading pages directory:', error.message);
    }
}