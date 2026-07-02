-- Add preferred_locale to public.users
ALTER TABLE public.users
ADD COLUMN preferred_locale text DEFAULT 'en'::text;

-- Update the type to ensure it matches the application's supported locales
ALTER TABLE public.users
ADD CONSTRAINT users_preferred_locale_check 
CHECK (preferred_locale IN ('en', 'ar'));
