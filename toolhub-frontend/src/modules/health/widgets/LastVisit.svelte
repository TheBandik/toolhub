<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { healthStore } from '../store.svelte';
	import { SPECIALTY_LABELS, SPECIALTY_ICONS } from '../types';

	const last = $derived(
		[...healthStore.visits].sort((a, b) => b.date.localeCompare(a.date))[0]
	);

	const daysAgo = $derived(
		last ? Math.floor((Date.now() - new Date(last.date).getTime()) / 86400000) : null
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Description>Последний визит</Card.Description>
		{#if last}
			<Card.Title class="flex items-center gap-2 text-xl">
				{SPECIALTY_ICONS[last.specialty]}
				{SPECIALTY_LABELS[last.specialty]}
			</Card.Title>
		{:else}
			<Card.Title class="text-xl text-muted-foreground">—</Card.Title>
		{/if}
	</Card.Header>
	{#if last && daysAgo != null}
		<Card.Content>
			<p class="text-muted-foreground text-sm">{daysAgo} дн. назад{last.clinic ? ` · ${last.clinic}` : ''}</p>
		</Card.Content>
	{/if}
</Card.Root>
