-- Table: public.users

-- DROP TABLE public.users;

CREATE SEQUENCE user_id_seq START WITH 1;

CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    displayname text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT users_displayname_unique UNIQUE (displayname)
        INCLUDE(displayname)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;
