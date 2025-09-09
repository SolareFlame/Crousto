import { fileURLToPath, pathToFileURL } from "url";
import path from 'path';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename)

export function loadFile(file_name) {
    try {
        const banner_path = path.join(__dirname, '..', 'res', file_name + '.md');
        const raw = fs.readFileSync(banner_path, 'utf8');
        return raw.replace(/\r\n/g, '\n').replace(/\s+$/g, '');
    } catch (err) {
        return null;
    }
}
