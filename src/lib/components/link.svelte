<script lang="ts">
	interface Link {
		title: string;
		url: string;
		tags: Array<{ name: string } | string>;
		created: string | number;
		updated: string | number;
		expand?: {
			tags?: Array<{ id: string; name: string }>;
		};
	}

	const { link } = $props<{ link: Link }>();

	const get_tag_name = (tag: { name: string } | string) => {
		if (typeof tag === 'object' && tag.name) {
			return tag.name;
		} else if (link.expand && link.expand.tags) {
			const expanded_tag = link.expand.tags.find(
				(t: { id: string | { name: string } }) => t.id === tag
			);
			return expanded_tag ? expanded_tag.name : 'Unknown';
		}
		return 'Unknown';
	};
</script>

<div class="card mb-4 w-full bg-base-100 shadow-xl">
	<div class="card-body">
		<a href={link.url}>
			<h2 class="card-title text-3xl">{link.title}</h2>
		</a><a href={link.url} class="link link-primary text-xl">
			{link.url}
		</a>
		{#if link.tags && link.tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each link.tags as tag}
					<span class="badge badge-primary">{get_tag_name(tag)}</span>
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
