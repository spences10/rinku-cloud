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
		inputClasses = ''
	}: Props = $props();
</script>

<div class="form-control w-full max-w-lg mb-2">
	<label for={id} class="label font-medium pb-1">
		<span class="label-text {fontSize}">{label}</span>
	</label>
	<input
		class="input rounded-lg w-full max-w-lg shadow-lg {fontSize} {inputClasses}"
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