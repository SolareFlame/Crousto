import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {typeof import('../config/config.json')} */
export const config = loadConfig();

function loadConfig() {
    const configPath = path.join(__dirname, '..', 'config', 'config.json');
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (err) {
        console.error('ERROR loading config:', err);
        return {};
    }
}
