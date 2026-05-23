<script lang="ts">
	import StatCard from '$lib/shell/StatCard.svelte';
	import { subscriptionsStore } from '../store.svelte';
	import { isActive, nextBillingDate, priceLabel, type Subscription } from '../types';

	const upcoming = $derived.by(() => {
		const now = new Date();
		const horizon = new Date();
		horizon.setDate(horizon.getDate() + 30);
		return subscriptionsStore.entries
			.filter((e): e is Subscription => e.kind === 'subscription' && isActive(e))
			.map((e) => ({ entry: e, date: nextBillingDate(e, now) }))
			.filter((x) => x.date <= horizon)
			.sort((a, b) => a.date.getTime() - b.date.getTime());
	});

	const next = $derived(upcoming[0]);

	const sub = $derived.by(() => {
		if (!next) return undefined;
		const date = next.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
		return `${date} · ${priceLabel(next.entry)}`;
	});
</script>

<StatCard label="Ближайший платёж" value={next ? next.entry.name : '—'} {sub} />
