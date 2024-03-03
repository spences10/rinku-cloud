import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { user } from '$lib/server/schema/user';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';

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
				message: 'Invalid username',
			});
		}
		if (
			typeof password !== 'string' ||
			password.length < 6 ||
			password.length > 255
		) {
			return fail(400, {
				message: 'Invalid password',
			});
		}

		const [existing_user] = await db
			.select()
			.from(user)
			.where(eq(user.username, username));
		if (!existing_user) {
			return fail(400, {
				message: 'Incorrect username or password',
			});
		}

		const valid_password = await new Argon2id().verify(
			existing_user.password,
			password,
		);
		if (!valid_password) {
			return fail(400, {
				message: 'Incorrect username or password',
			});
		}

		const session = await lucia.createSession(existing_user.id, {});
		const session_cookie = lucia.createSessionCookie(session.id);
		event.cookies.set(session_cookie.name, session_cookie.value, {
			path: '.',
			...session_cookie.attributes,
		});

		return redirect(302, '/submit-dev');
	},
};
