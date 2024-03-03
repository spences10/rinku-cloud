import { dev } from '$app/environment';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { Lucia } from 'lucia';
import { client } from './database';

const adapter = new LibSQLAdapter(client, {
	user: 'user',
	session: 'user_session',
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
		},
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
}
