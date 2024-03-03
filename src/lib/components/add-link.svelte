<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../routes/api/add-link/$types';
	import Input from './input.svelte';

	let { form } = $props<{ form: ActionData }>();
</script>

<form
	method="POST"
	action="/api/add-link?/submit_link"
	use:enhance={() => {
		return ({ update, result }) => {
			console.log('=====================');
			console.log(result);
			console.log('=====================');
			update({ reset: false });
		};
	}}
>
	<Input
		id="url"
		type="text"
		label="URL"
		placeholder="sveltebits.com"
		value={form?.data?.url}
		errors={form?.errors?.url}
	/>
	<Input
		id="tags"
		type="text"
		label="Tags"
		value={form?.data?.tags}
		errors={form?.errors?.tags}
	/>

	<label for="summary" class="label pb-1 font-medium">
		<span class="label-text text-base">Summary:</span>
	</label>
	<textarea id="summary" name="summary" class="textarea mb-2" />

	<input type="submit" value="Submit" name="submit_link" />
</form>
