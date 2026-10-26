-- Para bancos que já rodaram o schema.sql antes de os alertas terem coordenadas.
-- Cole no SQL Editor do Supabase e execute. Pode rodar mais de uma vez.

alter table public.alertas
  add column if not exists latitude double precision check (latitude between -90 and 90),
  add column if not exists longitude double precision check (longitude between -180 and 180);

alter table public.alertas drop constraint if exists alertas_coordenadas_juntas;
alter table public.alertas
  add constraint alertas_coordenadas_juntas check ((latitude is null) = (longitude is null));

-- Alertas antigos ficam sem coordenadas e não entram no mapa nem no score.
-- A view é recriada porque o Postgres não deixa inserir colunas no meio dela com "create or replace".
drop view if exists public.feed;
create view public.feed with (security_invoker = true) as
select
  a.id, a.tipo, a.texto, a.local, a.latitude, a.longitude, a.criado_em, a.autor_id,
  p.nome as autor_nome,
  (select count(*) from public.curtidas c where c.alerta_id = a.id)::int as curtidas,
  exists (select 1 from public.curtidas c where c.alerta_id = a.id and c.usuario_id = auth.uid()) as curtido
from public.alertas a
join public.perfis p on p.id = a.autor_id;
