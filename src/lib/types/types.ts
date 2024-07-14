import type {
	LinkResponse,
	RecordIdString,
	TagResponse,
} from './pocketbase-types';

export type NewTag = {
	id: string;
	name: string;
	isNew: true;
};

export type Tag = TagResponse | NewTag;

export interface ExpandedLinkResponse
	extends Omit<LinkResponse, 'tags' | 'expand'> {
	tags: RecordIdString[];
	expand?: {
		tags: TagResponse[];
	};
}
