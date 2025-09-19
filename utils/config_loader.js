import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {typeof import('../config/config.json')} */
export const config = loadConfig(true);

function loadConfig(_logs = false) {
    const configPath = path.join(__dirname, '..', 'config', 'config.json');
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('Config loaded successfully:', config)
        return config;
    } catch (err) {
        console.error('ERROR loading config:', err);
        return {};
    }
}
