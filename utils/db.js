const Client = require('pg-native');
require('dotenv').config();
const client = new Client();

try {
  client.connectSync();
} catch (error) {
  console.error('Something went wrong while connecting to DB...');
  console.error(error);
  process.exit(1);
}

module.exports = client;
