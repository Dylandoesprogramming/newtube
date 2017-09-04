UPDATE users SET userpic = $2 WHERE userid = $1;
SELECT * FROM users WHERE userid = $1