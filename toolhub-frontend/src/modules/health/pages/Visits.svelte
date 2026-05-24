<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { healthStore } from '../store.svelte';
	import {
		SPECIALTY_LABELS,
		SPECIALTY_ICONS,
		type MedSpecialty,
		type MedVisit
	} from '../types';
	import AddVisitDialog from '../components/AddVisitDialog.svelte';

	let dialogOpen = $state(false);
	let editingVisit = $state<MedVisit | undefined>(undefined);
	let expandedId = $state<string | null>(null);
	let query = $state('');
	let specialtyFilter = $state<MedSpecialty | null>(null);

	const specialties = $derived.by(() => {
		const set = new Set(healthStore.visits.map((v) => v.specialty));
		return [...set] as MedSpecialty[];
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return [...healthStore.visits]
			.sort((a, b) => b.date.localeCompare(a.date))
			.filter((v) => {
				if (specialtyFilter && v.specialty !== specialtyFilter) return false;
				if (!q) return true;
				return (
					v.diagnosis?.toLowerCase().includes(q) ||
					v.clinic?.toLowerCase().includes(q) ||
					v.doctor?.toLowerCase().includes(q) ||
					v.complaint?.toLowerCase().includes(q) ||
					SPECIALTY_LABELS[v.specialty].toLowerCase().includes(q)
				);
			});
	});

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
	<div class="flex flex-col gap-3">
		<div class="flex items-center gap-3">
			<Input placeholder="Поиск по диагнозу, врачу, клинике…" bind:value={query} class="flex-1" />
			<Button onclick={openAdd}>
				<Plus class="size-4" />
				Новый визит
			</Button>
		</div>
		{#if specialties.length > 0}
			<div class="flex flex-wrap gap-1.5">
				{#each specialties as s (s)}
					<Button
						type="button"
						variant={specialtyFilter === s ? 'default' : 'outline'}
						size="sm"
						onclick={() => (specialtyFilter = specialtyFilter === s ? null : s)}
					>
						{SPECIALTY_ICONS[s]} {SPECIALTY_LABELS[s]}
					</Button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		{#each filtered as visit (visit.id)}
			{@const expanded = expandedId === visit.id}
			<div class="bg-card rounded-lg border">
				<!-- Summary row -->
				<button
					type="button"
					onclick={() => (expandedId = expanded ? null : visit.id)}
					class="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors rounded-lg"
				>
					<span class="text-2xl">{SPECIALTY_ICONS[visit.specialty]}</span>
					<div class="flex flex-1 flex-col gap-0.5 min-w-0">
						<div class="flex items-center gap-2 flex-wrap">
							<span class="font-medium">{SPECIALTY_LABELS[visit.specialty]}</span>
							{#if visit.clinic}
								<span class="text-muted-foreground text-sm">{visit.clinic}</span>
							{/if}
							{#if visit.doctor}
								<span class="text-muted-foreground text-sm">· {visit.doctor}</span>
							{/if}
						</div>
						{#if visit.diagnosis}
							<span class="text-sm text-muted-foreground truncate">{visit.diagnosis}</span>
						{/if}
					</div>
					<div class="flex items-center gap-3 shrink-0">
						{#if visit.cost}
							<span class="text-sm font-medium whitespace-nowrap">{visit.cost.toLocaleString('ru-RU')} ₽</span>
						{/if}
						<span class="text-sm text-muted-foreground whitespace-nowrap">{formatDate(visit.date)}</span>
						<ChevronDown class="size-4 text-muted-foreground transition-transform {expanded ? 'rotate-180' : ''}" />
					</div>
				</button>

				<!-- Expanded details -->
				{#if expanded}
					<div class="border-t px-4 pb-4 pt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
						{#if visit.complaint}
							<div>
								<div class="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Жалоба</div>
								<div class="text-sm">{visit.complaint}</div>
							</div>
						{/if}
						{#if visit.diagnosis}
							<div>
								<div class="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Диагноз</div>
								<div class="text-sm">{visit.diagnosis}</div>
							</div>
						{/if}
						{#if visit.prescription}
							<div>
								<div class="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Назначение</div>
								<div class="text-sm">{visit.prescription}</div>
							</div>
						{/if}
						{#if visit.notes}
							<div>
								<div class="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Заметки</div>
								<div class="text-sm">{visit.notes}</div>
							</div>
						{/if}
						<div class="sm:col-span-2 flex justify-end">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'sm' })}>
									<MoreHorizontal class="size-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onSelect={() => openEdit(visit)}>Редактировать</DropdownMenu.Item>
									<DropdownMenu.Item onSelect={() => healthStore.removeVisit(visit.id)}>Удалить</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-muted-foreground rounded-lg border border-dashed py-12 text-center text-sm">
				Визитов не найдено
			</div>
		{/each}
	</div>
</div>

<AddVisitDialog bind:open={dialogOpen} visit={editingVisit} />
