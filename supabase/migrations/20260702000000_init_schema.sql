-- Create updated_at trigger helper
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create Users table
create table public.users (
    id uuid primary key,
    full_name text,
    email text unique not null,
    avatar_url text,
    auth_provider text,
    google_user_id text,
    is_onboarding_completed boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users
alter table public.users enable row level security;

-- Users RLS Policies
create policy "Allow public read access to users"
    on public.users for select
    using (true);

create policy "Block all client inserts (use API)"
    on public.users for insert
    with check (false);

create policy "Block all client updates (use API)"
    on public.users for update
    using (false);

-- Create trigger for users updated_at
create trigger set_users_updated_at
    before update on public.users
    for each row execute procedure public.handle_updated_at();

-- Create Trust Cards table
create table public.trust_cards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    selected_goal text,
    full_name text,
    job_title text,
    company text,
    profile_photo text,
    specialization text,
    strengths text, -- mapped to biggestStrength in the application layer
    years_of_experience text, -- maps to yearsOfExperience in Zustand
    short_bio text,
    experience jsonb, -- structured experience details
    achievement jsonb, -- structured achievements details
    phone text,
    linkedin text,
    website text,
    trust_score integer default 0 not null,
    profile_completion numeric default 0 not null,
    verification_status text default 'Pending' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on trust_cards
alter table public.trust_cards enable row level security;

-- Trust Cards RLS Policies
create policy "Allow public read access to trust cards"
    on public.trust_cards for select
    using (true);

create policy "Block all client inserts for trust card (use API)"
    on public.trust_cards for insert
    with check (false);

create policy "Block all client updates for trust card (use API)"
    on public.trust_cards for update
    using (false);

create policy "Block all client deletes for trust card (use API)"
    on public.trust_cards for delete
    using (false);

-- Create trigger for trust_cards updated_at
create trigger set_trust_cards_updated_at
    before update on public.trust_cards
    for each row execute procedure public.handle_updated_at();

