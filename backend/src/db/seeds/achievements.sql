insert into public.achievements (title, description, tier, rule_key, target_value)
values
  ('100 km Club', 'Logged more than 100 km this season.', 'Gold', 'distance_100km', 100),
  ('Consistency Builder', 'Completed runs in three consecutive weeks.', 'Silver', 'three_week_streak', 3),
  ('Hill Hunter', 'Climbed 1,000 m across recent sessions.', 'Bronze', 'elevation_1000m', 1000)
on conflict (rule_key) do update
set
  title = excluded.title,
  description = excluded.description,
  tier = excluded.tier,
  target_value = excluded.target_value;
