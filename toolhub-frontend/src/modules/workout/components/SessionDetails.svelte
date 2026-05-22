<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import {
		RPE_COLOR_BG,
		TENNIS_KIND_LABELS,
		TENNIS_COURT_LABELS,
		TENNIS_SURFACE_LABELS,
		type WorkoutSession
	} from '../types';
	import ZoneBar from './ZoneBar.svelte';

	let { session }: { session: WorkoutSession } = $props();

	function formatPace(sec: number): string {
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	const hasZones = $derived(!!session.zoneSeconds && session.zoneSeconds.some((s) => s > 0));
</script>

<div class="flex flex-col gap-5 p-2">
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
		<div>
			<div class="text-muted-foreground text-xs">Длительность</div>
			<div class="font-medium">{session.durationMin} мин</div>
		</div>
		{#if session.distanceKm != null}
			<div>
				<div class="text-muted-foreground text-xs">Дистанция</div>
				<div class="font-medium">{session.distanceKm} км</div>
			</div>
		{/if}
		{#if session.avgHR != null}
			<div>
				<div class="text-muted-foreground text-xs">Средний пульс</div>
				<div class="font-medium">{session.avgHR} bpm</div>
			</div>
		{/if}
		{#if session.maxHR != null}
			<div>
				<div class="text-muted-foreground text-xs">Макс. пульс</div>
				<div class="font-medium">{session.maxHR} bpm</div>
			</div>
		{/if}
		{#if session.activeCalories != null}
			<div>
				<div class="text-muted-foreground text-xs">Активные ккал</div>
				<div class="font-medium">{session.activeCalories}</div>
			</div>
		{/if}
		{#if session.rpe != null}
			<div>
				<div class="text-muted-foreground text-xs">RPE</div>
				<div class="flex items-center gap-2">
					<span
						class="inline-flex size-6 items-center justify-center rounded-md text-xs font-semibold text-white {RPE_COLOR_BG[
							session.rpe
						]}"
					>
						{session.rpe}
					</span>
					<span class="text-muted-foreground text-xs">/ 10</span>
				</div>
			</div>
		{/if}
	</div>

	{#if hasZones && session.zoneSeconds}
		<div class="flex flex-col gap-2">
			<div class="text-muted-foreground text-xs font-medium uppercase tracking-wide">
				Пульсовые зоны
			</div>
			<ZoneBar value={session.zoneSeconds} />
		</div>
	{/if}

	{#if session.details}
		<div class="flex flex-col gap-2">
			<div class="text-muted-foreground text-xs font-medium uppercase tracking-wide">
				{#if session.details.type === 'tennis'}Теннис
				{:else if session.details.type === 'running'}Бег
				{:else if session.details.type === 'strength'}Силовая{/if}
			</div>

			{#if session.details.type === 'tennis'}
				{@const d = session.details}
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
					<div>
						<div class="text-muted-foreground text-xs">Формат</div>
						<div class="font-medium">{TENNIS_KIND_LABELS[d.kind]}</div>
					</div>
					{#if d.court}
						<div>
							<div class="text-muted-foreground text-xs">Корт</div>
							<div class="font-medium">{TENNIS_COURT_LABELS[d.court]}</div>
						</div>
					{/if}
					{#if d.surface}
						<div>
							<div class="text-muted-foreground text-xs">Покрытие</div>
							<div class="font-medium">{TENNIS_SURFACE_LABELS[d.surface]}</div>
						</div>
					{/if}
					{#if d.score}
						<div>
							<div class="text-muted-foreground text-xs">Счёт</div>
							<div class="font-medium">{d.score}</div>
						</div>
					{/if}
					{#if d.partner}
						<div>
							<div class="text-muted-foreground text-xs">Партнёр</div>
							<div class="font-medium">{d.partner}</div>
						</div>
					{/if}
				</div>
			{:else if session.details.type === 'running'}
				{@const d = session.details}
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{#if d.avgPaceSecPerKm != null}
						<div>
							<div class="text-muted-foreground text-xs">Средний темп</div>
							<div class="font-medium">{formatPace(d.avgPaceSecPerKm)} /км</div>
						</div>
					{/if}
					{#if d.elevationGainM != null}
						<div>
							<div class="text-muted-foreground text-xs">Набор высоты</div>
							<div class="font-medium">{d.elevationGainM} м</div>
						</div>
					{/if}
					{#if d.location}
						<div>
							<div class="text-muted-foreground text-xs">Локация</div>
							<div class="font-medium">{d.location}</div>
						</div>
					{/if}
				</div>
			{:else if session.details.type === 'strength'}
				{@const d = session.details}
				{#if d.exercises.length}
					<div class="flex flex-col gap-1.5">
						{#each d.exercises as ex, i (i)}
							<div class="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
								<div class="flex items-center gap-2">
									<span class="font-medium">{ex.name}</span>
									{#if ex.muscleGroup}
										<Badge variant="secondary">{ex.muscleGroup}</Badge>
									{/if}
								</div>
								<span class="text-muted-foreground">
									{ex.sets}×{ex.reps}{ex.weightKg != null ? ` @ ${ex.weightKg} кг` : ''}
								</span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-muted-foreground text-xs">Упражнения не указаны</div>
				{/if}
			{/if}
		</div>
	{/if}

	{#if session.note}
		<div class="flex flex-col gap-1">
			<div class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Заметка</div>
			<div class="text-sm">{session.note}</div>
		</div>
	{/if}
</div>
