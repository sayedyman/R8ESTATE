-- Create analytics_events table
create table public.analytics_events (
    id uuid default gen_random_uuid() primary key,
    owner_user_id uuid not null references public.users(id) on delete cascade,
    visitor_id text,
    event_type text not null,
    source text not null default 'web',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now() not null
);

-- Indexing for performant dashboard aggregation queries
create index idx_analytics_events_owner_type on public.analytics_events (owner_user_id, event_type);
create index idx_analytics_events_created_at on public.analytics_events (created_at);

-- Enable Row Level Security (RLS)
alter table public.analytics_events enable row level security;

-- Insert Policy: anyone (unauthenticated or guest) is allowed to record an interaction
create policy "Allow insert for anyone"
    on public.analytics_events for insert
    with check (true);

-- Select Policy: only the owner of the analytics dashboard can read their events
create policy "Allow select for owner"
    on public.analytics_events for select
    using (auth.uid() = owner_user_id);
