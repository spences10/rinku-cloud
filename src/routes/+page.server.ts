import { error, fail, redirect } from '@sveltejs/kit';

import type { Action, Actions } from '@sveltejs/kit';

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

const add_link: Action = async ({ request, locals }) => {
	const form_data = await request.formData();
	const url = form_data.get('url') as string;
	const title = form_data.get('title') as string;
	const tags = form_data.get('tags') as string;

	const errors: Record<string, string> = {};

	if (!url) errors.url = 'URL is required';
	if (!title) errors.title = 'Title is required';

	if (Object.keys(errors).length > 0) {
		return fail(400, { errors });
	}

	try {
		// Create the link
		const link = await locals.pb.collection('link').create({
			url,
			title,
			user: locals.user.id,
		});

		// Handle tags
		const tag_data = tags ? tags.split(',') : [];

		const final_tag_ids = [];

		for (const tag_item of tag_data) {
			try {
				let tag;
				if (tag_item.startsWith('existing:')) {
					// This is an existing tag, extract the ID
					const tag_id = tag_item.split(':')[1];
					tag = await locals.pb.collection('tag').getOne(tag_id);
				} else if (tag_item.startsWith('new:')) {
					// This is a new tag, create it
					const tag_name = tag_item.split(':')[1];
					tag = await locals.pb.collection('tag').create({
						name: tag_name,
						user: locals.user.id,
					});
				} else {
					console.error(`Invalid tag format: ${tag_item}`);
					continue;
				}

				if (tag) {
					final_tag_ids.push(tag.id);

					// Create link_tag relationship
					await locals.pb.collection('link_tag').create({
						link_id: link.id,
						tag_id: tag.id,
					});
				}
			} catch (err) {
				console.error(`Error processing tag ${tag_item}:`, err);
			}
		}

		// Update the link with the tag relations
		await locals.pb.collection('link').update(link.id, {
			tags: final_tag_ids,
		});

		return { success: true };
	} catch (err) {
		console.error('Error adding link:', err);
		return fail(500, { error: 'Failed to add link' });
	}
};

export const actions: Actions = { add_link };
