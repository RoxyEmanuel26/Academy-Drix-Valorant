const fs = require('fs');
const path = require('path');
const dirs = [
    'src/commands/prefix/general',
    'src/commands/prefix/admin',
    'src/commands/slash/general',
    'src/commands/slash/admin'
];

dirs.forEach(dir => {
    const fullDirPath = path.resolve(dir);
    if (!fs.existsSync(fullDirPath)) return;
    const files = fs.readdirSync(fullDirPath).filter(f => f.endsWith('.ts'));
    files.forEach(file => {
        const filePath = path.join(fullDirPath, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Add one directory level up (../) to the existing relative imports
        content = content.replace(/(from\s+['"]|require\(['"])\.\.\//g, '\$1../../');

        fs.writeFileSync(filePath, content, 'utf8');
    });
});
console.log('Path refactoring complete!');
