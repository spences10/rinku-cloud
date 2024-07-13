<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Link, Tags } from '$lib/components';

	import type { LinkResponse, TagResponse } from '$lib/types';

	interface ExpandedLinkResponse extends LinkResponse {
		expand: {
			tags: TagResponse[];
		};
	}

	interface PageData {
		user_links: ExpandedLinkResponse[];
		user_tags: TagResponse[];
	}

	const { data, form } = $props<{ data: PageData; form: any }>();

	let selected_tags = $state<TagResponse[]>([]);

	const handle_tags_change = (tags: TagResponse[]) => {
		selected_tags = tags;
		console.log('Selected tags:', tags);
	};
</script>

<form method="POST" action="?/add_link" use:enhance>
	<Input
		id="url"
		type="url"
		label="URL"
		placeholder="Enter URL"
		required={true}
		errors={form?.errors?.url}
	/>
	<Input
		id="title"
		type="text"
		label="Title"
		placeholder="Enter title"
		required={true}
		errors={form?.errors?.title}
	/>
	<Tags
		existing_tags={data.user_tags}
		on_tags_change={handle_tags_change}
		placeholder="Enter tags..."
		max_tags={5}
	/>
	<button type="submit" class="btn btn-primary">Add Link</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#each data.user_links as link}
	<Link {link} />
{/each}
