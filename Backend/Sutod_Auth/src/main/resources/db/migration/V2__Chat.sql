CREATE TABLE IF NOT EXISTS app_schema.chat(
    id SERIAL PRIMARY KEY,
    c_userid BIGINT NOT NULL,
    c_user2id BIGINT NOT NULL,

    CONSTRAINT uq_users_pair UNIQUE (c_userid, c_user2id)
);