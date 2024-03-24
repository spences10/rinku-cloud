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
			class="input input-bordered"
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
			class="input input-bordered"
		/>
	</div>
	<button type="submit" class="btn btn-neutral">Add Link</button>
</form>
