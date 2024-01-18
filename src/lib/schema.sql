CREATE TABLE
  links (
    id INTEGER PRIMARY KEY,
    url TEXT NOT NULL,
    summary TEXT,
    UNIQUE (url)
  );

CREATE TABLE
  tags (
    id INTEGER PRIMARY KEY,
    tag TEXT NOT NULL,
    UNIQUE (tag)
  );

CREATE TABLE
  link_tags (
    link_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY (link_id) REFERENCES Links (id),
    FOREIGN KEY (tag_id) REFERENCES Tags (id),
    UNIQUE (link_id, tag_id)
  );