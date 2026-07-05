const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = [...walk('d:\\R8Estate\\components'), ...walk('d:\\R8Estate\\app')];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    if (content.includes('from "next-intl"')) {
        content = content.replace(/import\s*\{\s*useTranslations\s*\}\s*from\s*"next-intl"/g, 'import { useTranslations } from "@/hooks/use-translations"');
        modified = true;
    }
    if (content.includes("from 'next-intl'")) {
        content = content.replace(/import\s*\{\s*useTranslations\s*\}\s*from\s*'next-intl'/g, 'import { useTranslations } from "@/hooks/use-translations"');
        modified = true;
    }
    if (modified) {
        fs.writeFileSync(file, content);
        console.log('Replaced in ' + file);
    }
});
