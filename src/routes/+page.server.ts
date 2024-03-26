import { lucia } from '$lib/server/auth';
import { turso_client } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

import type { Action, Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const client = turso_client();

	// Fetch the user's links
	const links = await client.execute({
		sql: `SELECT * FROM link WHERE user_id = ? ORDER BY created_at DESC`,
		args: [event.locals.user.id]
	});

	// Fetch the user's tags
	const tags = await client.execute({
		sql: `SELECT * FROM tag WHERE user_id = ?`,
		args: [event.locals.user.id]
	});

	return {
		tags: tags.rows,
		links: links.rows,
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
	const form_data = await request.formData();

	const url = form_data.get('url') as string;
	const title = form_data.get('title') as string;
	const selected_tags = form_data.getAll('selected_tags') as string[];

	const client = turso_client();
	const created_at = Date.now();

	// Insert the link into the database
	try {
		await client.execute({
			sql: `INSERT INTO link (url, title, created_at, user_id) VALUES (?, ?, ?, ?)`,
			args: [
				url as string,
				title as string,
				created_at,
				locals.user?.id ?? 'default_user_id'
			]
		});

		// Retrieve the ID of the newly inserted link bc no .lastID property
		const result = await client.execute({
			sql: `SELECT id FROM link WHERE created_at = ? AND url = ? AND title = ? AND user_id = ?`,
			args: [
				created_at,
				url,
				title,
				locals.user?.id ?? 'default_user_id'
			]
		});

		// Assuming the query returns the ID of the newly inserted link
		const link_id = result.rows[0].id;

		// Insert the selected tags into the link_tag table
		for (const tag_id of selected_tags) {
			await client.execute({
				sql: `INSERT INTO link_tag (link_id, tag_id) VALUES (?, ?)`,
				args: [link_id, tag_id]
			});
		}

		return {
			success: true
		};
	} catch (error) {
		console.error('Failed to insert link:', error);
		return fail(500, { message: 'Failed to insert link' });
	}
};

export const actions: Actions = { sign_out, add_link };
