/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Link = "link",
	LinkTag = "link_tag",
	Tag = "tag",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type LinkRecord = {
	tags?: RecordIdString[]
	title: string
	url: string
	user: RecordIdString[]
}

export type LinkTagRecord = {
	link_id?: RecordIdString[]
	tag_id?: RecordIdString[]
}

export type TagRecord = {
	name?: string
	user?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	bio?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type LinkResponse<Texpand = unknown> = Required<LinkRecord> & BaseSystemFields<Texpand>
export type LinkTagResponse<Texpand = unknown> = Required<LinkTagRecord> & BaseSystemFields<Texpand>
export type TagResponse<Texpand = unknown> = Required<TagRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	link: LinkRecord
	link_tag: LinkTagRecord
	tag: TagRecord
	users: UsersRecord
}

export type CollectionResponses = {
	link: LinkResponse
	link_tag: LinkTagResponse
	tag: TagResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'link'): RecordService<LinkResponse>
	collection(idOrName: 'link_tag'): RecordService<LinkTagResponse>
	collection(idOrName: 'tag'): RecordService<TagResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
