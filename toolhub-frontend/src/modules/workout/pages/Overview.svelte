<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { workoutStore } from '../store.svelte';
	import { WORKOUT_TYPE_LABELS } from '../types';

	const weekSessions = $derived.by(() => {
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - 7);
		return workoutStore.sessions.filter((s) => new Date(s.date) >= cutoff);
	});

	const weekMinutes = $derived(weekSessions.reduce((acc, s) => acc + s.durationMin, 0));
	const last = $derived(workoutStore.sessions[0]);
</script>

<div class="flex flex-col gap-6">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
				<Card.Description>Всего тренировок</Card.Description>
				<Card.Title class="text-3xl">{workoutStore.sessions.length}</Card.Title>
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
			<Card.Content>
				<div class="text-sm">
					{last.durationMin} мин{last.note ? ` · ${last.note}` : ''}
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
