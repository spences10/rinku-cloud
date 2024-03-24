<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let url = $state('https://scottspence.com');
	let title = $state('thing');
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form method="POST" action="?/sign_out" use:enhance>
	<button>Sign out</button>
</form>

<form method="POST" action="?/add_link" use:enhance>
	<label for="url">URL:</label>
	<input name="url" bind:value={url} type="url" required />
	<label for="title">Title:</label>
	<input name="title" bind:value={title} type="text" required />
	<button type="submit">Add Link</button>
</form>
