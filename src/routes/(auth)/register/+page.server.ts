import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

import { db } from '$lib/server/database';
import { user } from '$lib/server/schema/user';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData();
		const username = form_data.get('username');
		const password = form_data.get('password');
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message:
					'Invalid username, must be between 3 and 31 characters, and only contain lowercase letters, numbers, underscores, and hyphens',
			});
		}
		if (
			typeof password !== 'string' ||
			password.length < 6 ||
			password.length > 255
		) {
			return fail(400, {
				message:
					'Invalid password length, must be between 6 and 255 characters',
			});
		}

		const hashed_password = await new Argon2id().hash(password);
		const user_id = generateId(15);

		try {
			await db.insert(user).values({
				id: user_id,
				name: '',
				username,
				password: hashed_password,
			});

			const session = await lucia.createSession(user_id, {});
			const session_cookie = lucia.createSessionCookie(session.id);
			event.cookies.set(session_cookie.name, session_cookie.value, {
				path: '.',
				...session_cookie.attributes,
			});
		} catch (e) {
			// Narrow down the type of e using a type guard
			if (
				typeof e === 'object' &&
				e !== null &&
				'code' in e &&
				'message' in e
			) {
				// Now TypeScript knows e has a code and message property
				const error = e as { code: string; message: string };

				if (error.code === 'SQLITE_CONSTRAINT') {
					const isUsernameConstraintViolation =
						error.message.includes(
							'UNIQUE constraint failed: user.username',
						);

					if (isUsernameConstraintViolation) {
						return fail(400, { message: 'Username already taken' });
					} else {
						// Handle other SQLITE_CONSTRAINT errors not related to the username unique constraint
						return fail(400, {
							message: 'A constraint violation occurred',
						});
					}
				}
			}

			console.error(e);

			// Handle other, unspecified errors
			return fail(500, { message: 'An unknown error occurred' });
		}
		return redirect(302, '/');
	},
};
