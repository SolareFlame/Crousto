const fs = require('fs');
const path = require('path');

function loadFile(file_name) {
    try {
        const banner_path = path.join(__dirname, '..', 'res', file_name + '.md');
        const raw = fs.readFileSync(banner_path, 'utf8');
        return raw.replace(/\r\n/g, '\n').replace(/\s+$/g, '');
    } catch (err) {
        return null;
    }
}

module.exports = { loadFile };
