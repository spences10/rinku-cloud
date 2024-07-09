import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const get_user_links = async (user_id: string) => {
		try {
			const links = await locals.pb
				.collection('link')
				.getFullList(undefined, {
					filter: `user.id = "${user_id}"`,
					// expand: 'user',
				});

			return links;
		} catch (err) {
			console.error('Error fetching links:', err);
			throw error(500, 'Something went wrong');
		}
	};

	return {
		user_links: await get_user_links(locals.user.id),
	};
};
