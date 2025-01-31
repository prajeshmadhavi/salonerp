CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" SERIAL PRIMARY KEY,
    "UID" UUID NOT NULL REFERENCES auth.users(id),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS customers_uid_idx ON public.customers("UID");
CREATE INDEX IF NOT EXISTS customers_email_idx ON public.customers(email);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see and modify their own customer records
CREATE POLICY "Users can only access their own customer records"
ON public.customers
FOR ALL
USING ("UID" = auth.uid())
WITH CHECK ("UID" = auth.uid());

-- Grant access to authenticated users
GRANT ALL ON TABLE public.customers TO authenticated;
GRANT USAGE ON SEQUENCE public.customers_id_seq TO authenticated;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_customers_timestamp
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
