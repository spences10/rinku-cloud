import { error, redirect } from '@sveltejs/kit';

import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			await locals.pb
				.collection('users')
				.authWithPassword(
					body.email as string,
					body.password as string
				);
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true,
				};
			}
		} catch (err) {
			console.log(err);
			error(500, 'something went wrong');
		}

		redirect(303, '/');
	},
};
