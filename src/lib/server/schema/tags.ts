import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const tags = sqliteTable('tags', {
	id: integer('id').primaryKey(),
	tag: text('tag').unique()
});

export const insert_tags_schema = createInsertSchema(tags);
export const select_tags_schema = createSelectSchema(tags);
