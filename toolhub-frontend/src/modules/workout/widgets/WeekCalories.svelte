<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { workoutStore } from '../store.svelte';

	const weekSessions = $derived.by(() => {
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - 7);
		return workoutStore.sessions.filter((s) => new Date(s.date) >= cutoff);
	});

	const weekCalories = $derived(weekSessions.reduce((acc, s) => acc + (s.activeCalories ?? 0), 0));
</script>

<StatCard label="Ккал за неделю" value={weekCalories} />
