-- Table for admin blog posts
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now()),
  author_id uuid references auth.users(id)
);
