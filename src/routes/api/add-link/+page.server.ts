import { db } from '$lib/server/database';
import { insert_links_schema, links } from '$lib/server/schema';
import { error } from '@sveltejs/kit';
import type { Action, Actions } from './$types';

const submit_link: Action = async ({ request, locals }) => {
	const form_data = Object.fromEntries(await request.formData());

	// Fetch the user details from locals
	const auth_details = await locals.auth?.validate();
	if (!auth_details) {
		error(401, 'Unauthorized');
	}
	const { user } = auth_details;
	const user_id = user.userId;

	// parse form data to add user_id
	const parsed_form_data: { [k: string]: any } = { ...form_data };

	// Include the user_id in parsedFormData
	parsed_form_data.user_id = user_id;

	// Validate using Drizzle-Zod schema
	const parsed_data = insert_links_schema.safeParse(parsed_form_data);

	if (!parsed_data.success) {
		// Handle validation errors
		console.error(parsed_data.error);
		return {
			status: 400,
			body: { error: parsed_data.error.flatten() },
			// or JSON.stringify(parsed_data.error)
		};
	}

	// If validation succeeds, insert into database
	try {
		await db.insert(links).values(parsed_data.data);
	} catch (err) {
		console.log(`Error: ${err}`);
		error(500, 'Something went wrong submitting link');
	}
	return {
		success: true,
	};
};

export const actions: Actions = { submit_link };
