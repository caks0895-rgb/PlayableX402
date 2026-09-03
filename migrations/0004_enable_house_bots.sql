-- Enable autonomous house bots by default
insert into meta (key, value) values ('house_bots', '1')
on conflict (key) do update set value = '1';
