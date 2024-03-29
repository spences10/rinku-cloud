<script lang="ts">
	import { enhance } from '$app/forms';
	import { writable } from 'svelte/store';

	let { data } = $props();

	const { tags } = data;

	export const selected_tags_store = writable<
		{ id: number; name: string }[]
	>([]);

	let url = $state('https://scottspence.com');
	let title = $state('thing');

	let input_focused = $state(false);
	let focused_index = $state(-1);
	let search_query = $state('');
	let selected_items = $state<{ id: number; name: string }[]>([]);

	let filtered_tags = $derived.by(() => {
		if (!search_query) return tags;
		return tags.filter((tag) =>
			(tag.name as string)
				?.toLowerCase()
				.includes(search_query.toLowerCase())
		);
	});

	const handle_focus = () => (input_focused = true);
	const handle_blur = () => {
		setTimeout(() => {
			input_focused = false;
		}, 200);
	};

	const generate_unique_id = () => {
		return Math.random();
	};

	const add_tag = (tag: { id: number; name: string }) => {
		const current_tags = $selected_tags_store;
		const is_tag_in_store = current_tags.some(
			(item) => item.id === tag.id
		);

		if (!is_tag_in_store) {
			$selected_tags_store = [...current_tags, tag];
		}

		selected_items = [...selected_items, tag].filter(
			(item, index, self) =>
				index === self.findIndex((t) => t.id === item.id)
		);
		focused_index = -1;
	};

	const remove_tag = (id: number) => {
		selected_items = selected_items.filter((item) => item.id !== id);
		$selected_tags_store = selected_items;
	};
</script>

<form
	method="POST"
	action="?/add_link"
	use:enhance
	class="flex max-w-xl flex-col justify-center gap-4 px-10 py-10 lg:px-16"
>
	<div class="form-control">
		<label for="url" class="label">
			<span class="label-text">URL</span>
		</label>
		<input
			name="url"
			bind:value={url}
			type="url"
			required
			class="input input-primary"
		/>
	</div>
	<div class="form-control">
		<label for="title" class="label">
			<span class="label-text">Title</span>
		</label>
		<input
			name="title"
			bind:value={title}
			type="text"
			required
			class="input input-primary"
		/>
	</div>
	<div class="form-control">
		<label for="title" class="label">
			<span class="label-text">Tags</span>
		</label>
		<div
			class="relative block rounded-btn border border-primary p-[11px] align-top"
		>
			<!-- tags displayed -->
			<div class="flex flex-wrap place-items-center">
				{#each selected_items as item, index}
					<div draggable="true" class="" style="">
						<div
							class="badge badge-primary mb-0 mr-1 flex justify-between"
						>
							<span class="mb-1 mt-1 flex-grow pr-1">{item.name}</span
							>
							<button
								class="cursor-pointer pb-2 text-xs hover:text-warning"
								onclick={() => remove_tag(item.id)}
								tabindex="0"
							>
								&times;
							</button>
						</div>
					</div>
				{/each}
				<!-- input for the next item selection -->
				<input
					type="text"
					class="w-20 bg-base-100 outline-0"
					id=""
					name="tag"
					autocomplete="off"
					tabindex="0"
					bind:value={search_query}
					onfocus={handle_focus}
					onblur={handle_blur}
					onkeydown={(event) => {
						if (event.key === 'Enter') {
							event.preventDefault();
							// Generate a temporary ID for the tag
							const temp_id = generate_unique_id();
							add_tag({ id: temp_id, name: search_query });
							// Clear the search_query after adding the tag
							search_query = '';
						}
					}}
				/>
				<!-- clear currnet selection -->
				<span class="">&times;</span>
			</div>
			<!-- list of available items -->
			{#if input_focused}
				<div
					class="relative max-h-56 w-full overflow-auto"
					style="top: 0px;"
				>
					{#each filtered_tags as tag, index}
						<button
							class="w-full text-left hover:bg-secondary hover:text-secondary-content {index ===
							focused_index
								? 'bg-secondary text-secondary-content'
								: ''} {selected_items.some(
								(item) => item.id === tag.id
							)
								? 'bg-secondary text-secondary-content'
								: ''}"
							onclick={() => add_tag(tag as unknown as { id: number; name: string })}
							tabindex={index === focused_index ? 0 : -1}
						>
							{tag.name}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		<!-- hidden multi select with selected values added -->
		<select multiple class="hidden" name="selected_tags">
			{#each $selected_tags_store as item, index}
				<option value={item.name} selected class="">
					{item.name}
				</option>
			{/each}
		</select>
	</div>
	<button type="submit" class="btn btn-primary">Add Link</button>
</form>
