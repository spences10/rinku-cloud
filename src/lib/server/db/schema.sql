CREATE TABLE
  IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

CREATE TABLE
  IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
  );

CREATE TABLE
  IF NOT EXISTS link (
    id TEXT NOT NULL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
  );

CREATE TABLE
  IF NOT EXISTS tag (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

CREATE TABLE
  IF NOT EXISTS link_tag (
    link_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (link_id, tag_id),
    FOREIGN KEY (link_id) REFERENCES link (id),
    FOREIGN KEY (tag_id) REFERENCES tag (id)
  );

