<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.pcss';

	let { children } = $props<{ children: Snippet }>();
</script>

{@render children()}
