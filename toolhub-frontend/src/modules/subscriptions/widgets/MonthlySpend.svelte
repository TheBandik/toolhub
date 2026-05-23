<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { subscriptionsStore } from '../store.svelte';
	import { isActive, monthlyInBase, formatMoney } from '../types';

	const monthly = $derived(
		subscriptionsStore.entries
			.filter((e) => isActive(e))
			.reduce((acc, e) => acc + monthlyInBase(e, subscriptionsStore.settings), 0)
	);
</script>

<StatCard
	label="Расходы в месяц"
	value={formatMoney(monthly, subscriptionsStore.settings.baseCurrency)}
	sub={subscriptionsStore.settings.baseCurrency}
/>
