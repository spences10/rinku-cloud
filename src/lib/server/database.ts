import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as dotenv from 'dotenv';
dotenv.config();


export const client = createClient({
	url: process.env.DATABASE_URL || '',
	authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client);

export interface DatabaseUser {
	id: string;
	username: string;
	password: string;
}
