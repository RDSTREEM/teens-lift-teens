-- Create table for user notes
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Create table for posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Create table for anonymous chat messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamp with time zone default timezone('utc', now())
);
