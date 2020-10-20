CREATE TABLE default_feed (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       category_name text NOT NULL,
       url VARCHAR(512) UNIQUE NOT NULL,
       web_url VARCHAR(512) NOT NULL,
       name text
) ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;
