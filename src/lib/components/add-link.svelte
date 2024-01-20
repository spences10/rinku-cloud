<script lang="ts">
	import { enhance } from '$app/forms';
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
	<label for="url">URL:</label><br />
	<input type="text" id="url" name="url" /><br />
	<label for="tags">Tags (separated by commas):</label><br />
	<input type="text" id="tags" name="tags" /><br />
	<label for="summary">Summary:</label><br />
	<textarea id="summary" name="summary"></textarea><br />
	<input type="submit" value="Submit" name="submit_link" />
</form>
