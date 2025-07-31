CREATE TABLE IF NOT EXISTS app_schema.messages(
    id SERIAL PRIMARY KEY,
    c_message VARCHAR NOT NULL,
    c_senderid BIGINT NOT NULL,
    c_chatid BIGINT NOT NULL,
    c_timestamp TIMESTAMP NOT NULL
);