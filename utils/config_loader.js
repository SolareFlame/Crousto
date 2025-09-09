import fs from 'fs';

import { fileURLToPath } from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);


/**
 * @typedef {Object} Config
 * @property {ApiUniv} api_univ
 * @property {Visuals} visuals
 * @property {Data} data
 * @property {DbCache} db_cache
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
 * @property {Banners} banners
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
 * @typedef {Object} Banners
 * @property {string} default
 */

/**
 * @typedef {Object} Data
 * @property {string} bot_name
 * @property {string} github_url
 * @property {string} cron_subscription
 */

/**
 * @typedef {Object} DbCache
 * @property {number} menu_validity_time
 * @property {number} restaurant_validity_time
 */

/** @type {Config} */
export const config = loadConfig();

/**
 * Load configuration from config.json file.
 * @returns {Config} The configuration object.
 */
export function loadConfig() {
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
