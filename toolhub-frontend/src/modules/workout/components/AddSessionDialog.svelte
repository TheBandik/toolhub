<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { workoutStore } from '../store.svelte';
	import {
		WORKOUT_TYPE_LABELS,
		TENNIS_KIND_LABELS,
		TENNIS_COURT_LABELS,
		TENNIS_SURFACE_LABELS,
		RPE_COLOR_BG,
		emptyDetails,
		type WorkoutType,
		type WorkoutDetails,
		type TennisKind,
		type TennisCourt,
		type TennisSurface,
		type ZoneSeconds
	} from '../types';
	import ZonesInput from './ZonesInput.svelte';
	import StrengthExercisesInput from './StrengthExercisesInput.svelte';

	let { open = $bindable() }: { open: boolean } = $props();

	const today = () => new Date().toISOString().slice(0, 10);

	let date = $state(today());
	let type = $state<WorkoutType>('tennis');
	let durationMin = $state<number | null>(60);
	let distanceKm = $state<number | null>(null);
	let avgHR = $state<number | null>(null);
	let maxHR = $state<number | null>(null);
	let activeCalories = $state<number | null>(null);
	let rpe = $state<number | null>(null);
	let zoneSeconds = $state<ZoneSeconds>([0, 0, 0, 0, 0]);
	let note = $state('');
	let details = $state<WorkoutDetails>(emptyDetails('tennis'));

	function setType(t: WorkoutType) {
		type = t;
		details = emptyDetails(t);
	}

	function reset() {
		date = today();
		type = 'tennis';
		durationMin = 60;
		distanceKm = null;
		avgHR = null;
		maxHR = null;
		activeCalories = null;
		rpe = null;
		zoneSeconds = [0, 0, 0, 0, 0];
		note = '';
		details = emptyDetails('tennis');
	}

	function num(v: number | null | undefined): number | undefined {
		return v == null || !Number.isFinite(v) ? undefined : v;
	}

	function hasZoneSeconds(z: ZoneSeconds): boolean {
		return z.some((m) => Number(m) > 0);
	}

	function cleanedDetails(d: WorkoutDetails): WorkoutDetails | undefined {
		if (d.type === 'tennis') {
			const cleaned = {
				...d,
				score: d.score?.trim() || undefined,
				partner: d.partner?.trim() || undefined
			};
			return cleaned;
		}
		if (d.type === 'running') {
			if (d.avgPaceSecPerKm == null && d.elevationGainM == null && !d.location?.trim()) {
				return undefined;
			}
			return { ...d, location: d.location?.trim() || undefined };
		}
		if (d.type === 'strength') {
			const exercises = d.exercises.filter((e) => e.name.trim());
			return exercises.length ? { type: 'strength', exercises } : undefined;
		}
		return undefined;
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		workoutStore.add({
			date,
			type,
			durationMin: Number(durationMin) || 0,
			distanceKm: num(distanceKm),
			avgHR: num(avgHR),
			maxHR: num(maxHR),
			activeCalories: num(activeCalories),
			rpe: num(rpe),
			zoneSeconds: hasZoneSeconds(zoneSeconds) ? ([...zoneSeconds] as ZoneSeconds) : undefined,
			note: note.trim() || undefined,
			details: cleanedDetails(details)
		});
		reset();
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Новая тренировка</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={submit} class="flex flex-col gap-5">
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-2">
					<Label for="session-date">Дата</Label>
					<Input id="session-date" type="date" bind:value={date} required />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="session-duration">Длительность (мин)</Label>
					<Input
						id="session-duration"
						type="number"
						min="1"
						bind:value={durationMin}
						required
					/>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label>Тип</Label>
				<div class="flex flex-wrap gap-2">
					{#each Object.entries(WORKOUT_TYPE_LABELS) as [value, label] (value)}
						<Button
							type="button"
							variant={type === value ? 'default' : 'outline'}
							size="sm"
							onclick={() => setType(value as WorkoutType)}
						>
							{label}
						</Button>
					{/each}
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<div class="flex flex-col gap-2">
					<Label for="session-avg-hr">Средний пульс</Label>
					<Input id="session-avg-hr" type="number" min="0" bind:value={avgHR} />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="session-max-hr">Макс. пульс</Label>
					<Input id="session-max-hr" type="number" min="0" bind:value={maxHR} />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="session-calories">Активные ккал</Label>
					<Input id="session-calories" type="number" min="0" bind:value={activeCalories} />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="session-distance">Дистанция, км</Label>
					<Input
						id="session-distance"
						type="number"
						min="0"
						step="0.1"
						bind:value={distanceKm}
					/>
				</div>
			</div>

			<ZonesInput bind:value={zoneSeconds} />

			<div class="flex flex-col gap-2">
				<Label>RPE — субъективная нагрузка (1–10)</Label>
				<div class="flex gap-1">
					{#each Array.from({ length: 10 }, (_, i) => i + 1) as n (n)}
						<button
							type="button"
							onclick={() => (rpe = rpe === n ? null : n)}
							class="flex h-9 flex-1 items-center justify-center rounded-md text-sm font-semibold text-white transition-all {RPE_COLOR_BG[
								n
							]} {rpe === n
								? 'ring-foreground ring-2 ring-offset-2'
								: 'opacity-50 hover:opacity-100'}"
						>
							{n}
						</button>
					{/each}
				</div>
			</div>

			{#if details.type === 'tennis'}
				<div class="flex flex-col gap-3 rounded-md border p-3">
					<div class="text-sm font-medium">Теннис</div>
					<div class="flex flex-col gap-2">
						<Label>Формат</Label>
						<div class="flex flex-wrap gap-2">
							{#each Object.entries(TENNIS_KIND_LABELS) as [value, label] (value)}
								<Button
									type="button"
									variant={details.kind === value ? 'default' : 'outline'}
									size="sm"
									onclick={() => {
										if (details.type === 'tennis') details.kind = value as TennisKind;
									}}
								>
									{label}
								</Button>
							{/each}
						</div>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div class="flex flex-col gap-2">
							<Label>Корт</Label>
							<div class="flex flex-wrap gap-2">
								{#each Object.entries(TENNIS_COURT_LABELS) as [value, label] (value)}
									<Button
										type="button"
										variant={details.court === value ? 'default' : 'outline'}
										size="sm"
										onclick={() => {
											if (details.type === 'tennis') {
												details.court =
													details.court === value ? undefined : (value as TennisCourt);
											}
										}}
									>
										{label}
									</Button>
								{/each}
							</div>
						</div>
						<div class="flex flex-col gap-2">
							<Label>Покрытие</Label>
							<div class="flex flex-wrap gap-2">
								{#each Object.entries(TENNIS_SURFACE_LABELS) as [value, label] (value)}
									<Button
										type="button"
										variant={details.surface === value ? 'default' : 'outline'}
										size="sm"
										onclick={() => {
											if (details.type === 'tennis') {
												details.surface =
													details.surface === value ? undefined : (value as TennisSurface);
											}
										}}
									>
										{label}
									</Button>
								{/each}
							</div>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div class="flex flex-col gap-2">
							<Label for="tennis-score">Счёт</Label>
							<Input id="tennis-score" placeholder="6:4 6:3" bind:value={details.score} />
						</div>
						<div class="flex flex-col gap-2">
							<Label for="tennis-partner">Партнёр / соперник</Label>
							<Input id="tennis-partner" bind:value={details.partner} />
						</div>
					</div>
				</div>
			{/if}

			{#if details.type === 'running'}
				<div class="flex flex-col gap-3 rounded-md border p-3">
					<div class="text-sm font-medium">Бег</div>
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
						<div class="flex flex-col gap-2">
							<Label for="run-pace">Темп (сек/км)</Label>
							<Input
								id="run-pace"
								type="number"
								min="0"
								bind:value={details.avgPaceSecPerKm}
							/>
						</div>
						<div class="flex flex-col gap-2">
							<Label for="run-elev">Набор высоты, м</Label>
							<Input
								id="run-elev"
								type="number"
								min="0"
								bind:value={details.elevationGainM}
							/>
						</div>
						<div class="flex flex-col gap-2">
							<Label for="run-loc">Локация</Label>
							<Input id="run-loc" bind:value={details.location} />
						</div>
					</div>
				</div>
			{/if}

			{#if details.type === 'strength'}
				<div class="flex flex-col gap-3 rounded-md border p-3">
					<div class="text-sm font-medium">Силовая</div>
					<StrengthExercisesInput bind:value={details.exercises} />
				</div>
			{/if}

			<div class="flex flex-col gap-2">
				<Label for="session-note">Заметка</Label>
				<Input id="session-note" bind:value={note} placeholder="Опционально" />
			</div>

			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Отмена</Button>
				<Button type="submit">Добавить</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
