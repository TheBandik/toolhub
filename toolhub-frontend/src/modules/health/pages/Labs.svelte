<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import Minus from '@lucide/svelte/icons/minus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import { healthStore } from '../store.svelte';
	import {
		LAB_TYPE_LABELS,
		getLabItemStatus,
		type LabType,
		type LabResult
	} from '../types';
	import AddLabDialog from '../components/AddLabDialog.svelte';

	let dialogOpen = $state(false);
	let editingLab = $state<LabResult | undefined>(undefined);
	let typeFilter = $state<LabType | null>(null);

	const sorted = $derived(
		[...healthStore.labs]
			.filter((l) => !typeFilter || l.type === typeFilter)
			.sort((a, b) => b.date.localeCompare(a.date))
	);

	function openAdd() {
		editingLab = undefined;
		dialogOpen = true;
	}

	function openEdit(l: LabResult) {
		editingLab = l;
		dialogOpen = true;
	}

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
	}

	const STATUS_CONFIG = {
		high: { icon: TrendingUp, cls: 'text-destructive', badge: 'Выше нормы' },
		low: { icon: TrendingDown, cls: 'text-blue-500', badge: 'Ниже нормы' },
		normal: { icon: Minus, cls: 'text-emerald-500', badge: 'Норма' },
		unknown: { icon: Minus, cls: 'text-muted-foreground', badge: '' }
	} as const;
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center gap-3">
		<div class="flex flex-wrap gap-1.5">
			{#each Object.entries(LAB_TYPE_LABELS) as [val, label] (val)}
				<Button
					type="button"
					variant={typeFilter === val ? 'default' : 'outline'}
					size="sm"
					onclick={() => (typeFilter = typeFilter === val ? null : (val as LabType))}
				>
					{label}
				</Button>
			{/each}
		</div>
		<div class="ml-auto">
			<Button onclick={openAdd}>
				<Plus class="size-4" />
				Добавить анализ
			</Button>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		{#each sorted as lab (lab.id)}
			{@const abnormal = lab.items.filter((i) => {
				const s = getLabItemStatus(i);
				return s === 'high' || s === 'low';
			})}
			<Card.Root>
				<Card.Header>
					<div class="flex items-start justify-between gap-2">
						<div class="flex flex-col gap-0.5">
							<Card.Title>{lab.name}</Card.Title>
							<Card.Description>
								{formatDate(lab.date)}{lab.clinic ? ` · ${lab.clinic}` : ''}
							</Card.Description>
						</div>
						<div class="flex items-center gap-2">
							{#if abnormal.length > 0}
								<Badge variant="destructive">{abnormal.length} вне нормы</Badge>
							{:else}
								<Badge variant="secondary" class="text-emerald-600">Всё в норме</Badge>
							{/if}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
									<MoreHorizontal class="size-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onSelect={() => openEdit(lab)}>Редактировать</DropdownMenu.Item>
									<DropdownMenu.Item onSelect={() => healthStore.removeLab(lab.id)}>Удалить</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col divide-y rounded-lg border overflow-hidden">
						{#each lab.items as item (item.name)}
							{@const status = getLabItemStatus(item)}
							{@const cfg = STATUS_CONFIG[status]}
							{@const Icon = cfg.icon}
							<div class="flex items-center gap-3 px-3 py-2.5 {status === 'high' ? 'bg-destructive/5' : status === 'low' ? 'bg-blue-500/5' : ''}">
								<Icon class="size-4 shrink-0 {cfg.cls}" />
								<span class="flex-1 text-sm">{item.name}</span>
								<span class="font-semibold tabular-nums text-sm {cfg.cls}">{item.value}</span>
								<span class="text-muted-foreground text-sm w-16 text-right">{item.unit}</span>
								{#if item.refMin != null || item.refMax != null}
									<span class="text-muted-foreground text-xs w-24 text-right whitespace-nowrap">
										{item.refMin ?? ''}–{item.refMax ?? ''}
									</span>
								{/if}
							</div>
						{/each}
					</div>
					{#if lab.notes}
						<p class="text-muted-foreground mt-2 text-xs">{lab.notes}</p>
					{/if}
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="text-muted-foreground rounded-lg border border-dashed py-16 text-center text-sm">
				Анализов не найдено
			</div>
		{/each}
	</div>
</div>

<AddLabDialog bind:open={dialogOpen} lab={editingLab} />
