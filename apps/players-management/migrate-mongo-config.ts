/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
let configDB = require('../../migrate-mongo-config.default.ts');
configDB = configDB(process.env.PLAYERS_REPO_HOST, 'apps/players-management/migrations');
// Return the config as a promise
module.exports = configDB;
