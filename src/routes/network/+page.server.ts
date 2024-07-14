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
					expand: 'tags',
				});

			return links;
		} catch (err) {
			console.error('Error fetching links:', err);
			throw error(500, 'Something went wrong');
		}
	};

	const get_user_tags = async (user_id: string) => {
		try {
			const tags = await locals.pb
				.collection('tag')
				.getFullList(undefined, {
					filter: `user = "${user_id}"`,
					sort: 'name',
				});

			return tags;
		} catch (err) {
			console.error('Error fetching tags:', err);
			throw error(500, 'Something went wrong');
		}
	};

	return {
		user_links: await get_user_links(locals.user.id),
		user_tags: await get_user_tags(locals.user.id),
	};
};
