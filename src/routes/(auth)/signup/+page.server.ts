import { lucia } from '$lib/server/auth';
import { turso_client } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

import type { Actions } from './$types';

const client = turso_client();

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData();
		const username = form_data.get('username');
		const password = form_data.get('password');
		// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (
			typeof password !== 'string' ||
			password.length < 6 ||
			password.length > 255
		) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const user_id = generateId(15);
		const hashed_password = await new Argon2id().hash(password);

		// Check if username is already used and insert if not
		await client.execute({
			sql: `INSERT OR IGNORE INTO user (id, username, password)
      VALUES (?, ?, ?)`,
			args: [user_id, username, hashed_password]
		});

		const session = await lucia.createSession(user_id, {});
		const session_cookie = lucia.createSessionCookie(session.id);
		event.cookies.set(session_cookie.name, session_cookie.value, {
			path: '.',
			...session_cookie.attributes
		});

		redirect(302, '/');
	}
};
