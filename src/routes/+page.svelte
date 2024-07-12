<script lang="ts">
	import Link from '$lib/components/link.svelte';

	const { data } = $props();
</script>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
{#each data.user_links as { title, url, tags, created, updated }, index}
	<Link link={{ title, url, tags, created, updated }} />
{/each}
