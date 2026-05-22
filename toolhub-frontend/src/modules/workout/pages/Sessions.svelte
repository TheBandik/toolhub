<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { workoutStore } from '../store.svelte';
	import { WORKOUT_TYPE_LABELS, RPE_COLOR_BG } from '../types';
	import AddSessionDialog from '../components/AddSessionDialog.svelte';
	import SessionDetails from '../components/SessionDetails.svelte';

	let dialogOpen = $state(false);
	let expandedId = $state<string | null>(null);

	function toggle(id: string) {
		expandedId = expandedId === id ? null : id;
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-end">
		<Button onclick={() => (dialogOpen = true)}>
			<Plus class="size-4" />
			Новая тренировка
		</Button>
	</div>

	<div class="bg-card rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-8"></Table.Head>
					<Table.Head>Дата</Table.Head>
					<Table.Head>Тип</Table.Head>
					<Table.Head class="text-right">Длит.</Table.Head>
					<Table.Head class="text-right">Дист.</Table.Head>
					<Table.Head class="text-right">Ср. пульс</Table.Head>
					<Table.Head class="text-right">Ккал</Table.Head>
					<Table.Head class="text-center">RPE</Table.Head>
					<Table.Head class="w-12"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each workoutStore.sessions as session (session.id)}
					{@const expanded = expandedId === session.id}
					<Table.Row
						class="hover:bg-muted/50 cursor-pointer"
						onclick={() => toggle(session.id)}
					>
						<Table.Cell>
							<ChevronDown
								class="text-muted-foreground size-4 transition-transform {expanded
									? 'rotate-180'
									: ''}"
							/>
						</Table.Cell>
						<Table.Cell class="whitespace-nowrap">{session.date}</Table.Cell>
						<Table.Cell>
							<Badge variant="secondary">{WORKOUT_TYPE_LABELS[session.type]}</Badge>
						</Table.Cell>
						<Table.Cell class="text-right">{session.durationMin} мин</Table.Cell>
						<Table.Cell class="text-muted-foreground text-right">
							{session.distanceKm ? `${session.distanceKm} км` : '—'}
						</Table.Cell>
						<Table.Cell class="text-muted-foreground text-right">
							{session.avgHR ?? '—'}
						</Table.Cell>
						<Table.Cell class="text-muted-foreground text-right">
							{session.activeCalories ?? '—'}
						</Table.Cell>
						<Table.Cell class="text-center">
							{#if session.rpe != null}
								<span
									class="inline-flex size-6 items-center justify-center rounded-md text-xs font-semibold text-white {RPE_COLOR_BG[
										session.rpe
									]}"
								>
									{session.rpe}
								</span>
							{:else}
								<span class="text-muted-foreground">—</span>
							{/if}
						</Table.Cell>
						<Table.Cell onclick={(e: Event) => e.stopPropagation()}>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									class={buttonVariants({ variant: 'ghost', size: 'icon' })}
								>
									<MoreHorizontal class="size-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onSelect={() => workoutStore.remove(session.id)}>
										Удалить
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
					{#if expanded}
						<Table.Row class="bg-muted/30 hover:bg-muted/30">
							<Table.Cell colspan={9} class="p-4">
								<SessionDetails {session} />
							</Table.Cell>
						</Table.Row>
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<AddSessionDialog bind:open={dialogOpen} />
