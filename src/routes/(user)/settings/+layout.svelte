<script lang="ts">
	import { page } from '$app/stores';

	const { children } = $props();
	let links = [
		{ href: `/settings/profile`, title: `Profile` },
		{ href: `/settings/account`, title: `Account` },
		{ href: `/settings/security`, title: `Security` },
	];
</script>

<div class="prose-xl h-full w-full">
	<h2>Account Settings</h2>
	<div class="divider"></div>
</div>
<div class="flex h-full w-full space-x-4">
	<ul class="menu w-60 rounded-box bg-base-100 px-2">
		{#each links as { href, title }}
			<li>
				<a
					{href}
					class="font-medium {$page.url.pathname === href
						? `active`
						: ``}"
				>
					{title}
				</a>
			</li>
		{/each}
	</ul>
	<div class="w-full">
		{@render children()}
	</div>
</div>
