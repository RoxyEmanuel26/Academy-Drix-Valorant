import fs from 'fs';
import path from 'path';

let catalogCache: any = null;

export function getCatalog() {
    if (!catalogCache) {
        const p = path.join(process.cwd(), 'assets', 'PublicContentCatalog.json');
        try {
            catalogCache = JSON.parse(fs.readFileSync(p, 'utf-8'));
        } catch (e) {
            console.error('Failed to load PublicContentCatalog.json', e);
            catalogCache = {};
        }
    }
    return catalogCache;
}

export function getCharacterFullImagePathByName(name: string): string | null {
    if (!name) return null;
    const cat = getCatalog();
    if (!cat.characters) return null;

    const char = cat.characters.find((c: any) =>
        c.name?.defaultText?.toLowerCase() === name.toLowerCase() ||
        c.name?.localizedByCulture?.['en-US']?.toLowerCase() === name.toLowerCase() ||
        c.name?.localizedByCulture?.['id-ID']?.toLowerCase() === name.toLowerCase()
    );

    if (char) {
        const imagePath = path.join(process.cwd(), 'assets', 'Characters', `${char.id}_full.png`);
        if (fs.existsSync(imagePath)) {
            return imagePath;
        }
    }
    return null;
}

export function getCharacterDisplayIconPathByName(name: string): string | null {
    if (!name) return null;
    const cat = getCatalog();
    if (!cat.characters) return null;

    const char = cat.characters.find((c: any) =>
        c.name?.defaultText?.toLowerCase() === name.toLowerCase() ||
        c.name?.localizedByCulture?.['en-US']?.toLowerCase() === name.toLowerCase() ||
        c.name?.localizedByCulture?.['id-ID']?.toLowerCase() === name.toLowerCase()
    );

    if (char) {
        const imagePath = path.join(process.cwd(), 'assets', 'Characters', `${char.id}.png`);
        if (fs.existsSync(imagePath)) {
            return imagePath;
        }
    }
    return null;
}
