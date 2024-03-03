-- drop the lot
DROP TABLE IF EXISTS "__drizzle_migrations";
DROP TABLE IF EXISTS "user_session";
DROP TABLE IF EXISTS "user_key";
DROP TABLE IF EXISTS "link_tags";
DROP TABLE IF EXISTS "links";
DROP TABLE IF EXISTS "tags";
DROP TABLE IF EXISTS "user";

CREATE TABLE
  "__drizzle_migrations" (
    id SERIAL PRIMARY KEY,
    hash text NOT NULL,
    created_at numeric
  );

CREATE TABLE
  `link_tags` (
    `link_id` integer,
    `tag_id` integer,
    FOREIGN KEY (`link_id`) REFERENCES `links` (`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON UPDATE no action ON DELETE no action
  );

CREATE TABLE
  `links` (
    `id` integer PRIMARY KEY NOT NULL,
    `user_id` text NOT NULL,
    `url` text,
    `summary` text (3500),
    `created_at` integer DEFAULT (strftime ('%s', 'now')),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE no action ON DELETE no action
  );

CREATE UNIQUE INDEX `links_url_unique` ON `links` (`url`);

CREATE TABLE
  `tags` (`id` integer PRIMARY KEY NOT NULL, `tag` text);

CREATE UNIQUE INDEX `tags_tag_unique` ON `tags` (`tag`);

CREATE TABLE
  `user` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text (50),
    `username` text (32) NOT NULL,
    `password` text (132) NOT NULL,
    `created_at` integer DEFAULT (strftime ('%s', 'now')),
    `updated_at` integer DEFAULT (strftime ('%s', 'now'))
  );

CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);

CREATE TABLE
  `user_session` (
    `id` text PRIMARY KEY NOT NULL,
    `expires_at` integer DEFAULT (strftime ('%s', 'now')),
    `user_id` text NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE no action ON DELETE no action
  );