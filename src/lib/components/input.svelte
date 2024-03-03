<script lang="ts">
	let {
		id = '',
		label,
		type = 'text',
		placeholder = '',
		required = false,
		disabled = false,
		value = '',
		errors = [] as string[],
		font_size = 'text-base',
		input_classes = '',
	} = $props();
</script>

<div class="form-control mb-2 w-full max-w-lg">
	<label for={id} class="label pb-1 font-medium">
		<span class="label-text {font_size}">{label}</span>
	</label>
	<input
		class="input w-full max-w-lg rounded-lg shadow-lg {font_size} {input_classes}"
		{type}
		{id}
		{placeholder}
		{required}
		{disabled}
		name={id}
		{value}
	/>
	{#if errors}
		{#each errors as error}
			<label for={id} class="label pb-0">
				<span class="label-text-alt text-warning">{error}</span>
			</label>
		{/each}
	{/if}
</div>
