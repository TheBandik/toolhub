<script lang="ts">
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import Check from '@lucide/svelte/icons/check';
	import { moduleRegistry } from '$lib/modules/registry';
	import { dashboardStore } from './store.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	// Flatten all widgets from all modules
	const allWidgets = $derived(
		moduleRegistry.flatMap((m) => (m.widgets ?? []).map((w) => ({ ...w, moduleId: m.id })))
	);

	// Widgets grouped by module for the dialog
	const widgetsByModule = $derived(
		moduleRegistry
			.filter((m) => m.widgets?.length)
			.map((m) => ({ manifest: m, widgets: m.widgets! }))
	);

	// Selected widget definitions in order
	const selectedDefs = $derived(
		dashboardStore.selected
			.map((id) => allWidgets.find((w) => w.id === id))
			.filter((w) => w !== undefined)
	);

	let customizing = $state(false);
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center gap-3">
		<LayoutDashboard class="text-muted-foreground size-6" />
		<h2 class="text-2xl font-semibold tracking-tight">Дашборд</h2>
		<div class="ml-auto">
			<Button variant="outline" size="sm" onclick={() => (customizing = true)}>
				<Settings2 class="mr-2 size-4" />
				Настроить
			</Button>
		</div>
	</div>

	{#if selectedDefs.length === 0}
		<div
			class="text-muted-foreground flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm"
		>
			<p>Нет выбранных виджетов.</p>
			<Button variant="outline" size="sm" onclick={() => (customizing = true)}>
				<Settings2 class="mr-2 size-4" />
				Настроить дашборд
			</Button>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each selectedDefs as widget (widget.id)}
				{#await widget.component()}
					<div class="bg-card h-24 animate-pulse rounded-lg border"></div>
				{:then mod}
					{@const Cmp = mod.default}
					<Cmp />
				{/await}
			{/each}
		</div>
	{/if}
</div>

<Dialog.Root bind:open={customizing}>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Настроить дашборд</Dialog.Title>
			<Dialog.Description>Выберите показатели, которые хотите видеть.</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-5 py-2">
			{#each widgetsByModule as { manifest, widgets }}
				{@const ModIcon = manifest.icon}
				<div class="flex flex-col gap-1.5">
					<div class="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
						<ModIcon class="size-3.5" />
						{manifest.name}
					</div>
					<div class="flex flex-col">
						{#each widgets as w (w.id)}
							{@const selected = dashboardStore.isSelected(w.id)}
							<button
								type="button"
								onclick={() => dashboardStore.toggle(w.id)}
								class="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
							>
								<span
									class="flex size-4 shrink-0 items-center justify-center rounded border transition-colors {selected
										? 'bg-primary border-primary text-primary-foreground'
										: 'border-input'}"
								>
									{#if selected}
										<Check class="size-3" />
									{/if}
								</span>
								{w.label}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
