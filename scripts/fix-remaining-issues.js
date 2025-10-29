#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixRemainingIssues(content, filename) {
    let fixedContent = content;
    let changesCount = 0;

    console.log(`\nFixing remaining issues in ${filename}...`);

    // Fix duplicate type attributes on buttons
    const duplicateTypeMatches = fixedContent.match(/type="[^"]*"\s+[^>]*type="[^"]*"/g);
    if (duplicateTypeMatches) {
        fixedContent = fixedContent.replace(/(<button[^>]*?)type="[^"]*"(\s+[^>]*?)type="[^"]*"([^>]*?>)/g, '$1$2type="button"$3');
        changesCount++;
        console.log('  - Fixed duplicate type attributes on buttons');
    }

    // Remove redundant role="form" from <form> elements
    if (fixedContent.includes('role="form"')) {
        fixedContent = fixedContent.replace(/\s*role="form"/g, '');
        changesCount++;
        console.log('  - Removed redundant role="form" from form elements');
    }

    // Fix aria-label misuse on ul/li elements by removing them or converting to appropriate alternatives
    const ariaLabelOnLists = fixedContent.match(/(<ul[^>]*?)aria-label="([^"]*?)"([^>]*?>)/g);
    if (ariaLabelOnLists) {
        fixedContent = fixedContent.replace(/(<ul[^>]*?)aria-label="([^"]*?)"([^>]*?>)/g, '$1aria-labelledby="list-heading"$3');
        changesCount++;
        console.log('  - Converted aria-label to aria-labelledby on list elements');
    }

    // Fix aria-labelledby misuse on div elements that don't support it
    const ariaLabelledByOnDiv = fixedContent.match(/(<div[^>]*?)aria-labelledby="([^"]*?)"([^>]*?>)/g);
    if (ariaLabelledByOnDiv) {
        fixedContent = fixedContent.replace(/(<div[^>]*?)aria-labelledby="([^"]*?)"([^>]*?>)/g, '$1$3');
        changesCount++;
        console.log('  - Removed aria-labelledby from div elements');
    }

    // Convert div elements with list-like roles to proper semantic elements
    const divWithListRole = fixedContent.match(/<div[^>]*role="(list|listitem)"[^>]*>/g);
    if (divWithListRole) {
        fixedContent = fixedContent.replace(/<div([^>]*?)role="list"([^>]*?)>/g, '<ul$1$2>');
        fixedContent = fixedContent.replace(/<div([^>]*?)role="listitem"([^>]*?)>/g, '<li$1$2>');
        fixedContent = fixedContent.replace(/<\/div>(\s*<\/div>)?(\s*(?=<\/ul>))/g, '</li>$2');
        changesCount++;
        console.log('  - Converted div elements to proper semantic list elements');
    }

    // Remove aria-label from elements that shouldn't have it (but are strictly allowed)
    const strictlyAllowedButNotRecommended = [
        { pattern: /(<a[^>]*?)aria-label="([^"]*?)"([^>]*?>)/g, replacement: '$1title="$2"$3' },
        { pattern: /(<button[^>]*?)aria-label="([^"]*?)"([^>]*?>)([^<]*)<\/button>/g, replacement: '$1$3$4 <span class="sr-only">$2</span></button>' }
    ];

    strictlyAllowedButNotRecommended.forEach(fix => {
        const beforeContent = fixedContent;
        fixedContent = fixedContent.replace(fix.pattern, fix.replacement);
        if (beforeContent !== fixedContent) {
            changesCount++;
            console.log('  - Converted aria-label to appropriate alternative');
        }
    });

    // Ensure all buttons have proper type attribute (no duplicates)
    fixedContent = fixedContent.replace(/(<button[^>]*?)\s+type="[^"]*"\s+([^>]*?)type="[^"]*"([^>]*?>)/g, '$1 $2type="button"$3');
    
    // Clean up any extra spaces created by our fixes
    fixedContent = fixedContent.replace(/\s+/g, ' ');
    fixedContent = fixedContent.replace(/\s+>/g, '>');
    fixedContent = fixedContent.replace(/>\s+</g, '><');

    console.log(`  Total remaining fixes applied: ${changesCount}`);
    return fixedContent;
}

function processFiles() {
    const pagesDir = path.join(__dirname, '../public/pages');
    
    console.log('Applying final accessibility validation fixes...\n');
    
    try {
        const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html') && !file.endsWith('.backup'));
        
        console.log(`Found ${files.length} HTML files to process:`);
        files.forEach(file => console.log(`  - ${file}`));

        files.forEach(filename => {
            const filePath = path.join(pagesDir, filename);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const fixedContent = fixRemainingIssues(content, filename);
                
                // Create backup of previous version
                const backupPath = filePath + '.final-backup';
                fs.writeFileSync(backupPath, content);
                
                // Write fixed content
                fs.writeFileSync(filePath, fixedContent);
                
                console.log(`✅ Applied final fixes to ${filename}`);
                
            } catch (error) {
                console.error(`❌ Error processing ${filename}:`, error.message);
            }
        });

        console.log('\n🎉 Final accessibility fixes completed!');
        console.log('\nRun html-validate again to verify all issues are resolved.');
        
    } catch (error) {
        console.error('Error reading pages directory:', error.message);
    }
}

processFiles();