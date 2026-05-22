<script lang="ts">
	import { page } from '$app/state';
	import { getModule, getModuleRoute } from '$lib/modules/registry';
	import type { Component } from 'svelte';

	const moduleId = $derived(page.params.moduleId ?? '');
	const rest = $derived(page.params.rest ?? '');

	const manifest = $derived(getModule(moduleId));
	const route = $derived(manifest ? getModuleRoute(manifest, rest) : undefined);

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
</script>

{#if !manifest}
	<div class="text-muted-foreground text-sm">Модуль не найден: {moduleId}</div>
{:else if !route}
	<div class="text-muted-foreground text-sm">
		Страница не найдена в модуле {manifest.name}
	</div>
{:else if resolved}
	{@const C = resolved}
	<C />
{:else if loading}
	<div class="text-muted-foreground text-sm">Загрузка...</div>
{/if}
