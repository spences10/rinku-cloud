import { lucia } from '$lib/server/auth';
import { turso_client } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

import type { Action, Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const client = turso_client();

	// Use a CTE to aggregate tags for each link
	const linksWithTags = await client.execute({
		sql: `
			WITH tag_aggregates AS (
					SELECT link_id, GROUP_CONCAT(tag.name) AS tags
					FROM link_tag
					JOIN tag ON tag.id = link_tag.tag_id
					WHERE tag.user_id = ?
					GROUP BY link_id
			)
			SELECT link.*, tag_aggregates.tags
			FROM link
			LEFT JOIN tag_aggregates ON link.id = tag_aggregates.link_id
			WHERE link.user_id = ?
			ORDER BY link.created_at DESC
		`,
		args: [event.locals.user.id, event.locals.user.id]
	});

	// Fetch the user's tags
	const tags = await client.execute({
		sql: `SELECT * FROM tag WHERE user_id = ?`,
		args: [event.locals.user.id]
	});

	return {
		tags: tags.rows,
		links: linksWithTags.rows,
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

export const actions: Actions = { sign_out };
