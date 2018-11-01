-- Table: public.asset

-- DROP TABLE public.asset;

CREATE TABLE public.asset
(
    serial_number text COLLATE pg_catalog."default" NOT NULL,
    id integer NOT NULL DEFAULT nextval('asset_id_seq'::regclass),
    type_id integer NOT NULL,
    make_id integer NOT NULL,
    model_id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    location_id integer NOT NULL,
    CONSTRAINT asset_pkey PRIMARY KEY (id),
    CONSTRAINT asset_serial_number_unique UNIQUE (serial_number)
        INCLUDE(serial_number),
    CONSTRAINT asset_location_id_fkey FOREIGN KEY (location_id)
        REFERENCES public.location (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT asset_make_id_fkey FOREIGN KEY (make_id)
        REFERENCES public.make (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT asset_model_id_fkey FOREIGN KEY (model_id)
        REFERENCES public.model (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT asset_type_id_fkey FOREIGN KEY (type_id)
        REFERENCES public.type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.asset
    OWNER to postgres;
