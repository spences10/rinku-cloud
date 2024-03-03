import { z } from 'zod';

export const add_link_schema = z.object({
	url: z
		.string()
		.url()
		.transform((url) => {
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				return 'https://' + url;
			}
			return url;
		}),
	tags: z.string(), // Add validation as needed
	summary: z.string(), // Add validation as needed
});
