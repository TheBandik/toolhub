<script lang="ts">
	import { page } from '$app/state';
	import { allNavItems } from './nav';
	import { sidebarState } from './sidebar-state.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import CommandPalette from './CommandPalette.svelte';
	import Menu from '@lucide/svelte/icons/menu';

	const currentTitle = $derived(
		allNavItems.find((i) =>
			i.href === '/dashboard' ? page.url.pathname === '/dashboard' : page.url.pathname.startsWith(i.href)
		)?.label ?? 'Toolhub'
	);
</script>

<header
	class="bg-background sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 sm:px-6"
>
	<div class="flex min-w-0 items-center gap-2">
		<button
			type="button"
			class="hover:bg-muted rounded-md p-1.5 md:hidden"
			aria-label="Открыть меню"
			onclick={() => sidebarState.toggle()}
		>
			<Menu class="size-5" />
		</button>
		<h1 class="truncate text-base font-semibold">{currentTitle}</h1>
	</div>
	<div class="flex shrink-0 items-center gap-2">
		<CommandPalette />
		<ThemeToggle />
	</div>
</header>
