CREATE TABLE feederror (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       feed_id BIGINT UNSIGNED UNIQUE NOT NULL,
       error TEXT,
       created_at timestamp NOT NULL DEFAULT current_timestamp,
       FOREIGN KEY (feed_id) REFERENCES feed(id) ON DELETE CASCADE
) ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;
