<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		id?: string;
		label?: string;
		type?: string;
		disabled?: boolean;
		required?: boolean;
		errors?: string[];
		fontSize?: string;
		inputClasses?: string;
	}

	let {
		value = '',
		placeholder = '',
		id = '',
		label = '',
		type = 'text',
		disabled = false,
		required = false,
		errors = [],
		fontSize = 'text-base',
		inputClasses = '',
	}: Props = $props();
</script>

<div class="form-control mb-2 w-full max-w-lg">
	<label for={id} class="label pb-1 font-medium">
		<span class="label-text {fontSize}">{label}</span>
	</label>
	<input
		class="input w-full max-w-lg rounded-lg shadow-lg {fontSize} {inputClasses}"
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
