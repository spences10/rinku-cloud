import type { ZodError, z } from "zod";

export const validateData = async <T extends z.ZodTypeAny>(
	form_data: FormData,
	schema: T,
) => {
	const body = Object.fromEntries(form_data.entries()) as z.infer<T>;
	try {
		const data = await schema.parseAsync(body);

		return {
			formData: data,
			error: null,
		};
	} catch (err) {
		console.log(`Error: ${err}`);
		const errors = (err as ZodError).flatten();
		return {
			formData: body,
			errors,
		};
	}
};
