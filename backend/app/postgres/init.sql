CREATE TABLE users (
    uuid SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
INSERT INTO users (login, password) VALUES ('Test', '123');