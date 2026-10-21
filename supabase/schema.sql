-- Cole no SQL Editor do Supabase (Project > SQL Editor) e execute uma vez.

-- Perfil público de cada usuário (nome mostrado nos alertas).
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default 'Corredor',
  criado_em timestamptz not null default now()
);

-- Cria o perfil sozinho quando alguém se cadastra (o nome vem do cadastro).
create function public.criar_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'nome'), ''), 'Corredor'));
  return new;
end;
$$;

create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.criar_perfil();

create table public.alertas (
  id uuid primary key default gen_random_uuid(),
  autor_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  tipo text not null check (tipo in ('danger', 'warn', 'ok')),
  texto text not null check (char_length(trim(texto)) between 1 and 500),
  local text,
  criado_em timestamptz not null default now()
);
create index alertas_criado_em_idx on public.alertas (criado_em desc);

create table public.curtidas (
  alerta_id uuid not null references public.alertas (id) on delete cascade,
  usuario_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  primary key (alerta_id, usuario_id)
);

-- Segurança por linha: só usuários logados leem; cada um mexe só no que é seu.
alter table public.perfis enable row level security;
alter table public.alertas enable row level security;
alter table public.curtidas enable row level security;

create policy "perfis visiveis a logados" on public.perfis for select to authenticated using (true);
create policy "alertas visiveis a logados" on public.alertas for select to authenticated using (true);
create policy "publicar o proprio alerta" on public.alertas for insert to authenticated with check (autor_id = auth.uid());
create policy "apagar o proprio alerta" on public.alertas for delete to authenticated using (autor_id = auth.uid());
create policy "curtidas visiveis a logados" on public.curtidas for select to authenticated using (true);
create policy "curtir como si mesmo" on public.curtidas for insert to authenticated with check (usuario_id = auth.uid());
create policy "descurtir a propria curtida" on public.curtidas for delete to authenticated using (usuario_id = auth.uid());

-- Feed pronto: alerta + nome do autor + total de curtidas + se EU curti.
create view public.feed with (security_invoker = true) as
select
  a.id, a.tipo, a.texto, a.local, a.criado_em, a.autor_id,
  p.nome as autor_nome,
  (select count(*) from public.curtidas c where c.alerta_id = a.id)::int as curtidas,
  exists (select 1 from public.curtidas c where c.alerta_id = a.id and c.usuario_id = auth.uid()) as curtido
from public.alertas a
join public.perfis p on p.id = a.autor_id;
