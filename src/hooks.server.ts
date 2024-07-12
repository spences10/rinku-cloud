import { PUBLIC_DATABASE_URL } from '$env/static/public';
import Pocketbase from 'pocketbase';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new Pocketbase(PUBLIC_DATABASE_URL);

	event.locals.pb.authStore.loadFromCookie(
		event.request.headers.get('cookie') || ''
	);

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = event.locals.pb.authStore.model;
			// event.locals.user = serializedNonPOJOs(
			// 	event.locals.pb.authStore.model
			// ) as User;
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	response.headers.set(
		'Set-Cookie',
		event.locals.pb.authStore.exportToCookie({ secure: true })
	);

	return response;
};
