import { lucia } from '$lib/server/auth';
import { turso_client } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

import type { Action, Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	return {
		user: event.locals.user
	};
};

const sign_out: Action = async (event) => {
	if (!event.locals.session) {
		return fail(401);
	}
	await lucia.invalidateSession(event.locals.session.id);
	const session_cookie = lucia.createBlankSessionCookie();
	event.cookies.set(session_cookie.name, session_cookie.value, {
		path: '.',
		...session_cookie.attributes
	});
	return redirect(302, '/login');
};

const add_link: Action = async ({ request, locals }) => {
	const client = turso_client();
	const form_data = Object.fromEntries(await request.formData());
	const { url, title } = form_data;

	// Insert the link into the database
	try {
		await client.execute({
			sql: `INSERT INTO link (url, title, created_at, user_id) VALUES (?, ?, ?, ?)`,
			args: [
				url as string,
				title as string,
				Date.now(),
				locals.user?.id ?? 'default_user_id'
			]
		});
		return {
			success: true
		};
	} catch (error) {
		console.error('Failed to insert link:', error);
		return fail(500, { message: 'Failed to insert link' });
	}
};

export const actions: Actions = { sign_out, add_link };
