CREATE TABLE user (
       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       auth0_user_id VARCHAR(512) UNIQUE NOT NULL,
       is_admin boolean NOT NULL DEFAULT false
) ENGINE = innodb DEFAULT CHARSET utf8mb4 ROW_FORMAT=DYNAMIC;
