import { turso_client } from '$lib/server/db';

export const actions = {
	default: async ({ request, locals }) => {
		const client = turso_client();

		const form_data = Object.fromEntries(await request.formData());

		const name = form_data.tag as string;
		const user_id = locals.user?.id ?? 'default_user_id';

		// Check if the tag already exists
		const existing_tag = await client.execute({
			sql: 'SELECT * FROM tag WHERE name = ? AND user_id = ?',
			args: [name, user_id]
		});
		if (existing_tag.rows.length > 0) {
			return {
				status: 200,
				body: {
					success: true,
					tag: existing_tag.rows[0]
				}
			};
		}

		// Insert the new tag
		await client.execute({
			sql: 'INSERT INTO tag (name, user_id) VALUES (?, ?)',
			args: [name, user_id]
		});

		// Retrieve the newly inserted tag
		const inserted_tag = await client.execute({
			sql: 'SELECT * FROM tag WHERE name = ? AND user_id = ?',
			args: [name, user_id]
		});

		return {
			status: 200,
			body: {
				success: true,
				tag: inserted_tag.rows[0]
			}
		};
	}
};
