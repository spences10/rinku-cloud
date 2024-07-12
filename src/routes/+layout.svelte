<script lang="ts">
	import { Nav } from '$lib/components';
	import '../app.css';

	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';

	interface Props {
		data: LayoutServerData;
		children?: Snippet;
	}

	let { data, children }: Props = $props();
</script>

<Nav {data} />

<div class="flex min-h-screen flex-col overflow-x-hidden">
	<main
		id="main-content"
		class="container mx-auto max-w-3xl flex-grow px-4"
	>
		{@render children?.()}
	</main>
</div>
