<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { musicStore } from '../store.svelte';
	import { formatHours } from '../types';

	const totalSec = $derived(musicStore.tracks.reduce((s, t) => s + (t.durationSec ?? 0), 0));
</script>

<StatCard label="Длительность библиотеки" value={formatHours(totalSec)} />
