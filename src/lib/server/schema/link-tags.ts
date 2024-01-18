import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { links } from './links';
import { tags } from './tags';

export const link_tags = sqliteTable('link_tags', {
	link_id: integer('link_id').references(() => links.id),
	tag_id: integer('tag_id').references(() => tags.id)
});

export const insert_link_tags_schema = createInsertSchema(link_tags);
export const select_link_tags_schema = createSelectSchema(link_tags);
