INSERT INTO users (username, bio, subs)
VALUES($1, 'I am blank', 0);
SELECT * FROM users WHERE username = $1;