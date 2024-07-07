<script lang="ts">
	import { enhance } from '$app/forms';
	import { Error } from '$lib/icons';

	const { form } = $props();
</script>

<h1>Sign in</h1>
<p>Or <a href="/signup">sign up</a> for an account</p>
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

	<div class="form-control">
		<label for="password" class="label">
			<span class="label-text">Password</span>
		</label>
		<input
			type="password"
			placeholder="🤫"
			name="password"
			id="password"
			class="input input-bordered"
		/>
	</div>

	<p>Forgot your password? <a href="/reset">Reset it</a></p>
	{#if form?.notVerified}
		<div role="alert" class="alert alert-error">
			<Error />
			<span>Verify your email address before signing in.</span>
		</div>
	{/if}
	<button type="submit" class="btn btn-neutral">Sign in</button>
</form>
