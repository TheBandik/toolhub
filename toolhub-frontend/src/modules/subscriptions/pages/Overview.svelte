<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { subscriptionsStore } from '../store.svelte';
	import {
		CATEGORY_LABELS,
		CATEGORY_ICONS,
		formatMoney,
		monthlyInBase,
		isActive,
		nextBillingDate,
		priceLabel,
		type ServiceCategory,
		type Subscription
	} from '../types';

	const activeEntries = $derived(subscriptionsStore.entries.filter((e) => isActive(e)));
	const monthly = $derived(
		activeEntries.reduce((acc, e) => acc + monthlyInBase(e, subscriptionsStore.settings), 0)
	);
	const servicesMonthly = $derived(
		activeEntries
			.filter((e) => e.kind === 'service')
			.reduce((acc, e) => acc + monthlyInBase(e, subscriptionsStore.settings), 0)
	);

	const byCategory = $derived.by(() => {
		const map = new Map<ServiceCategory, number>();
		for (const e of activeEntries) {
			const v = monthlyInBase(e, subscriptionsStore.settings);
			map.set(e.category, (map.get(e.category) ?? 0) + v);
		}
		return [...map.entries()]
			.map(([category, amount]) => ({
				category,
				amount,
				share: monthly > 0 ? amount / monthly : 0
			}))
			.sort((a, b) => b.amount - a.amount);
	});

	const upcoming = $derived.by(() => {
		const now = new Date();
		const horizon = new Date();
		horizon.setDate(horizon.getDate() + 30);
		return activeEntries
			.filter((e): e is Subscription => e.kind === 'subscription')
			.map((e) => ({ entry: e, date: nextBillingDate(e, now) }))
			.filter((x) => x.date <= horizon)
			.sort((a, b) => a.date.getTime() - b.date.getTime());
	});

	function formatDate(d: Date): string {
		return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
	}
</script>

<div class="flex flex-col gap-6">
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

		<Card.Root>
			<Card.Header>
				<Card.Description>Доля сервисов</Card.Description>
				<Card.Title class="text-3xl">
					{monthly > 0 ? Math.round((servicesMonthly / monthly) * 100) : 0}%
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Расходы по категориям</Card.Title>
				<Card.Description>В месяц, нормализовано в {subscriptionsStore.settings.baseCurrency}</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-3">
				{#each byCategory as row (row.category)}
					<div class="flex flex-col gap-1.5">
						<div class="flex items-center gap-2 text-sm">
							<span>{CATEGORY_ICONS[row.category]}</span>
							<span class="flex-1">{CATEGORY_LABELS[row.category]}</span>
							<span class="font-medium">
								{formatMoney(row.amount, subscriptionsStore.settings.baseCurrency)}
							</span>
							<span class="text-muted-foreground w-10 text-right text-xs">
								{Math.round(row.share * 100)}%
							</span>
						</div>
						<div class="bg-muted h-1.5 overflow-hidden rounded-full">
							<div class="bg-primary h-full" style="width: {row.share * 100}%"></div>
						</div>
					</div>
				{:else}
					<div class="text-muted-foreground text-sm">Пока пусто.</div>
				{/each}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Ближайшие платежи</Card.Title>
				<Card.Description>В течение 30 дней</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if upcoming.length === 0}
					<div class="text-muted-foreground text-sm">Ничего не предстоит.</div>
				{:else}
					<div class="flex flex-col">
						{#each upcoming as u (u.entry.id)}
							<div class="flex items-center gap-3 border-b py-2 last:border-b-0">
								<span class="text-xl">{u.entry.icon}</span>
								<div class="flex flex-1 flex-col">
									<div class="flex items-center gap-2 text-sm font-medium">
										{u.entry.name}
										{#if !u.entry.autoRenew}
											<Badge variant="outline">Не автопродление</Badge>
										{/if}
									</div>
									<div class="text-muted-foreground text-xs">{priceLabel(u.entry)}</div>
								</div>
								<div class="text-sm font-medium whitespace-nowrap">{formatDate(u.date)}</div>
							</div>
						{/each}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
