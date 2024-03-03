import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const session_id = locals.session?.id;
	if (typeof session_id === 'string') {
		await lucia.invalidateSession(session_id);
		redirect(303, '/');
	} else {
		redirect(303, '/');
	}
};
