-- Table: public.location

-- DROP TABLE public.location;

CREATE SEQUENCE location_id_seq START WITH 1;

CREATE TABLE public.location
(
    id integer NOT NULL DEFAULT nextval('location_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    CONSTRAINT location_pkey PRIMARY KEY (id),
    CONSTRAINT location_name_unique UNIQUE (name)
        INCLUDE(name)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.location
    OWNER to postgres;
