-- Add a UNIQUE constraint on trust_cards.user_id
-- Required for the upsert onConflict: 'user_id' to work correctly.
-- Without this, Supabase cannot resolve the conflict and silently falls back to insert.
alter table public.trust_cards add constraint trust_cards_user_id_unique unique (user_id);
