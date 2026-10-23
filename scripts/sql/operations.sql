CREATE TABLE IF NOT EXISTS public.avexium_enquiries(id uuid PRIMARY KEY,created_at timestamptz NOT NULL,record jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS public.avexium_notification_outbox(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,enquiry_id uuid UNIQUE NOT NULL REFERENCES public.avexium_enquiries(id) ON DELETE CASCADE,status text NOT NULL DEFAULT 'pending',attempts integer NOT NULL DEFAULT 0,last_attempt timestamptz,sent_at timestamptz,provider_reference text);
CREATE TABLE IF NOT EXISTS public.avexium_operational_events(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,created_at timestamptz NOT NULL DEFAULT now(),code text NOT NULL,severity text NOT NULL);
CREATE INDEX IF NOT EXISTS avexium_enquiries_created_idx ON public.avexium_enquiries(created_at DESC);
ALTER TABLE public.avexium_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avexium_notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avexium_operational_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.avexium_enquiries,public.avexium_notification_outbox,public.avexium_operational_events FROM PUBLIC;
