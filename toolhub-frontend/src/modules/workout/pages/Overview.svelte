<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { workoutStore } from '../store.svelte';
	import { WORKOUT_TYPE_LABELS, computeZones } from '../types';

	const weekSessions = $derived.by(() => {
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - 7);
		return workoutStore.sessions.filter((s) => new Date(s.date) >= cutoff);
	});

	const weekMinutes = $derived(weekSessions.reduce((acc, s) => acc + s.durationMin, 0));
	const weekCalories = $derived(weekSessions.reduce((acc, s) => acc + (s.activeCalories ?? 0), 0));
	const weekDistance = $derived(
		Math.round(weekSessions.reduce((acc, s) => acc + (s.distanceKm ?? 0), 0) * 10) / 10
	);
	const last = $derived(workoutStore.sessions[0]);

	const zones = $derived(computeZones(workoutStore.settings));
	const lastZoneLabels = $derived(zones.map((z) => `Z${z.zone} ${z.min}–${z.max}`));
</script>

<div class="flex flex-col gap-6">
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		<Card.Root>
			<Card.Header>
				<Card.Description>Тренировок за неделю</Card.Description>
				<Card.Title class="text-3xl">{weekSessions.length}</Card.Title>
			</Card.Header>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Description>Минут за неделю</Card.Description>
				<Card.Title class="text-3xl">{weekMinutes}</Card.Title>
			</Card.Header>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Description>Ккал за неделю</Card.Description>
				<Card.Title class="text-3xl">{weekCalories}</Card.Title>
			</Card.Header>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Description>Километров за неделю</Card.Description>
				<Card.Title class="text-3xl">{weekDistance}</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>

	{#if last}
		<Card.Root>
			<Card.Header>
				<Card.Description>Последняя тренировка</Card.Description>
				<Card.Title class="flex items-center gap-2">
					{last.date}
					<Badge variant="secondary">{WORKOUT_TYPE_LABELS[last.type]}</Badge>
				</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-3">
				<div class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
					<div>
						<div class="text-muted-foreground text-xs">Длительность</div>
						<div>{last.durationMin} мин</div>
					</div>
					{#if last.distanceKm}
						<div>
							<div class="text-muted-foreground text-xs">Дистанция</div>
							<div>{last.distanceKm} км</div>
						</div>
					{/if}
					{#if last.avgHR}
						<div>
							<div class="text-muted-foreground text-xs">Ср. пульс</div>
							<div>{last.avgHR} bpm</div>
						</div>
					{/if}
					{#if last.activeCalories}
						<div>
							<div class="text-muted-foreground text-xs">Ккал</div>
							<div>{last.activeCalories}</div>
						</div>
					{/if}
					{#if last.rpe}
						<div>
							<div class="text-muted-foreground text-xs">RPE</div>
							<div>{last.rpe}/10</div>
						</div>
					{/if}
				</div>

				{#if last.zoneSeconds && last.zoneSeconds.some((m) => m > 0)}
					<div class="flex flex-col gap-1">
						<div class="text-muted-foreground text-xs">Время в зонах</div>
						<div class="grid grid-cols-5 gap-1 text-center text-xs">
							{#each last.zoneSeconds as sec, i (i)}
								<div class="rounded-md border px-2 py-1">
									<div class="text-muted-foreground text-[10px]">{lastZoneLabels[i]}</div>
									<div class="font-medium">
										{Math.floor(sec / 60)}:{String(sec % 60).padStart(2, '0')}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if last.note}
					<div class="text-sm">{last.note}</div>
				{/if}
			</Card.Content>
		</Card.Root>
	{/if}
</div>
