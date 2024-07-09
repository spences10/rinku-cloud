import { error, redirect } from '@sveltejs/kit';

import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').create({ ...body });
			await locals.pb
				.collection('users')
				.requestVerification(body.email as string);
		} catch (err) {
			console.log(err);
			error(500, 'something went wrong');
		}

		redirect(303, '/login');
	},
};
