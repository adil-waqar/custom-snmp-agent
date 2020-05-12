CREATE TABLE public."snmpSignals"
(
    "signalValue" bigint NOT NULL,
    "signalTime" time without time zone NOT NULL,
    id bigint NOT NULL,
    CONSTRAINT "snmpSignals_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)

TABLESPACE pg_default;

INSERT INTO public."snmpSignals" values (1, 2, '22:30:17.39148');
INSERT INTO public."snmpSignals" values (2, 10, '22:45:19.12341');
INSERT INTO public."snmpSignals" values (3, 17, '23:12:20.83169');
INSERT INTO public."snmpSignals" values (4, 30, '17:52:37.71826');