require('dotenv').config();
const pgClient = require('./db');

try {
  console.info('Running migration..');

  pgClient.querySync('DROP TABLE IF EXISTS public."snmpSignals";');
  pgClient.querySync(
    'CREATE TABLE public."snmpSignals" ( id bigint NOT NULL, "signalValue" bigint NOT NULL, "signalTime" time without time zone NOT NULL, CONSTRAINT "snmpSignals_pkey" PRIMARY KEY (id))'
  );
  pgClient.querySync(
    'INSERT INTO public."snmpSignals" values (1, 2, \'22:30:17.39148\'); INSERT INTO public."snmpSignals" values (2, 10, \'22:45:19.12341\'); INSERT INTO public."snmpSignals" values (3, 17, \'23:12:20.83169\'); INSERT INTO public."snmpSignals" values (4, 30, \'17:52:37.71826\');'
  );

  console.info('Migration successful!');
} catch (error) {
  console.error('Something went wrong while running the migration.');
  console.error(error);
}
