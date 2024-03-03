import { db } from '$lib/server/database';
import { tags } from '$lib/server/schema';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	let all_tags: {
		id: number;
		tag: string | null;
	}[];
	try {
		all_tags = await db.select().from(tags);
	} catch (error) {
		return {
			status: 500,
			body: JSON.stringify({ error: 'Internal server error' }),
		};
	}
	return json(all_tags);
};
