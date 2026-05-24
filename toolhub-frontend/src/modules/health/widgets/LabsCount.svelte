<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { healthStore } from '../store.svelte';
	import { getLabItemStatus } from '../types';

	const yearAgo = new Date();
	yearAgo.setFullYear(yearAgo.getFullYear() - 1);

	const thisYear = $derived(
		healthStore.labs.filter((l) => new Date(l.date) >= yearAgo)
	);

	const abnormal = $derived(
		thisYear.reduce((acc, l) => {
			return acc + l.items.filter((i) => {
				const s = getLabItemStatus(i);
				return s === 'high' || s === 'low';
			}).length;
		}, 0)
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Description>Анализов за год</Card.Description>
		<Card.Title class="text-3xl">{thisYear.length}</Card.Title>
	</Card.Header>
	{#if abnormal > 0}
		<Card.Content>
			<p class="text-destructive text-sm">{abnormal} показат. вне нормы</p>
		</Card.Content>
	{/if}
</Card.Root>
