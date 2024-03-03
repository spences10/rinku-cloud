import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '.';

export const links = sqliteTable('links', {
	id: integer('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	url: text('url').unique(),
	summary: text('summary', { length: 3500 }),
	created: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	modified: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
});

const url_validation_schema = z.string().url();

export const insert_links_schema = createInsertSchema(links, {
	url: url_validation_schema,
});
export const select_links_schema = createSelectSchema(links);
