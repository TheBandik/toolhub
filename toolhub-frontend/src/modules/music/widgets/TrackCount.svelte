<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { musicStore } from '../store.svelte';

	const trackCount = $derived(musicStore.tracks.length);
	const artistCount = $derived(new Set(musicStore.tracks.map((t) => t.artist)).size);
</script>

<StatCard label="Треков в библиотеке" value={trackCount} sub={`${artistCount} исполнителей`} />
