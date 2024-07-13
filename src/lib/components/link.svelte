<script lang="ts">
	import type { LinkResponse, TagResponse } from '$lib/types/pocketbase-types';

	interface ExpandedLinkResponse extends LinkResponse {
		expand?: {
			tags?: TagResponse[];
		};
	}

	const { link } = $props<{ link: ExpandedLinkResponse }>();

	let display_tags = $derived(link.expand?.tags ?? []);
</script>

<div class="card mb-4 w-full bg-base-100 shadow-xl">
	<div class="card-body">
		<a href={link.url}>
			<h2 class="card-title text-3xl">{link.title}</h2>
		</a>
		<a href={link.url} class="link link-primary text-xl">
			{link.url}
		</a>
		{#if display_tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each display_tags as tag}
					<span class="badge badge-primary">{tag.name}</span>
				{/each}
			</div>
		{/if}
		<p class="text-xs text-neutral">
			Created: {new Date(link.created).toLocaleString()}
		</p>
		<p class="text-xs text-neutral">
			Updated: {new Date(link.updated).toLocaleString()}
		</p>
	</div>
</div>