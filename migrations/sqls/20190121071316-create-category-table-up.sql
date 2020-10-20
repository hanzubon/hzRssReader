CREATE TABLE category (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       user_id BIGINT UNSIGNED NOT NULL,
       name TEXT NOT NULL default '',
       FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;
CREATE INDEX cat_uid_idx ON category(user_id);

CREATE TABLE categorymap (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       category_id BIGINT UNSIGNED NOT NULL,
       feed_id BIGINT UNSIGNED NOT NULL,
       user_id BIGINT UNSIGNED NOT NULL,
       FOREIGN KEY (feed_id) REFERENCES feed(id) ON DELETE CASCADE,
       FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
       FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
       UNIQUE KEY catmap_uniq_idx (feed_id, user_id)
) ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;

CREATE INDEX catmap_catid_idx ON categorymap(category_id);
CREATE INDEX catmap_fid_idx ON categorymap(feed_id);
CREATE INDEX catmap_uid_idx ON categorymap(user_id);
