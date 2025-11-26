ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';

UPDATE profiles SET role = 'admin' WHERE email = 'dein@email.com';