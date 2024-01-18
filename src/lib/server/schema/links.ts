import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const links = sqliteTable('links', {
	id: integer('id').primaryKey(),
	url: text('url').unique(),
	summary: text('summary'),
	created: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	modified: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
});

export const insert_links_schema = createInsertSchema(links);
export const select_links_schema = createSelectSchema(links);
