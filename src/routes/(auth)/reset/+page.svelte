<script lang="ts">
	import { enhance } from '$app/forms';

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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Email sent to reset your password.</span>
		</div>
	{/if}
</form>
