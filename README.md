# SNMP Sub-agent

This is a UNIX-based SNMP Sub-agent written in JavaScript that essentially exposes three OIDs performing different operations.

## Design

In order to extend an SNMP agent and add extra functionality to it, there are a lot of ways that I founded in my R&D for this project. Some of them are the following:

1. Using **pass** keyword to run a script on a specific ID and return its result
2. Using **extend** keyword to extend the agent.
3. **Adding custom code** inside the SNMP agent.
4. Using the **AgentX Protocol** which allows a master agent to be extended by independent sub-agents.

Out of all the options that I tried, I choose **AgentX Protocol** due to the following reasons:

1. **Minimal to zero configuration** was required to make the master agent accept a sub-agent. To be able to delegate tasks to a sub-agent, all that was needed was that a sub-agent had to register for the part of the **MIB** from the master, that it wanted to take care of.
2. An SNMP sub-agent is **completely independent/decoupled** from the master agent making it very easy to add custom OIDs and handle them accordingly.
3. Many languages have **support** for making an SNMP sub-agent.

The three custom OIDs are the responsibility of my sub-agent to handle. Whenever the master SNMP agent gets a request from the manager on the custom OIDs that I have added, it forwards the request to the sub-agent to handle. Sub-agent handles the request and returns the result back to master which eventually returns it back to the client.

## Description

This SNMP sub-agent exposes a total of 3 custom OIDs, the details of which are as follows.

| #   | OID                     | Name            | Request    | Description                                                       |
| --- | ----------------------- | --------------- | ---------- | ----------------------------------------------------------------- |
| 1   | 1.3.6.1.4.1.53864.1.1.1 | softwareVersion | GetRequest | Gets you the version number of the software running on the system |
| 2   | 1.3.6.1.4.1.53864.1.2.1 | diskSpace       | GetRequest | Gets you the size in bytes of the directory /var/log              |
| 3   | 1.3.6.1.4.1.53864.1.3.1 | signalValue     | GetRequest | Gets you the latest signalValue from DB                           |

## Installation

## Setup NET-SNMP

**Note: I'm using Ubuntu 18.04 for this installation. Please look-up the relevant installation setup for your own distribution.**

1. To install SNMP, the CLI tool from NET-SNMP to make requests and SNMPD, the agent itself, execute the following commands in terminal.
   **Note**: You can skip this step if you already have these installed.

```bash
sudo apt update
sudo apt install snmp snmpd libsnmp-dev
```

2. Go to **/usr/share/snmp/mibs** and paste the custom MIB file that you'll find in **snmp-subagent/net-snmp-configs/NET-SNMP-AFINITI-MIB**, in this directory.

3. Go to **/etc/snmp/snmp.conf** and replace the contents of the file with the following.

```bash
mibs +NET-SNMP-AFINITI-MIB
```

4. Being in the same directory, replace the contents of the file **snmpd.conf** with the following:

```bash
rocommunity public 127.0.0.1 .1
master agentx
agentXSocket    tcp:localhost:705
```

5. To test if everything is working, run the following command:

```bash
snmpwalk -v 2c -c public localhost system
```

&nbsp;&nbsp;&nbsp; You should get the following **output**:

```bash
SNMPv2-MIB::sysDescr.0 = STRING: Linux mrrobot 5.3.0-51-generic
#44~18.04.2-Ubuntu SMP Thu Apr 23 14:27:18 UTC 2020 x86_64
SNMPv2-MIB::sysObjectID.0 = OID: NET-SNMP-MIB::netSnmpAgentOIDs.10
DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (1398091) 3:53:00.91
SNMPv2-MIB::sysContact.0 = STRING: root
SNMPv2-MIB::sysName.0 = STRING: mrrobot
SNMPv2-MIB::sysLocation.0 = STRING: Unknown
...
```

## Project Setup

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

5. Run the application by running the following command. Make sure to run it with **sudo**, because some operations require admin privileges.

```bash
sudo npm start
```

6. Finally, you've an SNMP agent running at UDP port 161 and listening for requests.

## Testing/Usage

In order to test this SNMP agent, earlier we installed **snmp** , through which we can now issue **GetRequests** against the OIDs mentioned in the description. We can also issue **GetNext** requests through **snmpwalk**.

Following is the format/CLI tool to make GetRequests:

```bash
snmpget -v [snmpVersion] -c [communityString] [hostAddress] [oid]
```

Now, lets make the requests against the OIDs mentioned above.

1. Get software version. Make sure to add **.0** at the end of the OID, since it's scalar type.

```bash
snmpget -v 2c -c public localhost 1.3.6.1.4.1.53864.1.1.1.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
NET-SNMP-AFINITI-MIB::softwareVersionString.0 = STRING: "6.1.1"
```

2. Get the latest signal value from DB. Make sure to add **.0** at the end of the OID, since it's scalar type.

```bash
snmpget -v 2c -c public localhost 1.3.6.1.4.1.53864.1.3.1.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
NET-SNMP-AFINITI-MIB::signalValueInteger.0 = INTEGER: 17
```

3. Get total disk space used in **/var/log**. Make sure to add **.0** at the end of the OID, since it's scalar type.

```bash
snmpget -v 2c -c public localhost 1.3.6.1.4.1.53864.1.2.1.0
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
NET-SNMP-AFINITI-MIB::diskSpaceInteger.0 = INTEGER: 744357888
```

You can also do an **snmpwalk** to traverse the whole **afinitiStats** subtree at once by executing the following command in terminal.

```bash
snmpwalk -v 2c -c public localhost NET-SNMP-AFINITI-MIB::afinitiStats
```

OR by using the **OID** as follows:

```bash
snmpwalk -v 2c -c public localhost 1.3.6.1.4.1.53864.1
```

&nbsp;&nbsp;&nbsp;**Output:**

```bash
NET-SNMP-AFINITI-MIB::softwareVersionString.0 = STRING: "6.1.1"
NET-SNMP-AFINITI-MIB::diskSpaceInteger.0 = INTEGER: 744357888
NET-SNMP-AFINITI-MIB::signalValueInteger.0 = INTEGER: 17
```
