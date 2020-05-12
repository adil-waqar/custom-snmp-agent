const Client = require('pg-native');
const client = new Client();

try {
  client.connectSync();
} catch (error) {
  console.error('Something went wrong while connecting to DB...');
  console.error(error);
  process.exit(1);
}

module.exports = client;
