import { db } from '$lib/server/database';
import { insert_links_schema, links } from '$lib/server/schema';
import { error } from '@sveltejs/kit';
import type { Action, Actions } from './$types';

const submit_link: Action = async ({ request }) => {
	const formData = Object.fromEntries(await request.formData());

	console.log('=====================');
	console.log(formData);
	console.log('=====================');

	// Validate using Drizzle-Zod schema
	const parsedData = insert_links_schema.safeParse(formData);

	if (!parsedData.success) {
		// Handle validation errors
		console.error(parsedData.error);
		return {
			status: 400,
			body: parsedData.error,
		};
	}

	// If validation succeeds, insert into database
	try {
		await db.insert(links).values(parsedData.data);
	} catch (err) {
		console.log(`Error: ${err}`);
		error(500, 'Something went wrong submitting link');
	}
	return {
		success: true,
	};
};

export const actions: Actions = { submit_link };
