import { PUBLIC_DATABASE_URL } from '$env/static/public';

export const get_pocketbase_image_url = (
	collection: string,
	record_id: string,
	file_name: string | undefined,
	size = '0x0'
) => {
	return `${PUBLIC_DATABASE_URL}/api/files/${collection}/${record_id}/${file_name}?thumb=${size}`;
};
