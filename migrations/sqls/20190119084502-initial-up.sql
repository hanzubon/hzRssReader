CREATE TABLE feed (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       url VARCHAR(512) UNIQUE NOT NULL,
       update_interval BIGINT UNSIGNED NOT NULL DEFAULT 0,
       updated_at timestamp not null default 0 on update current_timestamp
) ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;

CREATE TABLE hubmap (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       hub VARCHAR(512) NOT NULL,
       subscribed_at timestamp not null default current_timestamp,
       feed_id BIGINT UNSIGNED UNIQUE NOT NULL,
       FOREIGN KEY (feed_id) REFERENCES feed(id) ON DELETE CASCADE
)  ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;
