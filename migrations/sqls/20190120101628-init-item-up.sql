CREATE TABLE item (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       title TEXT NOT NULL default '',
       content TEXT NOT NULL default '',
       link TEXT NOT NULL default '',
       item_id VARCHAR(512) UNIQUE NOT NULL,
       pubdate timestamp NOT NULL,
       feed_id BIGINT UNSIGNED NOT NULL,
       FOREIGN KEY (feed_id) REFERENCES feed(id) ON DELETE CASCADE
) ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;
