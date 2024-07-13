import type { TagResponse } from './pocketbase-types';

export type NewTag = {
	id: string;
	name: string;
	isNew: true;
};

export type Tag = TagResponse | NewTag;
