<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input, Link, Tags } from '$lib/components';

	import type { LinkResponse, Tag, TagResponse } from '$lib/types';

	interface ExpandedLinkResponse extends LinkResponse {
		expand: {
			tags: TagResponse[];
		};
	}

	interface PageData {
		user_links: ExpandedLinkResponse[];
		user_tags: TagResponse[];
	}

	const { data, form } = $props<{ data: PageData; form: FormData }>();

	let selected_tags = $state<Tag[]>([]);
	let search_term = $state('');

	const handle_tags_change = (tags: Tag[]) => {
		selected_tags = tags;
		console.log('Selected tags:', tags);
	};

	let filtered_links = $derived.by(() => {
		const search_lower = search_term.toLowerCase();
		return data.user_links.filter(
			(link: ExpandedLinkResponse) =>
				link.title.toLowerCase().includes(search_lower) ||
				link.url.toLowerCase().includes(search_lower) ||
				link.expand.tags.some((tag: TagResponse) =>
					tag.name.toLowerCase().includes(search_lower)
				)
		);
	});
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
	<button type="submit" class="btn btn-primary rounded-box shadow-lg mb-8">
		Add Link
	</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<div class="mb-8">
	<label for="search" class="label pb-1 font-medium">
		<span class="label-text text-base">Search</span>
	</label>
	<input
		type="text"
		id="search"
		bind:value={search_term}
		placeholder="Search links..."
		class="input w-full rounded-box border-dotted border-secondary shadow-lg"
	/>
</div>

{#if filtered_links.length === 0}
	<p>No matching links found.</p>
{:else}
	{#each filtered_links as link}
		<Link {link} />
	{/each}
{/if}
