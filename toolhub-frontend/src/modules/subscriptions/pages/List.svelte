<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Plus from '@lucide/svelte/icons/plus';
	import { subscriptionsStore } from '../store.svelte';
	import {
		CATEGORY_LABELS,
		formatMoney,
		monthlyInBase,
		priceLabel,
		isActive,
		type ServiceEntry
	} from '../types';
	import AddEntryDialog from '../components/AddEntryDialog.svelte';

	let dialogOpen = $state(false);
	let editingEntry = $state<ServiceEntry | undefined>(undefined);
	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return subscriptionsStore.entries;
		return subscriptionsStore.entries.filter(
			(e) =>
				e.name.toLowerCase().includes(q) ||
				e.note?.toLowerCase().includes(q) ||
				CATEGORY_LABELS[e.category].toLowerCase().includes(q)
		);
	});

	function openAdd() {
		editingEntry = undefined;
		dialogOpen = true;
	}

	function openEdit(entry: ServiceEntry) {
		editingEntry = entry;
		dialogOpen = true;
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center gap-3">
		<Input placeholder="Поиск по названию, категории…" bind:value={query} class="max-w-xs" />
		<div class="ml-auto">
			<Button onclick={openAdd}>
				<Plus class="size-4" />
				Новая запись
			</Button>
		</div>
	</div>

	<div class="bg-card overflow-x-auto rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-12"></Table.Head>
					<Table.Head>Название</Table.Head>
					<Table.Head>Категория</Table.Head>
					<Table.Head>Тип</Table.Head>
					<Table.Head class="text-right">Цена</Table.Head>
					<Table.Head class="text-right">В месяц ({subscriptionsStore.settings.baseCurrency})</Table.Head>
					<Table.Head class="w-12"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filtered as entry (entry.id)}
					{@const active = isActive(entry)}
					<Table.Row class={active ? '' : 'opacity-50'}>
						<Table.Cell class="text-2xl">{entry.icon}</Table.Cell>
						<Table.Cell>
							<div class="flex flex-col">
								<span class="font-medium">{entry.name}</span>
								{#if entry.note}
									<span class="text-muted-foreground text-xs">{entry.note}</span>
								{/if}
							</div>
						</Table.Cell>
						<Table.Cell>
							<Badge variant="secondary">{CATEGORY_LABELS[entry.category]}</Badge>
						</Table.Cell>
						<Table.Cell>
							{#if entry.kind === 'subscription'}
								<Badge variant="outline">Подписка</Badge>
							{:else}
								<Badge variant="outline">Сервис</Badge>
							{/if}
						</Table.Cell>
						<Table.Cell class="text-right whitespace-nowrap">{priceLabel(entry)}</Table.Cell>
						<Table.Cell class="text-right whitespace-nowrap font-medium">
							{formatMoney(
								monthlyInBase(entry, subscriptionsStore.settings),
								subscriptionsStore.settings.baseCurrency
							)}
						</Table.Cell>
						<Table.Cell>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									class={buttonVariants({ variant: 'ghost', size: 'icon' })}
								>
									<MoreHorizontal class="size-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onSelect={() => openEdit(entry)}>
										Редактировать
									</DropdownMenu.Item>
									<DropdownMenu.Item onSelect={() => subscriptionsStore.remove(entry.id)}>
										Удалить
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
				{#if filtered.length === 0}
					<Table.Row>
						<Table.Cell colspan={7} class="text-muted-foreground py-10 text-center text-sm">
							Ничего не найдено
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<AddEntryDialog bind:open={dialogOpen} entry={editingEntry} />
