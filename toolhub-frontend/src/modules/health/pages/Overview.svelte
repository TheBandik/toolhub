<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { healthStore } from '../store.svelte';
	import {
		SPECIALTY_LABELS,
		SPECIALTY_ICONS,
		TOOTH_STATUS_LABELS,
		getLabItemStatus,
		type MedSpecialty
	} from '../types';

	// Last visit per specialty
	const lastBySpecialty = $derived.by(() => {
		const map = new Map<MedSpecialty, (typeof healthStore.visits)[0]>();
		for (const v of [...healthStore.visits].sort((a, b) => b.date.localeCompare(a.date))) {
			if (!map.has(v.specialty)) map.set(v.specialty, v);
		}
		return [...map.entries()].sort((a, b) => b[1].date.localeCompare(a[1].date));
	});

	// Recent labs (last 3)
	const recentLabs = $derived(
		[...healthStore.labs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
	);

	// Teeth summary
	const teethSummary = $derived.by(() => {
		const counts: Record<string, number> = {};
		for (const rec of Object.values(healthStore.teeth)) {
			counts[rec.status] = (counts[rec.status] ?? 0) + 1;
		}
		return counts;
	});

	function daysSince(date: string): number {
		return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	// Abnormal indicators count across all labs
	const abnormalCount = $derived.by(() => {
		let n = 0;
		for (const lab of healthStore.labs) {
			for (const item of lab.items) {
				const s = getLabItemStatus(item);
				if (s === 'high' || s === 'low') n++;
			}
		}
		return n;
	});
</script>

<div class="flex flex-col gap-6">
	<!-- Stats row -->
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		<Card.Root>
			<Card.Header>
				<Card.Description>Всего визитов</Card.Description>
				<Card.Title class="text-3xl">{healthStore.visits.length}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Анализов</Card.Description>
				<Card.Title class="text-3xl">{healthStore.labs.length}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Показателей вне нормы</Card.Description>
				<Card.Title class="text-3xl {abnormalCount > 0 ? 'text-destructive' : ''}">{abnormalCount}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Файлов</Card.Description>
				<Card.Title class="text-3xl">{healthStore.files.length}</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Last visits by specialty -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Последние визиты</Card.Title>
				<Card.Description>По каждой специальности</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col">
				{#each lastBySpecialty as [spec, visit] (spec)}
					<div class="flex items-start gap-3 border-b py-3 last:border-b-0">
						<span class="mt-0.5 text-xl">{SPECIALTY_ICONS[spec]}</span>
						<div class="flex flex-1 flex-col gap-0.5">
							<div class="flex items-center gap-2">
								<span class="text-sm font-medium">{SPECIALTY_LABELS[spec]}</span>
								{#if visit.clinic}
									<span class="text-muted-foreground text-xs">{visit.clinic}</span>
								{/if}
							</div>
							{#if visit.diagnosis}
								<span class="text-muted-foreground text-xs">{visit.diagnosis}</span>
							{/if}
						</div>
						<div class="flex flex-col items-end gap-0.5">
							<span class="text-xs font-medium">{formatDate(visit.date)}</span>
							<span class="text-muted-foreground text-xs">{daysSince(visit.date)} дн. назад</span>
						</div>
					</div>
				{:else}
					<div class="text-muted-foreground py-4 text-center text-sm">Визитов пока нет</div>
				{/each}
			</Card.Content>
		</Card.Root>

		<div class="flex flex-col gap-6">
			<!-- Recent labs -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Последние анализы</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-2">
					{#each recentLabs as lab (lab.id)}
						{@const abnormal = lab.items.filter((i) => {
							const s = getLabItemStatus(i);
							return s === 'high' || s === 'low';
						}).length}
						<div class="flex items-center justify-between rounded-md border px-3 py-2">
							<div class="flex flex-col">
								<span class="text-sm font-medium">{lab.name}</span>
								<span class="text-muted-foreground text-xs">{formatDate(lab.date)}{lab.clinic ? ` · ${lab.clinic}` : ''}</span>
							</div>
							{#if abnormal > 0}
								<Badge variant="destructive">{abnormal} вне нормы</Badge>
							{:else}
								<Badge variant="secondary">Всё в норме</Badge>
							{/if}
						</div>
					{:else}
						<div class="text-muted-foreground text-sm">Анализов пока нет</div>
					{/each}
				</Card.Content>
			</Card.Root>

			<!-- Teeth summary -->
			<Card.Root>
				<Card.Header>
					<Card.Title>🦷 Стоматология</Card.Title>
					<Card.Description>Состояние зубов</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-wrap gap-3">
						{#each Object.entries(teethSummary) as [status, count] (status)}
							<div class="flex flex-col items-center gap-0.5 rounded-lg border px-3 py-2">
								<span class="text-xl font-bold">{count}</span>
								<span class="text-muted-foreground text-xs">{TOOTH_STATUS_LABELS[status as keyof typeof TOOTH_STATUS_LABELS]}</span>
							</div>
						{:else}
							<div class="text-muted-foreground text-sm">Данных нет</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
