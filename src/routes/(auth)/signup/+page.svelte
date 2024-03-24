<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Sign up</h1>
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
			placeholder=""
			name="username"
			id="username"
			class="input input-bordered"
		/>
	</div>
	<div class="form-control">
		<label for="password" class="label">
			<span class="label-text">Password</span>
		</label>
		<input
			type="password"
			placeholder=""
			name="password"
			id="password"
			class="input input-bordered"
		/>
	</div>
	<button type="submit" class="btn btn-neutral">Continue</button>
</form>
