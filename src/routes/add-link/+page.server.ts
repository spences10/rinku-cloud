import { turso_client } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

import type { Action, Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const client = turso_client();

	// Fetch the user's tags
	const tags = await client.execute({
		sql: `SELECT * FROM tag WHERE user_id = ?`,
		args: [event.locals.user.id]
	});

	return {
		tags: tags.rows,
		user: event.locals.user
	};
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

		// Retrieve the ID of the newly inserted link
		const result = await client.execute({
			sql: `
				SELECT id FROM link 
				WHERE created_at = ? AND url = ? AND title = ? AND user_id = ?
			`,
			args: [
				created_at,
				url,
				title,
				locals.user?.id ?? 'default_user_id'
			]
		});

		const link_id = result.rows[0].id;

		// Check if the tag already exists or insert a new one
		for (const tag_name of selected_tags) {
			let existing_tag = await client.execute({
				sql: `SELECT * FROM tag WHERE name = ? AND user_id = ?`,
				args: [tag_name, locals.user?.id ?? 'default_user_id']
			});

			let tag_id;
			if (existing_tag.rows.length > 0) {
				// If the tag already exists, use its ID
				tag_id = existing_tag.rows[0].id;
			} else {
				// Insert the new tag and retrieve its ID
				await client.execute({
					sql: `INSERT INTO tag (name, user_id) VALUES (?, ?)`,
					args: [tag_name, locals.user?.id ?? 'default_user_id']
				});
				const new_tag_result = await client.execute({
					sql: `SELECT id FROM tag WHERE name = ? AND user_id = ?`,
					args: [tag_name, locals.user?.id ?? 'default_user_id']
				});
				tag_id = new_tag_result.rows[0].id;
			}

			// Insert the selected tag into the link_tag table
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

export const actions: Actions = { add_link };
