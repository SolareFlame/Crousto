const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} Config
 * @property {ApiUniv} api_univ
 * @property {Visuals} visuals
 * @property {Data} data
 */

/**
 * @typedef {Object} ApiUniv
 * @property {string} url
 * @property {ApiUnivEndpoints} endpoints
 */

/**
 * @typedef {Object} ApiUnivEndpoints
 * @property {ApiEndpoint} restaurants
 * @property {ApiEndpoint} menus
 */

/**
 * @typedef {Object} ApiEndpoint
 * @property {string} endpoint
 * @property {string[]} [params]
 */

/**
 * @typedef {Object} Visuals
 * @property {Colors} colors
 * @property {Logos} logos
 */

/**
 * @typedef {Object} Colors
 * @property {string} primary
 * @property {string} secondary
 */

/**
 * @typedef {Object} Logos
 * @property {string} default
 */

/**
 * @typedef {Object} Data
 * @property {string} bot_name
 * @property {string} github_url
 */

const config = loadConfig();

/**
 * Load configuration from config.json file.
 * @returns {Config} The configuration object.
 */
function loadConfig() {
    const config_path = path.join(__dirname, '..', 'config', 'config.json');

    let file_config = {};
    try {
        const raw = fs.readFileSync(config_path, 'utf8');
        file_config = JSON.parse(raw);
    } catch (err) {
        console.error('Utils: ERROR while loading config=', err.message);
    }

    console.log("Utils: Config loaded !");
    console.log(file_config);

    return file_config;
}

module.exports = {config};
