create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  event_type text not null, -- e.g. 'quest_completed', 'login', 'quest_viewed'
  meta jsonb,
  created_at timestamptz default now()
);
create or replace view analytics_dau as
select
  date_trunc('day', created_at) as day,
  count(distinct user_id) as dau
from events
group by 1
order by 1 desc;