<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { workoutStore } from '../store.svelte';
	import { WORKOUT_TYPE_LABELS } from '../types';

	const weekSessions = $derived.by(() => {
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - 7);
		return workoutStore.sessions.filter((s) => new Date(s.date) >= cutoff);
	});

	const sub = $derived.by(() => {
		if (!weekSessions.length) return undefined;
		const counts = new Map<string, number>();
		for (const s of weekSessions) counts.set(s.type, (counts.get(s.type) ?? 0) + 1);
		return [...counts.entries()]
			.map(([type, n]) => `${WORKOUT_TYPE_LABELS[type as keyof typeof WORKOUT_TYPE_LABELS].toLowerCase()} ×${n}`)
			.join(', ');
	});
</script>

<StatCard label="Тренировок за неделю" value={weekSessions.length} {sub} />
