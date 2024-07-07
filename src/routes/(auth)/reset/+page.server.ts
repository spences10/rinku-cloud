import { error } from '@sveltejs/kit';

import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			await locals.pb
				.collection('users')
				.requestPasswordReset(body.email as string);
			return { success: true };
		} catch (err) {
			console.log('=====================');
			console.log(err);
			console.log('=====================');
			error(500, 'something went wrong');
		}
	},
};
