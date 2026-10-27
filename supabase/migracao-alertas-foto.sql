-- Fotos nos alertas. Cole no SQL Editor do Supabase e execute. Pode rodar mais de uma vez.

alter table public.alertas add column if not exists foto_caminho text;

-- Bucket público para leitura (as fotos aparecem no feed); só quem está logado envia, e só na própria pasta.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-alertas', 'fotos-alertas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "enviar foto na propria pasta" on storage.objects;
create policy "enviar foto na propria pasta" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos-alertas' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "apagar a propria foto" on storage.objects;
create policy "apagar a propria foto" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos-alertas' and (storage.foldername(name))[1] = auth.uid()::text);

-- A view é recriada porque o Postgres não deixa inserir colunas no meio dela com "create or replace".
drop view if exists public.feed;
create view public.feed with (security_invoker = true) as
select
  a.id, a.tipo, a.texto, a.local, a.latitude, a.longitude, a.criado_em, a.autor_id, a.foto_caminho,
  p.nome as autor_nome,
  (select count(*) from public.curtidas c where c.alerta_id = a.id)::int as curtidas,
  exists (select 1 from public.curtidas c where c.alerta_id = a.id and c.usuario_id = auth.uid()) as curtido
from public.alertas a
join public.perfis p on p.id = a.autor_id;
