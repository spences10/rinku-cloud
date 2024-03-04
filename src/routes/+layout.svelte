<script lang="ts">
	import { browser } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import * as Fathom from 'fathom-client';
	import type { Snippet } from 'svelte';
	import '../app.pcss';

	const { PUBLIC_FATHOM_ID, PUBLIC_FATHOM_URL } = env;

	let { children } = $props<{ children: Snippet }>();

	$effect(() => {
		if (browser) {
			Fathom.load(PUBLIC_FATHOM_ID, {
				url: PUBLIC_FATHOM_URL,
			});
		}
	});

	// Track pageview on route change
	$effect(() => {
		$page.url.pathname, browser && Fathom.trackPageview();
	});

	onNavigate((navigation) => {
		// sorry Firefox and Safari users
		if (!(document as any).startViewTransition) return;

		return new Promise((resolve) => {
			(document as any).startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{@render children()}
