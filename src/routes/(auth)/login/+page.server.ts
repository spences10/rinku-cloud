import { error, redirect } from '@sveltejs/kit';

import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').authWithPassword(body.email as string, body.password as string);
      if (!locals.pb?.authStore?.model?.verified) {
        locals.pb.authStore.clear();
        return {
          notVerified: true,
        }
      }
		} catch (err) {
			console.log(err);
			error(500, 'something went wrong');
		}

		redirect(303, '/');
	},
};

// import { lucia } from '$lib/server/auth';
// import { turso_client } from '$lib/server/db/client';
// import { fail, redirect } from '@sveltejs/kit';
// import { Argon2id } from 'oslo/password';

// import type { Actions, PageServerLoad } from './$types';

// const client = turso_client();

// export const load: PageServerLoad = async (event) => {
// 	if (event.locals.user) {
// 		return redirect(302, '/');
// 	}
// 	return {};
// };

// export const actions: Actions = {
// 	default: async (event) => {
// 		const formData = await event.request.formData();
// 		const username = formData.get('username');
// 		const password = formData.get('password');

// 		if (
// 			typeof username !== 'string' ||
// 			username.length < 3 ||
// 			username.length > 31 ||
// 			!/^[a-z0-9_-]+$/.test(username)
// 		) {
// 			return fail(400, {
// 				message: 'Invalid username',
// 			});
// 		}
// 		if (
// 			typeof password !== 'string' ||
// 			password.length < 6 ||
// 			password.length > 255
// 		) {
// 			return fail(400, {
// 				message: 'Invalid password',
// 			});
// 		}

// 		const existing_user_result = await client.execute({
// 			sql: 'SELECT * FROM user WHERE username = ?',
// 			args: [username],
// 		});

// 		// Check if any user was found
// 		if (existing_user_result.rows.length === 0) {
// 			return fail(400, {
// 				message: 'Incorrect username or password',
// 			});
// 		}

// 		// Extract the first user from the rows array
// 		const existing_user = existing_user_result.rows[0];

// 		const valid_password = await new Argon2id().verify(
// 			existing_user.password as string,
// 			password as string
// 		);
// 		if (!valid_password) {
// 			return fail(400, {
// 				message: 'Incorrect username or password',
// 			});
// 		}

// 		if (existing_user.id !== null) {
// 			const session = await lucia.createSession(
// 				existing_user.id as string,
// 				{}
// 			);
// 			const session_cookie = lucia.createSessionCookie(session.id);
// 			event.cookies.set(session_cookie.name, session_cookie.value, {
// 				path: '.',
// 				...session_cookie.attributes,
// 			});
// 		} else {
// 		}

// 		return redirect(302, '/');
// 	},
// };
