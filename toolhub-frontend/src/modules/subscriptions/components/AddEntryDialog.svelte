<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { subscriptionsStore } from '../store.svelte';
	import {
		CURRENCIES,
		CURRENCY_SYMBOLS,
		BILLING_CYCLE_LABELS,
		TIME_UNIT_LABELS,
		CATEGORY_LABELS,
		CATEGORY_ICONS,
		type Currency,
		type BillingCycle,
		type TimeUnit,
		type ServiceCategory
	} from '../types';

	let { open = $bindable() }: { open: boolean } = $props();

	const today = () => new Date().toISOString().slice(0, 10);

	type Kind = 'subscription' | 'service';

	let kind = $state<Kind>('subscription');
	let name = $state('');
	let icon = $state(CATEGORY_ICONS.other);
	let iconManual = $state(false);
	let category = $state<ServiceCategory>('other');
	let currency = $state<Currency>('RUB');
	let startDate = $state(today());
	let endDate = $state('');
	let note = $state('');

	let price = $state<number | null>(null);
	let cycle = $state<BillingCycle>('monthly');
	let autoRenew = $state(true);

	let rate = $state<number | null>(null);
	let perUnit = $state<TimeUnit>('day');

	function setCategory(c: ServiceCategory) {
		category = c;
		if (!iconManual) icon = CATEGORY_ICONS[c];
	}

	function onIconInput(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		icon = value;
		iconManual = value.trim().length > 0;
	}

	function reset() {
		kind = 'subscription';
		name = '';
		icon = CATEGORY_ICONS.other;
		iconManual = false;
		category = 'other';
		currency = 'RUB';
		startDate = today();
		endDate = '';
		note = '';
		price = null;
		cycle = 'monthly';
		autoRenew = true;
		rate = null;
		perUnit = 'day';
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const base = {
			name: name.trim(),
			icon: icon.trim() || CATEGORY_ICONS[category],
			category,
			currency,
			startDate,
			endDate: endDate || undefined,
			note: note.trim() || undefined
		};
		if (kind === 'subscription') {
			subscriptionsStore.add({
				...base,
				kind: 'subscription',
				price: Number(price) || 0,
				cycle,
				autoRenew
			});
		} else {
			subscriptionsStore.add({
				...base,
				kind: 'service',
				rate: Number(rate) || 0,
				perUnit
			});
		}
		reset();
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Новая запись</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={submit} class="flex flex-col gap-5">
			<div class="flex flex-col gap-2">
				<Label>Тип</Label>
				<div class="flex flex-wrap gap-2">
					<Button
						type="button"
						variant={kind === 'subscription' ? 'default' : 'outline'}
						size="sm"
						onclick={() => (kind = 'subscription')}
					>
						Подписка
					</Button>
					<Button
						type="button"
						variant={kind === 'service' ? 'default' : 'outline'}
						size="sm"
						onclick={() => (kind = 'service')}
					>
						Сервис
					</Button>
				</div>
				<span class="text-muted-foreground text-xs">
					{kind === 'subscription'
						? 'Фиксированная цена за период (199 ₽/мес).'
						: 'Постоянное потребление в единицу времени (10 ₽/день).'}
				</span>
			</div>

			<div class="grid grid-cols-[5rem_1fr] gap-3">
				<div class="flex flex-col gap-2">
					<Label for="entry-icon">Иконка</Label>
					<Input
						id="entry-icon"
						class="text-center text-lg"
						value={icon}
						oninput={onIconInput}
						maxlength={4}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<Label for="entry-name">Название</Label>
					<Input id="entry-name" bind:value={name} required />
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label>Категория</Label>
				<div class="flex flex-wrap gap-2">
					{#each Object.entries(CATEGORY_LABELS) as [value, label] (value)}
						<Button
							type="button"
							variant={category === value ? 'default' : 'outline'}
							size="sm"
							onclick={() => setCategory(value as ServiceCategory)}
						>
							<span class="mr-1">{CATEGORY_ICONS[value as ServiceCategory]}</span>
							{label}
						</Button>
					{/each}
				</div>
			</div>

			{#if kind === 'subscription'}
				<div class="grid grid-cols-[1fr_8rem] gap-3">
					<div class="flex flex-col gap-2">
						<Label for="entry-price">Цена</Label>
						<Input id="entry-price" type="number" min="0" step="0.01" bind:value={price} required />
					</div>
					<div class="flex flex-col gap-2">
						<Label>Валюта</Label>
						<div class="flex flex-wrap gap-1">
							{#each CURRENCIES as c (c)}
								<Button
									type="button"
									variant={currency === c ? 'default' : 'outline'}
									size="sm"
									onclick={() => (currency = c)}
								>
									{CURRENCY_SYMBOLS[c]}
								</Button>
							{/each}
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<Label>Период</Label>
					<div class="flex flex-wrap gap-2">
						{#each Object.entries(BILLING_CYCLE_LABELS) as [value, label] (value)}
							<Button
								type="button"
								variant={cycle === value ? 'default' : 'outline'}
								size="sm"
								onclick={() => (cycle = value as BillingCycle)}
							>
								{label}
							</Button>
						{/each}
					</div>
				</div>
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input type="checkbox" class="size-4" bind:checked={autoRenew} />
					Автопродление
				</label>
			{:else}
				<div class="grid grid-cols-[1fr_8rem] gap-3">
					<div class="flex flex-col gap-2">
						<Label for="entry-rate">Расход</Label>
						<Input id="entry-rate" type="number" min="0" step="0.01" bind:value={rate} required />
					</div>
					<div class="flex flex-col gap-2">
						<Label>Валюта</Label>
						<div class="flex flex-wrap gap-1">
							{#each CURRENCIES as c (c)}
								<Button
									type="button"
									variant={currency === c ? 'default' : 'outline'}
									size="sm"
									onclick={() => (currency = c)}
								>
									{CURRENCY_SYMBOLS[c]}
								</Button>
							{/each}
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<Label>За единицу времени</Label>
					<div class="flex flex-wrap gap-2">
						{#each Object.entries(TIME_UNIT_LABELS) as [value, label] (value)}
							<Button
								type="button"
								variant={perUnit === value ? 'default' : 'outline'}
								size="sm"
								onclick={() => (perUnit = value as TimeUnit)}
							>
								{label}
							</Button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-2">
					<Label for="entry-start">Дата начала</Label>
					<Input id="entry-start" type="date" bind:value={startDate} required />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="entry-end">Дата окончания</Label>
					<Input id="entry-end" type="date" bind:value={endDate} />
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="entry-note">Заметка</Label>
				<Input id="entry-note" bind:value={note} placeholder="Опционально" />
			</div>

			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Отмена</Button>
				<Button type="submit">Добавить</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
