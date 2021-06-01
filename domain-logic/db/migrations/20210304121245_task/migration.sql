CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

CREATE TABLE public.task (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    text text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX task_created_at_ix ON public.task (created_at);