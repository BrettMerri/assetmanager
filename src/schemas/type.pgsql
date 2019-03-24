-- Table: public.type

-- DROP TABLE public.type;

CREATE SEQUENCE type_id_seq START WITH 1;

CREATE TABLE public.type
(
    id integer NOT NULL DEFAULT nextval('type_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    updated timestamp(6) with time zone NOT NULL,
    CONSTRAINT type_pkey PRIMARY KEY (id),
    CONSTRAINT type_name_unique UNIQUE (name)
        INCLUDE(name)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.type
    OWNER to postgres;
