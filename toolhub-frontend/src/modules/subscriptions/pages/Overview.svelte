<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { subscriptionsStore } from '../store.svelte';
	import { formatMoney, monthlyInBase, isActive } from '../types';

	const activeEntries = $derived(subscriptionsStore.entries.filter((e) => isActive(e)));
	const monthly = $derived(
		activeEntries.reduce((acc, e) => acc + monthlyInBase(e, subscriptionsStore.settings), 0)
	);
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
	<Card.Root>
		<Card.Header>
			<Card.Description>Активных позиций</Card.Description>
			<Card.Title class="text-3xl">{activeEntries.length}</Card.Title>
		</Card.Header>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Description>В месяц ({subscriptionsStore.settings.baseCurrency})</Card.Description>
			<Card.Title class="text-3xl">
				{formatMoney(monthly, subscriptionsStore.settings.baseCurrency)}
			</Card.Title>
		</Card.Header>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Description>В год ({subscriptionsStore.settings.baseCurrency})</Card.Description>
			<Card.Title class="text-3xl">
				{formatMoney(monthly * 12, subscriptionsStore.settings.baseCurrency)}
			</Card.Title>
		</Card.Header>
	</Card.Root>
</div>
