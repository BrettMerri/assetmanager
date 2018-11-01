-- Table: public.make

-- DROP TABLE public.make;

CREATE TABLE public.make
(
    id integer NOT NULL DEFAULT nextval('brand_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    type_id integer NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    updated timestamp(6) with time zone NOT NULL,
    CONSTRAINT make_pkey PRIMARY KEY (id),
    CONSTRAINT make_name_unique UNIQUE (name)
        INCLUDE(name),
    CONSTRAINT make_type_id_fkey FOREIGN KEY (type_id)
        REFERENCES public.type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.make
    OWNER to postgres;
