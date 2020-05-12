const snmp = require('net-snmp');
const getDiskSpace = require('./utils/getDiskSpace');
const getSignalValue = require('./utils/getSignalValue');

// Default options
const options = {
  port: 161,
  disableAuthorization: true,
  transport: 'udp4'
};

const callback = function (error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data.pdu.varbinds, null, 2));
  }
};

const agent = snmp.createAgent(options, callback);
const mib = agent.getMib();

const softwareVersionProvider = {
  name: 'softwareVersion',
  type: snmp.MibProviderType.Scalar,
  oid: '1.3.6.1.4.1.53864.1',
  scalarType: snmp.ObjectType.OctetString,
  handler: function (mibRequest) {
    mibRequest.done();
  }
};

const diskSpaceProvider = {
  name: 'diskSpace',
  type: snmp.MibProviderType.Scalar,
  oid: '1.3.6.1.4.1.53864.2',
  scalarType: snmp.ObjectType.Integer,
  handler: function (mibRequest) {
    mib.setScalarValue('diskSpace', getDiskSpace());
    mibRequest.done();
  }
};

const signalValueProvider = {
  name: 'signalValue',
  type: snmp.MibProviderType.Scalar,
  oid: '1.3.6.1.4.1.53864.3',
  scalarType: snmp.ObjectType.Integer,
  handler: function (mibRequest) {
    mib.setScalarValue('signalValue', getSignalValue());
    mibRequest.done();
  }
};

mib.registerProvider(softwareVersionProvider);
mib.setScalarValue('softwareVersion', '6.1.1');
mib.registerProvider(diskSpaceProvider);
mib.setScalarValue('diskSpace', getDiskSpace());
mib.registerProvider(signalValueProvider);
// Setting a default scalar
mib.setScalarValue('signalValue', getSignalValue());

console.info(new Date(), 'SNMP Agent is up and running..');
