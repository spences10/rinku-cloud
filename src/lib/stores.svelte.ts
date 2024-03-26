import type { Row } from '@libsql/client';
import { writable } from 'svelte/store';

export const tags_store = writable<Row[]>([]);

export const selected_tags_store = writable<
	{ id: number; name: string }[]
>([]);
