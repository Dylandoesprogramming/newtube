UPDATE videos SET title = $2 WHERE vidid = $1;
SELECT * FROM videos WHERE vidid = $1;