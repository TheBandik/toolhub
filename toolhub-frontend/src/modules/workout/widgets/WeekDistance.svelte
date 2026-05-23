<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { workoutStore } from '../store.svelte';

	const weekSessions = $derived.by(() => {
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - 7);
		return workoutStore.sessions.filter((s) => new Date(s.date) >= cutoff);
	});

	const weekDistance = $derived(
		Math.round(weekSessions.reduce((acc, s) => acc + (s.distanceKm ?? 0), 0) * 10) / 10
	);
</script>

<StatCard label="Км за неделю" value={`${weekDistance} км`} />
