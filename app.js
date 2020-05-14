const snmp = require('net-snmp');
const getDiskSpace = require('./utils/getDiskSpace');
const getSignalValue = require('./utils/getSignalValue');

// Default options
const options = {
  master: 'localhost',
  masterPort: 705,
  description: 'Node net-snmp AgentX sub-agent'
};

const agent = snmp.createSubagent(options);
const mib = agent.getMib();

const softwareVersionProvider = {
  name: 'softwareVersion',
  type: snmp.MibProviderType.Scalar,
  oid: '1.3.6.1.4.1.53864.1.1.1',
  scalarType: snmp.ObjectType.OctetString,
  handler: function (mibRequest) {
    mibRequest.done();
  }
};

const diskSpaceProvider = {
  name: 'diskSpace',
  type: snmp.MibProviderType.Scalar,
  oid: '1.3.6.1.4.1.53864.1.2.1',
  scalarType: snmp.ObjectType.Integer,
  handler: function (mibRequest) {
    mib.setScalarValue('diskSpace', getDiskSpace());
    mibRequest.done();
  }
};

const signalValueProvider = {
  name: 'signalValue',
  type: snmp.MibProviderType.Scalar,
  oid: '1.3.6.1.4.1.53864.1.3.1',
  scalarType: snmp.ObjectType.Integer,
  handler: function (mibRequest) {
    mib.setScalarValue('signalValue', getSignalValue());
    mibRequest.done();
  }
};

agent.open(function (error, data) {
  console.log('Successfully connected to master with PDU', data);
  if (error) {
    console.error(error);
  } else {
    agent.registerProvider(softwareVersionProvider, null);
    agent.getMib().setScalarValue('softwareVersion', '6.1.1');
    agent.registerProvider(diskSpaceProvider, null);
    agent.getMib().setScalarValue('diskSpace', getDiskSpace());
    agent.registerProvider(signalValueProvider, null);
    agent.getMib().setScalarValue('signalValue', getSignalValue());
    console.info(new Date(), 'SNMP sub-Agent is up and running..');
  }
});
