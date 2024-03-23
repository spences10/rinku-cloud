import { lucia } from '$lib/server/auth';
import { turso_client } from '$lib/server/db/client';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';

import type { Actions, PageServerLoad } from './$types';

const client = turso_client();

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

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
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const existingUserResult = await client.execute({
			sql: 'SELECT * FROM user WHERE username = ?',
			args: [username]
		});

		// Check if any user was found
		if (existingUserResult.rows.length === 0) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		// Extract the first user from the rows array
		const existingUser = existingUserResult.rows[0];

		const validPassword = await new Argon2id().verify(
			existingUser.password as string,
			password as string
		);
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		if (existingUser.id !== null) {
			const session = await lucia.createSession(existingUser.id as string, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
		}

		return redirect(302, '/');
	}
};
