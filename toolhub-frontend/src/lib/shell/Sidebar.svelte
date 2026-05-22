<script lang="ts">
	import { page } from '$app/state';
	import { navSections } from './nav';
	import { cn } from '$lib/utils';
	import Boxes from '@lucide/svelte/icons/boxes';

	function isActive(href: string) {
		if (href === '/dashboard') return page.url.pathname === '/dashboard';
		return page.url.pathname.startsWith(href);
	}
</script>

<aside
	class="bg-sidebar text-sidebar-foreground border-sidebar-border flex h-screen w-60 shrink-0 flex-col border-r"
>
	<div class="flex h-14 items-center gap-2 px-4">
		<Boxes class="text-sidebar-primary size-5" />
		<span class="font-semibold tracking-tight">Toolhub</span>
	</div>

	<nav class="flex-1 overflow-y-auto px-2 py-2">
		{#each navSections as section (section.heading ?? section.items[0].href)}
			{#if section.heading}
				<div
					class="text-sidebar-foreground/50 mt-4 mb-1 px-2 text-xs font-medium uppercase tracking-wider"
				>
					{section.heading}
				</div>
			{/if}
			<ul class="flex flex-col gap-0.5">
				{#each section.items as item (item.href)}
					{@const Icon = item.icon}
					{@const active = isActive(item.href)}
					<li>
						<a
							href={item.href}
							class={cn(
								'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
								active
									? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
									: 'hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
							)}
						>
							<Icon class="size-4" />
							<span>{item.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/each}
	</nav>

	<div class="text-sidebar-foreground/40 border-sidebar-border border-t px-4 py-3 text-xs">
		v0.0.1
	</div>
</aside>
