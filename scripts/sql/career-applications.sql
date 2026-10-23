CREATE TABLE IF NOT EXISTS public.avexium_career_applications (
 id uuid PRIMARY KEY,
 created_at timestamptz NOT NULL,
 record jsonb NOT NULL,
 cv bytea,
 CHECK (cv IS NULL OR octet_length(cv) <= 3145728)
);
CREATE INDEX IF NOT EXISTS avexium_career_applications_created_idx ON public.avexium_career_applications (created_at DESC);
ALTER TABLE public.avexium_career_applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.avexium_career_applications FROM PUBLIC;
