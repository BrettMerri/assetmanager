-- Table: public.model

-- DROP TABLE public.model;

CREATE TABLE public.model
(
    id integer NOT NULL DEFAULT nextval('model_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    make_id integer NOT NULL,
    created timestamp(6) with time zone NOT NULL,
    updated timestamp(6) with time zone NOT NULL,
    CONSTRAINT model_pkey PRIMARY KEY (id),
    CONSTRAINT model_name_unique UNIQUE (name)
        INCLUDE(name),
    CONSTRAINT model_make_id_fkey FOREIGN KEY (make_id)
        REFERENCES public.make (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.model
    OWNER to postgres;
