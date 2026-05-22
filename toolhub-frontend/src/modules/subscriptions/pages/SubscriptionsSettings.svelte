<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { subscriptionsStore } from '../store.svelte';
	import { CURRENCIES, CURRENCY_SYMBOLS, type Currency } from '../types';

	function setBase(c: Currency) {
		subscriptionsStore.updateSettings({ baseCurrency: c });
	}

	function onRate(c: Currency) {
		return (e: Event) => {
			const value = Number((e.target as HTMLInputElement).value);
			if (Number.isFinite(value) && value > 0) {
				subscriptionsStore.updateRate(c, value);
			}
		};
	}
</script>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Базовая валюта</Card.Title>
			<Card.Description>
				В этой валюте отображается нормализованная статистика. Остальные валюты конвертируются по курсам ниже.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-wrap gap-2">
				{#each CURRENCIES as c (c)}
					<Button
						type="button"
						variant={subscriptionsStore.settings.baseCurrency === c ? 'default' : 'outline'}
						size="sm"
						onclick={() => setBase(c)}
					>
						{c} {CURRENCY_SYMBOLS[c]}
					</Button>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Курсы к ₽</Card.Title>
			<Card.Description>
				Сколько рублей за 1 единицу валюты. Курс рубля к рублю — 1. Позже подтянем из интеграции.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-2 gap-3">
				{#each CURRENCIES as c (c)}
					<div class="flex flex-col gap-2">
						<Label for={`rate-${c}`}>{c} {CURRENCY_SYMBOLS[c]}</Label>
						<Input
							id={`rate-${c}`}
							type="number"
							min="0"
							step="0.01"
							disabled={c === 'RUB'}
							value={subscriptionsStore.settings.ratesToRUB[c]}
							onchange={onRate(c)}
						/>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
