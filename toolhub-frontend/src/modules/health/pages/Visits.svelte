<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { healthStore } from '../store.svelte';
	import {
		SPECIALTY_LABELS,
		SPECIALTY_ICONS,
		type MedSpecialty,
		type MedVisit,
		type ToothRecord
	} from '../types';
	import AddVisitDialog from '../components/AddVisitDialog.svelte';
	import ToothChart from '../components/ToothChart.svelte';

	let dialogOpen = $state(false);
	let editingVisit = $state<MedVisit | undefined>(undefined);
	let expandedId = $state<string | null>(null);

	// Specialties that already have visits, sorted by last visit date
	const usedSpecialties = $derived.by(() => {
		const map = new Map<MedSpecialty, string>(); // specialty → last date
		for (const v of healthStore.visits) {
			const cur = map.get(v.specialty);
			if (!cur || v.date > cur) map.set(v.specialty, v.date);
		}
		return [...map.entries()]
			.sort((a, b) => b[1].localeCompare(a[1]))
			.map(([s]) => s);
	});

	// All specialties (used first, then the rest)
	const allSpecialties = $derived.by(() => {
		const all = Object.keys(SPECIALTY_LABELS) as MedSpecialty[];
		const used = new Set(usedSpecialties);
		return [...usedSpecialties, ...all.filter((s) => !used.has(s))];
	});

	// Currently selected specialty
	let selected = $state<MedSpecialty | null>(null);
	const activeSpecialty = $derived(selected ?? usedSpecialties[0] ?? 'therapist');

	// Visits for the active specialty, sorted newest first
	const specialtyVisits = $derived(
		[...healthStore.visits]
			.filter((v) => v.specialty === activeSpecialty)
			.sort((a, b) => b.date.localeCompare(a.date))
	);

	// Count per specialty
	function countFor(s: MedSpecialty) {
		return healthStore.visits.filter((v) => v.specialty === s).length;
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
		return new Date(d).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function totalCost(specialty: MedSpecialty) {
		return healthStore.visits
			.filter((v) => v.specialty === specialty)
			.reduce((acc, v) => acc + (v.cost ?? 0), 0);
	}
</script>

<div class="flex flex-col gap-6">
	<!-- Specialty picker -->
	<div class="flex flex-wrap gap-2">
		{#each allSpecialties as s (s)}
			{@const count = countFor(s)}
			<button
				type="button"
				onclick={() => { selected = s; expandedId = null; }}
				class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors
					{activeSpecialty === s
						? 'bg-primary text-primary-foreground border-primary'
						: count > 0
							? 'bg-card hover:bg-muted'
							: 'bg-muted/40 text-muted-foreground hover:bg-muted border-dashed'}"
			>
				<span>{SPECIALTY_ICONS[s]}</span>
				<span>{SPECIALTY_LABELS[s]}</span>
				{#if count > 0}
					<span class="rounded-full px-1.5 py-0.5 text-xs
						{activeSpecialty === s ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground'}">
						{count}
					</span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Active specialty header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-3xl">{SPECIALTY_ICONS[activeSpecialty]}</span>
			<div>
				<h3 class="text-lg font-semibold">{SPECIALTY_LABELS[activeSpecialty]}</h3>
				{#if specialtyVisits.length > 0}
					{@const cost = totalCost(activeSpecialty)}
					<p class="text-muted-foreground text-sm">
						{specialtyVisits.length} визит{specialtyVisits.length === 1 ? '' : specialtyVisits.length < 5 ? 'а' : 'ов'}
						{#if cost > 0}&nbsp;· {cost.toLocaleString('ru-RU')} ₽{/if}
					</p>
				{/if}
			</div>
		</div>
		<Button onclick={openAdd}>
			<Plus class="size-4" />
			Новый визит
		</Button>
	</div>

	<!-- Dentistry special: tooth chart -->
	{#if activeSpecialty === 'dentist'}
		<Card.Root>
			<Card.Header>
				<Card.Title>Карта зубов</Card.Title>
				<Card.Description>Кликните по зубу, чтобы изменить статус</Card.Description>
			</Card.Header>
			<Card.Content>
				<ToothChart
					teeth={healthStore.teeth}
					onchange={(id: number, rec: ToothRecord) => healthStore.setTooth(id, rec)}
				/>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Visit list for active specialty -->
	{#if specialtyVisits.length === 0}
		<div class="text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center text-sm">
			<span class="text-4xl">{SPECIALTY_ICONS[activeSpecialty]}</span>
			<p>Визитов к {SPECIALTY_LABELS[activeSpecialty].toLowerCase()} пока нет</p>
			<Button variant="outline" size="sm" onclick={openAdd}>
				<Plus class="size-4" />
				Добавить первый
			</Button>
		</div>
	{:else}
		<div class="flex flex-col gap-2">
			{#each specialtyVisits as visit (visit.id)}
				{@const expanded = expandedId === visit.id}
				<div class="bg-card rounded-lg border">
					<button
						type="button"
						onclick={() => (expandedId = expanded ? null : visit.id)}
						class="flex w-full items-center gap-3 rounded-lg p-4 text-left transition-colors hover:bg-muted/30"
					>
						<div class="flex flex-1 flex-col gap-0.5 min-w-0">
							<div class="flex items-center gap-2 flex-wrap">
								{#if visit.clinic}
									<span class="font-medium">{visit.clinic}</span>
								{/if}
								{#if visit.doctor}
									<span class="text-muted-foreground text-sm">{visit.doctor}</span>
								{/if}
							</div>
							{#if visit.diagnosis}
								<span class="text-sm text-muted-foreground truncate">{visit.diagnosis}</span>
							{:else if visit.complaint}
								<span class="text-sm text-muted-foreground truncate">{visit.complaint}</span>
							{/if}
						</div>
						<div class="flex items-center gap-3 shrink-0">
							{#if visit.cost}
								<span class="text-sm font-medium whitespace-nowrap">
									{visit.cost.toLocaleString('ru-RU')} ₽
								</span>
							{/if}
							<span class="text-sm text-muted-foreground whitespace-nowrap">
								{formatDate(visit.date)}
							</span>
							<ChevronDown
								class="size-4 text-muted-foreground transition-transform {expanded ? 'rotate-180' : ''}"
							/>
						</div>
					</button>

					{#if expanded}
						<div class="grid grid-cols-1 gap-3 border-t px-4 pb-4 pt-3 sm:grid-cols-2">
							{#if visit.complaint}
								<div>
									<div class="text-muted-foreground mb-0.5 text-xs font-medium uppercase tracking-wide">Жалоба</div>
									<div class="text-sm">{visit.complaint}</div>
								</div>
							{/if}
							{#if visit.diagnosis}
								<div>
									<div class="text-muted-foreground mb-0.5 text-xs font-medium uppercase tracking-wide">Диагноз</div>
									<div class="text-sm">{visit.diagnosis}</div>
								</div>
							{/if}
							{#if visit.prescription}
								<div>
									<div class="text-muted-foreground mb-0.5 text-xs font-medium uppercase tracking-wide">Назначение</div>
									<div class="text-sm">{visit.prescription}</div>
								</div>
							{/if}
							{#if visit.notes}
								<div>
									<div class="text-muted-foreground mb-0.5 text-xs font-medium uppercase tracking-wide">Заметки</div>
									<div class="text-sm">{visit.notes}</div>
								</div>
							{/if}
							<div class="flex justify-end sm:col-span-2">
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
			{/each}
		</div>
	{/if}
</div>

<AddVisitDialog bind:open={dialogOpen} visit={editingVisit} />
