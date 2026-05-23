<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { subscriptionsStore } from '../store.svelte';
	import { isActive } from '../types';

	const activeCount = $derived(subscriptionsStore.entries.filter((e) => isActive(e)).length);
</script>

<StatCard label="Активных подписок" value={activeCount} />
