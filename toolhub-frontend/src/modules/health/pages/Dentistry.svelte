<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import { healthStore } from '../store.svelte';
	import { TOOTH_STATUS_LABELS, type ToothRecord } from '../types';
	import ToothChart from '../components/ToothChart.svelte';
	import AddVisitDialog from '../components/AddVisitDialog.svelte';
	import type { MedVisit } from '../types';

	let dialogOpen = $state(false);
	let editingVisit = $state<MedVisit | undefined>(undefined);

	const dentalVisits = $derived(
		[...healthStore.visits]
			.filter((v) => v.specialty === 'dentist')
			.sort((a, b) => b.date.localeCompare(a.date))
	);

	// Tooth stats
	const stats = $derived.by(() => {
		const counts: Record<string, number> = {};
		for (const rec of Object.values(healthStore.teeth)) {
			counts[rec.status] = (counts[rec.status] ?? 0) + 1;
		}
		return counts;
	});

	const totalCost = $derived(
		dentalVisits.reduce((acc, v) => acc + (v.cost ?? 0), 0)
	);

	function handleToothChange(id: number, rec: ToothRecord) {
		healthStore.setTooth(id, rec);
	}

	function openAdd() {
		editingVisit = undefined;
		dialogOpen = true;
	}

	function openEdit(v: MedVisit) {
		editingVisit = v;
		dialogOpen = true;
	}

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
	}
</script>

<div class="flex flex-col gap-6">
	<!-- Stats row -->
	<div class="flex flex-wrap gap-3">
		{#each Object.entries(stats) as [status, count] (status)}
			<div class="bg-card flex items-center gap-2 rounded-lg border px-3 py-2">
				<span class="text-lg font-bold">{count}</span>
				<span class="text-muted-foreground text-sm">{TOOTH_STATUS_LABELS[status as keyof typeof TOOTH_STATUS_LABELS]}</span>
			</div>
		{/each}
		{#if totalCost > 0}
			<div class="bg-card flex items-center gap-2 rounded-lg border px-3 py-2">
				<span class="text-lg font-bold">{totalCost.toLocaleString('ru-RU')} ₽</span>
				<span class="text-muted-foreground text-sm">потрачено</span>
			</div>
		{/if}
	</div>

	<!-- Tooth chart -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Карта зубов</Card.Title>
			<Card.Description>Кликните по зубу, чтобы изменить статус</Card.Description>
		</Card.Header>
		<Card.Content>
			<ToothChart teeth={healthStore.teeth} onchange={handleToothChange} />
		</Card.Content>
	</Card.Root>

	<!-- Dental visits -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<div>
					<Card.Title>Дневник лечения</Card.Title>
					<Card.Description>Все визиты к стоматологу</Card.Description>
				</div>
				<Button size="sm" onclick={openAdd}>
					<Plus class="size-4" />
					Новый визит
				</Button>
			</div>
		</Card.Header>
		<Card.Content>
			{#if dentalVisits.length === 0}
				<div class="text-muted-foreground py-8 text-center text-sm">
					Визитов к стоматологу пока нет
				</div>
			{:else}
				<div class="flex flex-col divide-y">
					{#each dentalVisits as visit (visit.id)}
						<div class="flex items-start gap-3 py-3">
							<div class="flex flex-1 flex-col gap-0.5">
								<div class="flex items-center gap-2">
									<span class="text-sm font-medium">{formatDate(visit.date)}</span>
									{#if visit.clinic}
										<span class="text-muted-foreground text-xs">{visit.clinic}</span>
									{/if}
									{#if visit.doctor}
										<span class="text-muted-foreground text-xs">· {visit.doctor}</span>
									{/if}
								</div>
								{#if visit.diagnosis}
									<span class="text-sm">{visit.diagnosis}</span>
								{/if}
								{#if visit.prescription}
									<span class="text-muted-foreground text-xs">{visit.prescription}</span>
								{/if}
							</div>
							<div class="flex items-center gap-2 shrink-0">
								{#if visit.cost}
									<span class="text-sm font-medium">{visit.cost.toLocaleString('ru-RU')} ₽</span>
								{/if}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
										<MoreHorizontal class="size-4" />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Item onSelect={() => openEdit(visit)}>Редактировать</DropdownMenu.Item>
										<DropdownMenu.Item onSelect={() => healthStore.removeVisit(visit.id)}>Удалить</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<AddVisitDialog bind:open={dialogOpen} visit={editingVisit} />
