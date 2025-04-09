// In this file you can configure migrate-mongo
require('dotenv').config();
const defaultConfig = (connectionString, migrationsDir) => {
  const [url, databaseName] = connectionString.split(/(?<=[a-z])\/(?=[a-z])/);
  return {
    mongodb: {
      url,
      databaseName,
      options: {},
    },
    migrationsDir,
    changelogCollectionName: 'changelog',
    migrationFileExtension: '.ts',
  };
};
module.exports = defaultConfig;
