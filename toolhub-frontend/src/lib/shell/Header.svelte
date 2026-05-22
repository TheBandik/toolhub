<script lang="ts">
	import { page } from '$app/state';
	import { allNavItems } from './nav';
	import ThemeToggle from './ThemeToggle.svelte';
	import CommandPalette from './CommandPalette.svelte';

	const currentTitle = $derived(
		allNavItems.find((i) =>
			i.href === '/dashboard' ? page.url.pathname === '/dashboard' : page.url.pathname.startsWith(i.href)
		)?.label ?? 'Toolhub'
	);
</script>

<header class="bg-background flex h-14 shrink-0 items-center justify-between border-b px-6">
	<h1 class="text-base font-semibold">{currentTitle}</h1>
	<div class="flex items-center gap-2">
		<CommandPalette />
		<ThemeToggle />
	</div>
</header>
