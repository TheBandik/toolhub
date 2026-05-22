<script lang="ts">
	import { page } from '$app/state';
	import { getModule, getModuleRoute } from '$lib/modules/registry';
	import { cn } from '$lib/utils';
	import type { Component } from 'svelte';

	const moduleId = $derived(page.params.moduleId ?? '');
	const rest = $derived(page.params.rest ?? '');

	const manifest = $derived(getModule(moduleId));
	const route = $derived(manifest ? getModuleRoute(manifest, rest) : undefined);
	const ModuleIcon = $derived(manifest?.icon);

	let resolved = $state<Component | null>(null);
	let loading = $state(false);

	$effect(() => {
		const current = route;
		if (!current) {
			resolved = null;
			return;
		}
		loading = true;
		current.component().then((mod) => {
			resolved = mod.default;
			loading = false;
		});
	});

	function hrefFor(path: string): string {
		if (!manifest) return '';
		const sub = path === '/' ? '' : path;
		return `/modules/${manifest.id}${sub}`;
	}
</script>

{#if !manifest}
	<div class="text-muted-foreground text-sm">Модуль не найден: {moduleId}</div>
{:else if !route}
	<div class="text-muted-foreground text-sm">
		Страница не найдена в модуле {manifest.name}
	</div>
{:else}
	<div class="flex flex-col gap-6">
		<div class="flex items-center gap-3">
			{#if ModuleIcon}
				<ModuleIcon class="text-muted-foreground size-6" />
			{/if}
			<h2 class="text-2xl font-semibold tracking-tight">{manifest.name}</h2>
		</div>

		{#if manifest.routes.length > 1}
			<div class="flex gap-1 border-b">
				{#each manifest.routes as r (r.path)}
					{#if r.label}
						<a
							href={hrefFor(r.path)}
							class={cn(
								'-mb-px border-b-2 px-3 py-2 text-sm transition-colors',
								route.path === r.path
									? 'border-foreground text-foreground'
									: 'text-muted-foreground hover:text-foreground border-transparent'
							)}
						>
							{r.label}
						</a>
					{/if}
				{/each}
			</div>
		{/if}

		{#if resolved}
			{@const C = resolved}
			<C />
		{:else if loading}
			<div class="text-muted-foreground text-sm">Загрузка...</div>
		{/if}
	</div>
{/if}
