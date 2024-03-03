import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = env;

export const client = createClient({
	url: DATABASE_URL || '',
	authToken: DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client);

export interface DatabaseUser {
	id: string;
	username: string;
	password: string;
}
