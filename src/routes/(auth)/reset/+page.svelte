<script lang="ts">
	import { enhance } from '$app/forms';
	import { Success } from '$lib/icons';

	const { form } = $props();
</script>

<h1>Password Reset</h1>
<p>Or <a href="/login">sign in</a> to your account</p>
<form
	method="POST"
	use:enhance
	class="flex max-w-xl flex-col justify-center gap-4 px-10 py-10 lg:px-16"
>
	<div class="form-control">
		<label for="email" class="label">
			<span class="label-text">Email</span>
		</label>
		<input
			type="email"
			placeholder="me@example.com"
			name="email"
			id="email"
			class="input input-bordered"
		/>
	</div>

	<button type="submit" class="btn btn-neutral">Request Reset</button>
	{#if form?.success}
		<div role="alert" class="alert alert-success">
			<Success />
			<span>Email sent to reset your password.</span>
		</div>
	{/if}
</form>
