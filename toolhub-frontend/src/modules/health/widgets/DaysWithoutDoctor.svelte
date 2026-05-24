<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { healthStore } from '../store.svelte';

	const days = $derived.by(() => {
		if (healthStore.visits.length === 0) return null;
		const last = [...healthStore.visits].sort((a, b) => b.date.localeCompare(a.date))[0];
		return Math.floor((Date.now() - new Date(last.date).getTime()) / 86400000);
	});

	const emoji = $derived.by(() => {
		if (days == null) return '🏥';
		if (days < 7) return '😰';
		if (days < 30) return '😊';
		if (days < 90) return '😌';
		return '🤸';
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Description>Дней без врача</Card.Description>
		<Card.Title class="flex items-center gap-2 text-3xl">
			{days ?? '—'}
			<span>{emoji}</span>
		</Card.Title>
	</Card.Header>
</Card.Root>
