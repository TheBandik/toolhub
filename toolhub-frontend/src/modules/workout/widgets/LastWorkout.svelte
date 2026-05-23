<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { workoutStore } from '../store.svelte';
	import { WORKOUT_TYPE_LABELS } from '../types';

	const last = $derived(workoutStore.sessions[0]);

	const sub = $derived.by(() => {
		if (!last) return undefined;
		const date = new Date(last.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
		return `${date} · ${last.durationMin} мин`;
	});
</script>

<StatCard
	label="Последняя тренировка"
	value={last ? WORKOUT_TYPE_LABELS[last.type] : '—'}
	{sub}
/>
