-- Add permanent slug column to trust_cards
-- Slugs are generated from full_name on first publish and never changed unless explicitly requested.
alter table public.trust_cards add column if not exists slug text unique;
