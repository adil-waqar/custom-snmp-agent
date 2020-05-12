const pgClient = require('./db');

module.exports = () => {
  try {
    const rows = pgClient.querySync(
      'SELECT "signalValue" FROM public."snmpSignals" WHERE "signalTime" = (SELECT MAX("signalTime") FROM public."snmpSignals")'
    );
    return Number(rows[0].signalValue);
  } catch (error) {
    console.error('Something went wrong while querying the database');
    console.error(error);
  }
};
