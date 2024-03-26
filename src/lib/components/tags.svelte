<script lang="ts">
	import { enhance } from '$app/forms';
	import { selected_tags_store } from '$lib/stores.svelte';

	import type { Row } from '@libsql/client';

	interface Props {
		tags: Row[];
	}

	let { tags }: Props = $props();

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

	const add_tag = (tag: { id: number; name: string }) => {
		selected_items = [...selected_items, tag].filter(
			(item, index, self) =>
				index === self.findIndex((t) => t.id === item.id)
		);
		focused_index = -1;
		$selected_tags_store = selected_items;
	};

	const remove_tag = (id: number) => {
		selected_items = selected_items.filter((item) => item.id !== id);
		$selected_tags_store = selected_items;
	};

	const key_handlers = {
		ArrowDown: () => {
			focused_index = Math.min(
				focused_index + 1,
				filtered_tags.length - 1
			);
		},
		ArrowUp: () => {
			focused_index = Math.max(focused_index - 1, 0);
		},
		Enter: () => {
			if (filtered_tags[focused_index]) {
				add_tag(
					filtered_tags[focused_index] as unknown as {
						id: number;
						name: string;
					}
				);
			}
		}
	};

	const handle_keydown = (event: KeyboardEvent) => {
		if (!input_focused) return;

		const handler =
			key_handlers[event.key as keyof typeof key_handlers];
		if (handler) {
			handler();
		}
	};
</script>

<!-- when clicked into show list of items -->
<div
	class="relative block rounded-btn border border-primary p-[11px] align-top"
>
	<!-- hidden multi select with selected values added -->
	<select multiple class="hidden">
		{#each selected_items as item, index}
			<option value={item.id} class=""> {item.name} </option>
		{/each}
	</select>
	<!-- tags displayed -->
	<div class="flex flex-wrap place-items-center">
		{#each selected_items as item, index}
			<div draggable="true" class="" style="">
				<div
					class="badge badge-primary mb-0 mr-1 flex justify-between"
				>
					<span class="mb-1 mt-1 flex-grow pr-1">{item.name}</span>
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
		<form
			method="POST"
			action="/api/add-tag?add_tag"
			use:enhance={({
				formElement,
				formData,
				action,
				cancel,
				submitter
			}) => {
				// `formElement` is this `<form>` element
				// `formData` is its `FormData` object that's about to be submitted
				// `action` is the URL to which the form is posted
				// calling `cancel()` will prevent the submission
				// `submitter` is the `HTMLElement` that caused the form to be submitted

				return async ({ result, update }) => {
					// `result` is an `ActionResult` object
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
					update({ reset: true });
				};
			}}
		>
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
				onkeydown={handle_keydown}
			/>
		</form>
		<!-- clear currnet selection -->
		<!-- <span class="">&times;</span> -->
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
						: ''} {selected_items.some((item) => item.id === tag.id)
						? 'bg-secondary text-secondary-content'
						: ''}"
					on:click={() => add_tag(tag as unknown as { id: number; name: string })}
					on:keydown={handle_keydown}
					tabindex={index === focused_index ? 0 : -1}
				>
					{tag.name}
				</button>
			{/each}
		</div>
	{/if}
</div>
