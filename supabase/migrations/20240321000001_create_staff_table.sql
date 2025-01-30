CREATE TABLE IF NOT EXISTS "public"."staff" (
    "id" SERIAL PRIMARY KEY,
    "UID" UUID NOT NULL REFERENCES auth.users(id),
    "name" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "phone_number1" TEXT NOT NULL,
    "phone_number2" TEXT,
    "gender" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "address" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS staff_uid_idx ON public.staff("UID");
CREATE INDEX IF NOT EXISTS staff_email_idx ON public.staff(email_id);

-- Grant necessary permissions
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see and modify their own staff records
CREATE POLICY "Users can only access their own staff records"
ON public.staff
FOR ALL
USING ("UID" = auth.uid())
WITH CHECK ("UID" = auth.uid());

-- Grant access to authenticated users
GRANT ALL ON TABLE public.staff TO authenticated;
GRANT USAGE ON SEQUENCE public.staff_id_seq TO authenticated;
