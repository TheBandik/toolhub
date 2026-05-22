<script lang="ts">
	import { page } from '$app/state';
	import { navSections, navFooter } from './nav';
	import { cn } from '$lib/utils';
	import Boxes from '@lucide/svelte/icons/boxes';

	function isActive(href: string) {
		if (href === '/dashboard') return page.url.pathname === '/dashboard';
		return page.url.pathname.startsWith(href);
	}
</script>

<aside
	class="bg-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r"
>
	<div class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
		<Boxes class="text-sidebar-primary size-5" />
		<span class="font-semibold tracking-tight">Toolhub</span>
	</div>

	<nav class="flex-1 overflow-y-auto px-2 py-3">
		{#each navSections as section, idx (section.heading ?? section.items[0].href)}
			<div class={cn('flex flex-col gap-0.5', idx > 0 && 'mt-4')}>
				{#if section.heading}
					<div
						class="text-sidebar-foreground/50 mb-1 px-2 text-xs font-medium tracking-wider uppercase"
					>
						{section.heading}
					</div>
				{/if}
				{#each section.items as item (item.href)}
					{@const Icon = item.icon}
					{@const active = isActive(item.href)}
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
				{/each}
			</div>
		{/each}
	</nav>

	<div class="border-sidebar-border flex flex-col gap-0.5 border-t px-2 py-3">
		{#each navFooter as item (item.href)}
			{@const Icon = item.icon}
			{@const active = isActive(item.href)}
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
		{/each}
	</div>

	<div class="text-sidebar-foreground/40 border-sidebar-border border-t px-4 py-2 text-xs">
		v0.0.1
	</div>
</aside>
