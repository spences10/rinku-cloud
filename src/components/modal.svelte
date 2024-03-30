<script lang="ts">
	let {
		modal = $bindable(),
		children,
	}: { children: any; modal: HTMLDialogElement } = $props();
</script>

<dialog class="rounded-box max-w-md" bind:this={modal} on:close id="add_link_modal">
	{@render children()}
</dialog>
