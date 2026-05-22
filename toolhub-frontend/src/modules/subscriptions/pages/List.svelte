<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Plus from '@lucide/svelte/icons/plus';
	import { subscriptionsStore } from '../store.svelte';
	import {
		CATEGORY_LABELS,
		formatMoney,
		monthlyInBase,
		priceLabel,
		isActive
	} from '../types';
	import AddEntryDialog from '../components/AddEntryDialog.svelte';

	let dialogOpen = $state(false);
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-end">
		<Button onclick={() => (dialogOpen = true)}>
			<Plus class="size-4" />
			Новая запись
		</Button>
	</div>

	<div class="bg-card rounded-lg border">
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
				{#each subscriptionsStore.entries as entry (entry.id)}
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
									<DropdownMenu.Item onSelect={() => subscriptionsStore.remove(entry.id)}>
										Удалить
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<AddEntryDialog bind:open={dialogOpen} />
