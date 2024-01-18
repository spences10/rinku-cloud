import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const links = sqliteTable('links', {
	id: integer('id').primaryKey(),
	url: text('url').unique(),
	summary: text('summary'),
	created: text('created').default(sql`CURRENT_TIMESTAMP`),
	modified: text('modified').default(sql`CURRENT_TIMESTAMP`),
});

export const insert_links_schema = createInsertSchema(links);
export const select_links_schema = createSelectSchema(links);
