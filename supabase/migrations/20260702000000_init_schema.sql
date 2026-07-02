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
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    email text unique not null,
    avatar_url text,
    auth_provider text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users
alter table public.users enable row level security;

-- Users RLS Policies
create policy "Allow public read access to users"
    on public.users for select
    using (true);

create policy "Allow insert for self"
    on public.users for insert
    with check (auth.uid() = id);

create policy "Allow update for self"
    on public.users for update
    using (auth.uid() = id);

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

create policy "Allow insert for own trust card"
    on public.trust_cards for insert
    with check (auth.uid() = user_id);

create policy "Allow update for own trust card"
    on public.trust_cards for update
    using (auth.uid() = user_id);

create policy "Allow delete for own trust card"
    on public.trust_cards for delete
    using (auth.uid() = user_id);

-- Create trigger for trust_cards updated_at
create trigger set_trust_cards_updated_at
    before update on public.trust_cards
    for each row execute procedure public.handle_updated_at();

-- Automatically sync users from auth.users to public.users on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, full_name, email, avatar_url, auth_provider)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        new.email,
        new.raw_user_meta_data->>'avatar_url',
        new.app_metadata->>'provider'
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
