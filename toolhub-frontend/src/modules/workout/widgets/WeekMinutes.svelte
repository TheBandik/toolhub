<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { workoutStore } from '../store.svelte';

	const weekSessions = $derived.by(() => {
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - 7);
		return workoutStore.sessions.filter((s) => new Date(s.date) >= cutoff);
	});

	const weekMinutes = $derived(weekSessions.reduce((acc, s) => acc + s.durationMin, 0));

	const sub = $derived.by(() => {
		const h = Math.floor(weekMinutes / 60);
		const m = weekMinutes % 60;
		if (!h) return undefined;
		return m ? `≈ ${h} ч ${m} мин` : `≈ ${h} ч`;
	});
</script>

<StatCard label="Минут за неделю" value={weekMinutes} {sub} />
