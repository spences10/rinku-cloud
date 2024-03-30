<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Row } from '@libsql/client';
	import Modal from '../components/modal.svelte';
	import AddLink from './add-link/+page.svelte';

	let { data } = $props();

	const links: Row[] = data.links;

	let search_query = $state('');

	let filtered_links = $derived.by(() => {
		if (!search_query) return links;
		return links.filter(
			(link) =>
				(link.title as string)
					?.toLowerCase()
					.includes(search_query.toLowerCase()) ||
				(link.tags &&
					(link.tags as string)
						.split(',')
						.some((tag) =>
							tag.toLowerCase().includes(search_query.toLowerCase())
						)) ||
				(link.url as string)
					?.toLowerCase()
					.includes(search_query.toLowerCase()) ||
				(typeof link.created_at === 'number' &&
					new Date(link.created_at)
						.toLocaleDateString()
						.includes(search_query))
		);
	});

	const show_modal = async () => {
		// get url
		const href = '/add-link';

		// get result of load function
		const result = await preloadData(href);

		// Type guard to check if the result is of type "loaded"
		if (result.type === 'loaded') {
			const dataToPush = {
				tags: result.data.tags,
				user: result.data.user,
			};
			// create history entry
			pushState(href, { selected: dataToPush });
			modal.showModal();
		} else {
			goto(href);
		}
	};

	let modal = $state() as HTMLDialogElement;

	const close_modal = () => {
		history.back();
		modal.close();
	};
</script>

<Modal bind:modal on:close={close_modal}>
	{#if $page.state.selected}
		<AddLink data={$page.state.selected} />
	{/if}
</Modal>

<h1>Hi, {data.user.username}!</h1>

<p>Your user ID is {data.user.id}.</p>

<form method="POST" action="?/sign_out" use:enhance>
	<button>Sign out</button>
</form>

<div class="flex justify-center">
	<a
		href="/add-link"
		class="btn btn-primary mb-20 shadow-lg"
		on:click|preventDefault={show_modal}
	>
		✨ Add a link ✨
	</a>
</div>

<div class="mb-4 flex justify-center">
	<input
		type="text"
		placeholder="Search..."
		bind:value={search_query}
		class="rounded-md border border-gray-300 p-2"
	/>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th>Title</th>
				<th>Tags</th>
				<th>URL</th>
				<th>Created At</th>
			</tr>
		</thead>
		<tbody>
			{#each filtered_links as link, index}
				<tr class:hover={'bg-base-200'}>
					<td>{link.title}</td>
					<td>
						{#if typeof link.tags === 'string'}
							{#each link.tags.split(',') as tag}
								<span
									class="badge badge-primary mr-2 cursor-pointer text-primary-content shadow-md transition hover:bg-accent hover:text-secondary-content"
								>
									{tag}
								</span>
							{/each}
						{:else}
							<span>No tags</span>
						{/if}
					</td>
					<td>
						<a href={link.url as string} class="link link-primary">
							{link.url as string}
						</a>
					</td>
					<td>
						{typeof link.created_at === 'number'
							? new Date(link.created_at).toLocaleDateString()
							: ''}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
