<script lang="ts">
	import Link from '$lib/components/link.svelte';
	import Input from '$lib/components/input.svelte';  // Import the custom Input component
	import type { LinkResponse, TagResponse } from '$lib/types/pocketbase-types';
	import { enhance } from '$app/forms';

	interface ExpandedLinkResponse extends LinkResponse {
		expand: {
			tags: TagResponse[];
		};
	}

	interface PageData {
		user_links: ExpandedLinkResponse[];
	}

	const { data, form } = $props<{ data: PageData, form: any }>();
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
	<Input 
		id="tags"
		type="text"
		label="Tags"
		placeholder="Enter tags (comma separated)"
		errors={form?.errors?.tags}
	/>
	<button type="submit" class="btn btn-primary">Add Link</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#each data.user_links as link}
	<Link {link} />
{/each}