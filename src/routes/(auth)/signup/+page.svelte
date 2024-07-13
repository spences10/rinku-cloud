<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Sign up</h1>
<p>
	Or <a href="/login" class="link link-primary">sign in</a> to your account
</p>
<form
	method="POST"
	use:enhance
	class="flex max-w-xl flex-col justify-center gap-4 px-10 py-10 lg:px-16"
>
	<div class="form-control">
		<label for="username" class="label">
			<span class="label-text">Username</span>
		</label>
		<input
			type="text"
			placeholder="username"
			name="username"
			id="username"
			class="input input-bordered"
		/>
	</div>

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

	<div class="form-control">
		<label for="passwordConfirm" class="label">
			<span class="label-text">Password Confirm</span>
		</label>
		<input
			type="passwordConfirm"
			placeholder=""
			name="passwordConfirm"
			id="passwordConfirm"
			class="input input-bordered"
		/>
	</div>

	<div class="form-control">
		<label for="name" class="label">
			<span class="label-text">Your Name</span>
		</label>
		<input
			type="name"
			placeholder=""
			name="name"
			id="name"
			class="input input-bordered"
		/>
	</div>

	<button type="submit" class="btn btn-neutral">Continue</button>
</form>
