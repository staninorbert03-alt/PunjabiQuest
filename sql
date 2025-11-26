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
create or replace view analytics_xp_by_day as
select
  date_trunc('day', coalesce((meta->>'completed_at')::timestamptz, created_at)) as day,
  sum( (meta->>'xp_gain')::int ) as total_xp,
  count(*) filter (where event_type = 'quest_completed') as completions
from events
where event_type = 'quest_completed'
group by 1
order by 1 desc;
create or replace view analytics_user_summary as
select
  p.id,
  p.username,
  p.xp,
  p.current_streak,
  p.last_learning_date,
  -- last event
  (select max(created_at) from events e where e.user_id = p.id) as last_active
from profiles p;
create or replace view analytics_weekly_cohort as
with first_activity as (
  select user_id, date_trunc('week', min(created_at))::date as cohort_week
  from events
  group by user_id
)
select
  fa.cohort_week,
  date_trunc('week', e.created_at)::date as activity_week,
  count(distinct e.user_id) as active_users_in_week
from first_activity fa
join events e on e.user_id = fa.user_id
group by fa.cohort_week, date_trunc('week', e.created_at)
order by fa.cohort_week, activity_week;
create or replace view analytics_streak_distribution as
select current_streak as streak, count(*) as users from profiles group by current_streak order by streak desc;