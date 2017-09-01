SELECT * FROM videos WHERE userid = $1
    ORDER BY uptime DESC
        LIMIT 1;