/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
let configDB = require('../../migrate-mongo-config.default.ts');
configDB = configDB(process.env.SCORES_REPO_HOST, 'apps/game-scores/migrations');
module.exports = configDB;
