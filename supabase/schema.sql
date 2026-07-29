-- ELDA BEAUTY — schéma Supabase (Postgres)
-- À exécuter une fois dans l'éditeur SQL du projet Supabase ("Pluto") :
-- Dashboard > SQL Editor > New query > coller ce fichier > Run.
--
-- Chaque table reprend le modèle "document" utilisé précédemment avec Firestore :
-- une colonne jsonb `data` contient l'objet complet (mêmes champs que les types
-- TypeScript dans types/index.ts), avec `id` et une colonne de tri en clair pour
-- pouvoir indexer/trier côté SQL sans dupliquer tous les champs en colonnes.

create table if not exists products (
  id text primary key,
  created_at bigint not null,
  data jsonb not null
);

create table if not exists orders (
  id text primary key,
  created_at bigint not null,
  data jsonb not null
);

create table if not exists reservations (
  id text primary key,
  created_at bigint not null,
  data jsonb not null
);

create table if not exists videos (
  id text primary key,
  created_at bigint not null,
  data jsonb not null
);

create table if not exists conversations (
  id text primary key,
  last_updated bigint not null,
  data jsonb not null
);

create table if not exists home_content (
  id text primary key default 'main',
  data jsonb not null
);

create index if not exists products_created_at_idx on products (created_at desc);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists reservations_created_at_idx on reservations (created_at desc);
create index if not exists videos_created_at_idx on videos (created_at desc);
create index if not exists conversations_last_updated_idx on conversations (last_updated desc);

-- Realtime : nécessaire pour que l'app reçoive les mises à jour en direct
-- (équivalent des onSnapshot() Firestore).
alter publication supabase_realtime add table
  products, orders, reservations, videos, conversations, home_content;

-- RLS : le site n'utilise pas Supabase Auth, l'admin est protégé par un simple
-- mot de passe côté client (voir lib/constants.ts). On ouvre donc l'accès complet,
-- comme les règles Firestore d'origine. À restreindre si une vraie authentification
-- admin est ajoutée plus tard.
alter table products enable row level security;
alter table orders enable row level security;
alter table reservations enable row level security;
alter table videos enable row level security;
alter table conversations enable row level security;
alter table home_content enable row level security;

create policy "public full access" on products for all using (true) with check (true);
create policy "public full access" on orders for all using (true) with check (true);
create policy "public full access" on reservations for all using (true) with check (true);
create policy "public full access" on videos for all using (true) with check (true);
create policy "public full access" on conversations for all using (true) with check (true);
create policy "public full access" on home_content for all using (true) with check (true);
