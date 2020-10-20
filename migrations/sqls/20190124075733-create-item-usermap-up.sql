CREATE TABLE useritemmap (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       item_id BIGINT UNSIGNED NOT NULL,
       feed_id BIGINT UNSIGNED NOT NULL,
       category_id BIGINT UNSIGNED NOT NULL,
       user_id BIGINT UNSIGNED NOT NULL,
       status boolean NOT NULL DEFAULT false,
       updated_at timestamp NOT NULL DEFAULT current_timestamp,
       FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
       FOREIGN KEY (feed_id) REFERENCES feed(id) ON DELETE CASCADE,
       FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
       FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
       UNIQUE itemmap_uniq_idx (item_id, user_id)
)  ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;

CREATE INDEX itemmap_catuid_idx ON useritemmap(user_id, category_id);
CREATE INDEX itemmap_feeduid_idx ON useritemmap(user_id, feed_id);
