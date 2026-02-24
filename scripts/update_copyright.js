const fs = require('fs');
const path = require('path');

const newHeader = fs.readFileSync(path.join(__dirname, 'copyright_header.txt'), 'utf8') + '\n';
const oldRegex = /\/\*\*[\s\S]*?⚡ ACADEMY DRIX VALORANT BOT[\s\S]*?\*\/\r?\n?/g;

function injectHeader(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            injectHeader(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            if (oldRegex.test(content)) {
                content = content.replace(oldRegex, newHeader);
                fs.writeFileSync(fullPath, content);
                console.log(`Updated header in: ${fullPath}`);
            } else if (!content.includes('WONDERPLAY')) {
                content = newHeader + content;
                fs.writeFileSync(fullPath, content);
                console.log(`Added header to: ${fullPath}`);
            }
        }
    }
}

const rootSrc = path.join(__dirname, '../src');
injectHeader(rootSrc);
console.log('Copyright header update complete.');
