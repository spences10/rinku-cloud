<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<form action="/logout" method="POST">
	<button type="submit">Logout</button>
</form>
<main class="">
	{@render children()}
</main>
