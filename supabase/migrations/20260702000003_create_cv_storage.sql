-- Create a private storage bucket for CV uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cvs',
  'cvs',
  false,
  10485760, -- 10 MB
  array['application/pdf']
)
on conflict (id) do nothing;

-- RLS: Authenticated users can upload their own CV
create policy "Users can upload their own CV"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS: Users can read their own CV files
create policy "Users can read their own CVs"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
