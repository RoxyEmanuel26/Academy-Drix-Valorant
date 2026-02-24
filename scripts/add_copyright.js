const fs = require('fs');
const path = require('path');

const headerText = fs.readFileSync(path.join(__dirname, 'copyright_header.txt'), 'utf8') + '\n';

function injectHeader(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            injectHeader(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes('ACADEMY DRIX VALORANT BOT') && !content.includes('Roxy Emanuel')) {
                fs.writeFileSync(fullPath, headerText + content);
                console.log(`Added header to: ${fullPath}`);
            }
        }
    }
}

const rootSrc = path.join(__dirname, '../src');
injectHeader(rootSrc);
console.log('Copyright header injection complete.');
