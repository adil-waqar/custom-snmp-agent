# Custom SNMP Agent

This is a UNIX-based SNMP Agent written in JavaScript that essentially exposes three OIDs performing different operations.

## Installation

1. The project has libudev-dev as a dependency. To install libudev-dev in your linux server, execute the following commands in terminal.

```bash
sudo apt-get update -y
sudo apt-get install -y libudev-dev
```

2. Install the rest of project dependencies by executing the following command in the root project.

```bash
npm install
```

3. Create a .env file in root to set the following environment variables for Postgres.

```bash
PGHOST=<hostAddress>
PGPORT=<hostPort>
PGUSER=<userName>
PGPASSWORD=<password>
PGDATABASE=<database>

```

4. To create required tables and insert relevant data, execute the following command.

```bash
npm run migration
```

5. Run the application by running the following command. Make sure to run it with **sudo**, otherwise the application will crash. This is because to expose a UDP port at 161 requires admin privileges.

```bash
sudo npm start
```

6. Finally, you've an SNMP agent running at UDP port 161 and listening for requests.

## Description

This SNMP agent exposes a total of 3 custom OIDs, the details of which are as follows.

| #   | OID                 | Name            | Request    | Description                                                       |
| --- | ------------------- | --------------- | ---------- | ----------------------------------------------------------------- |
| 1   | 1.3.6.1.4.1.53864.1 | softwareVersion | GetRequest | Gets you the version number of the software running on the system |
| 2   | 1.3.6.1.4.1.53864.2 | diskSpace       | GetRequest | Gets you the size in bytes of the directory /var/log              |
| 3   | 1.3.6.1.4.1.53864.3 | signalValue     | GetRequest | Gets you the latest signalValue from DB                           |

## Testing/Usage

In order to test this SNMP agent, you can install an SNMP manager and issue GetRequests against the OIDs mentioned in the description. For the sake of this documentation, I'll use the command line utilility as an SNMP client from net-snmp.
You can install the client/manager by running the following command in terminal:

```bash
sudo apt-get install snmp
```

This will give you a **snmpget** CLI tool to make GetRequests against the specified OIDs. Following is the format to make requests:

```bash
snmpget -v [snmpVersion] -c [communityString] [hostAddress] [oid]
```

Now, lets make the requests against the oids mentioned above.

1. Get software version. Make sure to add **.0** at the end of the OID, since it's scalar type.

```bash
snmpget -v2c -c public localhost 1.3.6.1.4.1.53864.1.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
iso.3.6.1.4.1.53864.1.0 = STRING: "6.1.1"
```

2. Get signal value. Make sure to add **.0** at the end of the OID, since it's scalar type.

```bash
snmpget -v2c -c public localhost 1.3.6.1.4.1.53864.3.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
iso.3.6.1.4.1.53864.3.0 = INTEGER: 50
```

3. Get total disk space used in **/var/log**. Make sure to add **.0** at the end of the OID, since it's scalar type.

```bash
snmpget -v2c -c public localhost 1.3.6.1.4.1.53864.2.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
iso.3.6.1.4.1.53864.2.0 = INTEGER: 606191616
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
