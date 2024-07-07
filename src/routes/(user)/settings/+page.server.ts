import { redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		redirect(302, '/login');
	} else {
		redirect(303, '/settings/profile');
	}
};
