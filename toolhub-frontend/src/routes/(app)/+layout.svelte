<script lang="ts">
	import Sidebar from '$lib/shell/Sidebar.svelte';
	import Header from '$lib/shell/Header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen">
	<Sidebar />
	<div class="flex min-w-0 flex-1 flex-col">
		<Header />
		<main class="flex-1 overflow-y-auto p-6">
			{@render children()}
		</main>
	</div>
</div>
