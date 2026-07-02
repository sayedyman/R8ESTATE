-- Drop the foreign key constraint linking public.users.id to auth.users(id)
alter table public.users drop constraint if exists users_id_fkey;

-- Add google_user_id column if not exists
alter table public.users add column if not exists google_user_id text;

-- Add is_onboarding_completed column if not exists
alter table public.users add column if not exists is_onboarding_completed boolean default false not null;
