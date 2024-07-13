<!-- 
 This code is adapted from https://github.com/agustinl/svelte-tags-input/blob/master/src/Tags.svelte
-->
<script lang="ts">
	import type { TagResponse } from '$lib/types';

	// New type for tags that haven't been saved to the database yet
	type NewTag = {
		id: string;
		name: string;
		isNew: true;
	};

	// Union type for tags that can be either existing or new
	type Tag = TagResponse | NewTag;

	interface Props {
		existing_tags: TagResponse[];
		on_tags_change: (tags: Tag[]) => void;
		placeholder?: string;
		max_tags?: number;
		allow_duplicates?: boolean;
	}

	let {
		existing_tags,
		on_tags_change,
		placeholder = 'Enter tags...',
		max_tags = Infinity,
		allow_duplicates = false,
	}: Props = $props();

	let tags = $state<Tag[]>([]);
	let input_value = $state('');
	let suggestions = $state<TagResponse[]>([]);
	let focused_suggestion_index = $state(-1);

	$effect(() => {
		on_tags_change(tags);
	});

	const add_tag = (tag_name: string) => {
		if (tags.length >= max_tags) return;

		const trimmed_tag = tag_name.trim();
		if (trimmed_tag === '') return;

		if (
			!allow_duplicates &&
			tags.some(
				(tag) => tag.name.toLowerCase() === trimmed_tag.toLowerCase()
			)
		)
			return;

		const existing_tag = existing_tags.find(
			(tag) => tag.name.toLowerCase() === trimmed_tag.toLowerCase()
		);

		if (existing_tag) {
			tags = [...tags, existing_tag];
		} else {
			const new_tag: NewTag = {
				id: crypto.randomUUID(), // Use a UUID for client-side identification
				name: trimmed_tag,
				isNew: true,
			};
			tags = [...tags, new_tag];
		}

		input_value = '';
		suggestions = [];
		focused_suggestion_index = -1;
	};

	const remove_tag = (index: number) => {
		tags = tags.filter((_, i) => i !== index);
	};

	const handle_keydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && input_value) {
			event.preventDefault();
			if (focused_suggestion_index >= 0) {
				add_tag(suggestions[focused_suggestion_index].name);
			} else {
				add_tag(input_value);
			}
		} else if (
			event.key === 'Backspace' &&
			input_value === '' &&
			tags.length > 0
		) {
			remove_tag(tags.length - 1);
		} else if (event.key === 'ArrowDown' && suggestions.length > 0) {
			event.preventDefault();
			focused_suggestion_index =
				(focused_suggestion_index + 1) % suggestions.length;
		} else if (event.key === 'ArrowUp' && suggestions.length > 0) {
			event.preventDefault();
			focused_suggestion_index =
				(focused_suggestion_index - 1 + suggestions.length) %
				suggestions.length;
		}
	};

	const update_suggestions = () => {
		if (input_value.trim() === '') {
			suggestions = [];
			return;
		}
		suggestions = existing_tags.filter(
			(tag) =>
				tag.name.toLowerCase().includes(input_value.toLowerCase()) &&
				!tags.some((selected_tag) => selected_tag.id === tag.id)
		);
		focused_suggestion_index = -1;
	};

	$effect(() => {
		update_suggestions();
	});
</script>

<div class="tag-input-container">
	<div class="tags-container">
		{#each tags as tag, index}
			<span class="tag">
				{tag.name}
				<button
					type="button"
					class="remove-tag"
					onclick={() => remove_tag(index)}>×</button
				>
			</span>
		{/each}
	</div>
	<input
		type="text"
		bind:value={input_value}
		onkeydown={handle_keydown}
		{placeholder}
		class="tag-input"
	/>
	<input
		type="hidden"
		name="tags"
		value={tags
			.map((tag) =>
				'isNew' in tag ? `new:${tag.name}` : `existing:${tag.id}`
			)
			.join(',')}
	/>
	{#if suggestions.length > 0}
		<ul class="suggestions">
			{#each suggestions as suggestion, index}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					class:focused={index === focused_suggestion_index}
					onmousedown={() => add_tag(suggestion.name)}
				>
					{suggestion.name}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	* {
		outline: 1px solid red !important;
	}
	.tag-input-container {
		border: 1px solid #ccc;
		padding: 5px;
		border-radius: 4px;
	}
	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin-bottom: 5px;
	}
	.tag {
		background-color: #e0e0e0;
		padding: 2px 5px;
		border-radius: 3px;
		display: flex;
		align-items: center;
	}
	.remove-tag {
		background: none;
		border: none;
		cursor: pointer;
		margin-left: 5px;
	}
	.tag-input {
		width: 100%;
		border: none;
		outline: none;
		padding: 5px;
	}
	.suggestions {
		list-style-type: none;
		padding: 0;
		margin: 5px 0 0 0;
		border: 1px solid #ccc;
		max-height: 150px;
		overflow-y: auto;
	}
	.suggestions li {
		padding: 5px;
		cursor: pointer;
	}
	.suggestions li.focused {
		background-color: #f0f0f0;
	}
</style>
